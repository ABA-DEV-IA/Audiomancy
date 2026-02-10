"""
Integration tests for the Health check routes.

Tests GET /health/ and GET /health/scheduler endpoints.
"""

import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

HEADERS = {"X-API-KEY": settings.api_key}
client = TestClient(app)


# ---------------------------------------------------------------------------
# GET /health/
# ---------------------------------------------------------------------------

def test_health_check():
    """Basic health check returns 200 with healthy status."""
    response = client.get("/health/", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "audiomancy-backend"


def test_health_check_no_api_key():
    """Health check is public and returns 200 without API key."""
    response = client.get("/health/")
    assert response.status_code == 200


# ---------------------------------------------------------------------------
# GET /health/scheduler
# ---------------------------------------------------------------------------

@patch("app.routes.health_routes.scheduler")
def test_scheduler_status_active(mock_scheduler):
    """Scheduler endpoint returns active status with job list."""
    mock_job = MagicMock()
    mock_job.id = "cleanup_cache"
    mock_job.name = "Cache Cleanup"
    mock_job.next_run_time = "2025-06-01T12:00:00"

    mock_scheduler.running = True
    mock_scheduler.get_jobs.return_value = [mock_job]

    response = client.get("/health/scheduler", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "active"
    assert len(data["jobs"]) == 1
    assert data["jobs"][0]["id"] == "cleanup_cache"


@patch("app.routes.health_routes.scheduler")
def test_scheduler_status_inactive(mock_scheduler):
    """Scheduler endpoint returns inactive when scheduler is stopped."""
    mock_scheduler.running = False

    response = client.get("/health/scheduler", headers=HEADERS)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "inactive"
    assert "not running" in data["message"].lower()
