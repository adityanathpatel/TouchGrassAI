from pydantic_settings import BaseSettings
from typing import Optional

import os

class Settings(BaseSettings):
    AI_PROVIDER: str = "mock"  # ollama, openai, mock
    MODEL_NAME: str = "llama3"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    ROUTING_PROVIDER: str = "osrm"
    MAP_PROVIDER: str = "openstreetmap"
    DATABASE_URL: str = "sqlite:///../touchgrass.db"
    
    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")

settings = Settings()
