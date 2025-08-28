"""
blob_tools.py

Utilities for interacting with Azure Blob Storage for caching track data.
Includes safe filenames, optional overwrite control, and robust error handling.
"""

from typing import Optional, List
from azure.storage.blob import BlobServiceClient
from azure.core.exceptions import ResourceExistsError
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

# --- Configuration ---
CONTAINER_NAME = "cache-audiomancy"
AZURE_CONNECTION_STRING = settings.azure_storage_connection_string

if not AZURE_CONNECTION_STRING:
    raise ValueError(
        "La variable AZURE_STORAGE_CONNECTION_STRING n'est pas définie dans le .env"
    )

blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)


def create_container_if_not_exists(container_name: str = CONTAINER_NAME):
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
    
    Non-alphanumeric characters are replaced with underscores.
    
    Args:
        category (str): Music category or mood.
    
    Returns:
        str: Safe blob filename.
    """
    safe_name = "".join(c if c.isalnum() else "_" for c in category.strip().lower())
    return f"{safe_name}_cache.json"


def upload_blob(
    blob_name: str,
    data: str,
    container_name: str = CONTAINER_NAME,
    overwrite: bool = False
):
    """
    Upload a string as a blob, optionally preventing overwrite.
    Handles race conditions where the blob might exist concurrently.
    
    Args:
        blob_name (str): Name of the blob to upload.
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


def download_blob(blob_name: str, container_name: str = CONTAINER_NAME) -> Optional[str]:
    """
    Download blob content as string.
    
    Args:
        blob_name (str): Name of the blob to download.
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


def delete_blob(blob_name: str, container_name: str = CONTAINER_NAME):
    """
    Delete a blob if it exists.
    
    Args:
        blob_name (str): Name of the blob to delete.
        container_name (str): Name of the container.
    """
    container_client = create_container_if_not_exists(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    if blob_client.exists():
        blob_client.delete_blob()
        logger.info(f"Blob '{blob_name}' supprimé.")


def list_blobs(container_name: str = CONTAINER_NAME) -> List[str]:
    """
    List all blob names in a container.
    
    Args:
        container_name (str): Name of the container.
    
    Returns:
        List[str]: List of blob names.
    """
    container_client = create_container_if_not_exists(container_name)
    return [b.name for b in container_client.list_blobs()]
