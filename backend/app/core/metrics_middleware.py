"""Prometheus middleware for automatic HTTP request metrics collection."""

import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.routes.metrics_routes import http_requests_total, http_request_duration_seconds


class PrometheusMiddleware(BaseHTTPMiddleware):  # pylint: disable=too-few-public-methods
    """Collect request count and duration for every HTTP request."""

    async def dispatch(self, request: Request, call_next):
        # Skip metrics collection for the /metrics endpoint itself
        if request.url.path == "/metrics":
            return await call_next(request)

        # Record start time
        start_time = time.time()
        status_code = 500  # default in case of unhandled exception

        try:
            # Process request
            response = await call_next(request)
            status_code = response.status_code
            return response
        finally:
            # Calculate duration
            duration = time.time() - start_time

            # Extract path without query parameters
            path = request.url.path

            # Record metrics (always, even on exception)
            http_requests_total.labels(
                method=request.method,
                endpoint=path,
                status_code=status_code
            ).inc()

            http_request_duration_seconds.labels(
                method=request.method,
                endpoint=path
            ).observe(duration)
