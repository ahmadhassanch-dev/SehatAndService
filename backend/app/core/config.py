from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    APP_NAME: str = "Sehat & Service API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str = "sehat-service-secret-key-2024-pakistan" # Should be set via env in prod
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30 * 24 * 60  # 30 days
    
    # Database - Handle both sync and async URLs, prefer environment variable
    DATABASE_URL: str = "postgresql+asyncpg://postgres:Hassan%408264@localhost/sehat_service"
   
    # Redis
    REDIS_URL: Optional[str] = None
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"] # Allow all for convenience in MVP, restrict in high-security prod
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()