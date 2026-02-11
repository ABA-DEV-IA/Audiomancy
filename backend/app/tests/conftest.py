import os
from dotenv import load_dotenv

# Load .env.test before app imports so test settings take effect
env_test_path = os.path.join(os.getcwd(), ".env.test")
if os.path.exists(env_test_path):
    load_dotenv(env_test_path)
else:
    print("WARNING: .env.test not found. Falling back to system env.")

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

# Shared TestClient instance
client = TestClient(app)

# Shared headers with valid API key
HEADERS = {"X-API-KEY": settings.api_key}


@pytest.fixture
def api_client():
    """
    Fixture returning a wrapper around TestClient 
    that automatically includes the API key in headers
    for all HTTP methods.
    """
    class AuthenticatedClient:
        def post(self, url: str, json: dict = None):
            return client.post(url, json=json, headers=HEADERS)

        def get(self, url: str, params: dict = None):
            return client.get(url, params=params, headers=HEADERS)

        def put(self, url: str, json: dict = None):
            return client.put(url, json=json, headers=HEADERS)

        def delete(self, url: str, params: dict = None):
            return client.delete(url, params=params, headers=HEADERS)

    return AuthenticatedClient()
