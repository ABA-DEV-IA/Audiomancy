"""
Prometheus metrics endpoint for monitoring.
Exposes application and system metrics for Prometheus scraping.
"""

from fastapi import APIRouter, Response
from prometheus_client import (
    Counter,
    Histogram,
    Gauge,
    generate_latest,
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
    REGISTRY,
)
import psutil
import time

router = APIRouter(tags=["Metrics"])

# ============================================================================
# HTTP Metrics
# ============================================================================

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

# ============================================================================
# System Metrics
# ============================================================================

process_cpu_seconds_total = Counter(
    "process_cpu_seconds_total",
    "Total CPU time consumed by the process",
    registry=REGISTRY
)

process_resident_memory_bytes = Gauge(
    "process_resident_memory_bytes",
    "Resident memory size in bytes",
    registry=REGISTRY
)

process_virtual_memory_bytes = Gauge(
    "process_virtual_memory_bytes",
    "Virtual memory size in bytes",
    registry=REGISTRY
)

# ============================================================================
# MongoDB Cache Metrics
# ============================================================================

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

# ============================================================================
# AI/LLM Metrics (DeepSeek)
# ============================================================================

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

# ============================================================================
# Jamendo API Metrics
# ============================================================================

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

# ============================================================================
# User Authentication Metrics (RGPD/Security)
# ============================================================================

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

# ============================================================================
# Application Info
# ============================================================================

app_info = Gauge(
    "audiomancy_info",
    "Application information",
    ["version", "service"],
    registry=REGISTRY
)

# Set application info
app_info.labels(version="1.0.0", service="audiomancy-backend").set(1)


# ============================================================================
# Metrics Update Functions
# ============================================================================

def update_system_metrics():
    """Update system metrics (CPU, memory)"""
    process = psutil.Process()

    # CPU time
    cpu_times = process.cpu_times()
    process_cpu_seconds_total.inc(cpu_times.user + cpu_times.system)

    # Memory
    memory_info = process.memory_info()
    process_resident_memory_bytes.set(memory_info.rss)
    process_virtual_memory_bytes.set(memory_info.vms)


# ============================================================================
# Metrics Endpoint
# ============================================================================

@router.get("/metrics")
def metrics():
    """
    Prometheus metrics endpoint.

    Exposes application, system, and business metrics in Prometheus format.
    This endpoint is scraped by Prometheus every 15 seconds (configured in prometheus.yml).

    Metrics categories:
    - HTTP: Request counts, latency, status codes
    - System: CPU usage, memory consumption
    - Cache: MongoDB cache hit/miss ratio
    - AI: DeepSeek API calls, latency, token usage
    - External APIs: Jamendo API metrics
    - Security: Authentication attempts, personal data access (RGPD)
    """
    # Update system metrics before generating output
    update_system_metrics()

    # Generate Prometheus metrics format
    metrics_output = generate_latest(REGISTRY)

    return Response(
        content=metrics_output,
        media_type=CONTENT_TYPE_LATEST
    )
