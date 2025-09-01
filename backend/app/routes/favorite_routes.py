from typing import List
from fastapi import APIRouter
from app.core.db import users_collection, playlists_collection, check_connection
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from app.services.user.user_service import hash_password

router = APIRouter(prefix="/users", tags=["Users"])