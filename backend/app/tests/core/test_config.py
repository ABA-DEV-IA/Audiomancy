"""
Tests for the application configuration module.

Covers:
- CORS origin parsing (with and without allowed_origins)
- HashiCorp Vault loading (no URL, cached, success, failure)
"""

import logging
import pytest
from unittest.mock import patch, MagicMock

from app.core.config import Settings


def test_cors_origins_with_allowed_origins():
    """If allowed_origins is defined, it should be split correctly."""
    settings = Settings(allowed_origins="http://foo.com,http://bar.com")
    assert settings.cors_origins == ["http://foo.com", "http://bar.com"]


def test_cors_origins_without_allowed_origins():
    """If allowed_origins is None, defaults should be returned."""
    settings = Settings(allowed_origins=None)
    assert "http://localhost:3000" in settings.cors_origins
    assert "http://127.0.0.1:3000" in settings.cors_origins


def test_cors_origins_single_origin():
    """A single origin is returned as a one-element list."""
    settings = Settings(allowed_origins="https://myapp.example.com")
    assert settings.cors_origins == ["https://myapp.example.com"]


def test_load_from_vault_no_url(caplog):
    """Should skip vault loading when vault_url is not set."""
    with caplog.at_level(logging.INFO, logger="app.core.config"):
        settings = Settings(vault_url=None, vault_token=None)
        settings.load_from_vault()
    assert "No Vault URL" in caplog.text or "Using .env values only" in caplog.text


def test_load_from_vault_no_token(caplog):
    """Should skip vault loading when vault_token is not set."""
    with caplog.at_level(logging.INFO, logger="app.core.config"):
        settings = Settings(vault_url="http://vault:8200", vault_token=None)
        settings.load_from_vault()
    assert "No Vault URL" in caplog.text or "Using .env values only" in caplog.text


def test_load_from_vault_uses_cache(caplog):
    """Should load secrets from in-memory cache when available."""
    settings = Settings(vault_url="http://vault:8200", vault_token="test-token")
    settings._secrets_cache = {"jamendo_client_id": "cached123"}
    with caplog.at_level(logging.INFO, logger="app.core.config"):
        settings.load_from_vault(force_reload=False)
    assert settings.jamendo_client_id == "cached123"
    assert "cache" in caplog.text.lower()


@patch("app.core.config.requests.get")
def test_load_from_vault_success(mock_get, capfd):
    """Should load secrets from HashiCorp Vault when configured."""
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "data": {
            "data": {
                "client_id": "test_jamendo_id",
                "url": "https://api.jamendo.com/v3.0/tracks",
            }
        }
    }
    mock_get.return_value = mock_response

    settings = Settings(vault_url="http://vault:8200", vault_token="test-token")
    settings.load_from_vault(force_reload=True)

    assert settings.jamendo_client_id == "test_jamendo_id"
    assert "jamendo_client_id" in settings._secrets_cache


@patch("app.core.config.requests.get")
def test_load_from_vault_failure(mock_get, caplog):
    """Should handle vault connection failure gracefully."""
    mock_get.side_effect = Exception("Connection refused")

    settings = Settings(vault_url="http://vault:8200", vault_token="test-token")
    with caplog.at_level(logging.WARNING, logger="app.core.config"):
        settings.load_from_vault(force_reload=True)

    assert "Failed" in caplog.text or "Connection refused" in caplog.text
