from fastapi import FastAPI
from app.routes import jamendo_routes

app = FastAPI(title="Audiomancy API")

# Enregistrement des routes
app.include_router(jamendo_routes.router)
