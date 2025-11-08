from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Incident, Image, AgentTranscript
from typing import List
import os
from sqlalchemy import func

router = APIRouter()

@router.get("/incidents")
async def get_incidents(
    db: Session = Depends(get_db),
    date_from: str = Query(None),
    confidence_min: float = Query(None),
    region: str = Query(None),
    status: str = Query(None),
    search: str = Query(None)
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
    if search:
        query = query.filter(Incident.id.contains(search))
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

@router.get("/incidents/{incident_id}/download")
async def download_report(incident_id: str):
    file_path = f"reports/incident_{incident_id}.pdf"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(file_path, media_type='application/pdf', filename=f"incident_{incident_id}.pdf")

@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    total_incidents = db.query(func.count(Incident.id)).scalar()
    total_carbon = db.query(func.sum(Incident.carbon_estimate)).scalar() or 0
    incidents_by_status = db.query(Incident.status, func.count(Incident.id)).group_by(Incident.status).all()
    incidents_over_time = db.query(func.date(Incident.timestamp), func.count(Incident.id)).group_by(func.date(Incident.timestamp)).all()

    return {
        "total_incidents": total_incidents,
        "total_carbon_impact": total_carbon,
        "incidents_by_status": dict(incidents_by_status),
        "incidents_over_time": [{"date": str(date), "count": count} for date, count in incidents_over_time]
    }