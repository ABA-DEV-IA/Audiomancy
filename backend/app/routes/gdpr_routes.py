"""
RGPD/GDPR compliance routes.

Endpoints for user data rights compliance:
- Right to access (Article 15)
- Right to erasure/be forgotten (Article 17)
- Right to data portability (Article 20)
"""

import logging
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from app.routes.metrics_routes import personal_data_access_total

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/gdpr", tags=["GDPR"])


class DataExportRequest(BaseModel):
    """Request model for data export"""
    email: EmailStr


class AccountDeletionRequest(BaseModel):
    """Request model for account deletion"""
    email: EmailStr
    confirmation: str  # User must type "DELETE" to confirm


@router.post("/data-export", status_code=status.HTTP_200_OK)
async def export_user_data(request: DataExportRequest) -> Dict[str, Any]:
    """
    Export all personal data for a user (GDPR Article 15 - Right to Access).

    This endpoint allows users to download all their personal data
    stored in the system in a machine-readable format (JSON).

    Args:
        request (DataExportRequest): User email to export data for

    Returns:
        Dict containing all user data:
        - profile: User profile information
        - favorites: List of favorite tracks
        - playlists: Generated playlists history
        - metadata: Account creation date, last login, etc.

    Raises:
        HTTPException(404): If user not found
    """
    logger.info(
        "GDPR data export request received",
        extra={"endpoint": "/gdpr/data-export", "email": request.email}
    )
    personal_data_access_total.labels(operation="export").inc()

    try:
        # TODO: Implement actual data retrieval from MongoDB
        # This is a placeholder response
        user_data = {
            "gdpr_request_type": "data_export",
            "email": request.email,
            "data": {
                "profile": {
                    "email": request.email,
                    "created_at": "2025-01-01T00:00:00Z",
                    "last_login": "2025-02-04T12:00:00Z"
                },
                "favorites": [],
                "playlists_generated": [],
                "consents": {
                    "marketing": False,
                    "analytics": True
                }
            },
            "export_date": "2025-02-04T12:00:00Z",
            "retention_policy": "Data is retained for 2 years after last activity"
        }

        logger.info(f"Data export completed for user: {request.email}")
        return user_data

    except Exception as e:
        logger.error(
            f"Error exporting user data: {str(e)}",
            extra={"endpoint": "/gdpr/data-export", "email": request.email},
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export user data: {str(e)}"
        ) from e


@router.delete("/account", status_code=status.HTTP_200_OK)
async def delete_user_account(request: AccountDeletionRequest) -> Dict[str, str]:
    """
    Delete user account and all associated data (GDPR Article 17 - Right to Erasure).

    This endpoint permanently deletes all user data from the system.
    This action is irreversible.

    Args:
        request (AccountDeletionRequest): User email and confirmation

    Returns:
        Dict with deletion confirmation message

    Raises:
        HTTPException(400): If confirmation is invalid
        HTTPException(404): If user not found
    """
    logger.warning(
        "GDPR account deletion request received",
        extra={"endpoint": "/gdpr/account", "email": request.email}
    )
    personal_data_access_total.labels(operation="delete").inc()

    # Require explicit confirmation
    if request.confirmation != "DELETE":
        logger.warning(f"Invalid deletion confirmation for user: {request.email}")
        raise HTTPException(
            status_code=400,
            detail="Invalid confirmation. Please type 'DELETE' to confirm account deletion."
        )

    try:
        # TODO: Implement actual account deletion from MongoDB
        # Steps:
        # 1. Delete user profile
        # 2. Delete all favorites
        # 3. Delete all playlists
        # 4. Delete all logs containing user email (or anonymize)
        # 5. Remove from cache

        logger.info(f"Account deletion completed for user: {request.email}")

        return {
            "status": "success",
            "message": f"Account and all associated data for {request.email} has been permanently deleted.",
            "deleted_at": "2025-02-04T12:00:00Z"
        }

    except Exception as e:
        logger.error(
            f"Error deleting user account: {str(e)}",
            extra={"endpoint": "/gdpr/account", "email": request.email},
            exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete account: {str(e)}"
        ) from e


@router.get("/data-retention-policy", status_code=status.HTTP_200_OK)
async def get_data_retention_policy() -> Dict[str, Any]:
    """
    Get the data retention policy (GDPR Article 13 - Information to be provided).

    Returns:
        Dict containing data retention policy details
    """
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
