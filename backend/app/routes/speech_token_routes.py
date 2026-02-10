"""
⚠️ DEPRECATED - azure_only_no_longer_usable_in_localhost

[DÉSACTIVÉ] Module de token Azure Speech (TTS).

Ce module était utilisé pour générer des tokens temporaires pour Azure Speech Services.
La fonctionnalité TTS a été désactivée dans le cadre de la migration hors Azure.

Alternative future : Piper TTS, Coqui TTS (open source, local)
"""

# import requests
# from fastapi import APIRouter, HTTPException
# from app.core.config import settings

# router = APIRouter()

# @router.post("/speech-token", tags=["Speech"])
# def get_speech_token():
#     """
#     [DÉSACTIVÉ] Requests a temporary Azure Speech token using the subscription key.
#     Returns the token + region, which the frontend can safely use.
#     """
#
#     if not settings.speech_key or not settings.speech_region:
#         raise HTTPException(status_code=500, detail="Missing Azure Speech config")
#
#     token_url = f"https://{settings.speech_region}.api.cognitive.microsoft.com/sts/v1.0/issueToken"
#     headers = {
#         "Ocp-Apim-Subscription-Key": settings.speech_key
#     }
#
#     try:
#         response = requests.post(token_url, headers=headers, timeout=10)
#         response.raise_for_status()
#         access_token = response.text
#         return {"token": access_token, "region": settings.speech_region}
#     except requests.RequestException as e:
#         raise HTTPException(status_code=500, detail=f"Azure token request failed: {e}") from e

from fastapi import APIRouter

router = APIRouter()
