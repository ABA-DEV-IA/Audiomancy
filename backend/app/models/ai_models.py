"""AI playlist generation request and response models."""

from pydantic import BaseModel, ConfigDict, field_validator
from typing import List, Optional

class PromptRequest(BaseModel):
    prompt: str
    limit: int

    @field_validator("limit")
    def validate_limit(cls, v: int) -> int:
        """Validate limit is 10, 25, or 50."""
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
    """Track metadata returned by AI playlist generation."""
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
