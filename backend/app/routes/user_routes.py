from typing import List
from fastapi import APIRouter
from app.models.user import UserCreateRequest, UserConnexionRequest, UserUpdateRequest, User, UserResponse
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from app.services.user.user_service import create_user_service, connexion_user_service, update_user_service
from bson import ObjectId

router = APIRouter(prefix="/user", tags=["Users"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_users(request: UserCreateRequest) -> UserResponse:
    return await create_user_service(request)
    

@router.post("/connexion", status_code=status.HTTP_200_OK)
async def connexion_user(request: UserConnexionRequest) -> UserResponse:
    return await connexion_user_service(request)
    
    
@router.put("/modify", status_code=status.HTTP_200_OK)
async def update_user(request: UserUpdateRequest) -> UserResponse:
    return await update_user_service(request)
