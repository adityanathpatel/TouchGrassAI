from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class Mission(BaseModel):
    title: str
    description: str

class AdventureBase(BaseModel):
    title: str
    description: str
    difficulty: str
    duration_minutes: int
    missions: List[Mission]
    checklist: List[str]
    safety_notes: List[str]
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    distance_km: float
    route_geometry: List[List[float]]

class AdventureCreate(AdventureBase):
    pass

class AdventureResponse(AdventureBase):
    id: str
    created_at: datetime
    completed: bool
    
    class Config:
        from_attributes = True

class GenerateAdventureRequest(BaseModel):
    lat: float
    lng: float
    activity: str
    duration_minutes: int
    difficulty: str
    interests: List[str]

class ObservationCreate(BaseModel):
    adventure_id: str
    category: str
    note: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class ObservationResponse(BaseModel):
    id: str
    adventure_id: str
    category: str
    note: str
    photo_path: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True
        
class GenerateJournalRequest(BaseModel):
    adventure_id: str
