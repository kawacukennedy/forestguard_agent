from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Incident, Image, AgentTranscript
from typing import List

router = APIRouter()

@router.get("/incidents")
async def get_incidents(
    db: Session = Depends(get_db),
    date_from: str = Query(None),
    confidence_min: float = Query(None),
    region: str = Query(None),
    status: str = Query(None)
):
    query = db.query(Incident)
    if date_from:
        query = query.filter(Incident.timestamp >= date_from)
    if confidence_min:
        query = query.filter(Incident.confidence_score >= confidence_min)
    if region:
        # Placeholder for region filter
        pass
    if status:
        query = query.filter(Incident.status == status)
    incidents = query.all()
    return incidents

@router.get("/incidents/{incident_id}")
async def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return {"error": "Incident not found"}
    images = db.query(Image).filter(Image.incident_id == incident_id).all()
    transcripts = db.query(AgentTranscript).filter(AgentTranscript.incident_id == incident_id).all()
    return {
        "incident": incident,
        "images": images,
        "transcripts": transcripts
    }