"""Jamendo API request and response models."""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator


class JamendoTrackRequest(BaseModel):
    """Request schema for track search with tags, duration range, and limit."""

    tags: str = Field(..., description="Tags for the track search")
    duration_min: int = Field(180, ge=0, description="Minimum duration in seconds")
    duration_max: int = Field(480, ge=0, description="Maximum duration in seconds")
    limit: int = Field(
        10,
        description="Number of tracks to return (allowed values: 10, 25, 50)",
    )
    track_id: Optional[str] = Field(
        None,
        alias="trackId",  # <-- frontend sends camelCase, backend receives snake_case
        description="Optional ID to cache/retrieve the playlist; does not affect the API request"
    )

    @field_validator("limit")
    def validate_limit(cls, v: int) -> int:
        """Validate limit is 10, 25, or 50."""
        if v not in (10, 25, 50):
            raise ValueError("limit must be one of 10, 25, or 50")
        return v

    model_config = ConfigDict(
        populate_by_name=True,  # <-- also allows access to track_id on backend
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
    """Track metadata including audio URL, license info, and tags."""

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
