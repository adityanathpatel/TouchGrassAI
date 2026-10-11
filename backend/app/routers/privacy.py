import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Adventure, Journal, Observation

router = APIRouter(prefix="/api/privacy", tags=["privacy"])


@router.get("/export")
def export_all(db: Session = Depends(get_db)):
    adventures = db.query(Adventure).all()
    payload = []
    for row in adventures:
        payload.append(
            {
                "id": row.id,
                "title": row.title,
                "plan": json.loads(row.payload_json),
                "route": json.loads(row.route_json) if row.route_json else None,
                "observations": [
                    {
                        "id": o.id,
                        "category": o.category,
                        "note": o.note,
                        "transcript": o.transcript,
                    }
                    for o in row.observations
                ],
                "journal": json.loads(row.journal.body_json) if row.journal else None,
            }
        )
    return {"local_only": True, "adventures": payload}


@router.delete("/data")
def delete_all(db: Session = Depends(get_db)):
    db.query(Journal).delete()
    db.query(Observation).delete()
    db.query(Adventure).delete()
    db.commit()
    return {"deleted": True, "message": "All adventure data on this device was removed."}
