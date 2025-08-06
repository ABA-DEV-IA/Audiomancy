"""
Utility functions for normalizing and formatting raw Jamendo track data.

Includes functions to clean up license URLs and convert Jamendo's native data
structure into the response model expected by the API.

Functions:
    normalize_license_url: Cleans license URL by removing region-specific suffixes.
    format_jamendo_track: Formats a single raw track into a JamendoTrackResponse.
"""

from urllib.parse import urlparse, urlunparse
from app.utils.license import LICENSE_MAP  # Renommé depuis tracks.py
from typing import Dict, Any
from typing import List

def normalize_license_url(url: str) -> str:
    """
    Converts a Jamendo license URL to a normalized base form by:
    - enforcing HTTPS
    - removing region-specific suffixes (e.g., /be/, /fr/)

    This form is used to match against LICENSE_MAP keys.
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

def format_jamendo_track(track: Dict[str, Any]) -> Dict[str, Any]:
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

def format_jamendo_tracks(tracks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Format a list of raw Jamendo track dictionaries.
    """
    return [format_jamendo_track(track) for track in tracks]
