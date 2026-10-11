from fastapi.testclient import TestClient

from app.main import app
from app.services.ai.json_extract import extract_json_payload

client = TestClient(app, raise_server_exceptions=False)


def test_offline_pack_download():
    created = client.post("/api/adventures/demo")
    adventure_id = created.json()["id"]
    packed = client.post(f"/api/adventures/{adventure_id}/download")
    assert packed.status_code == 200
    assert "Adventure downloaded" in packed.json()["message"]
    assert packed.json()["pack"]["plan"]["missions"]


def test_malformed_model_output():
    try:
        extract_json_payload("I cannot help with that.")
        assert False
    except ValueError:
        pass
