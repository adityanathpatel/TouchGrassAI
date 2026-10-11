from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services.ai.factory import get_ai_provider
from app.services.ai.mock_provider import MockAIProvider

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.get("/status")
def ai_status():
    provider = get_ai_provider()
    from app.config import get_settings

    settings = get_settings()
    live = provider.name != "mock" or settings.ai_provider == "mock"
    ollama = False
    try:
        from app.services.ai.ollama_provider import OllamaProvider

        ollama = OllamaProvider().available()
    except Exception:
        ollama = False
    return {
        "provider": provider.name,
        "configured": settings.ai_provider,
        "model": settings.model_name,
        "ollama_running": ollama,
        "message": None
        if ollama or settings.ai_provider == "mock"
        else "Local AI isn't running. Start Ollama or switch to Demo Mode.",
    }


@router.post("/analyze-image")
async def analyze_image(file: UploadFile = File(...), hint: str = Form("")):
    content = await file.read()
    if not content:
        raise HTTPException(400, "Photo is empty.")
    provider = get_ai_provider()
    try:
        result = provider.analyze_image(content, hint)
        source = provider.name
    except Exception as exc:
        result = MockAIProvider().analyze_image(content, hint)
        source = "mock-fallback"
        return {
            "ai_source": source,
            "warning": str(exc),
            "result": result.model_dump(),
        }
    payload = result.model_dump()
    payload["possible_identification"] = f"Possible identification: {result.possible_object}"
    payload["confidence_label"] = f"Confidence: {round(result.confidence * 100)}%"
    return {"ai_source": source, "result": payload}


@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    content = await file.read()
    if not content:
        raise HTTPException(400, "Audio is empty.")
    provider = get_ai_provider()
    try:
        text = provider.transcribe(content, file.filename or "audio.webm")
        return {"transcript": text, "ai_source": provider.name}
    except Exception as exc:
        raise HTTPException(
            503,
            str(exc) or "Microphone transcription unavailable. You can still type a note.",
        ) from exc
