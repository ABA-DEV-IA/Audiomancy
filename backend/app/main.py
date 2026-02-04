"""
Main entry point for the Audiomancy API backend using FastAPI.

This module configures the FastAPI application instance, including telemetry (Azure App Insights),
CORS, custom exception handlers, API key security, and the various API route groups.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from prometheus_fastapi_instrumentator import Instrumentator

from app.core.config import settings
from app.core.telemetry import setup_telemetry
from app.core.security import get_api_key

from app.routes.jamendo_routes import router as jamendo_router
from app.routes.ai_routes import router as ai_router
from app.routes.user_routes import router as user_router
from app.routes.favorite_routes import router as favorite_router
from app.routes.health_routes import router as health_router
# from app.routes.speech_token_routes import router as speech_router  # [DÉSACTIVÉ] Azure Speech TTS

from app.errors.handlers import validation_exception_handler
from app.utils.cache_tools import ensure_cache_indexes
from app.core.scheduler import start_scheduler, stop_scheduler
import logging

logger = logging.getLogger(__name__)

# Swagger visible ou non selon settings
docs_url = "/docs" if settings.swagger_on else None
redoc_url = "/redoc" if settings.swagger_on else None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting Audiomancy Backend...")
    await ensure_cache_indexes()
    start_scheduler()
    logger.info("✅ Startup complete")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Audiomancy Backend...")
    stop_scheduler()
    logger.info("✅ Shutdown complete")


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    This ensures telemetry is initialized before the app starts handling requests.
    """
    fastapi_app = FastAPI(
        title="Audiomancy API",
        docs_url=docs_url,
        redoc_url=redoc_url,
        lifespan=lifespan
    )

    # --- TELEMETRY INIT (Jaeger + OpenTelemetry) ---
    # Compétence C20: Surveiller une application d'IA
    # Monitoring local avec Jaeger (remplace Azure App Insights)
    
    # Toujours activer Jaeger en développement
    setup_telemetry(
        service_name="audiomancy-backend",
        app=fastapi_app,
        jaeger_endpoint=None  # Utilise JAEGER_ENDPOINT ou défaut Docker
    )
    
    # [LEGACY] Support Azure App Insights si configuré (pour rétrocompatibilité)
    # if settings.azure_appinsights_connection_string:
    #     setup_telemetry(
    #         connection_string=settings.azure_appinsights_connection_string,
    #         service_name="audiomancy-backend",
    #         app=fastapi_app
    #     )

    # --- CORS ---
    fastapi_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- PROMETHEUS METRICS ---
    # Expose /metrics endpoint for Prometheus scraping
    Instrumentator().instrument(fastapi_app).expose(fastapi_app, endpoint="/metrics")

    # --- Custom Exceptions ---
    fastapi_app.add_exception_handler(RequestValidationError, validation_exception_handler)

    # --- ROUTERS ---
    # Health check route (no authentication required)
    fastapi_app.include_router(health_router)
    
    # Protected routes
    protected = [Depends(get_api_key)]
    fastapi_app.include_router(jamendo_router, dependencies=protected)
    fastapi_app.include_router(ai_router, dependencies=protected)
    fastapi_app.include_router(user_router, dependencies=protected)
    fastapi_app.include_router(favorite_router, dependencies=protected)
    # fastapi_app.include_router(speech_router, dependencies=protected)  # [DÉSACTIVÉ] Azure Speech TTS

    return fastapi_app


app = create_app()
