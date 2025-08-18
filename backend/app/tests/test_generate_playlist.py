"""
Integration tests for the AI-powered playlist generation route.

Tests the POST /generate/playlist endpoint with different scenarios:
- ✅ Normal case: agent generates tags and Jamendo returns a valid playlist.
- ⚠️ Edge case: Jamendo returns no tracks for the given tags.
- ❌ Failure case: the AI agent crashes, and the API responds with a 500 error.

These tests use unittest.mock to patch the ai_executor (tag generation)
and get_tracks_for_reader (Jamendo service) functions, ensuring that
no real AI or external API calls are made during testing.
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)

@pytest.fixture
def fake_tracks():
    """
    Returns a list of dictionaries representing fake tracks.
    
    Each dictionary represents a track and contains the following fields:
    - id: str
    - title: str
    - artist: str
    - audio_url: str
    - duration: int
    - license_name: str
    - license_url: str
    - tags: List[str]
    - image: str
    """

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


def test_generate_playlist_success(fake_tracks):
    """✅ Normal case : agent generates tags and Jamendo returns a playlist"""
    with patch("app.routes.ai_routes.ai_executor", return_value="calm,study"), \
         patch("app.routes.ai_routes.get_tracks_for_reader", return_value=fake_tracks):

        response = client.post(
            "/generate/playlist",
            json={"prompt": "Je veux une playlist calme", "limit": 1}
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert data[0]["title"] == "Fake Song"
        assert "study" in data[0]["tags"]


def test_generate_playlist_empty():
    """⚠️ Cases where Jamendo does not return any tracks"""
    with patch("app.routes.ai_routes.ai_executor", return_value="calm,study"), \
         patch("app.routes.ai_routes.get_tracks_for_reader", return_value=[]):

        response = client.post(
            "/generate/playlist",
            json={"prompt": "Je veux une playlist calme", "limit": 1}
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert data == []

def test_generate_playlist_agent_failure():
    """❌ Case where the agent crashes"""
    with patch("app.routes.ai_routes.ai_executor", side_effect=Exception("Agent crashed")):
        response = client.post(
            "/generate/playlist",
            json={"prompt": "Je veux une playlist calme", "limit": 1}
        )

        assert response.status_code == 500
