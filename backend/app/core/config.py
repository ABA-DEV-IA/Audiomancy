"""
Application configuration module.

Loads application settings from environment variables via `.env` file for development
and optionally overrides them with secrets from Azure Key Vault in production.

This includes API keys, endpoints, and CORS configuration.

Attributes:
    settings (Settings): Singleton instance containing all loaded configuration values.
"""

from typing import Optional, List
from pydantic_settings import BaseSettings, SettingsConfigDict
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.core.exceptions import AzureError

def to_snake_case(name: str) -> str:
    """
    Convert a Key Vault secret name to a Python-friendly snake_case attribute name.

    Args:
        name (str): The secret name in Key Vault, e.g., "AZURE-OPENAI-API-KEY"

    Returns:
        str: The converted snake_case string, e.g., "azure_openai_api_key"
    """
    return name.lower().replace("-", "_")


class Settings(BaseSettings):
    """
    Application settings class using Pydantic BaseSettings.

    Loads values from `.env` for local development and can override with Azure Key Vault
    secrets when `azure_key_vault_url` is provided. Provides a property to get CORS origins
    as a list for FastAPI middleware.
    """

    # Comma-separated string for allowed CORS origins
    allowed_origins: Optional[str] = None

    # Example secrets and configuration values
    jamendo_client_id: Optional[str] = None
    azure_openai_api_key: Optional[str] = None
    azure_key_vault_url: Optional[str] = None
    deployment_name: Optional[str] = None
    endpoint_url: Optional[str] = None
    jamendo_url: Optional[str] = None
    speech_key: Optional[str] = None
    speech_region: Optional[str] = None
    azure_storage_connection_string: Optional[str] = None

    api_key: Optional[str] = None
    swagger_on: bool = False

    mongo_url: Optional[str] = None
    db_name: Optional[str] = None

    # Pydantic settings configuration: read from .env, ignore extra keys
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def load_from_key_vault(self) -> None:
        """
        Override settings with secrets from Azure Key Vault if available.

        Uses DefaultAzureCredential to authenticate with Managed Identity (in production)
        or developer credentials (if running locally with Azure CLI). Each secret in Key Vault
        is injected into the settings if the attribute exists.

        If no Key Vault URL is provided, falls back to .env values.
        """
        if not self.azure_key_vault_url:
            print("[INFO] No Key Vault URL provided. Using .env only.")
            return

        try:
            credential = DefaultAzureCredential()
            client = SecretClient(
                vault_url=self.azure_key_vault_url,
                credential=credential
            )

            for secret_props in client.list_properties_of_secrets():
                key = to_snake_case(secret_props.name)
                value = client.get_secret(secret_props.name).value
                if hasattr(self, key):
                    setattr(self, key, value)

            print("[INFO] Configuration successfully loaded from Azure Key Vault.")

        except AzureError as error:
            print(f"[WARNING] Could not load secrets from Key Vault: {error}")

    @property
    def cors_origins(self) -> List[str]:
        """
        Return allowed_origins as a list for CORSMiddleware.

        Handles dev/prod logic:
        - Dev: defaults to localhost if allowed_origins not set
        - Prod: must come from Key Vault or environment variable

        Returns:
            List[str]: List of allowed CORS origins
        """
        if self.allowed_origins:
            return [origin.strip() for origin in self.allowed_origins.split(",")]

        return ["http://localhost:3000", "http://127.0.0.1:3000"]


# Singleton instance to use throughout the application
settings = Settings()
settings.load_from_key_vault()
