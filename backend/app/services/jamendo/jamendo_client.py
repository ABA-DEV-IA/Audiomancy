"""
HTTP client for querying the Jamendo music API.

Performs GET requests with the required parameters (e.g., client ID, format),
and returns the parsed JSON response. Raises errors on network or HTTP issues.

Functions:
    fetch_tracks: Sends a GET request to the Jamendo API with the given parameters.
"""

import requests
from app.core.config import settings
from typing import Dict, Any

BASE_URL = "https://api.jamendo.com/v3.0/tracks/"

def fetch_tracks(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform a GET request to Jamendo API with given parameters.

    Args:
        params (dict): Query parameters for the API call.

    Returns:
        dict: JSON response from Jamendo API.

    Raises:
        RuntimeError: If the request fails.
    """
    params["client_id"] = settings.JAMENDO_CLIENT_ID
    params["format"] = "json"

    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise RuntimeError(f"Error fetching tracks from Jamendo API: {e}")
