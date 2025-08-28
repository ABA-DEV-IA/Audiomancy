from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict, field_validator
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class User(BaseModel):
    id: str
    email: EmailStr
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(populate_by_name=True)

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreateRequest(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserConnexionRequest(BaseModel):
    email: EmailStr
    password: str

class UserUpdateRequest(BaseModel):
    id: str
    username: Optional[str] = None
    password: Optional[str] = None
    
class UserResponse(BaseModel):
    success: bool
    message: str
    user: Optional[User]
    

