from fastapi import APIRouter
from app.models.jamendo import JamendoTrackRequest, JamendoTrackResponse
from app.services.jamendo.jamendo_service import get_tracks_for_reader
from typing import List

router = APIRouter(prefix="/jamendo", tags=["Jamendo"])

@router.post("/tracks", response_model=List[JamendoTrackResponse])
def get_jamendo_tracks(request: JamendoTrackRequest):
    """
    Fetch a list of tracks from Jamendo based on provided filters.
    """
    return get_tracks_for_reader(
        tags=request.tags,
        duration_min=request.duration_min,
        duration_max=request.duration_max,
        limit=request.limit
    )
