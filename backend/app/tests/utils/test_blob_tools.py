# ⚠️ DEPRECATED - azure_only_no_longer_usable_in_localhost
# Tests pour blob_tools.py (Azure Blob Storage) - module désactivé
# Cache migré vers MongoDB local (voir test_cache_tools.py si créé)

import pytest
from unittest.mock import patch, MagicMock

azure_core = pytest.importorskip("azure.core", reason="Azure SDK non installé — tests Azure skippés")
from azure.core.exceptions import ResourceNotFoundError, ResourceExistsError
from app.utils import blob_tools


class TestGenerateCacheFilename:
    def test_safe_filename(self):
        category = "Rock & Roll!"
        filename = blob_tools.generate_cache_filename(category)
        assert filename.startswith("cache/")
        assert "__" in filename
        assert filename.endswith("_cache.json")


@patch("app.utils.blob_tools.get_blob_service_client")
class TestBlobOperations:
    def test_create_container_if_not_exists(self, mock_get_client):
        mock_container_client = MagicMock()
        mock_get_client.return_value.get_container_client.return_value = mock_container_client
        # Simulate container does not exist
        mock_container_client.get_container_properties.side_effect = ResourceNotFoundError("Not found")
        blob_tools.create_container_if_not_exists("test-container")
        mock_container_client.create_container.assert_called_once()

    def test_upload_blob_overwrite_false(self, mock_get_client):
        mock_container_client = MagicMock()
        mock_get_client.return_value.get_container_client.return_value = mock_container_client
        mock_blob_client = MagicMock()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        # Simulate blob already exists
        mock_blob_client.upload_blob.side_effect = ResourceExistsError("Already exists")
        # Should not raise when overwrite=False
        blob_tools.upload_blob("cache/test.json", "data", overwrite=False)

    def test_download_blob_returns_none_if_not_exists(self, mock_get_client):
        mock_container_client = MagicMock()
        mock_get_client.return_value.get_container_client.return_value = mock_container_client
        mock_blob_client = MagicMock()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        mock_blob_client.exists.return_value = False

        result = blob_tools.download_blob("cache/test.json")
        assert result is None

    def test_delete_blob_calls_delete(self, mock_get_client):
        mock_container_client = MagicMock()
        mock_get_client.return_value.get_container_client.return_value = mock_container_client
        mock_blob_client = MagicMock()
        mock_container_client.get_blob_client.return_value = mock_blob_client
        mock_blob_client.exists.return_value = True

        blob_tools.delete_blob("cache/test.json")
        mock_blob_client.delete_blob.assert_called_once()

    def test_list_blobs_returns_names(self, mock_get_client):
        mock_container_client = MagicMock()
        mock_get_client.return_value.get_container_client.return_value = mock_container_client
        mock_blob1 = MagicMock()
        mock_blob2 = MagicMock()
        mock_container_client.list_blobs.return_value = [mock_blob1, mock_blob2]
        mock_blob1.name = "blob1"
        mock_blob2.name = "blob2"

        result = blob_tools.list_blobs()
        assert result == ["blob1", "blob2"]
