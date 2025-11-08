from .celery_app import celery_app
from .database import SessionLocal
from .models import Incident, AgentTranscript, Image
from ..agents.vision_agent import run_vision_agent
from ..agents.verifier_agent import run_verifier_agent
from ..agents.geolocation_agent import run_geolocation_agent
from ..agents.packager_agent import run_packager_agent
from ..agents.notification_agent import run_notification_agent

@celery_app.task
def run_pipeline(incident_id: str):
    db = SessionLocal()
    try:
        incident = db.query(Incident).filter(Incident.id == incident_id).first()
        if not incident:
            return

        images = db.query(Image).filter(Image.incident_id == incident_id).all()
        image_url = images[0].url if images else ""

        # Vision
        vision_result = run_vision_agent(image_url)
        db.add(AgentTranscript(incident_id=incident_id, agent_name="Vision", transcript_text=str(vision_result)))

        # Verifier
        verifier_result = run_verifier_agent(vision_result["polygons"], incident.timestamp, {})
        db.add(AgentTranscript(incident_id=incident_id, agent_name="Verifier", transcript_text=str(verifier_result)))

        # Geolocation
        geo_result = run_geolocation_agent(vision_result["polygons"], {})
        db.add(AgentTranscript(incident_id=incident_id, agent_name="Geolocation", transcript_text=str(geo_result)))

        # Packager
        transcripts = db.query(AgentTranscript).filter(AgentTranscript.incident_id == incident_id).all()
        transcript_data = [{"agent_name": t.agent_name, "transcript_text": t.transcript_text} for t in transcripts]
        packager_result = run_packager_agent({"id": incident_id, "carbon_estimate": geo_result["estimated_carbon_loss"], "status": "processed"}, transcript_data, images)
        db.add(AgentTranscript(incident_id=incident_id, agent_name="Packager", transcript_text=str(packager_result)))

        # Notification
        notify_result = run_notification_agent(incident_id, ["slack", "email"])
        db.add(AgentTranscript(incident_id=incident_id, agent_name="Notification", transcript_text=str(notify_result)))

        # Update incident
        incident.polygon_geojson = str(vision_result["polygons"])
        incident.confidence_score = vision_result["confidence_score"]
        incident.carbon_estimate = geo_result["estimated_carbon_loss"]
        incident.status = "processed"
        db.commit()
    finally:
        db.close()