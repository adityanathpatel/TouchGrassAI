from uuid import uuid4

from app.schemas import AdventurePlan, ChecklistItem, Coordinate, JournalResult, Mission, RouteResult
from app.services.ai.validators import REQUIRED_SAFETY
from app.services.geo import demo_route


def demo_adventure() -> tuple[AdventurePlan, RouteResult]:
    plan = AdventurePlan(
        title="60-Minute Nature Hunt",
        description="A labeled demo walk in Golden Gate Park. Find living details, then put the phone away.",
        goal="Complete a gentle public loop and notice four outdoor things without lingering on the screen.",
        difficulty="beginner",
        duration_minutes=60,
        missions=[
            Mission(id="demo-bird", title="Bird", prompt="Find one bird — seen or heard."),
            Mission(id="demo-tree", title="Tree", prompt="Notice one tree you would usually walk past."),
            Mission(id="demo-flower", title="Flower", prompt="Find one flower or bloom."),
            Mission(id="demo-landscape", title="Landscape", prompt="Pause for a landscape view."),
        ],
        checklist=[
            ChecklistItem(id="demo-c1", label="Water"),
            ChecklistItem(id="demo-c2", label="Comfortable shoes"),
            ChecklistItem(id="demo-c3", label="Phone on silent"),
        ],
        safety_notes=REQUIRED_SAFETY,
        bonus_challenge="Walk two minutes without unlocking your phone.",
        route_requirements="Public park paths only.",
    )
    route = demo_route("hackathon-demo")
    route.distance_km = 3.8
    route.duration_minutes = 60
    return plan, route


def demo_observations() -> list[dict]:
    return [
        {"category": "Bird", "note": "Small bird in a canopy near the meadow.", "demo": True},
        {"category": "Plant", "note": "A broad tree with deeply grooved bark.", "demo": True},
        {"category": "Plant", "note": "A cluster of flowers at path edge.", "demo": True},
        {"category": "Landscape", "note": "Open meadow light, late afternoon.", "demo": True},
    ]


def demo_journal() -> JournalResult:
    return JournalResult(
        title="A Quiet Hour in the Park",
        summary="A labeled demo walk: four notices, a 3.8 km public loop, and a phone that mostly stayed in a pocket.",
        highlights=["Bird at the meadow edge", "Tree bark texture", "A pause for landscape light"],
        discoveries=["The loop is short enough to finish without rushing."],
        reflection="Demo data is clearly labeled so a hackathon judge can tell sample from lived experience.",
        interesting_observations=["Flower at the path edge", "Open meadow"],
        next_time=["Use a real location near you", "Record one voice note while walking"],
    )


def new_id() -> str:
    return uuid4().hex
