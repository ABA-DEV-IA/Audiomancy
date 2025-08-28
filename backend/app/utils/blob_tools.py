"""
blob_tools.py

Utilities for interacting with Azure Blob Storage for caching track data.
Includes safe filenames, optional overwrite control, and robust error handling.
All blobs are stored under a "cache/" prefix to allow lifecycle management.
"""

from typing import Optional, List
from azure.storage.blob import BlobServiceClient
from azure.core.exceptions import ResourceExistsError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# --- Configuration ---
cache_blob_name = settings.cache_blob_name
azure_storage_connection_string = settings.azure_storage_connection_string

if not azure_storage_connection_string:
    raise ValueError(
        "La variable AZURE_STORAGE_CONNECTION_STRING n'est pas définie dans le .env"
    )

blob_service_client = BlobServiceClient.from_connection_string(azure_storage_connection_string)

# --- Internal prefix for cache blobs ---
CACHE_PREFIX = "cache/"


def create_container_if_not_exists(container_name: str = cache_blob_name):
    """
    Ensure the container exists. Create it if it doesn't.
    
    Args:
        container_name (str): Name of the Azure Blob container.
    
    Returns:
        ContainerClient: The client for interacting with the container.
    """
    container_client = blob_service_client.get_container_client(container_name)
    try:
        container_client.get_container_properties()
    except Exception:
        container_client.create_container()
    return container_client


def generate_cache_filename(category: str) -> str:
    """
    Return a safe blob filename for a given music category or mood.
    Stored inside the "cache/" folder.
    
    Non-alphanumeric characters are replaced with underscores.
    
    Args:
        category (str): Music category or mood.
    
    Returns:
        str: Safe blob filename with "cache/" prefix.
    """
    safe_name = "".join(c if c.isalnum() else "_" for c in category.strip().lower())
    return f"{CACHE_PREFIX}{safe_name}_cache.json"


def upload_blob(
    blob_name: str,
    data: str,
    container_name: str = cache_blob_name,
    overwrite: bool = False
):
    """
    Upload a string as a blob inside the "cache/" folder, optionally preventing overwrite.
    Handles race conditions where the blob might exist concurrently.
    
    Args:
        blob_name (str): Name of the blob (must already include CACHE_PREFIX).
        data (str): String data to upload.
        container_name (str): Name of the container.
        overwrite (bool): Whether to overwrite existing blob. Defaults to False.
    """
    container_client = create_container_if_not_exists(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    try:
        blob_client.upload_blob(data, overwrite=overwrite)
        logger.info(f"Blob '{blob_name}' uploadé avec succès.")
    except ResourceExistsError:
        if not overwrite:
            logger.info(f"Le blob '{blob_name}' existe déjà, upload ignoré (exception capturée).")
        else:
            raise


def download_blob(blob_name: str, container_name: str = cache_blob_name) -> Optional[str]:
    """
    Download blob content as string.
    
    Args:
        blob_name (str): Name of the blob (must already include CACHE_PREFIX).
        container_name (str): Name of the container.
    
    Returns:
        Optional[str]: Blob content as string, or None if blob does not exist.
    """
    container_client = create_container_if_not_exists(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    if not blob_client.exists():
        logger.info(f"Le blob '{blob_name}' n'existe pas.")
        return None

    data = blob_client.download_blob().readall()
    return data.decode("utf-8")


def delete_blob(blob_name: str, container_name: str = cache_blob_name):
    """
    Delete a blob if it exists.
    
    Args:
        blob_name (str): Name of the blob (must already include CACHE_PREFIX).
        container_name (str): Name of the container.
    """
    container_client = create_container_if_not_exists(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    if blob_client.exists():
        blob_client.delete_blob()
        logger.info(f"Blob '{blob_name}' supprimé.")


def list_blobs(container_name: str = cache_blob_name) -> List[str]:
    """
    List all blob names in a container.
    
    Args:
        container_name (str): Name of the container.
    
    Returns:
        List[str]: List of blob names.
    """
    container_client = create_container_if_not_exists(container_name)
    return [b.name for b in container_client.list_blobs()]
