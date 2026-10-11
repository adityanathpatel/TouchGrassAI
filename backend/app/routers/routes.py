import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Adventure
from app.schemas import RouteGenerateRequest
from app.services.routing import generate_route, search_location

router = APIRouter(prefix="/api/routes", tags=["routes"])


@router.post("/generate")
def create_route(request: RouteGenerateRequest, adventure_id: str | None = None, db: Session = Depends(get_db)):
    try:
        route = generate_route(request)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    except Exception:
        raise HTTPException(
            503,
            "Routing is unavailable. A local demo route can still be used.",
        )
    if adventure_id:
        row = db.get(Adventure, adventure_id)
        if row:
            row.route_json = route.model_dump_json()
            db.commit()
    return route.model_dump()


@router.get("/search")
def location_search(q: str):
    results = search_location(q)
    if not results:
        return {"results": [], "message": "No location results. Try a park name or use Demo Mode."}
    return {"results": results}
