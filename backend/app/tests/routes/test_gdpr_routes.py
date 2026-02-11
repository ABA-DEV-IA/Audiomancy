"""
Integration tests for the GDPR API routes.

Tests POST /gdpr/data-export, DELETE /gdpr/account,
and GET /gdpr/data-retention-policy endpoints
with mocked MongoDB collections.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

HEADERS = {"X-API-KEY": settings.api_key}
client = TestClient(app)

FAKE_USER_ID = ObjectId()
FAKE_USER = {
    "_id": FAKE_USER_ID,
    "email": "test@example.com",
    "username": "testuser",
    "created_at": "2025-01-01T00:00:00",
}


class FakeAsyncCursor:
    """Simulates an async MongoDB cursor."""

    def __init__(self, items):
        self._items = list(items)
        self._index = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self._index >= len(self._items):
            raise StopAsyncIteration
        item = self._items[self._index]
        self._index += 1
        return item


class FakeDeleteResult:
    """Simulates a pymongo DeleteResult."""

    def __init__(self, deleted_count: int):
        self.deleted_count = deleted_count


class TestDataExport:

    @patch("app.routes.gdpr_routes.favorite_collection")
    @patch("app.routes.gdpr_routes.users_collection")
    def test_export_user_data_success(self, mock_users, mock_favorites):
        """Exporting data for an existing user returns all personal data."""
        mock_users.find_one = AsyncMock(return_value=FAKE_USER)
        mock_favorites.find = MagicMock(return_value=FakeAsyncCursor([]))

        response = client.post(
            "/gdpr/data-export",
            json={"email": "test@example.com"},
            headers=HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["gdpr_request_type"] == "data_export"
        assert data["data"]["profile"]["email"] == "test@example.com"
        assert data["data"]["favorites_count"] == 0

    @patch("app.routes.gdpr_routes.users_collection")
    def test_export_user_not_found(self, mock_users):
        """Exporting data for a non-existent user returns 404."""
        mock_users.find_one = AsyncMock(return_value=None)

        response = client.post(
            "/gdpr/data-export",
            json={"email": "unknown@example.com"},
            headers=HEADERS,
        )
        assert response.status_code == 404

    def test_export_invalid_email(self):
        """Exporting data with invalid email returns 422."""
        response = client.post(
            "/gdpr/data-export",
            json={"email": "not-an-email"},
            headers=HEADERS,
        )
        assert response.status_code == 422

    @patch("app.routes.gdpr_routes.favorite_collection")
    @patch("app.routes.gdpr_routes.users_collection")
    def test_export_with_favorites(self, mock_users, mock_favorites):
        """Exporting data includes user's favorites."""
        fav = {"_id": ObjectId(), "user_id": str(FAKE_USER_ID), "name": "My fav"}
        mock_users.find_one = AsyncMock(return_value=FAKE_USER)
        mock_favorites.find = MagicMock(return_value=FakeAsyncCursor([fav]))

        response = client.post(
            "/gdpr/data-export",
            json={"email": "test@example.com"},
            headers=HEADERS,
        )
        data = response.json()
        assert data["data"]["favorites_count"] == 1


class TestAccountDeletion:

    @patch("app.routes.gdpr_routes.favorite_collection")
    @patch("app.routes.gdpr_routes.users_collection")
    def test_delete_account_success(self, mock_users, mock_favorites):
        """Deleting an account with valid confirmation returns success."""
        mock_users.find_one = AsyncMock(return_value=FAKE_USER)
        mock_users.delete_one = AsyncMock()
        mock_favorites.delete_many = AsyncMock(return_value=FakeDeleteResult(3))

        response = client.request(
            "DELETE",
            "/gdpr/account",
            json={"email": "test@example.com", "confirmation": "DELETE"},
            headers=HEADERS,
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"

    def test_delete_account_invalid_confirmation(self):
        """Deleting an account without typing DELETE returns 400."""
        response = client.request(
            "DELETE",
            "/gdpr/account",
            json={"email": "test@example.com", "confirmation": "nope"},
            headers=HEADERS,
        )
        assert response.status_code == 400

    @patch("app.routes.gdpr_routes.users_collection")
    def test_delete_account_user_not_found(self, mock_users):
        """Deleting an account for unknown user returns 404."""
        mock_users.find_one = AsyncMock(return_value=None)

        response = client.request(
            "DELETE",
            "/gdpr/account",
            json={"email": "ghost@example.com", "confirmation": "DELETE"},
            headers=HEADERS,
        )
        assert response.status_code == 404


class TestRetentionPolicy:

    def test_get_retention_policy(self):
        """Retention policy endpoint returns expected structure."""
        response = client.get("/gdpr/data-retention-policy", headers=HEADERS)
        assert response.status_code == 200
        data = response.json()
        assert "retention_periods" in data
        assert "anonymization" in data
        assert "contact" in data
        assert data["policy_version"] == "1.0"

    def test_retention_policy_no_api_key(self):
        """Retention policy is protected and returns 403 without API key."""
        response = client.get("/gdpr/data-retention-policy")
        assert response.status_code == 403
