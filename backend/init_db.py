from database import engine, Base
from models import User, Incident, Image, AgentTranscript

def init_database():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_database()
    print("Database tables created.")