from app.schemas import GenerateAdventureRequest
from app.services.ai.factory import get_ai_provider
from app.services.ai.mock_provider import MockAIProvider
from app.services.demo import demo_adventure


def build_adventure_prompt(request: GenerateAdventureRequest) -> str:
    prefs = request.preferences
    activity = request.custom_activity or request.activity
    location = request.location_label or "the user's current area"
    return f"""Create a personalized outdoor adventure.
Name: {prefs.name}
Activity: {activity}
Duration: {request.duration_minutes} minutes
Difficulty: {request.difficulty}
Interests: {", ".join(request.interests) or "nature"}
Fitness: {prefs.fitness_level}
Preferred distance: {prefs.preferred_distance_km} km
Starting area (label only, no coordinates): {location}
Do not output coordinates. Do not invent a turn-by-turn route.
"""


def generate_adventure_plan(request: GenerateAdventureRequest):
    if request.demo:
        plan, _ = demo_adventure()
        return plan, "demo"
    provider = get_ai_provider()
    prompt = build_adventure_prompt(request)
    try:
        plan = provider.generate_adventure(prompt)
        source = provider.name
    except Exception:
        plan = MockAIProvider().generate_adventure(prompt)
        source = "mock-fallback"
    plan.duration_minutes = request.duration_minutes
    plan.difficulty = request.difficulty
    return plan, source
