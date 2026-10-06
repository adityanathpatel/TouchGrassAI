from fastapi.testclient import TestClient
from main import app
import json

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "TouchGrass AI API is running"}

def test_generate_adventure():
    payload = {
        "lat": 37.7749,
        "lng": -122.4194,
        "activity": "Walking",
        "duration_minutes": 30,
        "difficulty": "Moderate",
        "interests": ["Nature"]
    }
    response = client.post("/api/adventures/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "title" in data
    assert "route_geometry" in data
    assert data["duration_minutes"] == 30

def test_get_adventure():
    # First create
    payload = {
        "lat": 37.7749,
        "lng": -122.4194,
        "activity": "Hiking",
        "duration_minutes": 60,
        "difficulty": "Challenging",
        "interests": ["Fitness"]
    }
    create_res = client.post("/api/adventures/generate", json=payload)
    adv_id = create_res.json()["id"]
    
    # Then get
    get_res = client.get(f"/api/adventures/{adv_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == adv_id

def test_ai_json_validation():
    # This implicitly tests that the AI provider (Mock AI) returns valid JSON 
    # matching the expected Pydantic schemas when hitting the endpoint.
    payload = {
        "lat": 0,
        "lng": 0,
        "activity": "Test",
        "duration_minutes": 15,
        "difficulty": "Beginner",
        "interests": []
    }
    response = client.post("/api/adventures/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert type(data["missions"]) == list
    assert type(data["checklist"]) == list
