from database import engine, Base, SessionLocal
from models import User, Incident, Image, AgentTranscript
from datetime import datetime

def init_database():
    Base.metadata.create_all(bind=engine)

    # Add sample data
    db = SessionLocal()
    try:
        # Sample user
        if not db.query(User).first():
            user = User(name="Demo User", email="demo@forestguard.com", hashed_password="$2b$12$examplehash", builder_id="demo123")
            db.add(user)

        # Sample incidents
        if not db.query(Incident).first():
            incidents = [
                Incident(id="inc001", polygon_geojson='[[[0,0],[10,0],[10,10],[0,10]]]', confidence_score=0.85, carbon_estimate=500, status="processed", timestamp=datetime.utcnow()),
                Incident(id="inc002", polygon_geojson='[[[20,20],[30,20],[30,30],[20,30]]]', confidence_score=0.92, carbon_estimate=750, status="processed", timestamp=datetime.utcnow()),
                Incident(id="inc003", polygon_geojson='[[[40,40],[50,40],[50,50],[40,50]]]', confidence_score=0.78, carbon_estimate=300, status="processed", timestamp=datetime.utcnow()),
                Incident(id="inc004", polygon_geojson='[[[60,60],[70,60],[70,70],[60,70]]]', confidence_score=0.88, carbon_estimate=600, status="processed", timestamp=datetime.utcnow()),
                Incident(id="inc005", polygon_geojson='[[[80,80],[90,80],[90,90],[80,90]]]', confidence_score=0.95, carbon_estimate=800, status="processed", timestamp=datetime.utcnow()),
            ]
            for inc in incidents:
                db.add(inc)
                # Sample images
                db.add(Image(incident_id=inc.id, url="sample.jpg", source="demo", metadata={"location": "Forest Area"}))
                # Sample transcripts
                db.add(AgentTranscript(incident_id=inc.id, agent_name="Vision", transcript_text="Deforestation detected"))
                db.add(AgentTranscript(incident_id=inc.id, agent_name="Verifier", transcript_text="Verified"))
                db.add(AgentTranscript(incident_id=inc.id, agent_name="Geolocation", transcript_text="Area calculated"))
                db.add(AgentTranscript(incident_id=inc.id, agent_name="Packager", transcript_text="PDF generated"))
                db.add(AgentTranscript(incident_id=inc.id, agent_name="Notification", transcript_text="Notifications sent"))

        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
    print("Database tables created and sample data added.")