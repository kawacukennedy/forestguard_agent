from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Incident, Image
from ..tasks import run_pipeline
from ..config import settings
import uuid
import boto3
from botocore.exceptions import NoCredentialsError

router = APIRouter()

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key
) if settings.aws_access_key_id else None

def upload_to_somnia(file_content, key):
    # Mock Somnia decentralized storage (IPFS-like)
    # In real, use Somnia SDK to upload to decentralized network
    somnia_hash = f"somnia_ipfs_{key}"
    # Fallback to local for demo
    with open(f"uploads/{key}", "wb") as f:
        f.write(file_content)
    return f"somnia://{somnia_hash}"

def upload_to_s3(file_content, bucket, key):
    if s3_client:
        s3_client.put_object(Bucket=bucket, Key=key, Body=file_content)
        return f"https://{bucket}.s3.amazonaws.com/{key}"
    else:
        # Try Somnia first
        somnia_url = upload_to_somnia(file_content, key)
        if somnia_url:
            return somnia_url
        # Fallback to local
        with open(f"uploads/{key}", "wb") as f:
            f.write(file_content)
        return f"uploads/{key}"

@router.post("/upload")
async def upload_images(
    files: list[UploadFile] = File(...),
    location: str = Form(...),
    description: str = Form(None),
    db: Session = Depends(get_db)
 ):
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