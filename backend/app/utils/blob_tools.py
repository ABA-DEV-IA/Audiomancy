import os
from azure.storage.blob import BlobServiceClient
from app.core.config import settings

CONTAINER_NAME = "cache-audiomancy"
AZURE_CONNECTION_STRING = settings.azure_storage_connection_string

if not AZURE_CONNECTION_STRING:
    raise ValueError("La variable AZURE_STORAGE_CONNECTION_STRING n'est pas définie dans le .env")

blob_service_client = BlobServiceClient.from_connection_string(AZURE_CONNECTION_STRING)


def create_container_if_not_exists(container_name: str = CONTAINER_NAME):
    container_client = blob_service_client.get_container_client(container_name)
    try:
        container_client.get_container_properties()
    except Exception:
        container_client.create_container()
    return container_client


def upload_blob(blob_name: str, data: str, container_name: str = CONTAINER_NAME):
    """Upload a string as a blob only if it does not exist already."""
    container_client = create_container_if_not_exists(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    if blob_client.exists():
        print(f"Le blob '{blob_name}' existe déjà, upload ignoré.")
        return

    blob_client.upload_blob(data)
    print(f"Blob '{blob_name}' uploadé avec succès.")


def download_blob(blob_name: str, container_name: str = CONTAINER_NAME) -> str:
    container_client = create_container_if_not_exists(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    if not blob_client.exists():
        print(f"Le blob '{blob_name}' n'existe pas.")
        return ""

    data = blob_client.download_blob().readall()
    return data.decode("utf-8")


def delete_blob(blob_name: str, container_name: str = CONTAINER_NAME):
    container_client = create_container_if_not_exists(container_name)
    blob_client = container_client.get_blob_client(blob_name)

    if blob_client.exists():
        blob_client.delete_blob()
        print(f"Blob '{blob_name}' supprimé.")


def list_blobs(container_name: str = CONTAINER_NAME):
    container_client = create_container_if_not_exists(container_name)
    return [b.name for b in container_client.list_blobs()]


# --- Nouvelle fonction pour générer un nom de cache à partir d'une valeur ---
def generate_cache_filename(category: str) -> str:
    """Return a safe blob filename for a given music category or mood."""
    safe_name = category.strip().lower().replace(" ", "_")
    return f"{safe_name}_cache.json"
