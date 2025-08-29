"""
Tests for the /speech-token endpoint using the shared api_client fixture.
"""

import pytest
from unittest.mock import patch


def test_get_speech_token_success(api_client):
    """
    ✅ Returns key and region if both are correctly defined.
    """
    with patch("app.routes.speech_token_routes.speech_key", "fake_key"), \
         patch("app.routes.speech_token_routes.speech_region", "westeurope"):

        response = api_client.post("/speech-token")
        assert response.status_code == 200
        data = response.json()
        assert data["key"] == "fake_key"
        assert data["region"] == "westeurope"


def test_get_speech_token_missing_key(api_client):
    """
    🚫 Returns 500 if the speech key is missing.
    """
    with patch("app.routes.speech_token_routes.speech_key", None), \
         patch("app.routes.speech_token_routes.speech_region", "westeurope"):

        response = api_client.post("/speech-token")
        assert response.status_code == 500
        assert response.json()["detail"] == "Config Azure manquante"


def test_get_speech_token_missing_region(api_client):
    """
    🚫 Returns 500 if the speech region is missing.
    """
    with patch("app.routes.speech_token_routes.speech_key", "fake_key"), \
         patch("app.routes.speech_token_routes.speech_region", None):

        response = api_client.post("/speech-token")
        assert response.status_code == 500
        assert response.json()["detail"] == "Config Azure manquante"
