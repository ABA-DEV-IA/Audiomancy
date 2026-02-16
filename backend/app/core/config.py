"""Settings from .env with optional HashiCorp Vault overrides."""

import logging
import requests
from typing import Optional, List
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application configuration with Vault secret management."""

    # CORS
    allowed_origins: Optional[str] = None

    # Jamendo API
    jamendo_client_id: Optional[str] = None
    jamendo_url: Optional[str] = None

    # DeepSeek LLM
    deepseek_api_key: Optional[str] = None
    deepseek_base_url: Optional[str] = "https://api.deepseek.com"
    deepseek_model: Optional[str] = "deepseek-chat"
    deepseek_temperature: float = 0.0
    deepseek_max_tokens: int = 512

    # HashiCorp Vault
    vault_url: Optional[str] = None
    vault_token: Optional[str] = None
    vault_mount_path: str = "secrets"
    vault_path_prefix: str = "audiomancy/kv"

    # API security & docs
    api_key: Optional[str] = None
    swagger_on: bool = False

    # Frontend URL (used by scheduler to call /api/dailycategories)
    frontend_url: Optional[str] = "http://localhost:3000"

    # MongoDB
    mongo_host: Optional[str] = None
    mongo_port: Optional[str] = None
    mongo_username: Optional[str] = None
    mongo_password: Optional[str] = None
    mongo_db_name: Optional[str] = None

    # Internal cache for Vault secrets (avoids repeated network calls)
    _secrets_cache: dict = {}

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    def load_from_vault(self, force_reload: bool = False) -> None:  # pylint: disable=too-many-locals,too-many-branches,too-many-nested-blocks
        """Load secrets from Vault and cache them (skips if no vault_url/token)."""

        if not self.vault_url or not self.vault_token:
            logger.info("No Vault URL or token provided. Using .env values only.")
            return

        if self._secrets_cache and not force_reload:
            for key, value in self._secrets_cache.items():
                setattr(self, key, value)
            logger.info("Configuration loaded from Vault cache.")
            return

        try:
            headers = {'X-Vault-Token': self.vault_token}

            # Vault secrets are grouped by service, each containing multiple keys
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

            for secret_name, key_mappings in secret_config.items():
                try:
                    # Vault KV v2 API endpoint
                    if self.vault_path_prefix:
                        url = (
                            f"{self.vault_url}/v1/{self.vault_mount_path}/"
                            f"data/{self.vault_path_prefix}/{secret_name}"
                        )
                    else:
                        url = (
                            f"{self.vault_url}/v1/{self.vault_mount_path}/"
                            f"data/{secret_name}"
                        )
                    response = requests.get(url, headers=headers, timeout=5)

                    if response.status_code == 200:
                        data = response.json()
                        secret_data = data['data']['data']

                        for vault_key, settings_attr in key_mappings.items():
                            if (vault_key in secret_data and
                                    hasattr(self, settings_attr)):
                                value = secret_data[vault_key]
                                setattr(self, settings_attr, value)
                                new_cache[settings_attr] = value
                                logger.info(
                                    "Loaded '%s.%s' → '%s'",
                                    secret_name,
                                    vault_key,
                                    settings_attr
                                )
                            elif vault_key not in secret_data:
                                logger.warning(
                                    "Key '%s' not found in secret '%s'",
                                    vault_key,
                                    secret_name
                                )

                    elif response.status_code == 404:
                        logger.warning(
                            "Secret '%s' not found in Vault",
                            secret_name
                        )
                    else:
                        logger.warning(
                            "Failed to load '%s': HTTP %d",
                            secret_name,
                            response.status_code
                        )

                except requests.RequestException as error:
                    logger.warning(
                        "Failed to load secret '%s': %s",
                        secret_name,
                        error
                    )

            self._secrets_cache = new_cache
            logger.info(
                "Configuration successfully loaded from HashiCorp Vault "
                "(%d secrets).",
                len(new_cache)
            )

        except requests.RequestException as error:
            logger.warning("Failed to connect to HashiCorp Vault: %s", error)

    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        if self.allowed_origins:
            return [origin.strip() for origin in self.allowed_origins.split(",")]

        # Default values for local development
        return ["http://localhost:3000", "http://127.0.0.1:3000"]


settings = Settings()
settings.load_from_vault()
