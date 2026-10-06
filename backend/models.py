from sqlalchemy import Column, Integer, String, Float, Boolean, Text, JSON, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class Adventure(Base):
    __tablename__ = "adventures"
    
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    title = Column(String, index=True)
    description = Column(Text)
    difficulty = Column(String)
    duration_minutes = Column(Integer)
    missions = Column(JSON) # List of dicts
    checklist = Column(JSON) # List of strings
    safety_notes = Column(JSON) # List of strings
    
    start_lat = Column(Float)
    start_lng = Column(Float)
    end_lat = Column(Float)
    end_lng = Column(Float)
    distance_km = Column(Float)
    route_geometry = Column(JSON) # List of [lat, lng]
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed = Column(Boolean, default=False)
    
    observations = relationship("Observation", back_populates="adventure")

class Observation(Base):
    __tablename__ = "observations"
    
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    adventure_id = Column(String, ForeignKey("adventures.id"))
    category = Column(String)
    note = Column(Text)
    photo_path = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    adventure = relationship("Adventure", back_populates="observations")

class Journal(Base):
    __tablename__ = "journals"
    
    id = Column(String, primary_key=True, index=True, default=generate_uuid)
    adventure_id = Column(String, ForeignKey("adventures.id"))
    title = Column(String)
    summary = Column(Text)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
