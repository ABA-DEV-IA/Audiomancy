from fastapi import APIRouter
from app.models.favorite import Favorite, FavoriteResponse, FavoriteRenameRequest, FavoriteCreateRequest
from fastapi import APIRouter, status, Query
from app.services.favorite.favorite_service import create_favorite_service, delete_favorite_service, list_favorites_service, rename_favorite_service
from typing import List


router = APIRouter(prefix="/favorite", tags=["Favorite"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_favorite(request: FavoriteCreateRequest) -> FavoriteResponse:
    return await create_favorite_service(request)


@router.delete("/delete/{favorite_id}", status_code=status.HTTP_200_OK)
async def delete_favorite(favorite_id: str, user_id: str) -> FavoriteResponse:
    return await delete_favorite_service(favorite_id, user_id)


@router.get("/list/{user_id}", response_model=List[Favorite])
async def list_favorites(user_id: str):
    return await list_favorites_service(user_id)


@router.put("/rename", status_code=status.HTTP_200_OK)
async def rename_favorite(request: FavoriteRenameRequest) -> FavoriteResponse:
    return await rename_favorite_service(request)