"""
This module defines the FastAPI router responsible for exposing the 
Azure Speech service token endpoint. The endpoint allows the frontend 
(e.g., a React/Next.js application) to request the authentication 
credentials required to interact with Azure Cognitive Services 
(Speech-to-Text).
"""

from fastapi import APIRouter, HTTPException
from app.core.config import settings

router = APIRouter()

speech_key = settings.speech_key
speech_region = settings.speech_region

@router.post("/speech-token")
def get_speech_token():

    """
    Returns the Azure Speech Recognition API token.
    This token is used to authenticate the API call.
    The keys are provided by the following environment variables:
    - `speech_key`: Speech Recognition API key.
    - `speech_region`: Region where the service is deployed.
    If these variables are not defined, a 500 error is thrown.
    """

    secret_key = speech_key
    region = speech_region

    print(secret_key)
    print(region)
    if not secret_key or not region:
        raise HTTPException(status_code=500, detail="Config Azure manquante")

    return {"key": secret_key, "region": region}
