from sqlalchemy import Column, Integer, String, DateTime, Float, Text, ForeignKey, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

Base = declarative_base()

class UserRole(enum.Enum):
    admin = "admin"
    ranger = "ranger"
    ngo = "ngo"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.ranger)
    builder_id = Column(String, unique=True)
    somnia_wallet_address = Column(String)
    reward_points = Column(Float, default=0.0)

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    polygon_geojson = Column(Text)
    confidence_score = Column(Float)
    carbon_estimate = Column(Float)
    status = Column(String)  # e.g., 'pending', 'verified', 'false_positive'
    somnia_tx_hash = Column(String)
    nft_id = Column(String, nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    url = Column(String)
    source = Column(String)  # e.g., 'satellite', 'drone', 'community'
    metadata = Column(JSON)

class AgentTranscript(Base):
    __tablename__ = "agent_transcripts"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    agent_name = Column(String)
    transcript_text = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment_text = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)