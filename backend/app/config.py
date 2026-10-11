from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "TouchGrass AI"
    demo_mode: bool = False
    local_only: bool = True

    ai_provider: str = "ollama"
    model_name: str = "gemma2:2b"
    vision_model_name: str = "moondream"
    ollama_base_url: str = "http://127.0.0.1:11434"
    whisper_model: str = "tiny"

    routing_provider: str = "osrm"
    osrm_base_url: str = "https://router.project-osrm.org"
    map_provider: str = "openstreetmap"
    nominatim_base_url: str = "https://nominatim.openstreetmap.org"

    database_url: str = "sqlite:///./touchgrass.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"


@lru_cache
def get_settings() -> Settings:
    return Settings()
