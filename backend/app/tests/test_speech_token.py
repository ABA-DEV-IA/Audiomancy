import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from backend.app.routes.speech_token_routes import router


@pytest.fixture
def client(monkeypatch):
    """
    Configure un client de test FastAPI avec le router /speech-token.
    """
    app = FastAPI()
    app.include_router(router, prefix="/api")
    return TestClient(app)


def test_get_speech_token_success(client, monkeypatch):
    """
    Vérifie que l'endpoint retourne la clé et la région si les variables
    sont correctement définies.
    """
    # Simule les settings
    monkeypatch.setattr("backend.app.routes.speech_token_routes.speech_key", "fake_key")
    monkeypatch.setattr("backend.app.routes.speech_token_routes.speech_region", "westeurope")

    response = client.post("/api/speech-token")
    assert response.status_code == 200
    data = response.json()

    assert "key" in data
    assert "region" in data
    assert data["key"] == "fake_key"
    assert data["region"] == "westeurope"


def test_get_speech_token_missing_key(client, monkeypatch):
    """
    Vérifie que si la clé n’est pas définie, une erreur 500 est renvoyée.
    """
    monkeypatch.setattr("backend.app.routes.speech_token_routes.speech_key", None)
    monkeypatch.setattr("backend.app.routes.speech_token_routes.speech_region", "westeurope")

    response = client.post("/api/speech-token")
    assert response.status_code == 500
    assert response.json()["detail"] == "Config Azure manquante"


def test_get_speech_token_missing_region(client, monkeypatch):
    """
    Vérifie que si la région n’est pas définie, une erreur 500 est renvoyée.
    """
    monkeypatch.setattr("backend.app.routes.speech_token_routes.speech_key", "fake_key")
    monkeypatch.setattr("backend.app.routes.speech_token_routes.speech_region", None)

    response = client.post("/api/speech-token")
    assert response.status_code == 500
    assert response.json()["detail"] == "Config Azure manquante"