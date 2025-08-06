"""
API routes for interacting with the Jamendo music API.

Exposes a POST endpoint that allows the frontend or clients to request tracks
based on mood tags, duration, and limit. Delegates processing to the service layer.

Endpoints:
    POST /jamendo/tracks
"""


from fastapi import APIRouter
from app.models.jamendo import JamendoTrackRequest, JamendoTrackResponse
from app.services.jamendo.jamendo_service import get_tracks_for_reader
from typing import List

router = APIRouter(prefix="/jamendo", tags=["Jamendo"])

@router.post("/tracks", response_model=List[JamendoTrackResponse])
def get_jamendo_tracks(request: JamendoTrackRequest):
    """
    Generate a music playlist based on the provided tags and duration range.

    Args:
        request (JamendoTrackRequest): Request body containing:
            - tags: search keywords joined by '+' (e.g., "magic+fantasy+cinematic")
            - duration_min: minimum track duration in seconds
            - duration_max: maximum track duration in seconds
            - limit: number of tracks to return

    Returns:
        List[JamendoTrackResponse]: A list of formatted tracks including:
            - id
            - title
            - artist
            - audio_url
            - duration
            - license_name
            - license_url
            - tags
            - image

    Raises:
        HTTPException: If the Jamendo API call fails or returns no results.

    Notes:
        This endpoint integrates with Jamendo API and formats the data
        according to the JamendoTrackResponse model for frontend consumption.
    """
    return get_tracks_for_reader(
        tags=request.tags,
        duration_min=request.duration_min,
        duration_max=request.duration_max,
        limit=request.limit
    )
