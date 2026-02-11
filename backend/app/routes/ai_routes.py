"""Routes for AI-powered playlist generation."""

from typing import List
import logging
import asyncio
from fastapi import APIRouter, HTTPException
from app.models.ai_models import PromptRequest, GeneratedTrack
from app.services.ai.ai_executor import ai_executor
from app.services.jamendo.jamendo_service import get_tracks_for_reader

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/generate", tags=["Generate"])

@router.post("/playlist", response_model=List[GeneratedTrack])
async def generate_playlist(prompt: PromptRequest):
    """Generate a playlist from a natural language prompt using DeepSeek + Jamendo."""
    logger.info(
        "Playlist generation request received",
        extra={
            "endpoint": "/generate/playlist",
            "prompt_length": len(prompt.prompt),
            "requested_limit": prompt.limit
        }
    )

    try:
        # Generate tags using AI executor (DeepSeek)
        logger.debug("Calling AI executor with prompt: %s...", prompt.prompt[:100])
        tags = await asyncio.to_thread(ai_executor, prompt.prompt)
        logger.info("AI executor returned tags: %s", tags)

        # Fetch tracks from Jamendo
        logger.debug("Fetching tracks from Jamendo with tags: %s", tags)
        tracks = await get_tracks_for_reader(tags=tags, limit=prompt.limit)
        logger.info("Successfully generated playlist with %d tracks", len(tracks))

        # Convert dict/JamendoTrackResponse to GeneratedTrack
        return [GeneratedTrack(**track) if isinstance(track, dict) else GeneratedTrack(**track.model_dump()) for track in tracks]
    except Exception as e:
        logger.error(
            "Error generating playlist: %s",
            str(e),
            extra={
                "endpoint": "/generate/playlist",
                "error_type": type(e).__name__,
                "prompt": prompt.prompt[:100]
            },
            exc_info=True
        )
        raise HTTPException(status_code=500, detail="Erreur lors de la génération de la playlist") from e
