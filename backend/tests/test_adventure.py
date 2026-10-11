from app.schemas import GenerateAdventureRequest, Preferences
from app.services.adventures import generate_adventure_plan
from app.services.demo import demo_adventure


def test_demo_adventure_shape():
    plan, route = demo_adventure()
    assert plan.title == "60-Minute Nature Hunt"
    assert route.distance_km == 3.8
    assert len(plan.missions) == 4


def test_mock_generation_validates():
    request = GenerateAdventureRequest(
        preferences=Preferences(name="Asha", activities=["walking"]),
        activity="photography",
        duration_minutes=45,
        difficulty="moderate",
        interests=["nature"],
    )
    plan, source = generate_adventure_plan(request)
    assert plan.duration_minutes == 45
    assert plan.title
    assert source in {"ollama", "mock", "mock-fallback", "local", "demo"}
