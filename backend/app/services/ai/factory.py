from app.config import get_settings
from app.services.ai.base import AIProvider
from app.services.ai.mock_provider import MockAIProvider
from app.services.ai.ollama_provider import OllamaProvider


class LocalLLMProvider(OllamaProvider):
    """llama.cpp OpenAI-compatible servers can sit behind the same chat path later."""

    name = "local"


def get_ai_provider() -> AIProvider:
    settings = get_settings()
    name = settings.ai_provider.lower().strip()
    if name in {"mock", "demo"}:
        return MockAIProvider()
    if name == "local":
        provider: AIProvider = LocalLLMProvider()
    else:
        provider = OllamaProvider()
    if settings.demo_mode:
        return MockAIProvider()
    if not provider.available():
        return MockAIProvider()
    return provider
