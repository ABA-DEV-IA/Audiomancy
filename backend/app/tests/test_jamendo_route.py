"""
Integration tests for the Jamendo API route.

Tests the POST /jamendo/tracks endpoint with valid payloads and ensures
the returned data is correctly structured and complete.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


@pytest.fixture(autouse=True)
def mock_fetch_tracks(monkeypatch):
    """Mock Jamendo API calls to avoid real HTTP requests during tests."""
    def fake_fetch_tracks(params):
        return {
            "results": [
                {
                    "id": "123",
                    "name": "Mock Song",
                    "artist_name": "Mock Artist",
                    "audio": "http://mock.com/song.mp3",
                    "duration": 200,
                    "license_ccurl": "https://creativecommons.org/licenses/by/3.0/",
                    "musicinfo": {"tags": {"vartags": ["magic", "fantasy"]}},
                    "album_image": "http://mock.com/image.jpg",
                }
            ]
        }
    # 👉 Patch l’import réellement utilisé par le service
    monkeypatch.setattr("app.services.jamendo.jamendo_service.fetch_tracks", fake_fetch_tracks)


def test_generate_tracks_success():
    payload = {
        "tags": "magic fantasy cinematic",
        "duration_min": 180,
        "duration_max": 480,
        "limit": 10
    }
    response = client.post("/jamendo/tracks", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert data[0]["id"] == "123"
    assert data[0]["title"] == "Mock Song"
    assert data[0]["artist"] == "Mock Artist"
