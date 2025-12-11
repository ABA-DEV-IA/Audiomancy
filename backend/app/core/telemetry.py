"""
OpenTelemetry setup for Azure Application Insights:
- Traces (AzureMonitorTraceExporter)
- Logs (AzureMonitorLogExporter)
- Auto-instrumentation (FastAPI, Requests, Logging)

This ensures:
- Each HTTP request has its own OperationId
- External calls (Jamendo, Azure Blob, etc.) are included in traces
- Logs contain trace_id + span_id
"""

import logging

from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor

from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.instrumentation.logging import LoggingInstrumentor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

from azure.monitor.opentelemetry.exporter import AzureMonitorTraceExporter, AzureMonitorLogExporter
from fastapi import FastAPI


def setup_telemetry(
    connection_string: str,
    service_name: str = "fastapi-backend",
    app: FastAPI | None = None
) -> None:
    """
    Initialize OpenTelemetry (traces + logs) with Azure exporters.
    Optionally instruments a FastAPI app for automatic request tracing.

    Args:
        connection_string (str): Azure Application Insights connection string
        service_name (str): Logical name for telemetry grouping
        app (FastAPI | None): Optional FastAPI instance to instrument
    """

    # Shared resource metadata
    resource = Resource.create({"service.name": service_name})

    # ---------------------------
    # TRACING CONFIG
    # ---------------------------
    trace_provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(trace_provider)

    trace_exporter = AzureMonitorTraceExporter.from_connection_string(connection_string)
    trace_provider.add_span_processor(BatchSpanProcessor(trace_exporter))

    # ---------------------------
    # LOGGING CONFIG
    # ---------------------------
    logger_provider = LoggerProvider(resource=resource)
    log_exporter = AzureMonitorLogExporter.from_connection_string(connection_string)
    logger_provider.add_log_record_processor(BatchLogRecordProcessor(log_exporter))

    # Redirect Python logging → OpenTelemetry
    logging.basicConfig(level=logging.INFO)
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

    print("✅ Telemetry initialized: OpenTelemetry + Azure Monitor")
