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


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables or Azure Key Vault.
    """
    jamendo_client_id: str = ""  # ✅ snake_case to conform with Pylint
    azure_key_vault_url: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    def load_from_key_vault(self) -> None:
        """
        Override config values with secrets from Azure Key Vault,
        if AZURE_KEY_VAULT_URL is set.
        """
        if not self.azure_key_vault_url:
            print("[INFO] No Key Vault URL provided. Using .env only.")
            return

        try:
            credential = DefaultAzureCredential()
            client = SecretClient(vault_url=self.azure_key_vault_url, credential=credential)

            # Fetch secrets from Key Vault
            self.jamendo_client_id = (
                client.get_secret("jamendo").value or self.jamendo_client_id
            )

            print("[INFO] Configuration loaded from Azure Key Vault.")

        except Exception as error:  # ✅ Avoid catching base `Exception`
            print(f"[WARNING] Could not load secrets from Key Vault: {error}")

settings = Settings()
settings.load_from_key_vault()
