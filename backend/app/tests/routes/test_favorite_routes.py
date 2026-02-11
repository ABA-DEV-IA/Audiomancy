"""
Integration tests for the Favorite API routes.

Tests POST /favorite/create, DELETE /favorite/delete/{id},
GET /favorite/list/{user_id} and PUT /favorite/rename endpoints
with mocked services to avoid hitting the database.
"""

import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.models.favorite import Favorite, FavoriteResponse
from app.core.config import settings

HEADERS = {"X-API-KEY": settings.api_key}
client = TestClient(app)


SAMPLE_FAVORITE = Favorite(
    id="fav123",
    user_id="user456",
    name="Ma playlist chill",
    track_list=[],
)


@pytest.fixture(autouse=True)
def mock_favorite_services(monkeypatch):
    """Mock the favorite services to avoid real DB calls."""

    async def fake_create(request):
        return FavoriteResponse(
            success=True,
            message="Favorite created",
            favorite=SAMPLE_FAVORITE,
        )

    async def fake_delete(favorite_id, user_id):
        return FavoriteResponse(success=True, message="Favorite deleted")

    async def fake_list(user_id):
        return [SAMPLE_FAVORITE]

    async def fake_rename(request):
        return FavoriteResponse(success=True, message="Favorite renamed")

    monkeypatch.setattr("app.routes.favorite_routes.create_favorite_service", fake_create)
    monkeypatch.setattr("app.routes.favorite_routes.delete_favorite_service", fake_delete)
    monkeypatch.setattr("app.routes.favorite_routes.list_favorites_service", fake_list)
    monkeypatch.setattr("app.routes.favorite_routes.rename_favorite_service", fake_rename)


def test_create_favorite():
    """Creating a favorite returns 201 with success response."""
    payload = {
        "user_id": "user456",
        "name": "Ma playlist chill",
        "track_list": [],
    }
    response = client.post("/favorite/create", json=payload, headers=HEADERS)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Favorite created"
    assert data["favorite"]["name"] == "Ma playlist chill"


def test_create_favorite_missing_fields():
    """Creating a favorite without required fields returns 422."""
    response = client.post("/favorite/create", json={}, headers=HEADERS)
    assert response.status_code == 422


def test_create_favorite_no_api_key():
    """Creating a favorite without API key returns 403."""
    payload = {"user_id": "u1", "name": "test"}
    response = client.post("/favorite/create", json=payload)
    assert response.status_code == 403


def test_delete_favorite():
    """Deleting a favorite returns 200 with success response."""
    response = client.delete(
        "/favorite/delete/fav123",
        params={"user_id": "user456"},
        headers=HEADERS,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Favorite deleted"


def test_delete_favorite_no_api_key():
    """Deleting a favorite without API key returns 403."""
    response = client.delete("/favorite/delete/fav123", params={"user_id": "u1"})
    assert response.status_code == 403


def test_list_favorites():
    """Listing favorites returns a list of favorites."""
    response = client.get("/favorite/list/user456", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["name"] == "Ma playlist chill"


def test_list_favorites_no_api_key():
    """Listing favorites without API key returns 403."""
    response = client.get("/favorite/list/user456")
    assert response.status_code == 403


def test_rename_favorite():
    """Renaming a favorite returns 200 with success response."""
    payload = {
        "user_id": "user456",
        "favorite_id": "fav123",
        "new_name": "Renamed playlist",
    }
    response = client.put("/favorite/rename", json=payload, headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "Favorite renamed"


def test_rename_favorite_missing_fields():
    """Renaming a favorite without required fields returns 422."""
    response = client.put("/favorite/rename", json={}, headers=HEADERS)
    assert response.status_code == 422
