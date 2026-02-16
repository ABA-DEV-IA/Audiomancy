"""Prometheus metrics endpoint and metric definitions."""

from fastapi import APIRouter, Response
from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    generate_latest,
    CONTENT_TYPE_LATEST,
    REGISTRY,
)

router = APIRouter(tags=["Metrics"])

# HTTP metrics

http_requests_total = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"],
    registry=REGISTRY
)

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"],
    registry=REGISTRY
)

# MongoDB cache metrics

cache_operations_total = Counter(
    "cache_operations_total",
    "Total cache operations",
    ["operation", "result"],
    registry=REGISTRY
)

cache_hit_ratio = Gauge(
    "cache_hit_ratio",
    "Cache hit ratio (hits / total requests)",
    registry=REGISTRY
)

# DeepSeek / LLM metrics

deepseek_requests_total = Counter(
    "deepseek_requests_total",
    "Total requests to DeepSeek API",
    ["status"],
    registry=REGISTRY
)

deepseek_latency_seconds = Histogram(
    "deepseek_latency_seconds",
    "DeepSeek API response time in seconds",
    buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0],
    registry=REGISTRY
)

deepseek_tokens_used = Counter(
    "deepseek_tokens_used_total",
    "Total tokens consumed by DeepSeek API",
    ["type"],
    registry=REGISTRY
)

deepseek_errors_total = Counter(
    "deepseek_errors_total",
    "Total DeepSeek API errors",
    ["error_type"],
    registry=REGISTRY
)

# Jamendo API metrics

jamendo_requests_total = Counter(
    "jamendo_requests_total",
    "Total requests to Jamendo API",
    ["endpoint", "status"],
    registry=REGISTRY
)

jamendo_latency_seconds = Histogram(
    "jamendo_latency_seconds",
    "Jamendo API response time in seconds",
    registry=REGISTRY
)

# Authentication & GDPR metrics

auth_attempts_total = Counter(
    "auth_attempts_total",
    "Total authentication attempts",
    ["result"],
    registry=REGISTRY
)

personal_data_access_total = Counter(
    "personal_data_access_total",
    "Total personal data access operations",
    ["operation"],
    registry=REGISTRY
)

# Application info

app_info = Gauge(
    "audiomancy_info",
    "Application information",
    ["version", "service"],
    registry=REGISTRY
)

# Set application info
app_info.labels(version="1.0.0", service="audiomancy-backend").set(1)


@router.get("/metrics")
def metrics():
    """Expose all Prometheus metrics for scraping."""
    metrics_output = generate_latest(REGISTRY)
    return Response(content=metrics_output, media_type=CONTENT_TYPE_LATEST)
