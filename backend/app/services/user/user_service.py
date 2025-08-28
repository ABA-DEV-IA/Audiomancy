from passlib.context import CryptContext
from app.db import users_collection, playlists_collection, check_connection
from typing import List
from fastapi import APIRouter
from app.models.user import UserCreateRequest, UserConnexionRequest, UserUpdateRequest, UserCreate, User, UserResponse
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

# contexte pour le hash
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user_service(request: UserCreateRequest) -> UserResponse:
    
    existing = await users_collection.find_one({"email": request.email})
    
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
    user = UserCreate(
        email = request.email,
        username = request.username,
        password_hash = hash_password(request.password),
        created_at = datetime.utcnow()
    )
    
    user_create = await users_collection.insert_one(user.model_dump())
    
    user_dict = user.model_dump()
    
    doc = {**user_dict, "id": str(user_create.inserted_id)}
    
    return UserResponse(
        success = True,
        message = "Utilisateur créé avec succès",
        user = User(**doc).model_dump(by_alias=True)
    )

async def connexion_user_service(request: UserConnexionRequest) -> UserResponse:
    
    existing = await users_collection.find_one({"email": request.email})
    
    if not existing:
        raise HTTPException(status_code=400, detail="Utilisateur inconnu")
    
    if not verify_password(request.password, existing["password_hash"]):
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")
    
    doc = {**existing, "id": str(existing["_id"])}
    
    return UserResponse(
            success = True,
            message = "Connexion réussie",
            user = User(**doc)
    )


async def update_user_service(request: UserUpdateRequest) -> UserResponse:

    existing = await users_collection.find_one({"_id": ObjectId(request.id)})
    
    if not existing:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    update_data = {}
    for key, value in request.model_dump().items():
        if value is not None and key != "id":  # on ignore l'id
            if key == "password":
                update_data["password_hash"] = hash_password(value)
            else:
                update_data[key] = value

    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")

    result = await users_collection.update_one(
        {"_id": ObjectId(request.id)},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        return UserResponse(success=False, message="Aucune modification effectuée", user=None)

    updated_user = await users_collection.find_one({"_id": ObjectId(request.id)})
    doc = {**updated_user, "id": str(updated_user["_id"])}

    return UserResponse(
        success=True,
        message="Utilisateur mis à jour",
        user=User(**doc)
    )
    
def hash_password(password: str) -> str:
    """Hash un mot de passe en clair"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie qu'un mot de passe correspond au hash"""
    return pwd_context.verify(plain_password, hashed_password)
