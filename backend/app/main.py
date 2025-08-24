"""
Main entry point for the Audiomancy API backend using FastAPI.

This module configures the FastAPI application instance, including CORS settings to allow
requests from specified origins (e.g. local React development servers). It also registers
the Jamendo-related API routes by including the corresponding router.

Attributes:
    app (FastAPI): The FastAPI application instance.
    allowed_origins (List[str]): List of origins allowed to make cross-origin requests.
"""
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes.jamendo_routes import router as jamendo_router
from app.routes.ai_routes import router as ai_router
from app.core.security import get_api_key

# Activer Swagger seulement si swagger_on=True
docs_url = "/docs" if settings.swagger_on else None
redoc_url = "/redoc" if settings.swagger_on else None

# Créer l'app FastAPI
app = FastAPI(
    title="Audiomancy API",
    docs_url=docs_url,
    redoc_url=redoc_url
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes avec dépendance globale API Key
app.include_router(jamendo_router, dependencies=[Depends(get_api_key)])
app.include_router(ai_router, dependencies=[Depends(get_api_key)])