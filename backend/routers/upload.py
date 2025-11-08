from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Incident, Image
import uuid

router = APIRouter()

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
        # Save file to local storage
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())
        image_url = file_path
        image = Image(incident_id=incident_id, url=image_url, source="upload", metadata={"location": location, "description": description})
        db.add(image)

    db.commit()

    # Trigger agent pipeline (call /api/agents/run separately)

    return {"incident_id": incident_id, "status": "processing"}