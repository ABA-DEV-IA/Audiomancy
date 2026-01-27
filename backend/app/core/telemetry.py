"""
OpenTelemetry setup for Jaeger (local monitoring):
- Traces (OTLPSpanExporter → Jaeger)
- Logs (console + structured)
- Auto-instrumentation (FastAPI, Requests, Logging)

This ensures:
- Each HTTP request has its own trace_id
- External calls (Jamendo, DeepSeek, MongoDB) are included in traces
- Logs contain trace_id + span_id
- Dashboard accessible at http://localhost:16686
"""

import logging
import os

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor, ConsoleLogExporter

from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from fastapi import FastAPI


def setup_telemetry(
    connection_string: str = None,  # Rétrocompatibilité (ignoré)
    service_name: str = "audiomancy-backend",
    app: FastAPI | None = None,
    jaeger_endpoint: str = None
) -> None:
    """
    Initialize OpenTelemetry (traces + logs) with Jaeger exporter.
    Optionally instruments a FastAPI app for automatic request tracing.

    Args:
        connection_string (str): [IGNORED] Kept for backward compatibility
        service_name (str): Logical name for telemetry grouping
        app (FastAPI | None): Optional FastAPI instance to instrument
        jaeger_endpoint (str): Jaeger OTLP endpoint (default: http://jaeger:4317)
    """
    
    # Déterminer l'endpoint Jaeger (Docker ou local)
    if jaeger_endpoint is None:
        # En Docker, utiliser le nom du service
        jaeger_endpoint = os.getenv("JAEGER_ENDPOINT", "http://jaeger:4317")
    
    # Shared resource metadata
    resource = Resource.create({
        "service.name": service_name,
        "deployment.environment": os.getenv("ENVIRONMENT", "development")
    })

    # ---------------------------
    # TRACING CONFIG (Jaeger)
    # ---------------------------
    trace_provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(trace_provider)

    try:
        # OTLP exporter vers Jaeger
        trace_exporter = OTLPSpanExporter(
            endpoint=jaeger_endpoint,
            insecure=True  # Pas de TLS en local
        )
        trace_provider.add_span_processor(BatchSpanProcessor(trace_exporter))
        print(f"✅ Jaeger traces enabled: {jaeger_endpoint}")
    except Exception as e:
        print(f"⚠️  Jaeger traces disabled: {e}")

    # ---------------------------
    # LOGGING CONFIG (Console)
    # ---------------------------
    logger_provider = LoggerProvider(resource=resource)
    log_exporter = ConsoleLogExporter()  # Logs en console pour dev
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(log_exporter))

    # Redirect Python logging → OpenTelemetry
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - [trace_id=%(otelTraceID)s span_id=%(otelSpanID)s] - %(message)s'
    )
    root_logger = logging.getLogger()
    root_logger.addHandler(LoggingHandler(logger_provider=logger_provider))

    # ---------------------------
    # AUTO-INSTRUMENTATION
    # ---------------------------
    RequestsInstrumentor().instrument()
    LoggingInstrumentor().instrument(set_logging_format=True)

    if app is not None:
        # Instrument FastAPI app to trace incoming HTTP requests
        FastAPIInstrumentor.instrument_app(app)

    print(f"✅ Telemetry initialized: OpenTelemetry + Jaeger (UI: http://localhost:16686)")

