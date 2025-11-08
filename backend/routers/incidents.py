from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Incident, Image, AgentTranscript, Comment, User
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
    chain: str = Query(None),
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
    if chain:
        # Filter by chain if nft_ids contains the chain
        query = query.filter(Incident.nft_ids.op('->')(chain).isnot(None))
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
    comments = db.query(Comment).filter(Comment.incident_id == incident_id).all()
    return {
        "incident": incident,
        "images": images,
        "transcripts": transcripts,
        "comments": comments
    }

@router.get("/incidents/{incident_id}/download")
async def download_report(incident_id: str):
    file_path = f"reports/incident_{incident_id}.pdf"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(file_path, media_type='application/pdf', filename=f"incident_{incident_id}.pdf")

@router.post("/incidents/{incident_id}/comments")
async def add_comment(incident_id: str, comment_text: str, user_id: int, db: Session = Depends(get_db)):
    comment = Comment(incident_id=incident_id, user_id=user_id, comment_text=comment_text)
    db.add(comment)
    db.commit()
    return {"message": "Comment added"}

@router.put("/incidents/{incident_id}/assign")
async def assign_incident(incident_id: str, user_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if incident:
        incident.assigned_to = user_id
        db.commit()
        return {"message": "Incident assigned"}
    return {"error": "Incident not found"}

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

@router.get("/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db), limit: int = Query(10)):
    users = db.query(User).order_by(User.reward_points.desc()).limit(limit).all()
    return [{"name": user.name, "reward_points": user.reward_points, "role": user.role.value} for user in users]