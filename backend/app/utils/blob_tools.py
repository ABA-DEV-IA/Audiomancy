"""
blob_tools.py (async)

Asynchronous utilities for interacting with Azure Blob Storage for caching track data.
Includes safe filenames, optional overwrite control, and robust error handling.
All blobs are stored under a "cache/" prefix to allow lifecycle management.
"""

import logging
from typing import Optional, List

from azure.storage.blob.aio import BlobServiceClient
from azure.core.exceptions import ResourceExistsError, ResourceNotFoundError

from app.core.config import settings

logger = logging.getLogger(__name__)

# --- Configuration ---
cache_blob_name = settings.cache_blob_name
azure_storage_connection_string = settings.azure_storage_connection_string

if not azure_storage_connection_string:
    raise ValueError(
        "AZURE_STORAGE_CONNECTION_STRING environment variable is not set"
    )

# --- Internal prefix for cache blobs ---
CACHE_PREFIX = "cache/"


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


async def create_container_if_not_exists(container_name: str = cache_blob_name):
    """
    Ensure the container exists. Create it if it doesn't.

    Args:
        container_name (str): Name of the Azure Blob container.

    Returns:
        ContainerClient: The client for interacting with the container.
    """
    async with BlobServiceClient.from_connection_string(azure_storage_connection_string) as client:
        container_client = client.get_container_client(container_name)
        try:
            await container_client.get_container_properties()
        except ResourceNotFoundError:
            await container_client.create_container()
        return container_client


async def upload_blob(
    blob_name: str,
    data: str,
    container_name: str = cache_blob_name,
    overwrite: bool = False
) -> None:
    """
    Upload a string as a blob inside the "cache/" folder, optionally preventing overwrite.
    Handles race conditions where the blob might exist concurrently.

    Args:
        blob_name (str): Name of the blob (must already include CACHE_PREFIX).
        data (str): String data to upload.
        container_name (str): Name of the container.
        overwrite (bool): Whether to overwrite existing blob. Defaults to False.
    """
    async with BlobServiceClient.from_connection_string(azure_storage_connection_string) as client:
        container_client = client.get_container_client(container_name)
        blob_client = container_client.get_blob_client(blob_name)

        try:
            await blob_client.upload_blob(data, overwrite=overwrite)
            logger.info("Blob '%s' uploaded successfully.", blob_name)
        except ResourceExistsError:
            if not overwrite:
                logger.info("Blob '%s' already exists, upload ignored.", blob_name)
            else:
                raise


async def download_blob(blob_name: str, container_name: str = cache_blob_name) -> Optional[str]:
    """
    Download blob content as string.

    Args:
        blob_name (str): Name of the blob (must already include CACHE_PREFIX).
        container_name (str): Name of the container.

    Returns:
        Optional[str]: Blob content as string, or None if blob does not exist.
    """
    async with BlobServiceClient.from_connection_string(azure_storage_connection_string) as client:
        container_client = client.get_container_client(container_name)
        blob_client = container_client.get_blob_client(blob_name)

        try:
            stream = await blob_client.download_blob()
            data = await stream.readall()
            return data.decode("utf-8")
        except ResourceNotFoundError:
            logger.info("Blob '%s' does not exist.", blob_name)
            return None


async def delete_blob(blob_name: str, container_name: str = cache_blob_name) -> None:
    """
    Delete a blob if it exists.

    Args:
        blob_name (str): Name of the blob (must already include CACHE_PREFIX).
        container_name (str): Name of the container.
    """
    async with BlobServiceClient.from_connection_string(azure_storage_connection_string) as client:
        container_client = client.get_container_client(container_name)
        blob_client = container_client.get_blob_client(blob_name)

        try:
            await blob_client.delete_blob()
            logger.info("Blob '%s' deleted.", blob_name)
        except ResourceNotFoundError:
            logger.info("Blob '%s' not found, nothing to delete.", blob_name)


async def list_blobs(container_name: str = cache_blob_name) -> List[str]:
    """
    List all blob names in a container.

    Args:
        container_name (str): Name of the container.

    Returns:
        List[str]: List of blob names.
    """
    async with BlobServiceClient.from_connection_string(azure_storage_connection_string) as client:
        container_client = client.get_container_client(container_name)
        return [b.name async for b in container_client.list_blobs()]
