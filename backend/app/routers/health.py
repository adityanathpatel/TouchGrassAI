from fastapi import APIRouter

from app.config import get_settings

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/health")
def health():
    settings = get_settings()
    return {
        "ok": True,
        "app": settings.app_name,
        "ai_provider": settings.ai_provider,
        "model": settings.model_name,
        "routing": settings.routing_provider,
        "maps": settings.map_provider,
    }
