import pytest

from app.services.ai.json_extract import extract_json_payload
from app.services.ai.validators import validate_adventure_plan, validate_journal


def test_extract_json_from_payload_tags():
    raw = 'Sure.\n<payload>{"title": "Walk", "description": "A calm walk outside today.", "goal": "Notice living things", "difficulty": "easy", "duration_minutes": 60, "missions": [{"title": "Leaves", "prompt": "Find 3 leaf shapes"}], "checklist": [{"label": "Water"}], "safety_notes": ["Stay on trails"]}</payload>'
    data = extract_json_payload(raw)
    plan = validate_adventure_plan(data)
    assert plan.title == "Walk"
    assert plan.difficulty == "beginner"


def test_extract_json_from_fences():
    raw = '```json\n{"title": "Lake", "summary": "A short walk became a hunt for textures along the water.", "highlights": ["light"], "discoveries": ["birds"], "reflection": "slow down", "interesting_observations": ["bark"], "next_time": ["earlier"]}\n```'
    data = extract_json_payload(raw)
    journal = validate_journal(data)
    assert "Lake" in journal.title


def test_invalid_adventure_rejected():
    with pytest.raises(ValueError):
        validate_adventure_plan({"title": "x"})


def test_empty_ai_response():
    with pytest.raises(ValueError):
        extract_json_payload("   ")
