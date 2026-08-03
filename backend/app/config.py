from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import computed_field
from typing import List, Optional


class Settings(BaseSettings):
    # Set this to a real Neon URL for production, leave as default for local SQLite dev
    neon_database_url: Optional[str] = None
    resend_api_key: str = ""
    secret_admin_key: str = "dev_secret"
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    from_email: str = ""

    # Comma-separated list of allowed CORS origins.
    # Example: "https://myapp.vercel.app,https://preview-abc.vercel.app,*"
    frontend_url: str = "http://localhost:3000,http://127.0.0.1:3000,*"

    @computed_field  # type: ignore[misc]
    @property
    def sender_email(self) -> str:
        """Returns the configured from_email, or falls back to smtp_username if set."""
        if self.from_email and self.from_email != "onboarding@resend.dev":
            return self.from_email
        if self.smtp_username:
            return self.smtp_username
        return self.from_email or "onboarding@resend.dev"

    @computed_field  # type: ignore[misc]
    @property
    def allowed_origins(self) -> List[str]:
        """Split frontend_url on commas so multiple origins are supported."""
        return [origin.strip() for origin in self.frontend_url.split(",") if origin.strip()]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
