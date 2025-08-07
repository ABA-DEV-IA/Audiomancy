"""
Data models for the Jamendo music API.

Defines both request and response schemas used by the API endpoints. These models
ensure input validation and generate clear OpenAPI documentation.

Classes:
    JamendoTrackRequest: Model representing query parameters for fetching tracks.
    JamendoTrackResponse: Model representing the formatted track returned to the client.
"""

from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from enum import IntEnum


class LimitEnum(IntEnum):
    """
    Enum representing allowed limits for the number of tracks returned by the API.
    """
    ten = 10
    twenty_five = 25
    fifty = 50


class JamendoTrackRequest(BaseModel):
    """
    Request schema for retrieving music tracks from Jamendo.

    Attributes:
        tags (str): List of keywords joined by '+' (e.g., "magic+fantasy+cinematic").
        duration_min (int): Minimum track duration in seconds.
        duration_max (int): Maximum track duration in seconds.
        limit (LimitEnum): Number of tracks to return (10, 25, or 50).
    """
    tags: str = Field(..., description="Tags for the track search")
    duration_min: int = Field(180, ge=0, description="Minimum duration in seconds")
    duration_max: int = Field(480, ge=0, description="Maximum duration in seconds")
    limit: LimitEnum = Field(10, description="Number of tracks to return (10, 25, or 50)")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "tags": "magic+fantasy+cinematic",
                "duration_min": 180,
                "duration_max": 480,
                "limit": 10
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
