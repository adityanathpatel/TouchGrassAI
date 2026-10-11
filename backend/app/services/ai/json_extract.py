import json
import re
from typing import Any


PAYLOAD_RE = re.compile(r"<payload>\s*(\{.*\}|\[.*\])\s*</payload>", re.DOTALL)
OBJECT_RE = re.compile(r"(\{.*\})", re.DOTALL)


def extract_json_payload(raw_text: str) -> dict[str, Any]:
    """Pull JSON out of LLM text: tagged payload, fences, then first object."""
    if not raw_text or not raw_text.strip():
        raise ValueError("Empty AI response")

    text = raw_text.strip()
    tagged = PAYLOAD_RE.search(text)
    if tagged:
        return json.loads(tagged.group(1))

    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fenced:
        return json.loads(fenced.group(1))

    fallback = OBJECT_RE.search(text)
    if not fallback:
        raise ValueError("No JSON payload detected in response.")
    return json.loads(fallback.group(1))
