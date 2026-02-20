"""Main entry point for the Audiomancy FastAPI backend."""

import logging
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.security import get_api_key
from app.core.metrics_middleware import PrometheusMiddleware

from app.routes.jamendo_routes import router as jamendo_router
from app.routes.ai_routes import router as ai_router
from app.routes.user_routes import router as user_router
from app.routes.favorite_routes import router as favorite_router
from app.routes.health_routes import router as health_router
from app.routes.metrics_routes import router as metrics_router
from app.routes.gdpr_routes import router as gdpr_router

from app.errors.handlers import validation_exception_handler
from app.utils.cache_tools import ensure_cache_indexes
from app.core.scheduler import start_scheduler, stop_scheduler

_log_level = getattr(logging, os.getenv("LOG_LEVEL", "INFO").upper(), logging.INFO)
_app_logger = logging.getLogger("app")
_app_logger.setLevel(_log_level)
if not _app_logger.handlers:
    _h = logging.StreamHandler()
    _h.setLevel(_log_level)
    _h.setFormatter(logging.Formatter("%(levelname)-8s %(name)s: %(message)s"))
    _app_logger.addHandler(_h)

logger = logging.getLogger(__name__)

# Swagger visible ou non selon settings
docs_url = "/docs" if settings.swagger_on else None
redoc_url = "/redoc" if settings.swagger_on else None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    logger.info("Starting Audiomancy Backend...")
    await ensure_cache_indexes()
    start_scheduler()
    logger.info("Startup complete")

    yield

    logger.info("Shutting down...")
    stop_scheduler()
    logger.info("Shutdown complete")


def create_app() -> FastAPI:
    """Build and configure the FastAPI application."""
    fastapi_app = FastAPI(
        title="Audiomancy API",
        docs_url=docs_url,
        redoc_url=redoc_url,
        lifespan=lifespan
    )

    fastapi_app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    fastapi_app.add_middleware(PrometheusMiddleware)
    fastapi_app.add_exception_handler(RequestValidationError, validation_exception_handler)

    # Public routes
    fastapi_app.include_router(health_router)
    fastapi_app.include_router(metrics_router)

    # Protected routes (require API key)
    protected = [Depends(get_api_key)]
    fastapi_app.include_router(jamendo_router, dependencies=protected)
    fastapi_app.include_router(ai_router, dependencies=protected)
    fastapi_app.include_router(user_router, dependencies=protected)
    fastapi_app.include_router(favorite_router, dependencies=protected)
    fastapi_app.include_router(gdpr_router, dependencies=protected)

    return fastapi_app


app = create_app()
