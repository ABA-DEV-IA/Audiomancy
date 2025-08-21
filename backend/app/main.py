"""
Main entry point for the Audiomancy API backend using FastAPI.

This module configures the FastAPI application instance, including CORS settings to allow
requests from specified origins (e.g. local React development servers). It also registers
the Jamendo-related API routes by including the corresponding router.

Attributes:
    app (FastAPI): The FastAPI application instance.
    allowed_origins (List[str]): List of origins allowed to make cross-origin requests.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes.jamendo_routes import router as jamendo_router
from app.routes.ai_routes import router as ai_router

app = FastAPI(title="Audiomancy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,    # Allowed origins to make requests
    allow_credentials=True,
    allow_methods=["*"],       # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],       # Allow all headers
)

# Include API routes
app.include_router(jamendo_router)
app.include_router(ai_router)
