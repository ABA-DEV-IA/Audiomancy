from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime, timezone
from .jamendo import JamendoTrackResponse


class Favorite(BaseModel):
    id: Optional[str] = Field(default=None) 
    user_id: str
    name: str
    track_list: List[JamendoTrackResponse] = []
    saved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(populate_by_name=True)

    
class FavoriteResponse(BaseModel):
    success: bool
    message: str
    favorite: Favorite | None = None


class FavoriteRenameRequest(BaseModel):
    user_id: str
    favorite_id: str
    new_name: str
    
class FavoriteCreateRequest(BaseModel):
    user_id: str
    name: str
    track_list: List[JamendoTrackResponse] = []
    saved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(populate_by_name=True)