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
from app.utils.blob_tools import download_blob, upload_blob, generate_cache_filename

logger = logging.getLogger(__name__)


def get_tracks_for_reader(
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

    # --- Check cache if track_id is provided ---
    if track_id:
        cache_filename = generate_cache_filename(track_id)
        logger.debug("Looking for cache: %s", cache_filename)
        cached_data = download_blob(cache_filename)

        if cached_data:
            logger.info("Cache HIT for %s", cache_filename)
            cached_tracks = json.loads(cached_data)
            return [JamendoTrackResponse(**track) for track in cached_tracks]

        logger.info("Cache MISS for %s", cache_filename)

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

    # --- Save to cache if applicable ---
    if track_id:
        cache_filename = generate_cache_filename(track_id)
        logger.debug("Saving playlist to cache: %s", cache_filename)
        upload_blob(cache_filename, json.dumps(formatted_tracks))

    return formatted_tracks
