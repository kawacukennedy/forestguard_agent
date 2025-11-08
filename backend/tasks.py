from .celery_app import celery_app
from .database import SessionLocal
from .models import Incident, AgentTranscript, Image
from ..agents.vision_agent import run_vision_agent
from ..agents.verifier_agent import run_verifier_agent
from ..agents.geolocation_agent import run_geolocation_agent
from ..agents.packager_agent import run_packager_agent
from ..agents.notification_agent import run_notification_agent

@celery_app.task(bind=True, max_retries=1)
def run_pipeline(self, incident_id: str):
    db = SessionLocal()
    try:
        incident = db.query(Incident).filter(Incident.id == incident_id).first()
        if not incident:
            return

        images = db.query(Image).filter(Image.incident_id == incident_id).all()
        image_url = images[0].url if images else ""

        # Run agents with error handling
        try:
            vision_result = run_vision_agent(image_url)
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Vision", transcript_text=str(vision_result)))
        except Exception as e:
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Vision", transcript_text=f"Error: {str(e)}"))
            raise self.retry(countdown=60)

        try:
            verifier_result = run_verifier_agent(vision_result["polygons"], incident.timestamp, {})
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Verifier", transcript_text=str(verifier_result)))
        except Exception as e:
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Verifier", transcript_text=f"Error: {str(e)}"))
            raise

        try:
            geo_result = run_geolocation_agent(vision_result["polygons"], {})
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Geolocation", transcript_text=str(geo_result)))
        except Exception as e:
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Geolocation", transcript_text=f"Error: {str(e)}"))
            raise

        transcripts = db.query(AgentTranscript).filter(AgentTranscript.incident_id == incident_id).all()
        transcript_data = [{"agent_name": t.agent_name, "transcript_text": t.transcript_text} for t in transcripts]
        try:
            packager_result = run_packager_agent({"id": incident_id, "carbon_estimate": geo_result["estimated_carbon_loss"], "status": "processed"}, transcript_data, images)
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Packager", transcript_text=str(packager_result)))
        except Exception as e:
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Packager", transcript_text=f"Error: {str(e)}"))
            raise

        try:
            notify_result = run_notification_agent(incident_id, ["slack"])
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Notification", transcript_text=str(notify_result)))
        except Exception as e:
            db.add(AgentTranscript(incident_id=incident_id, agent_name="Notification", transcript_text=f"Error: {str(e)}"))
            raise

        # Update incident
        incident.polygon_geojson = str(vision_result["polygons"])
        incident.confidence_score = vision_result["confidence_score"]
        incident.carbon_estimate = geo_result["estimated_carbon_loss"]
        incident.status = "processed"
        db.commit()
    except Exception as e:
        db.rollback()
        incident.status = "failed"
        db.add(AgentTranscript(incident_id=incident_id, agent_name="Error", transcript_text=f"Pipeline failed: {str(e)}"))
        db.commit()
        raise
    finally:
        db.close()