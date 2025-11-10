from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Incident, Image
from ..tasks import run_pipeline
from ..config import settings
import uuid
import boto3
from botocore.exceptions import NoCredentialsError
import ipfshttpclient

router = APIRouter()

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key
) if settings.aws_access_key_id else None

ipfs_client = ipfshttpclient.connect('/ip4/127.0.0.1/tcp/5001')  # Local IPFS node

def upload_to_ipfs(file_content, filename):
    try:
        res = ipfs_client.add(file_content, filename=filename)
        return f"ipfs://{res['Hash']}"
    except Exception as e:
        print(f"IPFS upload failed: {e}")
        return None

def upload_to_somnia(file_content, key):
    # Use IPFS as Somnia decentralized storage
    ipfs_url = upload_to_ipfs(file_content, key)
    if ipfs_url:
        return ipfs_url
    # Fallback to local
    with open(f"uploads/{key}", "wb") as f:
        f.write(file_content)
    return f"uploads/{key}"

def upload_to_s3(file_content, bucket, key):
    if s3_client:
        try:
            s3_client.put_object(Bucket=bucket, Key=key, Body=file_content)
            return f"https://{bucket}.s3.amazonaws.com/{key}"
        except NoCredentialsError:
            pass
    # Try IPFS/Somnia
    somnia_url = upload_to_somnia(file_content, key)
    return somnia_url

@router.post("/upload")
async def upload_images(
    files: list[UploadFile] = File(...),
    location: str = Form(...),
    description: str = Form(None),
    db: Session = Depends(get_db)
  ):
    try:
        incident_id = str(uuid.uuid4())
        incident = Incident(id=incident_id, status="pending")
        db.add(incident)
        db.commit()

        for file in files:
            content = await file.read()
            key = f"{incident_id}_{file.filename}"
            image_url = upload_to_s3(content, settings.s3_bucket, key)
            image = Image(incident_id=incident_id, url=image_url, source="upload", metadata={"location": location, "description": description})
            db.add(image)

        db.commit()

        # Trigger async pipeline
        run_pipeline.delay(incident_id)

        return {"incident_id": incident_id, "status": "processing"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")