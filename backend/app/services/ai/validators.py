from uuid import uuid4

from pydantic import ValidationError

from app.schemas import AdventurePlan, ChecklistItem, JournalResult, Mission


REQUIRED_SAFETY = [
    "Stay on marked trails and public paths.",
    "Avoid restricted or private areas.",
    "Check weather before you go.",
    "Do not explore dangerous locations.",
    "Do not rely on AI for emergency or safety-critical decisions.",
    "Keep emergency contacts accessible.",
]


def _ids(prefix: str, items: list) -> list:
    out = []
    for item in items:
        if isinstance(item, dict) and not item.get("id"):
            item = {**item, "id": f"{prefix}-{uuid4().hex[:8]}"}
        out.append(item)
    return out


def validate_adventure_plan(data: dict) -> AdventurePlan:
    payload = dict(data)
    payload["missions"] = _ids("m", payload.get("missions") or [])
    payload["checklist"] = _ids("c", payload.get("checklist") or [])
    if not payload.get("safety_notes"):
        payload["safety_notes"] = REQUIRED_SAFETY
    else:
        merged = list(payload["safety_notes"])
        for note in REQUIRED_SAFETY[:3]:
            if note not in merged:
                merged.append(note)
        payload["safety_notes"] = merged[:10]
    try:
        plan = AdventurePlan.model_validate(payload)
    except ValidationError as exc:
        raise ValueError(f"Invalid adventure JSON: {exc.errors()[0]['msg']}") from exc
    return plan


def validate_journal(data: dict) -> JournalResult:
    try:
        return JournalResult.model_validate(data)
    except ValidationError as exc:
        raise ValueError(f"Invalid journal JSON: {exc.errors()[0]['msg']}") from exc


def coerce_mission_list(raw: list) -> list[Mission]:
    missions = []
    for item in raw:
        if isinstance(item, str):
            missions.append(Mission(id=f"m-{uuid4().hex[:8]}", title=item[:40], prompt=item))
        else:
            missions.append(Mission.model_validate({**item, "id": item.get("id") or f"m-{uuid4().hex[:8]}"}))
    return missions


def coerce_checklist(raw: list) -> list[ChecklistItem]:
    items = []
    for item in raw:
        if isinstance(item, str):
            items.append(ChecklistItem(id=f"c-{uuid4().hex[:8]}", label=item))
        else:
            items.append(
                ChecklistItem.model_validate({**item, "id": item.get("id") or f"c-{uuid4().hex[:8]}"})
            )
    return items
