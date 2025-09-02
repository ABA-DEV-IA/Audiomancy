import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings

# ---------- Synchronous TestClient ----------
sync_client = TestClient(app)

# ---------- Shared headers ----------
HEADERS = {"X-API-KEY": settings.api_key}


@pytest.fixture
def api_client():
    """
    Hybrid client fixture supporting both synchronous
    and asynchronous requests with API key automatically included.
    """

    class HybridClient:
        # ---------- Synchronous methods ----------
        def get(self, url: str, params: dict = None):
            return sync_client.get(url, params=params, headers=HEADERS)

        def post(self, url: str, json: dict = None):
            return sync_client.post(url, json=json, headers=HEADERS)

        def put(self, url: str, json: dict = None):
            return sync_client.put(url, json=json, headers=HEADERS)

        def delete(self, url: str, params: dict = None):
            return sync_client.delete(url, params=params, headers=HEADERS)

        # ---------- Asynchronous methods ----------
        async def get_async(self, url: str, params: dict = None):
            async with AsyncClient(
                transport=ASGITransport(app=app),
                base_url="http://test"
            ) as client:
                return await client.get(url, params=params, headers=HEADERS)

        async def post_async(self, url: str, json: dict = None):
            async with AsyncClient(
                transport=ASGITransport(app=app),
                base_url="http://test"
            ) as client:
                return await client.post(url, json=json, headers=HEADERS)

        async def put_async(self, url: str, json: dict = None):
            async with AsyncClient(
                transport=ASGITransport(app=app),
                base_url="http://test"
            ) as client:
                return await client.put(url, json=json, headers=HEADERS)

        async def delete_async(self, url: str, params: dict = None):
            async with AsyncClient(
                transport=ASGITransport(app=app),
                base_url="http://test"
            ) as client:
                return await client.delete(url, params=params, headers=HEADERS)

    return HybridClient()
