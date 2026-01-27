"""
Main entry point for the Audiomancy API backend using FastAPI.

This module configures the FastAPI application instance, including telemetry (Azure App Insights),
CORS, custom exception handlers, API key security, and the various API route groups.
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.telemetry import setup_telemetry
from app.core.security import get_api_key

from app.routes.jamendo_routes import router as jamendo_router
from app.routes.ai_routes import router as ai_router
from app.routes.user_routes import router as user_router
from app.routes.favorite_routes import router as favorite_router
# from app.routes.speech_token_routes import router as speech_router  # [DÉSACTIVÉ] Azure Speech TTS

from app.errors.handlers import validation_exception_handler
from app.utils.cache_tools import ensure_cache_indexes

# Swagger visible ou non selon settings
docs_url = "/docs" if settings.swagger_on else None
redoc_url = "/redoc" if settings.swagger_on else None


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    This ensures telemetry is initialized before the app starts handling requests.
    """
    fastapi_app = FastAPI(
        title="Audiomancy API",
        docs_url=docs_url,
        redoc_url=redoc_url
    )

    # --- TELEMETRY INIT (Azure App Insights + OpenTelemetry) ---
    # Conservé pour la compétence C20: Surveiller une application d'IA
    # TODO: Remplacer Azure Monitor par Jaeger pour monitoring local
    if settings.azure_appinsights_connection_string:
        # On passe l'app pour tracer automatiquement les requêtes entrantes
        setup_telemetry(
            connection_string=settings.azure_appinsights_connection_string,
            service_name="audiomancy-backend",
            app=fastapi_app
        )

    # --- CORS ---
    fastapi_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Custom Exceptions ---
    fastapi_app.add_exception_handler(RequestValidationError, validation_exception_handler)

    # --- Startup Event: Initialize MongoDB cache indexes ---
    @fastapi_app.on_event("startup")
    async def startup_event():
        """Initialize cache indexes on startup"""
        await ensure_cache_indexes()

    # --- ROUTERS ---
    protected = [Depends(get_api_key)]
    fastapi_app.include_router(jamendo_router, dependencies=protected)
    fastapi_app.include_router(ai_router, dependencies=protected)
    fastapi_app.include_router(user_router, dependencies=protected)
    fastapi_app.include_router(favorite_router, dependencies=protected)
    # fastapi_app.include_router(speech_router, dependencies=protected)  # [DÉSACTIVÉ] Azure Speech TTS

    return fastapi_app


app = create_app()
