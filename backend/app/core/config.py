from pydantic import BaseSettings

class Settings(BaseSettings):
    JAMENDO_CLIENT_ID: str

    class Config:
        env_file = ".env"

settings = Settings()
