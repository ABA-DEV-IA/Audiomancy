from datetime import datetime, timezone
from typing import Dict, Any

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException
from passlib.context import CryptContext

from app.core.db import users_collection, check_connection
from app.models.user import (
    UserCreateRequest,
    UserLoginRequest,
    UserUpdateRequest,
    UserCreate,
    User,
    UserPublic,
    UserResponse,
)

# Context for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def mongo_to_user_doc(document: Dict[str, Any]) -> Dict[str, Any]:
    """Convert a MongoDB document to a dict with string 'id' field."""
    return {**document, "id": str(document["_id"])} if "_id" in document else document


def hash_password(password: str) -> str:
    """Hash a plain-text password with bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plain-text password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def _user_to_public(doc: dict) -> UserPublic:
    """
    Convert a MongoDB user document to a UserPublic model (no password_hash).
    """
    user_doc = mongo_to_user_doc(doc)
    return UserPublic(
        id=user_doc["id"],
        email=user_doc["email"],
        username=user_doc["username"],
        created_at=user_doc.get("created_at", datetime.now(timezone.utc)),
    )


async def create_user_service(request: UserCreateRequest) -> UserResponse:
    """Create a new user. Raises 400 if email already registered."""
    if not await check_connection():
        raise HTTPException(status_code=503, detail="impossible de se connecter au serveur")
    
    existing = await users_collection.find_one({"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà enregistré")

    user = UserCreate(
        email=request.email,
        username=request.username,
        password_hash=hash_password(request.password),
        created_at=datetime.now(timezone.utc),
    )

    result = await users_collection.insert_one(user.model_dump())
    doc = {**user.model_dump(), "_id": result.inserted_id}

    return UserResponse(
        success=True,
        message="User successfully created",
        user=_user_to_public(doc),
    )


async def login_user_service(request: UserLoginRequest) -> UserResponse:
    """Authenticate a user with email and password."""
    if not await check_connection():
        raise HTTPException(status_code=503, detail="impossible de se connecter au serveur")
    
    existing = await users_collection.find_one({"email": request.email})
    if not existing:
        raise HTTPException(status_code=400, detail="Email ou mot de passe invalide")

    if not verify_password(request.password, existing["password_hash"]):
        raise HTTPException(status_code=400, detail="Email ou mot de passe invalide")

    return UserResponse(
        success=True,
        message="Login successful",
        user=_user_to_public(existing),
    )


async def update_user_service(request: UserUpdateRequest) -> UserResponse:
    """Update a user's username or password."""
    if not await check_connection():
        raise HTTPException(status_code=503, detail="impossible de se connecter au serveur")
    
    try:
        oid = ObjectId(request.id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail="ID utilisateur invalide")

    existing = await users_collection.find_one({"_id": oid})
    if not existing:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    update_data = {}
    for key, value in request.model_dump().items():
        if value is not None and key != "id":
            if key == "password":
                update_data["password_hash"] = hash_password(value)
            else:
                update_data[key] = value

    if not update_data:
        raise HTTPException(status_code=400, detail="Aucun champ valide à mettre à jour")

    result = await users_collection.update_one(
        {"_id": oid}, {"$set": update_data}
    )

    if result.modified_count == 0:
        return UserResponse(
            success=False,
            message="Aucune modification appliquée",
            user=None,
        )

    updated_user = await users_collection.find_one({"_id": oid})

    return UserResponse(
        success=True,
        message="L'utilisateur a été mis à jour avec succès",
        user=_user_to_public(updated_user),
    )
