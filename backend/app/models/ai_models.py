"""
Pydantic models for AI-powered playlist generation.

This module defines the data schemas used by the playlist generation API:

- PromptRequest: Represents the input payload sent by the client,
  containing a natural language prompt and the number of tracks to return.

- GeneratedTrack: Represents a track returned by the Jamendo service,
  including metadata such as title, artist, audio URL, license information,
  tags, and an optional image.

These models ensure request validation, type safety, and structured responses
across the API.
"""

from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional

class PromptRequest(BaseModel):
    prompt: str
    limit: int

    @field_validator("limit")
    def validate_limit(cls, v: int) -> int:
        """Ensure that limit is restricted to 10, 25, or 50."""
        if v not in (10, 25, 50):
            raise ValueError("limit must be one of 10, 25, or 50")
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "prompt": "Génère moi une playlist adaptée pour lire Harry Potter.",
                "limit": 10
            }
        }
    )

class GeneratedTrack(BaseModel):
    """
    Response schema for a track.

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
