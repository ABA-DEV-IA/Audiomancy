import requests
from app.core.config import settings

BASE_URL = "https://api.jamendo.com/v3.0/tracks/"

def fetch_tracks(params: dict) -> dict:
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
