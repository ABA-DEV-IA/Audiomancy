"""
Data models for the Jamendo music API.

Defines both request and response schemas used by the API endpoints. These models
ensure input validation and generate clear OpenAPI documentation.

Classes:
    JamendoTrackRequest: Model representing query parameters for fetching tracks.
    JamendoTrackResponse: Model representing the formatted track returned to the client.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator


class JamendoTrackRequest(BaseModel):
    """
    Request schema for retrieving music tracks from Jamendo.

    Attributes:
        tags (str): List of keywords joined by ' ' (e.g., "magic fantasy cinematic").
        duration_min (int): Minimum track duration in seconds.
        duration_max (int): Maximum track duration in seconds.
        limit (int): Number of tracks to return (must be one of 10, 25, or 50).
        track_id (Optional[str]): Optional identifier used to cache/retrieve playlists.
                                  Not required for the API call itself.
    """

    tags: str = Field(..., description="Tags for the track search")
    duration_min: int = Field(180, ge=0, description="Minimum duration in seconds")
    duration_max: int = Field(480, ge=0, description="Maximum duration in seconds")
    limit: int = Field(
        10,
        description="Number of tracks to return (allowed values: 10, 25, 50)",
    )
    track_id: Optional[str] = Field(
        None,
        alias="trackId",  # <-- frontend envoie camelCase, backend reçoit snake_case
        description="Optional ID to cache/retrieve the playlist; does not affect the API request"
    )

    @field_validator("limit")
    def validate_limit(cls, v: int) -> int:
        """Ensure that limit is restricted to 10, 25, or 50."""
        if v not in (10, 25, 50):
            raise ValueError("limit must be one of 10, 25, or 50")
        return v

    model_config = ConfigDict(
        populate_by_name=True,  # <-- permet d'accéder aussi à track_id côté backend
        json_schema_extra={
            "example": {
                "tags": "magic+fantasy+cinematic",
                "duration_min": 180,
                "duration_max": 480,
                "limit": 10,
                "track_id": "harry_potter_reading_1"
            }
        }
    )


class JamendoTrackResponse(BaseModel):
    """
    Response schema for a Jamendo track.

    Attributes:
        id (str): Unique track identifier.
        title (str): Track title.
        artist (str): Artist name.
        audio_url (str): Direct URL to the audio file.
        duration (int): Track duration in seconds.
        license_name (Optional[str]): Name of the license.
        license_url (Optional[str]): URL of the license.
        tags (List[str]): List of track tags.
        image (Optional[str]): URL of the album or track image.
    """

    id: str
    title: str
    artist: str
    audio_url: str
    duration: int
    license_name: Optional[str]
    license_url: Optional[str]
    tags: List[str]
    image: Optional[str]

    model_config = ConfigDict()
