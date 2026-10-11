from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Adventure, Observation
from app.schemas import ObservationCreate
from app.services.demo import new_id

router = APIRouter(prefix="/api/observations", tags=["observations"])


@router.post("")
def create_observation(payload: ObservationCreate, db: Session = Depends(get_db)):
    adventure = db.get(Adventure, payload.adventure_id)
    if not adventure:
        raise HTTPException(404, "Adventure not found.")
    obs = Observation(
        id=new_id(),
        adventure_id=payload.adventure_id,
        category=payload.category,
        note=payload.note,
        transcript=payload.transcript,
        latitude=payload.latitude,
        longitude=payload.longitude,
        ai_label=payload.ai_label,
        ai_confidence=payload.ai_confidence,
    )
    db.add(obs)
    db.commit()
    return {
        "id": obs.id,
        "stored": "local",
        "category": obs.category,
        "created_at": obs.created_at.isoformat(),
    }


@router.get("")
def list_observations(adventure_id: str, db: Session = Depends(get_db)):
    rows = db.query(Observation).filter(Observation.adventure_id == adventure_id).all()
    return [
        {
            "id": row.id,
            "category": row.category,
            "note": row.note,
            "transcript": row.transcript,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "ai_label": row.ai_label,
            "ai_confidence": row.ai_confidence,
            "created_at": row.created_at.isoformat(),
        }
        for row in rows
    ]
