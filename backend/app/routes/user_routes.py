"""User routes: registration, login, profile update."""

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
    """Create a new user account."""
    logger.info(
        "User creation request received",
        extra={"endpoint": "/user/create", "email": request.email}
    )
    personal_data_access_total.labels(operation="create").inc()

    try:
        result = await create_user_service(request)
        logger.info("User created successfully: %s", request.email)
        return result
    except Exception as e:
        logger.error(
            "Error creating user: %s",
            str(e),
            extra={"endpoint": "/user/create", "email": request.email},
            exc_info=True
        )
        raise


@router.post("/login", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def login_user(request: UserLoginRequest) -> UserResponse:
    """Authenticate user with email and password."""
    logger.info(
        "Login attempt",
        extra={"endpoint": "/user/login", "email": request.email}
    )

    try:
        result = await login_user_service(request)
        # Successful login
        auth_attempts_total.labels(result="success").inc()
        logger.info("User logged in successfully: %s", request.email)
        return result
    except Exception as e:
        # Failed login
        auth_attempts_total.labels(result="failure").inc()
        logger.warning(
            "Login failed for user: %s - %s",
            request.email,
            str(e),
            extra={"endpoint": "/user/login", "email": request.email}
        )
        raise


@router.put("/modify", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def update_user(request: UserUpdateRequest) -> UserResponse:
    """Update user profile."""
    return await update_user_service(request)
