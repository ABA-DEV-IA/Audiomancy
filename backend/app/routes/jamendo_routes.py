"""Jamendo API routes for fetching music tracks."""

from typing import List
import logging
from fastapi import APIRouter
from app.models.jamendo import JamendoTrackRequest, JamendoTrackResponse
from app.services.jamendo.jamendo_service import get_tracks_for_reader

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/jamendo", tags=["Jamendo"])


@router.post("/tracks", response_model=List[JamendoTrackResponse])
async def get_jamendo_tracks(request: JamendoTrackRequest):
    """Fetch a music playlist from Jamendo based on tags and duration range."""
    logger.info(
        "Jamendo tracks request received",
        extra={
            "endpoint": "/jamendo/tracks",
            "tags": request.tags,
            "limit": request.limit,
            "duration_range": f"{request.duration_min}-{request.duration_max}"
        }
    )

    try:
        tracks = await get_tracks_for_reader(
            tags=request.tags,
            duration_min=request.duration_min,
            duration_max=request.duration_max,
            limit=request.limit,
            track_id=request.track_id
        )
        logger.info("Successfully retrieved %d tracks from Jamendo", len(tracks))
        return tracks
    except Exception as e:
        logger.error(
            "Error fetching Jamendo tracks: %s",
            str(e),
            extra={
                "endpoint": "/jamendo/tracks",
                "error_type": type(e).__name__
            },
            exc_info=True
        )
        raise
