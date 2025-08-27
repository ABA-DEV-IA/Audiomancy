from typing import List
from fastapi import APIRouter
from app.db import users_collection, playlists_collection, check_connection
from app.models.user import UserRequest, UserConnexionRequest, UserUpdateRequest, User
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from app.services.user.user_service import hash_password, verify_password
from bson import ObjectId

router = APIRouter(prefix="/user", tags=["Users"])

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_users(request: UserRequest):
    existing = await users_collection.find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
        
    user = User(
        email = request.email,
        username = request.username,
        password_hash = hash_password(request.password),
        created_at = datetime.utcnow()
    )
    
    user_create = await users_collection.insert_one(user.model_dump())
    
    # Préparer l'objet utilisateur à retourner
    user_dict = user.model_dump()
    user_dict["id"] = str(user_create.inserted_id)  # 🔥 Convertir ObjectId en string

    return {
        "success": True,
        "message": "Utilisateur créé avec succès",
        "user": user_dict
    }
    

@router.post("/connexion", status_code=status.HTTP_200_OK)
async def connexion_user(request: UserConnexionRequest):

    existing = await users_collection.find_one({"email": request.email})
    
    if not existing:
        raise HTTPException(status_code=400, detail="Utilisateur inconnu")
    
    if not verify_password(request.password, existing["password_hash"]):
        raise HTTPException(status_code=400, detail="Mot de passe incorrect")
    
    return {
        "success": True,
        "message": "Connexion réussie",
        "user": {
            "id": str(existing["_id"]),
            "email": existing["email"],
            "username": existing["username"]
        }
    }
    
@router.put("/modify")
async def update_user(request: UserUpdateRequest, user_id):
    existing = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    update_data = {}

    for k, v in request.dict().items():
        if v is not None:
            if k == "password":  
                update_data["password_hash"] = hash_password(v)  # on hash avant d’enregistrer
            else:
                update_data[k] = v    
    
    print(update_data)

    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")

    result = await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    if result.modified_count == 0:
        return {"success": False, "message": "Aucune modification effectuée"}

    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})

    updated_user_data = dict(updated_user)
    updated_user_data["id"] = str(updated_user_data["_id"])
    del updated_user_data["_id"]
    user_obj = User(**updated_user_data)

    return {"success": True, "message": "Utilisateur mis à jour", "user": user_obj}