from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models, schemas
from services.ai_provider import get_ai_provider, AIProvider
from services.route_generator import generate_route

router = APIRouter(prefix="/api/adventures", tags=["adventures"])

@router.post("/generate", response_model=schemas.AdventureResponse)
async def generate_adventure(
    request: schemas.GenerateAdventureRequest, 
    db: Session = Depends(get_db)
):
    provider = get_ai_provider()
    
    ai_content = await provider.generate_adventure(
        lat=request.lat,
        lng=request.lng,
        activity=request.activity,
        duration_minutes=request.duration_minutes,
        difficulty=request.difficulty,
        interests=request.interests
    )
    
    speed_kmh = 5.0
    if request.activity.lower() == "running":
        speed_kmh = 10.0
    elif request.activity.lower() == "cycling":
        speed_kmh = 15.0
        
    distance_km = (speed_kmh / 60) * request.duration_minutes
    route_data = await generate_route(request.lat, request.lng, distance_km)
    
    db_adventure = models.Adventure(
        title=ai_content.get("title", "Adventure"),
        description=ai_content.get("description", ""),
        difficulty=ai_content.get("difficulty", request.difficulty),
        duration_minutes=ai_content.get("duration_minutes", request.duration_minutes),
        missions=ai_content.get("missions", []),
        checklist=ai_content.get("checklist", []),
        safety_notes=ai_content.get("safety_notes", []),
        start_lat=route_data["start_lat"],
        start_lng=route_data["start_lng"],
        end_lat=route_data["end_lat"],
        end_lng=route_data["end_lng"],
        distance_km=route_data["distance_km"],
        route_geometry=route_data["route_geometry"]
    )
    
    db.add(db_adventure)
    db.commit()
    db.refresh(db_adventure)
    
    return db_adventure

@router.get("/{adventure_id}", response_model=schemas.AdventureResponse)
def get_adventure(adventure_id: str, db: Session = Depends(get_db)):
    adventure = db.query(models.Adventure).filter(models.Adventure.id == adventure_id).first()
    if not adventure:
        raise HTTPException(status_code=404, detail="Adventure not found")
    return adventure

@router.get("/", response_model=List[schemas.AdventureResponse])
def list_adventures(db: Session = Depends(get_db)):
    return db.query(models.Adventure).order_by(models.Adventure.created_at.desc()).all()

@router.delete("/{adventure_id}")
def delete_adventure(adventure_id: str, db: Session = Depends(get_db)):
    adventure = db.query(models.Adventure).filter(models.Adventure.id == adventure_id).first()
    if not adventure:
        raise HTTPException(status_code=404, detail="Adventure not found")
    db.delete(adventure)
    db.commit()
    return {"message": "Deleted"}
