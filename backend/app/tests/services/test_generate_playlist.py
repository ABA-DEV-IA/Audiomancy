"""
Integration tests for the AI-powered playlist generation route (async version).
"""

import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient
from app.main import app


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


@pytest.mark.asyncio
async def test_generate_playlist_success(fake_tracks):
    """✅ Normal case : agent generates tags and Jamendo returns a playlist"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        with patch("app.routes.ai_routes.ai_executor", new_callable=AsyncMock, return_value="calm,study"), \
             patch("app.routes.ai_routes.get_tracks_for_reader", new_callable=AsyncMock, return_value=fake_tracks):

            response = await client.post(
                "/generate/playlist",
                json={"prompt": "Je veux une playlist calme", "limit": 10}
            )

            assert response.status_code == 200
            data = response.json()
            assert isinstance(data, list)
            assert data[0]["title"] == "Fake Song"
            assert "study" in data[0]["tags"]


@pytest.mark.asyncio
async def test_generate_playlist_empty():
    """⚠️ Cases where Jamendo does not return any tracks"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        with patch("app.routes.ai_routes.ai_executor", new_callable=AsyncMock, return_value="calm,study"), \
             patch("app.routes.ai_routes.get_tracks_for_reader", new_callable=AsyncMock, return_value=[]):

            response = await client.post(
                "/generate/playlist",
                json={"prompt": "Je veux une playlist calme", "limit": 10}
            )

            assert response.status_code == 200
            assert response.json() == []


@pytest.mark.asyncio
async def test_generate_playlist_agent_failure():
    """❌ Case where the agent crashes"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        with patch("app.routes.ai_routes.ai_executor", new_callable=AsyncMock, side_effect=Exception("Agent crashed")):
            response = await client.post(
                "/generate/playlist",
                json={"prompt": "Je veux une playlist calme", "limit": 10}
            )
            assert response.status_code == 500


@pytest.mark.asyncio
async def test_generate_playlist_invalid_limit():
    """🚫 Case where 'limit' is invalid -> FastAPI/Pydantic should return 422"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/generate/playlist",
            json={"prompt": "Une playlist impossible", "limit": 1}  # ❌ not in {10, 25, 50}
        )

        assert response.status_code == 422
        data = response.json()
        assert data["detail"][0]["msg"] == "Value error, limit must be one of 10, 25, or 50"
        assert data["detail"][0]["loc"][-1] == "limit"
