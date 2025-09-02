"""
Asynchronous HTTP client for querying the Jamendo music API.

Performs GET requests with the required parameters (e.g., client ID, format),
and returns the parsed JSON response. Raises errors on network or HTTP issues.
"""

from typing import Dict, Any
import httpx
from app.core.config import settings

base_url = settings.jamendo_url


async def fetch_tracks(params: Dict[str, Any]) -> Dict[str, Any]:
    """
    Perform an async GET request to Jamendo API with given parameters.

    Args:
        params (dict): Query parameters for the API call.

    Returns:
        dict: JSON response from Jamendo API.

    Raises:
        RuntimeError: If the request fails.
    """
    params["client_id"] = settings.jamendo_client_id
    params["format"] = "json"

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(base_url, params=params)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise RuntimeError(f"Error fetching tracks from Jamendo API: {e}") from e
