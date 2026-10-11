import base64

import httpx

from app.config import get_settings
from app.schemas import AdventurePlan, ImageAnalysisResult, JournalResult
from app.services.ai.base import AIProvider
from app.services.ai.json_extract import extract_json_payload
from app.services.ai.validators import validate_adventure_plan, validate_journal


ADVENTURE_SYSTEM = """You are TouchGrass AI, an outdoor companion.
Generate a short outdoor adventure as JSON only.
Do not invent GPS coordinates, distances, or walking routes.
AI owns language: title, mission, checklist, safety tone.
Maps and routing are handled by another system.
Put JSON inside <payload></payload>.
Schema:
{"title": str, "description": str, "goal": str, "difficulty": "beginner|moderate|challenging",
 "duration_minutes": number, "missions": [{"title": str, "prompt": str}],
 "checklist": [{"label": str}], "safety_notes": [str], "bonus_challenge": str,
 "route_requirements": str}
Keep people on public, marked, everyday paths. Never suggest cliffs, trespass, night exploration in unsafe areas, or anything emergency-related.
"""

JOURNAL_SYSTEM = """You write a calm outdoor journal from the user's notes.
Do not invent facts that are not in the input.
JSON only inside <payload></payload>.
Schema:
{"title": str, "summary": str, "highlights": [str], "discoveries": [str],
 "reflection": str, "interesting_observations": [str], "next_time": [str]}
"""


class OllamaProvider(AIProvider):
    name = "ollama"

    def __init__(self) -> None:
        self.settings = get_settings()
        self.base = self.settings.ollama_base_url.rstrip("/")
        self.model = self.settings.model_name
        self.vision_model = self.settings.vision_model_name

    def available(self) -> bool:
        try:
            response = httpx.get(f"{self.base}/api/tags", timeout=2.0)
            return response.status_code == 200
        except httpx.HTTPError:
            return False

    def _chat(self, system: str, user: str, model: str | None = None) -> str:
        payload = {
            "model": model or self.model,
            "stream": False,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
        }
        try:
            response = httpx.post(f"{self.base}/api/chat", json=payload, timeout=120.0)
            response.raise_for_status()
        except httpx.ConnectError as exc:
            raise RuntimeError("Local AI isn't running. Start Ollama or switch to Demo Mode.") from exc
        except httpx.HTTPError as exc:
            raise RuntimeError("The open-weight model did not respond. Check Ollama and MODEL_NAME.") from exc
        data = response.json()
        return data.get("message", {}).get("content") or ""

    def generate_adventure(self, prompt: str) -> AdventurePlan:
        raw = self._chat(ADVENTURE_SYSTEM, prompt)
        parsed = extract_json_payload(raw)
        return validate_adventure_plan(parsed)

    def generate_journal(self, prompt: str) -> JournalResult:
        raw = self._chat(JOURNAL_SYSTEM, prompt)
        parsed = extract_json_payload(raw)
        return validate_journal(parsed)

    def analyze_image(self, image_bytes: bytes, hint: str = "") -> ImageAnalysisResult:
        b64 = base64.b64encode(image_bytes).decode("ascii")
        prompt = (
            "Identify what this outdoor photo might show. Be uncertain. "
            "Never present identification as fact. "
            f"User hint: {hint or 'none'}. "
            "JSON inside <payload> with keys possible_object, possible_species, confidence (0-1), short_description."
        )
        payload = {
            "model": self.vision_model,
            "stream": False,
            "prompt": prompt,
            "images": [b64],
        }
        try:
            response = httpx.post(f"{self.base}/api/generate", json=payload, timeout=120.0)
            response.raise_for_status()
        except httpx.HTTPError as exc:
            raise RuntimeError("Local vision model isn't available. Pull a vision model in Ollama or skip identification.") from exc
        raw = response.json().get("response") or ""
        parsed = extract_json_payload(raw)
        confidence = float(parsed.get("confidence") or 0.5)
        confidence = max(0.0, min(1.0, confidence))
        return ImageAnalysisResult(
            possible_object=str(parsed.get("possible_object") or "unknown object"),
            possible_species=parsed.get("possible_species"),
            confidence=confidence,
            short_description=str(parsed.get("short_description") or "Possible identification only."),
        )

    def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> str:
        try:
            from faster_whisper import WhisperModel  # type: ignore
        except ImportError as exc:
            raise RuntimeError(
                "Local speech recognition isn't installed. Use the browser voice option or pip install faster-whisper."
            ) from exc
        import tempfile
        from pathlib import Path

        suffix = Path(filename).suffix or ".webm"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(audio_bytes)
            path = tmp.name
        model = WhisperModel(self.settings.whisper_model, device="cpu", compute_type="int8")
        segments, _ = model.transcribe(path)
        text = " ".join(segment.text.strip() for segment in segments).strip()
        return text or "(no speech detected)"
