"""
This module defines the FastAPI router responsible for exposing the 
Azure Speech service token endpoint. Instead of returning the raw 
speech key (dangerous), it requests a temporary token from Azure 
and returns it to the frontend.
"""

import requests
from fastapi import APIRouter, HTTPException
from app.core.config import settings

router = APIRouter()

@router.post("/speech-token", tags=["Speech"])
def get_speech_token():
    """
    Requests a temporary Azure Speech token using the subscription key.
    Returns the token + region, which the frontend can safely use.
    """

    if not settings.speech_key or not settings.speech_region:
        raise HTTPException(status_code=500, detail="Missing Azure Speech config")

    token_url = f"https://{settings.speech_region}.api.cognitive.microsoft.com/sts/v1.0/issueToken"
    headers = {
        "Ocp-Apim-Subscription-Key": settings.speech_key
    }

    try:
        response = requests.post(token_url, headers=headers)
        response.raise_for_status()
        access_token = response.text
        return {"token": access_token, "region": settings.speech_region}
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Azure token request failed: {e}")
