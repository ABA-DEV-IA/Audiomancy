"""
blob_tools.py

⚠️ DEPRECATED - azure_only_no_longer_usable_in_localhost

Ce module Azure Blob Storage n'est plus utilisable en environnement localhost.
Le cache a été migré vers MongoDB local (voir cache_tools.py).

Utilities for interacting with Azure Blob Storage for caching track data.
Provides safe filenames, optional overwrite control, and robust error handling.
All blobs are stored under a "cache/" prefix to allow lifecycle management.

Key functions:
- generate_cache_filename: Create safe blob filenames for categories or moods.
- create_container_if_not_exists: Ensure a container exists, create if missing.
- upload_blob: Upload string data to a blob with optional overwrite.
- download_blob: Download blob content as string.
- delete_blob: Delete a blob if it exists.
- list_blobs: List all blob names in a container.
"""

import logging
from typing import Optional, List

logger = logging.getLogger(__name__)

# ============================================================================
# ⚠️ AZURE BLOB STORAGE — DÉSACTIVÉ (localhost uniquement)
# ============================================================================
# Ce module est désactivé en environnement localhost.
# Le cache utilise MongoDB local (voir cache_tools.py).
# Ce fichier sera supprimé dans une branche git dédiée au nettoyage Azure.
# ============================================================================

_AZURE_AVAILABLE = False
cache_blob_name = None
azure_storage_connection_string = None

try:
    from azure.storage.blob import BlobServiceClient, ContainerClient, BlobClient
    from azure.core.exceptions import ResourceExistsError, ResourceNotFoundError
    from app.core.config import settings

    cache_blob_name = getattr(settings, 'cache_blob_name', None)
    azure_storage_connection_string = getattr(settings, 'azure_storage_connection_string', None)

    if azure_storage_connection_string and cache_blob_name:
        _AZURE_AVAILABLE = True
        logger.info("[DEPRECATED] Azure Blob Storage available but deprecated. Use cache_tools.py.")
    else:
        logger.info("[DEPRECATED] Azure Blob Storage disabled (no connection string).")
except ImportError:
    logger.info("[DEPRECATED] Azure Blob Storage SDK not installed. Module disabled.")


def _check_azure() -> None:
    """Guard: vérifie que Azure Blob Storage est disponible. Lève RuntimeError sinon."""
    if not _AZURE_AVAILABLE:
        raise RuntimeError(
            "Azure Blob Storage est désactivé en localhost. "
            "Utilisez cache_tools.py (MongoDB) à la place."
        )


def get_blob_service_client():
    """
    Return a new instance of BlobServiceClient from the connection string.

    Returns:
        BlobServiceClient: Client to interact with Azure Blob Storage.

    Raises:
        RuntimeError: If Azure Blob Storage is not available.
    """
    _check_azure()
    return BlobServiceClient.from_connection_string(azure_storage_connection_string)


# --- Internal prefix for cache blobs ---
CACHE_PREFIX = "cache/"


def create_container_if_not_exists(container_name: str = None):
    _check_azure()
    if container_name is None:
        container_name = cache_blob_name
    # Original signature preserved below
    # def create_container_if_not_exists(container_name: str = cache_blob_name) -> ContainerClient:
    """
    Ensure the specified container exists; create it if it does not.

    Args:
        container_name (str): Name of the Azure Blob container.

    Returns:
        ContainerClient: Client for interacting with the container.

    Notes:
        - If the container already exists, no action is taken.
        - Raises exceptions if creation fails due to permissions or network errors.
    """
    container_client = get_blob_service_client().get_container_client(container_name)
    try:
        container_client.get_container_properties()
    except ResourceNotFoundError:
        container_client.create_container()
        logger.info("Container '%s' created.", container_name)
    return container_client


def generate_cache_filename(category: str) -> str:
    """
    Generate a safe blob filename for a given category or mood.

    Args:
        category (str): Music category or mood name.

    Returns:
        str: Safe blob filename with "cache/" prefix, e.g., "cache/rock_roll_cache.json".

    Notes:
        - Converts all characters to lowercase.
        - Non-alphanumeric characters are replaced with underscores.
    """
    safe_name = "".join(c if c.isalnum() else "_" for c in category.strip().lower())
    return f"{CACHE_PREFIX}{safe_name}_cache.json"


def upload_blob(
    blob_name: str,
    data: str,
    container_name: str = None,
    overwrite: bool = False
) -> None:
    _check_azure()
    if container_name is None:
        container_name = cache_blob_name
    """
    Upload string data to a blob in the specified container.

    Args:
        blob_name (str): Name of the blob (should include CACHE_PREFIX).
        data (str): String data to upload.
        container_name (str): Name of the Azure Blob container.
        overwrite (bool): Whether to overwrite an existing blob. Defaults to False.

    Raises:
        ResourceExistsError: If the blob exists and overwrite=False.
    """
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


def download_blob(blob_name: str, container_name: str = None) -> Optional[str]:
    _check_azure()
    if container_name is None:
        container_name = cache_blob_name
    """
    Download blob content as a string.

    Args:
        blob_name (str): Name of the blob (should include CACHE_PREFIX).
        container_name (str): Name of the container.

    Returns:
        Optional[str]: Blob content as string, or None if the blob does not exist.
    """
    container_client = create_container_if_not_exists(container_name)
    blob_client: BlobClient = container_client.get_blob_client(blob_name)

    if not blob_client.exists():
        logger.info("Blob '%s' does not exist.", blob_name)
        return None

    data = blob_client.download_blob().readall()
    return data.decode("utf-8")


def delete_blob(blob_name: str, container_name: str = None) -> None:
    _check_azure()
    if container_name is None:
        container_name = cache_blob_name
    """
    Delete a blob if it exists.

    Args:
        blob_name (str): Name of the blob (should include CACHE_PREFIX).
        container_name (str): Name of the container.

    Notes:
        - No error is raised if the blob does not exist.
    """
    container_client = create_container_if_not_exists(container_name)
    blob_client: BlobClient = container_client.get_blob_client(blob_name)

    if blob_client.exists():
        blob_client.delete_blob()
        logger.info("Blob '%s' deleted.", blob_name)


def list_blobs(container_name: str = None) -> List[str]:
    _check_azure()
    if container_name is None:
        container_name = cache_blob_name
    """
    List all blob names in a container.

    Args:
        container_name (str): Name of the container.

    Returns:
        List[str]: List of blob names.
    """
    container_client = create_container_if_not_exists(container_name)
    return [b.name for b in container_client.list_blobs()]
