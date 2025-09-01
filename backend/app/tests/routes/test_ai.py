import pytest
from unittest.mock import patch

@pytest.fixture
def fake_tracks():
    return [
        {
            "id": "1",
            "title": "Fake Song",
            "artist": "Fake Artist",
            "audio_url": "http://example.com/audio.mp3",
            "duration": 180,
            "license_name": "CC",
            "license_url": "http://example.com/license",
            "tags": ["calm", "study"],
            "image": "http://example.com/image.jpg",
        }
    ]

def test_generate_playlist_success(api_client, fake_tracks):
    with patch("app.routes.ai_routes.ai_executor", return_value="calm study"), \
         patch("app.routes.ai_routes.get_tracks_for_reader", return_value=fake_tracks):
        response = api_client.post("/generate/playlist", json={"prompt": "Je veux une playlist calme", "limit": 10})
        assert response.status_code == 200
        data = response.json()
        assert data == fake_tracks

def test_generate_playlist_empty(api_client):
    with patch("app.routes.ai_routes.ai_executor", return_value="calm study"), \
         patch("app.routes.ai_routes.get_tracks_for_reader", return_value=[]):
        response = api_client.post("/generate/playlist", json={"prompt": "Je veux une playlist calme", "limit": 10})
        assert response.status_code == 200
        assert response.json() == []

def test_generate_playlist_ai_failure(api_client):
    with patch("app.routes.ai_routes.ai_executor", side_effect=Exception("AI crashed")):
        response = api_client.post("/generate/playlist", json={"prompt": "Test", "limit": 10})
        assert response.status_code == 500
        assert "AI crashed" in response.json()["detail"]
