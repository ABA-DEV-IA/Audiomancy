"""
Tests for the /speech/token route using both synchronous and asynchronous requests.
"""

import pytest
from unittest.mock import patch, AsyncMock
from httpx import AsyncClient
from app.main import app
from app.core.config import settings

@pytest.mark.asyncio
async def test_get_speech_token_success(api_client):
    """✅ Returns a token successfully"""
    async def async_mock_post(*args, **kwargs):
        class MockResponse:
            text = "fake-token"
        return MockResponse()

    with patch("app.routes.speech_token_routes.httpx.AsyncClient.post", new=async_mock_post):
        # Use async client
        response = await api_client.get_async("/speech/token")
        data = response.json()

    assert response.status_code == 200
    assert data["token"] == "fake-token"
    assert data["region"] == settings.speech_region


def test_get_speech_token_missing_key():
    """🚫 Missing API key returns 401"""
    from fastapi.testclient import TestClient
    client = TestClient(app)
    response = client.get("/speech/token")  # No headers
    assert response.status_code == 401
    assert "detail" in response.json()


@pytest.mark.asyncio
async def test_get_speech_token_missing_region(api_client, monkeypatch):
    """🚫 Missing Azure region returns 500"""
    monkeypatch.setattr(settings, "speech_region", None)
    response = await api_client.get_async("/speech/token")
    data = response.json()
    assert response.status_code == 500
    assert "detail" in data


@pytest.mark.asyncio
async def test_get_speech_token_azure_error(api_client):
    """❌ Azure raises an exception -> returns 500"""
    async def async_mock_post(*args, **kwargs):
        raise Exception("Azure error")

    with patch("app.routes.speech_token_routes.httpx.AsyncClient.post", new=async_mock_post):
        response = await api_client.get_async("/speech/token")
        data = response.json()

    assert response.status_code == 500
    assert "detail" in data
    assert "Azure error" in data["detail"]
