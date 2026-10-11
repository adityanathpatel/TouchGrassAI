import json
from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Adventure
from app.schemas import GenerateAdventureRequest
from app.services.adventures import generate_adventure_plan
from app.services.demo import demo_adventure, new_id

router = APIRouter(prefix="/api/adventures", tags=["adventures"])


@router.post("/generate")
def generate(request: GenerateAdventureRequest, db: Session = Depends(get_db)):
    plan, source = generate_adventure_plan(request)
    adventure_id = new_id()
    record = Adventure(
        id=adventure_id,
        title=plan.title,
        description=plan.description,
        goal=plan.goal,
        difficulty=plan.difficulty,
        duration_minutes=plan.duration_minutes,
        activity=request.activity,
        payload_json=plan.model_dump_json(),
        is_demo=request.demo or source == "demo",
        status="ready",
    )
    db.add(record)
    db.commit()
    return {
        "id": adventure_id,
        "ai_source": source,
        "is_demo": record.is_demo,
        "plan": plan.model_dump(),
    }


@router.get("")
def list_adventures(db: Session = Depends(get_db)):
    rows = db.query(Adventure).order_by(Adventure.created_at.desc()).all()
    return [
        {
            "id": row.id,
            "title": row.title,
            "status": row.status,
            "is_demo": row.is_demo,
            "downloaded": row.downloaded,
            "created_at": row.created_at.isoformat(),
        }
        for row in rows
    ]


@router.get("/{adventure_id}")
def get_adventure(adventure_id: str, db: Session = Depends(get_db)):
    row = db.get(Adventure, adventure_id)
    if not row:
        raise HTTPException(404, "Adventure not found.")
    return {
        "id": row.id,
        "title": row.title,
        "status": row.status,
        "is_demo": row.is_demo,
        "downloaded": row.downloaded,
        "plan": json.loads(row.payload_json),
        "route": json.loads(row.route_json) if row.route_json else None,
        "created_at": row.created_at.isoformat(),
        "finished_at": row.finished_at.isoformat() if row.finished_at else None,
    }


@router.post("/{adventure_id}/download")
def download_pack(adventure_id: str, db: Session = Depends(get_db)):
    row = db.get(Adventure, adventure_id)
    if not row:
        raise HTTPException(404, "Adventure not found.")
    row.downloaded = True
    row.status = "packed"
    db.commit()
    return {
        "message": "Adventure downloaded ✓",
        "pack": {
            "id": row.id,
            "plan": json.loads(row.payload_json),
            "route": json.loads(row.route_json) if row.route_json else None,
            "is_demo": row.is_demo,
            "downloaded_at": datetime.utcnow().isoformat(),
        },
    }


@router.post("/{adventure_id}/finish")
def finish(adventure_id: str, db: Session = Depends(get_db)):
    row = db.get(Adventure, adventure_id)
    if not row:
        raise HTTPException(404, "Adventure not found.")
    row.status = "complete"
    row.finished_at = datetime.utcnow()
    db.commit()
    return {"status": "complete", "id": row.id}


@router.delete("/{adventure_id}")
def delete_adventure(adventure_id: str, db: Session = Depends(get_db)):
    row = db.get(Adventure, adventure_id)
    if not row:
        raise HTTPException(404, "Adventure not found.")
    db.delete(row)
    db.commit()
    return {"deleted": True}


@router.post("/demo")
def create_demo(db: Session = Depends(get_db)):
    plan, route = demo_adventure()
    adventure_id = new_id()
    record = Adventure(
        id=adventure_id,
        title=plan.title,
        description=plan.description,
        goal=plan.goal,
        difficulty=plan.difficulty,
        duration_minutes=plan.duration_minutes,
        activity="nature exploration",
        payload_json=plan.model_dump_json(),
        route_json=route.model_dump_json(),
        is_demo=True,
        downloaded=True,
        status="packed",
    )
    db.add(record)
    db.commit()
    return {"id": adventure_id, "plan": plan.model_dump(), "route": route.model_dump(), "is_demo": True}
