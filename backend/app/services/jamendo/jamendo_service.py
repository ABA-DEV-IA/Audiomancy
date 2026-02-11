"""Business logic for fetching and formatting Jamendo tracks."""

import logging
import asyncio
from typing import List, Optional

from app.models.jamendo import JamendoTrackResponse
from app.services.jamendo.jamendo_client import fetch_tracks
from app.utils.formatter import format_jamendo_tracks
from app.utils.randomizer import choose_random_tags, sample_tracks
from app.utils.cache_tools import get_cache, save_cache, generate_cache_key

logger = logging.getLogger(__name__)


async def get_tracks_for_reader(
    tags: str,
    duration_min: int = 180,
    duration_max: int = 480,
    limit: int = 10,
    track_id: Optional[str] = None,
) -> List[JamendoTrackResponse]:
    """Fetch and format tracks from Jamendo, with optional MongoDB cache."""

    logger.info(
        "Fetching tracks with params: tags=%s, duration_min=%d, duration_max=%d, limit=%d, track_id=%s",
        tags,
        duration_min,
        duration_max,
        limit,
        track_id,
    )

    # Randomize tags for diversity
    tags = choose_random_tags(tags)
    logger.debug("Tags after randomization: %s", tags)

    # Check MongoDB cache
    if track_id:
        cache_key = generate_cache_key(track_id)
        logger.info("Looking for cache: %s", cache_key)
        cached_data = await get_cache(cache_key)

        if cached_data:
            logger.info("Cache HIT for %s (%d tracks)", cache_key, len(cached_data))
            return cached_data

        logger.info("Cache MISS for %s", cache_key)

    # Fetch from Jamendo
    params = {
        "limit": 100,
        "fuzzytags": tags,
        "speed": "low+medium",
        "vocalinstrumental": "instrumental",
        "durationbetween": f"{duration_min}_{duration_max}",
        "include": "musicinfo+licenses",
        "groupby": "artist_id",
    }
    logger.debug("Fetching from Jamendo with params: %s", params)

    response_data = await asyncio.to_thread(fetch_tracks, params)
    if "results" not in response_data:
        logger.warning("Jamendo response did not contain 'results'")
        return []

    all_tracks = response_data["results"]
    logger.info("Received %d tracks from Jamendo", len(all_tracks))

    # Sampling & formatting
    selected_tracks = sample_tracks(all_tracks, limit)
    logger.debug("Sampled %d tracks", len(selected_tracks))

    formatted_tracks = format_jamendo_tracks(selected_tracks)
    logger.info("Formatted %d tracks", len(formatted_tracks))

    # Save to cache
    if track_id:
        cache_key = generate_cache_key(track_id)
        logger.info("Saving %d tracks to cache: %s", len(formatted_tracks), cache_key)
        await save_cache(cache_key, formatted_tracks, ttl_days=1)
        logger.info("Cache saved for %s", cache_key)

    return formatted_tracks
