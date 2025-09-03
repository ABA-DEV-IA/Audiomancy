"""
Tests for the /speech-token endpoint using the shared api_client fixture.
"""

import pytest
from unittest.mock import patch, MagicMock
from requests.exceptions import RequestException

def test_get_speech_token_success(api_client):
    """✅ Returns token and region if config is valid and Azure responds."""

    mock_response = MagicMock()
    mock_response.raise_for_status.return_value = None
    mock_response.text = "fake_token"

    with patch("app.core.config.settings.speech_key", "fake_key"), \
         patch("app.core.config.settings.speech_region", "westeurope"), \
         patch("app.routes.speech_token_routes.requests.post", return_value=mock_response):

        response = api_client.post("/speech-token")
        assert response.status_code == 200
        data = response.json()
        assert data["token"] == "fake_token"
        assert data["region"] == "westeurope"


def test_get_speech_token_missing_key(api_client):
    """🚫 Returns 500 if the speech key is missing."""

    with patch("app.core.config.settings.speech_key", None), \
         patch("app.core.config.settings.speech_region", "westeurope"):

        response = api_client.post("/speech-token")
        assert response.status_code == 500
        assert response.json()["detail"] == "Missing Azure Speech config"


def test_get_speech_token_missing_region(api_client):
    """🚫 Returns 500 if the speech region is missing."""

    with patch("app.core.config.settings.speech_key", "fake_key"), \
         patch("app.core.config.settings.speech_region", None):

        response = api_client.post("/speech-token")
        assert response.status_code == 500
        assert response.json()["detail"] == "Missing Azure Speech config"


def test_get_speech_token_azure_error(api_client):
    """🚫 Returns 500 if Azure request fails."""

    mock_response = MagicMock()
    # Important : simulate a request exception
    mock_response.raise_for_status.side_effect = RequestException("HTTP Error")

    with patch("app.core.config.settings.speech_key", "fake_key"), \
         patch("app.core.config.settings.speech_region", "westeurope"), \
         patch("app.routes.speech_token_routes.requests.post", return_value=mock_response):

        response = api_client.post("/speech-token")
        assert response.status_code == 500
        assert "Azure token request failed" in response.json()["detail"]
