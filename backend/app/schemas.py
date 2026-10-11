from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator


Difficulty = Literal["beginner", "moderate", "challenging", "easy"]
Activity = Literal[
    "walking",
    "hiking",
    "running",
    "cycling",
    "bird watching",
    "photography",
    "nature exploration",
    "gardening",
    "family activity",
    "nature",
    "custom",
]


class Coordinate(BaseModel):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)


class Mission(BaseModel):
    id: str
    title: str
    prompt: str
    completed: bool = False


class ChecklistItem(BaseModel):
    id: str
    label: str
    completed: bool = False


class AdventurePlan(BaseModel):
    title: str = Field(min_length=3, max_length=80)
    description: str = Field(min_length=10, max_length=600)
    goal: str = Field(min_length=8, max_length=400)
    difficulty: str
    duration_minutes: int = Field(ge=10, le=240)
    missions: list[Mission] = Field(min_length=1, max_length=8)
    checklist: list[ChecklistItem] = Field(min_length=1, max_length=12)
    safety_notes: list[str] = Field(min_length=1, max_length=10)
    bonus_challenge: str | None = None
    route_requirements: str = ""

    @field_validator("difficulty")
    @classmethod
    def normalize_difficulty(cls, value: str) -> str:
        mapping = {"easy": "beginner", "medium": "moderate", "hard": "challenging"}
        cleaned = value.strip().lower()
        return mapping.get(cleaned, cleaned)


class Preferences(BaseModel):
    name: str = "Explorer"
    activities: list[str] = Field(default_factory=lambda: ["walking"])
    fitness_level: str = "moderate"
    available_time_minutes: int = 60
    preferred_distance_km: float = 3.0
    difficulty: str = "beginner"
    interests: list[str] = Field(default_factory=lambda: ["nature"])


class GenerateAdventureRequest(BaseModel):
    preferences: Preferences = Field(default_factory=Preferences)
    activity: str = "walking"
    duration_minutes: int = 60
    difficulty: str = "beginner"
    interests: list[str] = Field(default_factory=lambda: ["nature"])
    location: Coordinate | None = None
    location_label: str = ""
    custom_activity: str | None = None
    demo: bool = False


class RouteGenerateRequest(BaseModel):
    start: Coordinate
    end: Coordinate | None = None
    duration_minutes: int = 60
    activity: str = "walking"
    difficulty: str = "beginner"
    demo: bool = False


class RouteResult(BaseModel):
    provider: str
    fallback: bool = False
    distance_km: float
    duration_minutes: float
    start: Coordinate
    end: Coordinate
    waypoints: list[Coordinate]
    geometry: list[list[float]]
    source: str


class ObservationCreate(BaseModel):
    adventure_id: str
    category: str
    note: str = ""
    transcript: str = ""
    latitude: float | None = None
    longitude: float | None = None
    ai_label: str | None = None
    ai_confidence: float | None = None


class JournalGenerateRequest(BaseModel):
    adventure_id: str
    observations: list[dict[str, Any]] = Field(default_factory=list)
    completed_missions: list[str] = Field(default_factory=list)
    completed_checklist: list[str] = Field(default_factory=list)
    notes: str = ""
    voice_transcripts: list[str] = Field(default_factory=list)
    distance_km: float | None = None
    duration_minutes: float | None = None
    demo: bool = False


class JournalResult(BaseModel):
    title: str
    summary: str
    highlights: list[str]
    discoveries: list[str]
    reflection: str
    interesting_observations: list[str]
    next_time: list[str]


class ImageAnalysisResult(BaseModel):
    possible_object: str
    possible_species: str | None = None
    confidence: float = Field(ge=0, le=1)
    short_description: str
    disclaimer: str = "AI identification can be incorrect."
