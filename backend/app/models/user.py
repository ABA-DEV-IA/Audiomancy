from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict


class User(BaseModel):
    """User database model."""
    id: str
    email: EmailStr
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(populate_by_name=True)


class UserCreate(BaseModel):
    """User creation model for database insertion."""
    email: EmailStr
    username: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserCreateRequest(BaseModel):
    """User registration request with plaintext password."""
    email: EmailStr
    username: str
    password: str


class UserLoginRequest(BaseModel):
    """Login request with email and password."""
    email: EmailStr
    password: str


class UserUpdateRequest(BaseModel):
    """Update user profile (username and/or password)."""
    id: str
    username: Optional[str] = None
    password: Optional[str] = None


class UserPublic(BaseModel):
    """User model without password hash for API responses."""
    id: str
    email: EmailStr
    username: str
    created_at: datetime


class UserResponse(BaseModel):
    """Standard response for user operations."""
    success: bool
    message: str
    user: Optional[UserPublic] = None
