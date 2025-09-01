from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .jamendo import JamendoTrackResponse


class Favorite(BaseModel):
    name: str
    track_list: List[JamendoTrackResponse] = []
    
    model_config = ConfigDict()