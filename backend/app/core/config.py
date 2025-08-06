"""
Application configuration module.

Uses Pydantic Settings to load environment variables, such as the Jamendo API client ID,
from a `.env` file. This configuration is shared across the application.

Attributes:
    settings (Settings): Singleton instance containing all loaded environment variables.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    JAMENDO_CLIENT_ID: str

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
