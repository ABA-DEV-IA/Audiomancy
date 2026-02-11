"""Routes for managing user favorite playlists (CRUD)."""

from typing import List
from fastapi import APIRouter, status
from app.models.favorite import (
    Favorite,
    FavoriteResponse,
    FavoriteRenameRequest,
    FavoriteCreateRequest,
)
from app.services.favorite.favorite_service import (
    create_favorite_service,
    delete_favorite_service,
    list_favorites_service,
    rename_favorite_service,
)

router = APIRouter(prefix="/favorite", tags=["Favorite"])


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_favorite(request: FavoriteCreateRequest) -> FavoriteResponse:
    """Save a new playlist to favorites."""

    return await create_favorite_service(request)


@router.delete("/delete/{favorite_id}", status_code=status.HTTP_200_OK)
async def delete_favorite(favorite_id: str, user_id: str) -> FavoriteResponse:
    """Remove a favorite by ID."""
    return await delete_favorite_service(favorite_id, user_id)


@router.get("/list/{user_id}", response_model=List[Favorite])
async def list_favorites(user_id: str):
    """List all favorites for a user."""
    return await list_favorites_service(user_id)


@router.put("/rename", status_code=status.HTTP_200_OK)
async def rename_favorite(request: FavoriteRenameRequest) -> FavoriteResponse:
    """Rename a favorite playlist."""
    return await rename_favorite_service(request)
