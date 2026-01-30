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

from typing import Optional, List
from pydantic_settings import BaseSettings, SettingsConfigDict
import requests


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
    # ☁️ VAULT CONFIGURATION
    # ------------------------------------------------------------------
    vault_url: Optional[str] = None  # URL du HashiCorp Vault
    vault_token: Optional[str] = None  # Token pour authentification vault
    vault_mount_path: str = "secrets"  # Mount path du KV engine
    vault_path_prefix: str = "audiomancy/kv"  # Préfixe du chemin des secrets

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

    def load_from_vault(self, force_reload: bool = False) -> None:
        """
        Load and override configuration values from HashiCorp Vault.

        If `vault_url` is not provided, this method does nothing
        and the application relies solely on environment variables.

        Secrets retrieved from HashiCorp Vault are:
        - Mapped using secret_mapping dictionary
        - Applied only if a corresponding attribute exists in this class
        - Cached in memory to avoid repeated calls

        Args:
            force_reload (bool): If True, forces a reload of secrets
                                 from Vault even if cached.
        """

        if not self.vault_url or not self.vault_token:
            print("[INFO] No Vault URL or token provided. Using .env values only.")
            return

        if self._secrets_cache and not force_reload:
            for key, value in self._secrets_cache.items():
                setattr(self, key, value)
            print("[INFO] Configuration loaded from Vault cache.")
            return

        try:
            # Headers pour l'authentification HashiCorp Vault
            headers = {
                'X-Vault-Token': self.vault_token
            }

            # Configuration des secrets groupés dans le Vault
            # Chaque secret contient plusieurs clés (structure groupée)
            secret_config = {
                'deepseek': {
                    'api_key': 'deepseek_api_key',
                    'base_url': 'deepseek_base_url',
                    'model': 'deepseek_model',
                    'temperature': 'deepseek_temperature',
                    'max-tokens': 'deepseek_max_tokens',
                },
                'mongoDB': {
                    'host': 'mongo_host',
                    'port': 'mongo_port',
                    'db_name': 'mongo_db_name',
                    'username': 'mongo_username',
                    'password': 'mongo_password',
                },
                'jamendo': {
                    'client_id': 'jamendo_client_id',
                    'url': 'jamendo_url',
                },
                'apikey': {
                    'api_key': 'api_key',
                    'swagger_on': 'swagger_on',
                    'allowed_origins': 'allowed_origins',
                },
            }

            new_cache = {}

            # Récupérer chaque secret groupé depuis HashiCorp Vault
            for secret_name, key_mappings in secret_config.items():
                try:
                    # HashiCorp Vault KV v2 API: /v1/{mount_path}/data/{path_prefix}/{secret_name}
                    # Construire l'URL en tenant compte du cas où vault_path_prefix est vide
                    if self.vault_path_prefix:
                        url = f"{self.vault_url}/v1/{self.vault_mount_path}/data/{self.vault_path_prefix}/{secret_name}"
                    else:
                        url = f"{self.vault_url}/v1/{self.vault_mount_path}/data/{secret_name}"
                    response = requests.get(url, headers=headers, timeout=5)

                    if response.status_code == 200:
                        data = response.json()
                        # KV v2 structure: data.data contient toutes les clés du secret
                        secret_data = data['data']['data']

                        # Extraire chaque clé du secret et la mapper à l'attribut Settings
                        for vault_key, settings_attr in key_mappings.items():
                            if vault_key in secret_data and hasattr(self, settings_attr):
                                value = secret_data[vault_key]
                                setattr(self, settings_attr, value)
                                new_cache[settings_attr] = value
                                print(f"[INFO] Loaded '{secret_name}.{vault_key}' → '{settings_attr}'")
                            elif vault_key not in secret_data:
                                print(f"[WARNING] Key '{vault_key}' not found in secret '{secret_name}'")

                    elif response.status_code == 404:
                        print(f"[WARNING] Secret '{secret_name}' not found in Vault")
                    else:
                        print(f"[WARNING] Failed to load '{secret_name}': HTTP {response.status_code}")

                except Exception as error:
                    print(f"[WARNING] Failed to load secret '{secret_name}': {error}")

            self._secrets_cache = new_cache
            print(f"[INFO] Configuration successfully loaded from HashiCorp Vault ({len(new_cache)} secrets).")

        except Exception as error:
            print(f"[WARNING] Failed to connect to HashiCorp Vault: {error}")

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
settings.load_from_vault()
