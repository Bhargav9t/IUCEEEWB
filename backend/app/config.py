from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field
from typing import List, Optional


class Settings(BaseSettings):
    # Set this to a real Neon URL for production, leave as default for local SQLite dev
    neon_database_url: Optional[str] = None
    resend_api_key: str = ""
    secret_admin_key: str = "dev_secret"

    # Comma-separated list of allowed CORS origins.
    # Example: "https://myapp.vercel.app,https://preview-abc.vercel.app"
    frontend_url: str = "http://localhost:3000"

    @computed_field  # type: ignore[misc]
    @property
    def allowed_origins(self) -> List[str]:
        """Split frontend_url on commas so multiple origins are supported."""
        return [origin.strip() for origin in self.frontend_url.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
