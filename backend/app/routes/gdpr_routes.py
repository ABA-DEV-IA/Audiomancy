"""GDPR compliance routes (data export, account deletion, retention policy)."""

import logging
from datetime import datetime, timezone
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.core.db import users_collection, favorite_collection
from app.routes.metrics_routes import personal_data_access_total

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/gdpr", tags=["GDPR"])


class DataExportRequest(BaseModel):
    """GDPR data export request."""
    email: EmailStr


class AccountDeletionRequest(BaseModel):
    """Account deletion request requiring explicit confirmation."""
    email: EmailStr
    confirmation: str


@router.post("/data-export", status_code=status.HTTP_200_OK)
async def export_user_data(request: DataExportRequest) -> Dict[str, Any]:
    """Export all user data (GDPR Article 15)."""
    logger.info(
        "GDPR data export request received",
        extra={"endpoint": "/gdpr/data-export", "email": request.email}
    )
    personal_data_access_total.labels(operation="export").inc()

    try:
        # Find user by email
        user_doc = await users_collection.find_one({"email": request.email})
        if not user_doc:
            raise HTTPException(
                status_code=404,
                detail="Utilisateur introuvable."
            )

        user_id = str(user_doc["_id"])

        # Fetch user's favorites
        favorites_cursor = favorite_collection.find({"user_id": user_id})
        favorites: List[Dict[str, Any]] = []
        async for fav in favorites_cursor:
            fav["_id"] = str(fav["_id"])
            favorites.append(fav)

        # Build GDPR-compliant response
        now = datetime.now(timezone.utc).isoformat()
        user_data = {
            "gdpr_request_type": "data_export",
            "email": request.email,
            "data": {
                "profile": {
                    "email": user_doc.get("email"),
                    "username": user_doc.get("username"),
                    "created_at": str(user_doc.get("created_at", "")),
                },
                "favorites": favorites,
                "favorites_count": len(favorites),
            },
            "export_date": now,
            "retention_policy": "Data is retained for 2 years after last activity"
        }

        logger.info("Data export completed for user: %s", request.email)
        return user_data

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Error exporting user data: %s",
            str(e),
            extra={"endpoint": "/gdpr/data-export", "email": request.email},
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de l'export des données utilisateur"
        ) from e


@router.delete("/account", status_code=status.HTTP_200_OK)
async def delete_user_account(request: AccountDeletionRequest) -> Dict[str, Any]:
    """Delete account and all associated data (GDPR Article 17)."""
    logger.warning(
        "GDPR account deletion request received",
        extra={"endpoint": "/gdpr/account", "email": request.email}
    )
    personal_data_access_total.labels(operation="delete").inc()

    # Require explicit confirmation
    if request.confirmation != "DELETE":
        logger.warning("Invalid deletion confirmation for user: %s", request.email)
        raise HTTPException(
            status_code=400,
            detail="Invalid confirmation. Please type 'DELETE' to confirm account deletion."
        )

    try:
        # 1. Find user
        user_doc = await users_collection.find_one({"email": request.email})
        if not user_doc:
            raise HTTPException(
                status_code=404,
                detail="Utilisateur introuvable."
            )

        user_id = str(user_doc["_id"])

        # 2. Delete all user favorites
        favorites_result = await favorite_collection.delete_many({"user_id": user_id})
        logger.info(
            "Deleted %d favorites for user: %s",
            favorites_result.deleted_count, request.email
        )

        # 3. Delete user profile
        await users_collection.delete_one({"_id": user_doc["_id"]})

        now = datetime.now(timezone.utc).isoformat()
        logger.info("Account deletion completed for user: %s", request.email)

        return {
            "status": "success",
            "message": f"Account and all associated data for {request.email} has been permanently deleted.",
            "deleted_at": now,
            "deleted_items": {
                "favorites": favorites_result.deleted_count,
                "user_profile": 1
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Error deleting user account: %s",
            str(e),
            extra={"endpoint": "/gdpr/account", "email": request.email},
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail="Erreur lors de la suppression du compte"
        ) from e


@router.get("/data-retention-policy", status_code=status.HTTP_200_OK)
async def get_data_retention_policy() -> Dict[str, Any]:
    """Get data retention policy (GDPR Article 13)."""
    logger.info("Data retention policy requested")

    return {
        "policy_version": "1.0",
        "last_updated": "2025-01-01",
        "retention_periods": {
            "user_profiles": "2 years after last activity",
            "favorite_tracks": "2 years after last activity",
            "generated_playlists": "1 year",
            "application_logs": "31 days (RGPD-compliant via Promtail anonymization)",
            "metrics_data": "90 days (Prometheus retention)"
        },
        "anonymization": {
            "logs": "Emails, passwords, and tokens are automatically anonymized in logs via Promtail",
            "metrics": "Personal identifiers are not stored in Prometheus metrics"
        },
        "contact": {
            "dpo_email": "dpo@audiomancy.example.com",
            "privacy_policy_url": "https://audiomancy.example.com/privacy"
        }
    }
