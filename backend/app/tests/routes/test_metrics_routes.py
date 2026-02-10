"""
Integration tests for the Prometheus metrics routes.

Tests GET /metrics endpoint to ensure Prometheus exposition format
is correctly generated.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

HEADERS = {"X-API-KEY": settings.api_key}
client = TestClient(app)


# ---------------------------------------------------------------------------
# GET /metrics
# ---------------------------------------------------------------------------

def test_metrics_endpoint():
    """Metrics endpoint returns 200 with Prometheus text format."""
    response = client.get("/metrics", headers=HEADERS)
    assert response.status_code == 200
    assert "text/plain" in response.headers.get("content-type", "")


def test_metrics_contains_app_info():
    """Metrics output includes the audiomancy_info gauge."""
    response = client.get("/metrics", headers=HEADERS)
    body = response.text
    assert "audiomancy_info" in body


def test_metrics_contains_http_metrics():
    """Metrics output includes HTTP request counters."""
    response = client.get("/metrics", headers=HEADERS)
    body = response.text
    assert "http_requests_total" in body or "http_request_duration_seconds" in body


def test_metrics_contains_cache_metrics():
    """Metrics output includes cache operation counters."""
    response = client.get("/metrics", headers=HEADERS)
    body = response.text
    # The counter may not have been incremented yet, but the metric family
    # should be defined by the REGISTRY
    assert "cache_operations_total" in body or "cache_hit_ratio" in body


def test_metrics_no_api_key():
    """Metrics endpoint is public (Prometheus scraping) and returns 200 without API key."""
    response = client.get("/metrics")
    assert response.status_code == 200
