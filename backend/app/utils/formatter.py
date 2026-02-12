"""Format Jamendo track data with license normalization."""
from typing import Dict, Any
from typing import List
from urllib.parse import urlparse, urlunparse
from app.utils.license import LICENSE_MAP


def normalize_license_url(url: str) -> str:
    """Normalize license URL to HTTPS and remove regional suffixes."""

    if not url:
        return ""
    parsed = urlparse(url)
    path_parts = parsed.path.rstrip("/").split("/")

    # Remove regional suffix if present (e.g., '/be', '/fr')
    if len(path_parts) >= 5 and len(path_parts[-1]) == 2:
        path_parts = path_parts[:-1]

    normalized_path = "/".join(path_parts) + "/"
    return f"https://{parsed.netloc}{normalized_path}"  # Force HTTPS


def format_jamendo_track(track: Dict[str, Any]) -> Dict[str, Any]:
    """Format track data with normalized license info."""
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
        "tags": (track.get("musicinfo") or {}).get("tags", {}).get("vartags", []),
        "image": track.get("album_image"),
    }


def format_jamendo_tracks(tracks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Format list of track dictionaries."""
    return [format_jamendo_track(track) for track in tracks]


def mongo_to_user_doc(document: Dict[str, Any]) -> Dict[str, Any]:
    """Convert MongoDB _id to string id field."""
    return {**document, "id": str(document["_id"])} if "_id" in document else document
