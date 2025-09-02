"""
Unit tests for the Jamendo service logic.

Mocks API calls and verifies the behavior of the get_tracks_for_reader function
under various conditions (valid response, empty result, etc.).
"""

import pytest
from unittest.mock import AsyncMock, patch
from app.services.jamendo.jamendo_service import get_tracks_for_reader


@pytest.mark.asyncio
@patch("app.services.jamendo.jamendo_service.fetch_tracks", new_callable=AsyncMock)
async def test_get_tracks_for_reader_returns_formatted(mock_fetch):
    """Ensure get_tracks_for_reader returns a properly formatted list when Jamendo API returns results."""
    mock_fetch.return_value = {
        "results": [
            {
                "id": "1",
                "name": "Test Song",
                "artist_name": "Test Artist",
                "audio": "https://audio.mp3",
                "duration": 240,
                "license_ccurl": "https://creativecommons.org/licenses/by/4.0/",
                "musicinfo": {"tags": {"vartags": ["cinematic"]}},
                "album_image": "https://image.com"
            }
        ]
    }

    results = await get_tracks_for_reader("cinematic", 180, 300, 1)
    assert len(results) == 1
    assert results[0]["title"] == "Test Song"
    assert results[0]["tags"] == ["cinematic"]


@pytest.mark.asyncio
@patch("app.services.jamendo.jamendo_service.fetch_tracks", new_callable=AsyncMock)
async def test_get_tracks_for_reader_empty_results(mock_fetch):
    """Ensure get_tracks_for_reader returns an empty list when Jamendo API returns no results."""
    mock_fetch.return_value = {"results": []}
    results = await get_tracks_for_reader("cinematic", 180, 300, 1)
    assert results == []
