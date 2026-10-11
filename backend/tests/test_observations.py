from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app

client = TestClient(app, raise_server_exceptions=False)


def test_create_observation_requires_adventure():
    response = client.post(
        "/api/observations",
        json={"adventure_id": "missing", "category": "Bird", "note": "parrot"},
    )
    assert response.status_code == 404


def test_observation_roundtrip():
    demo = client.post("/api/adventures/demo")
    adventure_id = demo.json()["id"]
    created = client.post(
        "/api/observations",
        json={
            "adventure_id": adventure_id,
            "category": "Bird",
            "note": "I saw three parrots near the lake.",
            "latitude": 37.77,
            "longitude": -122.48,
        },
    )
    assert created.status_code == 200
    listed = client.get("/api/observations", params={"adventure_id": adventure_id})
    assert listed.status_code == 200
    assert listed.json()[0]["category"] == "Bird"
