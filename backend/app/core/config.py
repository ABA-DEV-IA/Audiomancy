"""
Application configuration module.

Uses Pydantic Settings to load environment variables, such as the Jamendo 
API client ID,from a `.env` file. Optionally, it can override them with 
values from Azure Key Vault, if AZURE_KEY_VAULT_URL is provided.

Attributes:
    settings (Settings): Singleton instance containing all loaded configuration values.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.core.exceptions import AzureError

def to_snake_case(name: str) -> str:
    """
    Convert a Key Vault secret name to snake_case for Python attributes.
    Examples:
        "AZURE-OPENAI-API-KEY" -> "azure_openai_api_key"
        "jamendo-client-id" -> "jamendo_client_id"
    """
    return name.lower().replace("-", "_")


class Settings(BaseSettings):
    """
    Application settings loaded from .env , Cors and optionally from Azure Key Vault.
    """

    # CORS configuration
    allowed_origins : list[str] = [
        "http://localhost:3000",  # Default React local address
        "http://127.0.0.1:3000",  # Alternate localhost
        "audiomancy.azurewebsites.net",
        # Add other allowed URLs here (e.g. production URLs)
    ]

    # Example fields
    jamendo_client_id: Optional[str] = None
    azure_openai_api_key: Optional[str] = None
    azure_key_vault_url: Optional[str] = None
    deployment_name: Optional[str] = None
    endpoint_url: Optional[str] = None
    jamendo_url: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def load_from_key_vault(self) -> None:
        """
        Override settings with values from Azure Key Vault if available.
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

            # Loop through all secrets in the vault
            for secret_props in client.list_properties_of_secrets():
                key = to_snake_case(secret_props.name)
                value = client.get_secret(secret_props.name).value

                # Dynamically inject into settings if field exists
                if hasattr(self, key):
                    setattr(self, key, value)

            print("[INFO] Configuration successfully loaded from Azure Key Vault.")

        except AzureError as error:
            print(f"[WARNING] Could not load secrets from Key Vault: {error}")


# Singleton instance
settings = Settings()
settings.load_from_key_vault()
