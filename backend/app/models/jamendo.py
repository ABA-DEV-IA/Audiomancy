from pydantic import BaseModel, Field
from typing import List, Optional
from enum import IntEnum


class LimitEnum(IntEnum):
    ten = 10
    twenty_five = 25
    fifty = 50


class JamendoTrackRequest(BaseModel):
    tags: str = Field(..., example="magic+fantasy+cinematic")
    duration_min: int = Field(180, ge=0, description="Minimum duration in seconds")
    duration_max: int = Field(480, ge=0, description="Maximum duration in seconds")
    limit: LimitEnum = Field(10, description="Number of tracks to return (10, 25, or 50)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "tags": "magic+fantasy+cinematic",
                "duration_min": 180,
                "duration_max": 480,
                "limit": 10
            }
        }
    }


class JamendoTrackResponse(BaseModel):
    id: str
    title: str
    artist: str
    audio_url: str
    duration: int
    license_name: Optional[str]
    license_url: Optional[str]
    tags: List[str]
    image: Optional[str]
