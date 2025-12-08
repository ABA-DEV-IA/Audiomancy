"""
blob_tools.py (version compatible CI/CD & tests unitaires)
"""

import logging
from typing import Optional, List

from azure.storage.blob import BlobServiceClient, ContainerClient, BlobClient
from azure.core.exceptions import ResourceExistsError, ResourceNotFoundError

from app.core.config import settings

logger = logging.getLogger(__name__)

# --- Configuration ---
cache_blob_name = settings.cache_blob_name
azure_storage_connection_string = settings.azure_storage_connection_string

# IMPORTANT : on NE crée PAS le client ici.
_blob_service_client: BlobServiceClient | None = None


def get_blob_service_client() -> BlobServiceClient:
    """
    Lazy loader for BlobServiceClient.  
    Avoids import-time initialization (critical for CI/CD and pytest).
    """
    global _blob_service_client

    if _blob_service_client is None:
        if not azure_storage_connection_string:
            raise RuntimeError(
                "AZURE_STORAGE_CONNECTION_STRING must be set before using blob tools."
            )

        _blob_service_client = BlobServiceClient.from_connection_string(
            azure_storage_connection_string
        )

    return _blob_service_client


# --- Internal prefix for cache blobs ---
CACHE_PREFIX = "cache/"


def create_container_if_not_exists(container_name: str = cache_blob_name) -> ContainerClient:
    client = get_blob_service_client()
    container_client = client.get_container_client(container_name)

    try:
        container_client.get_container_properties()
    except ResourceNotFoundError:
        container_client.create_container()

    return container_client


def generate_cache_filename(category: str) -> str:
    safe_name = "".join(c if c.isalnum() else "_" for c in category.strip().lower())
    return f"{CACHE_PREFIX}{safe_name}_cache.json"


def upload_blob(
    blob_name: str,
    data: str,
    container_name: str = cache_blob_name,
    overwrite: bool = False
) -> None:

    container_client = create_container_if_not_exists(container_name)
    blob_client: BlobClient = container_client.get_blob_client(blob_name)

    try:
        blob_client.upload_blob(data, overwrite=overwrite)
        logger.info("Blob '%s' uploaded successfully.", blob_name)
    except ResourceExistsError:
        if not overwrite:
            logger.info("Blob '%s' already exists, upload ignored.", blob_name)
        else:
            raise


def download_blob(blob_name: str, container_name: str = cache_blob_name) -> Optional[str]:
    container_client = create_container_if_not_exists(container_name)
    blob_client: BlobClient = container_client.get_blob_client(blob_name)

    if not blob_client.exists():
        logger.info("Blob '%s' does not exist.", blob_name)
        return None

    data = blob_client.download_blob().readall()
    return data.decode("utf-8")


def delete_blob(blob_name: str, container_name: str = cache_blob_name) -> None:
    container_client = create_container_if_not_exists(container_name)
    blob_client: BlobClient = container_client.get_blob_client(blob_name)

    if blob_client.exists():
        blob_client.delete_blob()
        logger.info("Blob '%s' deleted.", blob_name)


def list_blobs(container_name: str = cache_blob_name) -> List[str]:
    container_client = create_container_if_not_exists(container_name)
    return [b.name for b in container_client.list_blobs()]
