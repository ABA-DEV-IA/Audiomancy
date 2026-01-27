"""
Business logic layer for fetching and formatting music tracks from Jamendo.

This module orchestrates the interaction between the Jamendo API client,
formatting utilities, and caching tools. It is responsible for:
    - Selecting and randomizing tags
    - Fetching raw tracks from Jamendo
    - Formatting tracks into structured responses
    - Handling cache read/write operations

Functions:
    get_tracks_for_reader: Fetches and formats music tracks based on given parameters.
"""

import json
import logging
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
    """
    Fetch and format tracks from Jamendo, with optional cache support.

    Args:
        tags (str): Tags used for fuzzy search (e.g., "magic+fantasy").
        duration_min (int, optional): Minimum track duration in seconds. Defaults to 180.
        duration_max (int, optional): Maximum track duration in seconds. Defaults to 480.
        limit (int, optional): Maximum number of tracks to return. Defaults to 10.
        track_id (Optional[str], optional): Optional ID used for caching/retrieving the playlist.

    Returns:
        List[JamendoTrackResponse]: List of formatted music tracks.
    """

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

    # --- Check MongoDB cache if track_id is provided ---
    if track_id:
        cache_key = generate_cache_key(track_id)
        logger.info("🔍 Looking for cache: %s", cache_key)
        cached_data = await get_cache(cache_key)

        if cached_data:
            logger.info("✅ Cache HIT for %s (found %d tracks)", cache_key, len(cached_data))
            # Return cached data as-is (list of dicts)
            return cached_data

        logger.info("❌ Cache MISS for %s", cache_key)

    # --- Fetch from Jamendo ---
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

    response_data = fetch_tracks(params)
    if "results" not in response_data:
        logger.warning("Jamendo response did not contain 'results'")
        return []

    all_tracks = response_data["results"]
    logger.info("Received %d tracks from Jamendo", len(all_tracks))

    # --- Sampling & formatting ---
    selected_tracks = sample_tracks(all_tracks, limit)
    logger.debug("Sampled %d tracks", len(selected_tracks))

    formatted_tracks = format_jamendo_tracks(selected_tracks)
    logger.info("Formatted %d tracks", len(formatted_tracks))

    # --- Save to MongoDB cache if applicable ---
    if track_id:
        cache_key = generate_cache_key(track_id)
        logger.info("💾 Saving %d tracks to cache: %s", len(formatted_tracks), cache_key)
        # formatted_tracks is already a list of dicts
        await save_cache(cache_key, formatted_tracks, ttl_days=7)
        logger.info("✅ Cache saved successfully for %s", cache_key)

    return formatted_tracks
