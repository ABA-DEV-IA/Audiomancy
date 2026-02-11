"""
Security utilities for API key authentication.

Validates that requests contain the correct API key from settings.
"""

import hmac

from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from app.core.config import settings

api_key_header = APIKeyHeader(name="X-API-KEY", auto_error=True)

def get_api_key(api_key: str = Security(api_key_header)):
    """Validate the API key using constant-time comparison."""
    if not settings.api_key or not hmac.compare_digest(api_key, settings.api_key):
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

def swagger_enabled() -> bool:
    """Check whether Swagger UI is enabled in settings."""
    return settings.swagger_on
