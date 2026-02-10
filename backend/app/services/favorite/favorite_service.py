"""
Service layer for managing user favorites (playlists).

Provides CRUD operations for favorite playlists stored in MongoDB:
- create_favorite_service: Save a new playlist to favorites
- delete_favorite_service: Remove a favorite playlist
- list_favorites_service: List all favorites for a user
- rename_favorite_service: Rename an existing favorite playlist
"""

from app.core.db import favorite_collection
from app.models.favorite import Favorite, FavoriteCreateRequest, FavoriteResponse, FavoriteRenameRequest
from app.utils.formatter import mongo_to_user_doc
from fastapi import HTTPException
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId



async def create_favorite_service(request: FavoriteCreateRequest) -> FavoriteResponse:
    """
    Create a new favorite playlist for a user.

    Args:
        request (Favorite): The favorite data including user_id, name, and track_list.

    Raises:
        HTTPException(400): If a favorite with the same name already exists for this user.

    Returns:
        FavoriteResponse: Response containing the created favorite.
    """

    existing = await favorite_collection.find_one({
        "user_id": request.user_id,
        "name": request.name
        })

    if existing:
        raise HTTPException(status_code=400, detail="Nom déjà existant.")
    
    favorite = Favorite(
        user_id = request.user_id,
        name = request.name,
        track_list = request.track_list,
        saved_at = datetime.now(timezone.utc)
    )


    result = await favorite_collection.insert_one(favorite.model_dump())
    favorite.id = str(result.inserted_id)


    return FavoriteResponse(
        success = True,
        message = "Playlist ajoutée aux favoris !",
        favorite=favorite
    )


async def delete_favorite_service(favorite_id: str, user_id: str) -> FavoriteResponse:
    """
    Delete a favorite playlist by ID.

    Args:
        favorite_id (str): The ObjectId of the favorite to delete.
        user_id (str): The user's ID (ownership check).

    Raises:
        HTTPException(404): If the favorite is not found.

    Returns:
        FavoriteResponse: Confirmation of deletion.
    """
    
    try:
        oid = ObjectId(favorite_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail="ID de favori invalide")

    result = await favorite_collection.delete_one({
        "_id": oid,
        "user_id": user_id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Playlist non trouvée.")

    return FavoriteResponse(
        success = True,
        message = "Playlist retirée des favoris.",
    )


async def list_favorites_service(user_id: str):
    """
    List all favorite playlists for a given user.

    Args:
        user_id (str): The user's ID.

    Returns:
        List[Favorite]: List of the user's favorite playlists.
    """

    favorites = await favorite_collection.find({"user_id": user_id}).to_list(None)

    result = []
    for fav in favorites:
        result.append(Favorite(**mongo_to_user_doc(fav)))
    return result


async def rename_favorite_service(request: FavoriteRenameRequest) -> FavoriteResponse:
    """
    Rename an existing favorite playlist.

    Args:
        request (FavoriteRenameRequest): Contains favorite_id, user_id, and new_name.

    Raises:
        HTTPException(400): If the new name is already in use.
        HTTPException(404): If the favorite is not found.

    Returns:
        FavoriteResponse: Confirmation of rename.
    """

    existing = await favorite_collection.find_one({
        "user_id": request.user_id,
        "name": request.new_name
    })
    if existing:
        raise HTTPException(status_code=400, detail="Nom déjà utilisé.")
    
    try:
        oid = ObjectId(request.favorite_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail="ID de favori invalide")

    result = await favorite_collection.update_one(
        {"_id": oid, "user_id": request.user_id},
        {"$set": {"name": request.new_name}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Playlist non trouvée.")
    
    return FavoriteResponse(
        success=True,
        message="Playlist renommée avec succès !"
    )