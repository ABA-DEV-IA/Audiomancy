"""HTTP client for the Jamendo music API."""

import requests
from typing import Dict, Any
from app.core.config import settings

base_url = settings.jamendo_url


def fetch_tracks(params: Dict[str, Any]) -> Dict[str, Any]:
    """GET request to Jamendo API. Raises RuntimeError on failure."""
    params["client_id"] = settings.jamendo_client_id
    params["format"] = "json"

    try:
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise RuntimeError(f"Error fetching tracks from Jamendo API: {e}") from e
