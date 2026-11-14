import os
import sys

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))  # app/core
APP_DIR = os.path.dirname(CURRENT_DIR)                    # app
BACKEND_DIR = os.path.dirname(APP_DIR)                    # backend
ENV_PATH = os.path.join(BACKEND_DIR, ".env")

# Ensure site-packages from local Python installs are accessible if needed
for p in [r"D:\Anaconda\Lib\site-packages", r"D:\Python\Lib\site-packages"]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.append(p)

from typing import List, Any
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=ENV_PATH,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "ROSS-SEARCH API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Security & JWT
    SECRET_KEY: str = "CHANGE_ME_TO_A_STRONG_RANDOM_SECRET_KEY"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # PostgreSQL Database Configuration (Production Target)
    # Default is configured from .env (e.g., sqlite:///./ross_search.db for dev, postgresql://... for prod)
    DATABASE_URL: str = "sqlite:///./ross_search.db"

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://localhost:5173,https://kalonakre.github.io,https://ross-search.onrender.com,https://ross-search-api.onrender.com"

    @field_validator("DEBUG", mode="before")
    @classmethod
    def parse_debug(cls, v: Any) -> bool:
        """Handle strings like 'release', 'debug', 'true', '1' safely."""
        if isinstance(v, str):
            return v.strip().lower() in ("true", "1", "t", "yes", "debug")
        return bool(v)

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]


settings = Settings()
