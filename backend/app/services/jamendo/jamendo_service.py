"""
Business logic layer for fetching and formatting music tracks from Jamendo.

Handles the interaction between the raw Jamendo API and the application's formatting logic.
Responsible for applying transformation and returning clean, structured data.

Functions:
    get_tracks_for_reader: Fetches and formats music tracks based on given parameters.
"""

from app.services.jamendo.jamendo_client import fetch_tracks
from app.utils.formatter import format_jamendo_tracks
from app.utils.randomizer import choose_random_tags, sample_tracks
from typing import List
from app.models.jamendo import JamendoTrackResponse


def get_tracks_for_reader(tags: str, duration_min: int = 180, duration_max: int = 480, limit: int = 10) -> List[JamendoTrackResponse]:
    tags = choose_random_tags(tags)
    """
    Fetches and formats tracks from Jamendo based on provided filters.

    Args:
        tags (str): Tags used for fuzzy search (e.g., "magic+fantasy").
        duration_min (int): Minimum track duration (in seconds).
        duration_max (int): Maximum track duration (in seconds).
        limit (int): Maximum number of tracks to return.
    
    Returns:
        List[JamendoTrackResponse]: Formatted list of music tracks.
    """

    params = {
        "limit": 100,
        "fuzzytags": tags,
        "speed": "low+medium",
        "vocalinstrumental": "instrumental",
        "durationbetween": f"{duration_min}_{duration_max}",
        "include": "musicinfo+licenses",
        "groupby": "artist_id"
    }

    data = fetch_tracks(params)
    if "results" not in data:
        return []

    all_tracks = data["results"]
    selected_tracks = sample_tracks(all_tracks, limit)

    return format_jamendo_tracks(selected_tracks)
