from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .favorite import Favorite

class UserRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserConnexionRequest(BaseModel):
    email: EmailStr
    password: str

class UserUpdateRequest(BaseModel):
    username: Optional[str]
    password: Optional[str]


class User(BaseModel):
    email: EmailStr
    username: str
    password_hash: str
    created_at: datetime = datetime.utcnow()

    model_config = ConfigDict()
