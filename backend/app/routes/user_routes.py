"""
User routes for FastAPI application.

Contains endpoints for creating, logging in, and updating users.
"""

import logging
from fastapi import APIRouter, status

from app.models.user import (
    UserCreateRequest,
    UserLoginRequest,
    UserUpdateRequest,
    UserResponse,
)
from app.services.user.user_service import (
    create_user_service,
    login_user_service,
    update_user_service,
)
from app.routes.metrics_routes import auth_attempts_total, personal_data_access_total

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/user", tags=["Users"])


@router.post("/create", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
async def create_user(request: UserCreateRequest) -> UserResponse:
    """
    Create a new user.

    Args:
        request (UserCreateRequest): The request body containing user details.

    Returns:
        UserResponse: Response containing success status, message, and created user.
    """
    logger.info(
        "User creation request received",
        extra={"endpoint": "/user/create", "email": request.email}
    )
    personal_data_access_total.labels(operation="create").inc()

    try:
        result = await create_user_service(request)
        logger.info(f"User created successfully: {request.email}")
        return result
    except Exception as e:
        logger.error(
            f"Error creating user: {str(e)}",
            extra={"endpoint": "/user/create", "email": request.email},
            exc_info=True
        )
        raise


@router.post("/login", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def login_user(request: UserLoginRequest) -> UserResponse:
    """
    Authenticate a user with email and password.

    Args:
        request (UserLoginRequest): The login credentials.

    Returns:
        UserResponse: Response containing success status, message, and user data.
    """
    logger.info(
        "Login attempt",
        extra={"endpoint": "/user/login", "email": request.email}
    )

    try:
        result = await login_user_service(request)
        # Successful login
        auth_attempts_total.labels(result="success").inc()
        logger.info(f"User logged in successfully: {request.email}")
        return result
    except Exception as e:
        # Failed login
        auth_attempts_total.labels(result="failure").inc()
        logger.warning(
            f"Login failed for user: {request.email} - {str(e)}",
            extra={"endpoint": "/user/login", "email": request.email}
        )
        raise


@router.put("/modify", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def update_user(request: UserUpdateRequest) -> UserResponse:
    """
    Update an existing user's information.

    Args:
        request (UserUpdateRequest): The request body containing updated fields.

    Returns:
        UserResponse: Response containing success status, message, and updated user.
    """
    return await update_user_service(request)
