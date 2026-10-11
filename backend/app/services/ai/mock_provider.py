from uuid import uuid4

from app.schemas import AdventurePlan, ChecklistItem, ImageAnalysisResult, JournalResult, Mission
from app.services.ai.base import AIProvider
from app.services.ai.validators import REQUIRED_SAFETY


class MockAIProvider(AIProvider):
    name = "mock"

    def available(self) -> bool:
        return True

    def generate_adventure(self, prompt: str) -> AdventurePlan:
        activity = "nature"
        if "bird" in prompt.lower():
            activity = "bird watching"
        elif "photo" in prompt.lower():
            activity = "photography"
        elif "run" in prompt.lower():
            activity = "running"
        title_map = {
            "bird watching": "Quiet Sky Watch",
            "photography": "Golden Hour Frames",
            "running": "Soft Ground Loop",
        }
        title = title_map.get(activity, "Urban Nature Detective")
        return AdventurePlan(
            title=title,
            description="A short outdoor mission that keeps your phone in your pocket. Look, listen, and move at a human pace.",
            goal="Spend most of this time noticing the living world around you, not the screen in your hand.",
            difficulty="beginner",
            duration_minutes=60,
            missions=[
                Mission(id="m-leaves", title="Leaf shapes", prompt="Find 3 different leaf shapes."),
                Mission(id="m-birds", title="Birds", prompt="Find 2 birds — even if you only hear them."),
                Mission(id="m-texture", title="Texture", prompt="Find 1 unusual natural texture."),
                Mission(id="m-pattern", title="Pattern", prompt="Find 1 natural geometric pattern."),
            ],
            checklist=[
                ChecklistItem(id="c-water", label="Bring water"),
                ChecklistItem(id="c-shoes", label="Wear comfortable shoes"),
                ChecklistItem(id="c-phone-away", label="Put the phone away between observations"),
                ChecklistItem(id="c-listen", label="Stop once and listen for 30 seconds"),
            ],
            safety_notes=REQUIRED_SAFETY,
            bonus_challenge="Sit still for two minutes without taking a photo.",
            route_requirements="A public walking loop near the starting point, on sidewalks or marked paths, under 5 km.",
        )

    def generate_journal(self, prompt: str) -> JournalResult:
        return JournalResult(
            title="A Quiet Evening Outside",
            summary="The outing started as a short walk and became a small nature hunt — brief glances at the phone, then back to the path.",
            highlights=[
                "Time spent looking instead of scrolling",
                "A route that stayed on public paths",
                "Observations recorded only when something was worth keeping",
            ],
            discoveries=["Leaf shapes along the path", "Birds at the edge of hearing", "A texture you would have walked past"],
            reflection="The best moment was probably the one you did not photograph.",
            interesting_observations=["The light changed faster than expected.", "Small details were easier after putting the phone away."],
            next_time=["Go a little earlier.", "Leave one mission unfinished on purpose.", "Invite someone who walks slower than you."],
        )

    def analyze_image(self, image_bytes: bytes, hint: str = "") -> ImageAnalysisResult:
        label = hint or "a plant or outdoor object"
        return ImageAnalysisResult(
            possible_object=label,
            possible_species=None,
            confidence=0.42,
            short_description="Possible identification from a local placeholder model. Treat this as a guess.",
        )

    def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> str:
        return "Voice note saved. Local speech recognition was not available, so this is a placeholder transcript."
