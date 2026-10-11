from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app, raise_server_exceptions=False)


def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["ok"] is True


def test_empty_location_search_message():
    response = client.get("/api/routes/search", params={"q": " "})
    assert response.status_code == 200


def test_missing_adventure():
    response = client.get("/api/adventures/nope")
    assert response.status_code == 404


def test_invalid_observation_payload():
    response = client.post("/api/observations", json={})
    assert response.status_code == 422


def test_delete_privacy():
    response = client.delete("/api/privacy/data")
    assert response.status_code == 200
    assert response.json()["deleted"] is True


def test_generate_demo_adventure_api():
    response = client.post("/api/adventures/generate", json={"demo": True, "duration_minutes": 60})
    assert response.status_code == 200
    body = response.json()
    assert body["plan"]["title"]
    assert body["is_demo"] is True
