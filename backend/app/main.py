from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.jamendo_routes import router as jamendo_router

app = FastAPI(title="Audiomancy API")

# CORS configuration
allowed_origins = [
    "http://localhost:3000",  # Default React local address
    "http://127.0.0.1:3000",  # Alternate localhost
    # Add other allowed URLs here (e.g. production URLs)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,    # Allowed origins to make requests
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

# Include API routes
app.include_router(jamendo_router)

