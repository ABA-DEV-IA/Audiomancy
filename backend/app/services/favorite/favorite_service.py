"""CRUD operations for favorite playlists stored in MongoDB."""

from app.core.db import favorite_collection
from app.models.favorite import Favorite, FavoriteCreateRequest, FavoriteResponse, FavoriteRenameRequest
from app.utils.formatter import mongo_to_user_doc
from fastapi import HTTPException
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId



async def create_favorite_service(request: FavoriteCreateRequest) -> FavoriteResponse:
    """Save playlist to user favorites."""

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
    """Delete favorite playlist by ID."""
    
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
    """Get all user favorite playlists."""

    favorites = await favorite_collection.find({"user_id": user_id}).to_list(None)

    result = []
    for fav in favorites:
        result.append(Favorite(**mongo_to_user_doc(fav)))
    return result


async def rename_favorite_service(request: FavoriteRenameRequest) -> FavoriteResponse:
    """Rename favorite playlist."""

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