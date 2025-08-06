"""
Integration tests for the Jamendo API route.

Tests the POST /jamendo/tracks endpoint with valid payloads and ensures
the returned data is correctly structured and complete.
"""

from fastapi.testclient import TestClient
from app.main import app 

client = TestClient(app)

def test_generate_tracks_success(): 
    payload = {
        "tags":"magic fantasy cinematic",
        "duration_min":180,
        "duration_max":480,
        "limit":10
    }
    response = client.post("/jamendo/tracks", json=payload)
    assert response.status_code == 200 
    assert isinstance(response.json(), list)
    if response.json():
        track = response.json()[0]
        assert "id" in track
        assert "title" in track 
        assert "audio_url" in track 