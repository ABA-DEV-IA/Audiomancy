from urllib.parse import urlparse, urlunparse
from app.utils.license import LICENSE_MAP  # Renommé depuis tracks.py

def normalize_license_url(url: str) -> str:
    """
    Normalize a Jamendo license URL by converting to HTTPS and removing regional suffix (e.g., /be/, /fr/).
    Returns the base URL for LICENSE_MAP lookup.
    """
    if not url:
        return ""
    
    parsed = urlparse(url)
    path_parts = parsed.path.rstrip("/").split("/")

    # Remove regional suffix if present (e.g., '/be', '/fr')
    if len(path_parts) >= 5 and len(path_parts[-1]) == 2:
        path_parts = path_parts[:-1]

    normalized_path = "/".join(path_parts) + "/"
    return f"https://{parsed.netloc}{normalized_path}"  # Force HTTPS

def format_jamendo_track(track: dict) -> dict:
    """
    Format a raw Jamendo track dictionary into a clean JSON structure,
    with a human-readable license name and regionalized license URL.
    """
    raw_license_url = track.get("license_ccurl")
    
    # Normalize to find the license name
    normalized_url = normalize_license_url(raw_license_url)
    license_name = LICENSE_MAP.get(normalized_url, "Unknown license")

    # Ensure display URL uses HTTPS even with regional path
    display_url = raw_license_url
    if raw_license_url:
        parsed_display = urlparse(raw_license_url)
        display_url = urlunparse(parsed_display._replace(scheme="https"))

    return {
        "id": track.get("id"),
        "title": track.get("name"),
        "artist": track.get("artist_name"),
        "audio_url": track.get("audio"),
        "duration": track.get("duration"),
        "license_name": license_name,
        "license_url": display_url,
        "tags": track.get("musicinfo", {}).get("tags", {}).get("vartags", []),
        "image": track.get("album_image"),
    }

def format_jamendo_tracks(tracks: list) -> list:
    """
    Format a list of raw Jamendo track dictionaries.
    """
    return [format_jamendo_track(track) for track in tracks]
