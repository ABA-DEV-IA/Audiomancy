"""
Business logic layer for fetching and formatting music tracks from Jamendo.

Handles the interaction between the raw Jamendo API and the application's formatting logic.
Responsible for applying transformation and returning clean, structured data.

Functions:
    get_tracks_for_reader: Fetches and formats music tracks based on given parameters.
"""
import json
from typing import List, Optional
from app.models.jamendo import JamendoTrackResponse
from app.services.jamendo.jamendo_client import fetch_tracks
from app.utils.formatter import format_jamendo_tracks
from app.utils.randomizer import choose_random_tags, sample_tracks
from app.utils.blob_tools import download_blob, upload_blob

def get_tracks_for_reader(
    tags: str,
    duration_min: int = 180,
    duration_max: int = 480,
    limit: int = 10,
    track_id: Optional[str] = None
) -> List[JamendoTrackResponse]:
    """
    Fetches and formats tracks from Jamendo, optionally using a cache identified by track_id.

    Args:
        tags (str): Tags used for fuzzy search (e.g., "magic+fantasy").
        duration_min (int): Minimum track duration (in seconds).
        duration_max (int): Maximum track duration (in seconds).
        limit (int): Maximum number of tracks to return.
        track_id (Optional[str]): Optional ID to cache/retrieve the playlist.

    Returns:
        List[JamendoTrackResponse]: Formatted list of music tracks.
    """
    tags = choose_random_tags(tags)

    # --- Check cache if track_id is provided ---
    if track_id:
        print(track_id)
        print("je suis une millésime")
        cached_data = download_blob(f"{track_id}.json")
        if cached_data:
            return [JamendoTrackResponse(**t) for t in json.loads(cached_data)]

    # --- Fetch from Jamendo if cache miss or no track_id ---
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
    formatted_tracks = format_jamendo_tracks(selected_tracks)

    # --- Save to cache if track_id provided ---
    if track_id:
        upload_blob(f"{track_id}.json", json.dumps(formatted_tracks))

    return formatted_tracks
