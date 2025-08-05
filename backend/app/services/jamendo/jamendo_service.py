from app.services.jamendo.jamendo_client import fetch_tracks
from app.utils.formatter import format_jamendo_tracks

def get_tracks_for_reader(tags: str, duration_min: int, duration_max: int, limit: int = 10) -> list[dict]:
    """
    Fetch and format a list of music tracks from Jamendo API for the reader.

    Args:
        tags (str): Fuzzy tags separated by "+" (e.g., "magic+fantasy+cinematic").
        duration_min (int): Minimum duration in seconds.
        duration_max (int): Maximum duration in seconds.
        limit (int): Number of tracks to return.

    Returns:
        list[dict]: A list of formatted music tracks.
    """

    params = {
        "limit": limit,
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

    return format_jamendo_tracks(data["results"])

