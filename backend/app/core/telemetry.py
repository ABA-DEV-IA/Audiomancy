# app/core/telemetry.py
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.azuremonitor import AzureMonitorTraceExporter

from opentelemetry.sdk._logs import LoggingHandler, LoggerProvider
from opentelemetry.exporter.azuremonitor import AzureMonitorLogExporter
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
import logging


def setup_telemetry(connection_string: str, service_name: str = "fastapi-backend"):
    """
    Initialise OpenTelemetry + Azure Application Insights
    """

    # Ressources communes (nom service)
    resource = Resource.create({"service.name": service_name})

    # ---- TRACES ----
    trace_provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(trace_provider)

    trace_exporter = AzureMonitorTraceExporter.from_connection_string(
        connection_string
    )

    trace_provider.add_span_processor(
        BatchSpanProcessor(trace_exporter)
    )

    # ---- LOGS ----
    log_exporter = AzureMonitorLogExporter.from_connection_string(connection_string)

    logger_provider = LoggerProvider(resource=resource)
    logger_provider.add_log_record_processor(
        BatchLogRecordProcessor(log_exporter)
    )

    logging.basicConfig(level=logging.INFO)
    logging.getLogger().addHandler(
        LoggingHandler(logger_provider=logger_provider)
    )

    print("Telemetry: OpenTelemetry + Azure Monitor initialisés")
