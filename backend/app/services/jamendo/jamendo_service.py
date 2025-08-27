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
from app.utils.blob_tools import download_blob, upload_blob, generate_cache_filename


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

    print(f"[get_tracks_for_reader] Called with params: "
          f"tags={tags}, duration_min={duration_min}, duration_max={duration_max}, "
          f"limit={limit}, track_id={track_id}")

    tags = choose_random_tags(tags)
    print(f"[get_tracks_for_reader] After choose_random_tags -> tags={tags}")

    # --- Check cache if track_id is provided ---
    if track_id:
        cache_filename = generate_cache_filename(track_id)
        print(f"[get_tracks_for_reader] Checking cache for {cache_filename}")
        cached_data = download_blob(cache_filename)
        if cached_data:
            print(f"[get_tracks_for_reader] Cache HIT for {cache_filename}")
            return [JamendoTrackResponse(**t) for t in json.loads(cached_data)]
        else:
            print(f"[get_tracks_for_reader] Cache MISS for {cache_filename}")

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
    print(f"[get_tracks_for_reader] Fetching from Jamendo with params: {params}")

    data = fetch_tracks(params)
    if "results" not in data:
        print("[get_tracks_for_reader] No 'results' key in Jamendo response")
        return []

    all_tracks = data["results"]
    print(f"[get_tracks_for_reader] Received {len(all_tracks)} tracks from Jamendo")

    selected_tracks = sample_tracks(all_tracks, limit)
    print(f"[get_tracks_for_reader] Sampled {len(selected_tracks)} tracks")

    formatted_tracks = format_jamendo_tracks(selected_tracks)
    print(f"[get_tracks_for_reader] Formatted {len(formatted_tracks)} tracks")

    # --- Save to cache if track_id provided ---
    if track_id:
        print(f"[get_tracks_for_reader] Uploading playlist to cache as {cache_filename}")
        upload_blob(cache_filename, json.dumps(formatted_tracks))

    print(f"[get_tracks_for_reader] Returning {len(formatted_tracks)} tracks")
    return formatted_tracks
