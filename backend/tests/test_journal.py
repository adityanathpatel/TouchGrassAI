from app.services.ai.json_extract import extract_json_payload
from app.services.ai.validators import validate_journal
from app.services.demo import demo_journal


def test_demo_journal_fields():
    journal = demo_journal()
    assert journal.title
    assert journal.next_time
    assert journal.summary


def test_journal_validation():
    raw = '{"title": "A Quiet Evening by the Lake", "summary": "The evening started as a short walk but became a small nature hunt along the water.", "highlights": ["lake light"], "discoveries": ["parrots"], "reflection": "I looked up more.", "interesting_observations": ["three parrots"], "next_time": ["go earlier"]}'
    data = extract_json_payload(raw)
    result = validate_journal(data)
    assert result.title.startswith("A Quiet Evening")
