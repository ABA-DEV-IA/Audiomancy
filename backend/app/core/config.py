"""
Application configuration module.

This module is responsible for loading and managing application configuration
values. It supports:

- Loading configuration from environment variables (via a `.env` file)
  for local development.
- Overriding configuration values with secrets stored in Azure Key Vault
  in production environments.
- In-memory caching of secrets to avoid repeated calls to Azure Key Vault.

This design allows the application to remain cloud-agnostic while ensuring
secure secret management and clean separation of concerns.
"""

from typing import Optional, List, Any
from pydantic_settings import BaseSettings, SettingsConfigDict
from datetime import datetime, timedelta

# Azure imports désactivés - Uniquement si Key Vault est utilisé
# from azure.identity import DefaultAzureCredential
# from azure.keyvault.secrets import SecretClient
# from azure.core.exceptions import AzureError


class TokenCredential:
    """
    Simple token-based credential for Azure Key Vault authentication.

    This credential class wraps a static bearer token for use with
    Azure Key Vault when using token-based authentication instead of
    DefaultAzureCredential.
    """
    def __init__(self, token: str):
        self.token = token

    def get_token(self, *scopes: str, **kwargs: Any):
        """
        Return the access token with a far future expiration.

        Args:
            *scopes: The scopes for which the token is valid (ignored).
            **kwargs: Additional arguments (ignored).

        Returns:
            AccessToken: An access token object with the bearer token.
        """
        from azure.core.credentials import AccessToken
        # Set expiration to 1 year in the future
        expires_on = datetime.now() + timedelta(days=365)
        return AccessToken(self.token, int(expires_on.timestamp()))


def to_snake_case(name: str) -> str:
    """
    Convert a Key Vault secret name to a Python-friendly snake_case attribute name.

    Azure Key Vault secrets are typically named using uppercase letters
    and hyphens (e.g. "DEEPSEEK-API-KEY"). This helper converts them to
    snake_case so they can be mapped to Pydantic settings attributes.

    Args:
        name (str): The secret name from Azure Key Vault.

    Returns:
        str: The converted snake_case string.
    """
    return name.lower().replace("-", "_")


class Settings(BaseSettings):
    """
    Application settings class.

    This class defines all configuration values used by the application.
    Values are loaded in the following order:

    1. Environment variables (via `.env` file in development).
    2. Azure Key Vault secrets (if `azure_key_vault_url` is provided).

    Secrets loaded from Azure Key Vault are cached in memory to avoid
    unnecessary network calls during the application's lifetime.
    """

    # ------------------------------------------------------------------
    # 🌐 CORS CONFIGURATION
    # ------------------------------------------------------------------
    allowed_origins: Optional[str] = None

    # ------------------------------------------------------------------
    # 🎵 JAMENDO API CONFIGURATION
    # ------------------------------------------------------------------
    jamendo_client_id: Optional[str] = None
    jamendo_url: Optional[str] = None

    # ------------------------------------------------------------------
    # 🧠 DEEPSEEK LLM CONFIGURATION
    # ------------------------------------------------------------------
    deepseek_api_key: Optional[str] = None
    deepseek_base_url: Optional[str] = "https://api.deepseek.com"
    """
    deepseek_api_key:
        Secret API key used to authenticate requests to the DeepSeek API.

    deepseek_base_url:
        Base URL for the DeepSeek API. This is optional and can be overridden
        in case of proxying, self-hosted deployments, or future API changes.
    """

    deepseek_model: Optional[str] = "deepseek-chat"
    """
    deepseek_model:
        Name of the DeepSeek model used for chat completion.
        Default is "deepseek-chat".
    """

    deepseek_temperature: float = 0.0
    """
    deepseek_temperature:
        Sampling temperature for the model.
        - 0.0 → deterministic output (recommended for ReAct agents)
        - Higher values → more creative but less predictable
    """

    deepseek_max_tokens: int = 512
    """
    deepseek_max_tokens:
        Maximum number of tokens generated in the response.
        This acts as a hard limit to control cost and response size.
    """

    # ------------------------------------------------------------------
    # 🎤 SPEECH / AUDIO SERVICES [DÉSACTIVÉ - Migration hors Azure]
    # ------------------------------------------------------------------
    # speech_key: Optional[str] = None
    # speech_region: Optional[str] = None

    # ------------------------------------------------------------------
    # ☁️ AZURE INFRASTRUCTURE [PARTIELLEMENT DÉSACTIVÉ]
    # ------------------------------------------------------------------
    azure_key_vault_url: Optional[str] = None  # Optionnel: utiliser .env en local
    vault_token: Optional[str] = None  # Token pour authentification vault
    # azure_storage_connection_string: Optional[str] = None  # Remplacé par MongoDB cache
    # cache_blob_name: Optional[str] = None  # Remplacé par MongoDB cache

    # ------------------------------------------------------------------
    # 📊 OBSERVABILITY / MONITORING
    # ------------------------------------------------------------------
    azure_appinsights_connection_string: Optional[str] = None

    # ------------------------------------------------------------------
    # 🔐 API SECURITY & DOCUMENTATION
    # ------------------------------------------------------------------
    api_key: Optional[str] = None
    swagger_on: bool = False

    # ------------------------------------------------------------------
    # 🌐 FRONTEND URL (for scheduler calls)
    # ------------------------------------------------------------------
    frontend_url: Optional[str] = "http://localhost:3000"
    """
    frontend_url:
        URL of the frontend application. Used by APScheduler to call
        frontend API routes like /api/dailycategories.
        Default: http://localhost:3000
    """

    # ------------------------------------------------------------------
    # 🗄️ DATABASE (MONGODB)
    # ------------------------------------------------------------------
    mongo_host: Optional[str] = None
    mongo_port: Optional[str] = None
    mongo_username: Optional[str] = None
    mongo_password: Optional[str] = None
    mongo_db_name: Optional[str] = None

    # ------------------------------------------------------------------
    # 🔒 INTERNAL CACHE (KEY VAULT SECRETS)
    # ------------------------------------------------------------------
    _secrets_cache: dict = {}

    # ------------------------------------------------------------------
    # ⚙️ PYDANTIC SETTINGS CONFIGURATION
    # ------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    def load_from_key_vault(self, force_reload: bool = False) -> None:
        """
        Load and override configuration values from Azure Key Vault.

        If `azure_key_vault_url` is not provided, this method does nothing
        and the application relies solely on environment variables.

        Secrets retrieved from Azure Key Vault are:
        - Automatically converted to snake_case
        - Applied only if a corresponding attribute exists in this class
        - Cached in memory to avoid repeated calls

        Args:
            force_reload (bool): If True, forces a reload of secrets
                                 from Azure Key Vault even if cached.
        """

        if not self.azure_key_vault_url:
            print("[INFO] No Azure Key Vault URL provided. Using .env values only.")
            return

        # Vérifier si les modules Azure sont disponibles
        try:
            from azure.identity import DefaultAzureCredential
            from azure.keyvault.secrets import SecretClient
            from azure.core.exceptions import AzureError
        except ImportError:
            print("[WARNING] Azure SDK not installed. Install azure-identity and azure-keyvault-secrets to use Key Vault.")
            print("[INFO] Using .env values only.")
            return

        if self._secrets_cache and not force_reload:
            for key, value in self._secrets_cache.items():
                setattr(self, key, value)
            print("[INFO] Configuration loaded from Key Vault cache.")
            return

        try:
            # Choisir le credential en fonction de la présence du token
            if self.vault_token:
                credential = TokenCredential(self.vault_token)
                print("[INFO] Using token-based authentication for Key Vault.")
            else:
                credential = DefaultAzureCredential()
                print("[INFO] Using DefaultAzureCredential for Key Vault.")

            client = SecretClient(
                vault_url=self.azure_key_vault_url,
                credential=credential
            )

            # Mapping des noms de secrets du vault vers les attributs Settings
            secret_mapping = {
                # DeepSeek configuration
                'deepseek': 'deepseek_api_key',
                'deepseek-base-url': 'deepseek_base_url',
                'deepseek-model': 'deepseek_model',
                'deepseek-temperature': 'deepseek_temperature',
                'deepseek-max-tokens': 'deepseek_max_tokens',

                # MongoDB configuration
                'mongodb-host': 'mongo_host',
                'mongodb-port': 'mongo_port',
                'mongodb-db-name': 'mongo_db_name',

                # Jamendo configuration
                'jamendo': 'jamendo_client_id',

                # API Security
                'api-key': 'api_key',
                'apikey': 'api_key',
            }

            new_cache = {}

            for secret_props in client.list_properties_of_secrets():
                secret_name = secret_props.name.lower()

                # Utiliser le mapping si disponible, sinon convertir en snake_case
                if secret_name in secret_mapping:
                    key = secret_mapping[secret_name]
                else:
                    key = to_snake_case(secret_props.name)

                # Only apply secrets that exist in the Settings model
                if hasattr(self, key):
                    value = client.get_secret(secret_props.name).value
                    setattr(self, key, value)
                    new_cache[key] = value
                    print(f"[INFO] Loaded secret '{secret_props.name}' → '{key}'")

            self._secrets_cache = new_cache
            print(f"[INFO] Configuration successfully loaded from Azure Key Vault ({len(new_cache)} secrets).")

        except Exception as error:
            print(f"[WARNING] Failed to load secrets from Azure Key Vault: {error}")

    @property
    def cors_origins(self) -> List[str]:
        """
        Return allowed CORS origins as a list.

        This property converts the comma-separated `allowed_origins`
        string into a list compatible with FastAPI's CORSMiddleware.

        Returns:
            List[str]: List of allowed CORS origins.
        """
        if self.allowed_origins:
            return [origin.strip() for origin in self.allowed_origins.split(",")]

        # Default values for local development
        return ["http://localhost:3000", "http://127.0.0.1:3000"]


# ----------------------------------------------------------------------
# 📦 SINGLETON SETTINGS INSTANCE
# ----------------------------------------------------------------------
settings = Settings()
settings.load_from_key_vault()
