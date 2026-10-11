from abc import ABC, abstractmethod

from app.schemas import AdventurePlan, ImageAnalysisResult, JournalResult


class AIProvider(ABC):
    name: str

    @abstractmethod
    def generate_adventure(self, prompt: str) -> AdventurePlan:
        raise NotImplementedError

    @abstractmethod
    def generate_journal(self, prompt: str) -> JournalResult:
        raise NotImplementedError

    @abstractmethod
    def analyze_image(self, image_bytes: bytes, hint: str = "") -> ImageAnalysisResult:
        raise NotImplementedError

    @abstractmethod
    def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> str:
        raise NotImplementedError

    @abstractmethod
    def available(self) -> bool:
        raise NotImplementedError
