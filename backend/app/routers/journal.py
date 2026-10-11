import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Adventure, Journal, Observation
from app.schemas import JournalGenerateRequest
from app.services.ai.factory import get_ai_provider
from app.services.ai.mock_provider import MockAIProvider
from app.services.demo import demo_journal, new_id

router = APIRouter(prefix="/api/journal", tags=["journal"])


@router.post("/generate")
def generate_journal(request: JournalGenerateRequest, db: Session = Depends(get_db)):
    adventure = db.get(Adventure, request.adventure_id)
    if not adventure:
        raise HTTPException(404, "Adventure not found.")
    if request.demo or adventure.is_demo:
        result = demo_journal()
        source = "demo"
    else:
        obs_rows = db.query(Observation).filter(Observation.adventure_id == request.adventure_id).all()
        prompt = f"""Write a journal for this finished outdoor adventure.
Title: {adventure.title}
Plan: {adventure.payload_json}
Missions completed: {request.completed_missions}
Checklist completed: {request.completed_checklist}
User notes: {request.notes}
Voice transcripts: {request.voice_transcripts}
Observations: {[ {"category": o.category, "note": o.note, "transcript": o.transcript} for o in obs_rows ] + request.observations}
Distance km: {request.distance_km}
Duration minutes: {request.duration_minutes}
Do not invent discoveries that are not in the data.
"""
        provider = get_ai_provider()
        try:
            result = provider.generate_journal(prompt)
            source = provider.name
        except Exception:
            result = MockAIProvider().generate_journal(prompt)
            source = "mock-fallback"

    journal = db.query(Journal).filter(Journal.adventure_id == request.adventure_id).first()
    if journal:
        journal.title = result.title
        journal.body_json = result.model_dump_json()
    else:
        journal = Journal(
            id=new_id(),
            adventure_id=request.adventure_id,
            title=result.title,
            body_json=result.model_dump_json(),
        )
        db.add(journal)
    db.commit()
    return {"ai_source": source, "journal": result.model_dump()}
