"""
Integration tests for the AI-powered playlist generation route.

Tests the POST /generate/playlist endpoint with different scenarios:
- ✅ Normal case: agent generates tags and Jamendo returns a valid playlist.
- ⚠️ Edge case: Jamendo returns no tracks for the given tags.
- ❌ Failure case: the AI agent crashes, and the API responds with a 500 error.
- 🚫 Validation case: invalid limit triggers 422 Unprocessable Entity.
"""

import pytest
from unittest.mock import patch


@pytest.fixture
def fake_tracks():
    """Returns a list of dictionaries representing fake tracks."""
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
    """✅ Normal case : agent generates tags and Jamendo returns a playlist"""
    with patch("app.routes.ai_routes.ai_executor", return_value="calm,study"), \
         patch("app.routes.ai_routes.get_tracks_for_reader", return_value=fake_tracks):

        response = api_client.post(
            "/generate/playlist",
            json={"prompt": "Je veux une playlist calme", "limit": 10}
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert data[0]["title"] == "Fake Song"
        assert "study" in data[0]["tags"]


def test_generate_playlist_empty(api_client):
    """⚠️ Cases where Jamendo does not return any tracks"""
    with patch("app.routes.ai_routes.ai_executor", return_value="calm,study"), \
         patch("app.routes.ai_routes.get_tracks_for_reader", return_value=[]):

        response = api_client.post(
            "/generate/playlist",
            json={"prompt": "Je veux une playlist calme", "limit": 10}
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert data == []


def test_generate_playlist_agent_failure(api_client):
    """❌ Case where the agent crashes"""
    with patch("app.routes.ai_routes.ai_executor", side_effect=Exception("Agent crashed")):
        response = api_client.post(
            "/generate/playlist",
            json={"prompt": "Je veux une playlist calme", "limit": 10}
        )

        assert response.status_code == 500


def test_generate_playlist_invalid_limit(api_client):
    response = api_client.post(
        "/generate/playlist",
        json={"prompt": "Une playlist impossible", "limit": 1}
    )

    assert response.status_code == 422
    data = response.json()

    # Ici data["detail"] est une string, pas une liste de dicts
    assert isinstance(data["detail"], str)
    assert "limit must be one of 10, 25, or 50" in data["detail"]

