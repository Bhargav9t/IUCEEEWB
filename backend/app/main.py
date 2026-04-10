from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine

# Import models so SQLAlchemy registers them with Base before create_all
import app.models.events       # noqa: F401
import app.models.subscribers  # noqa: F401

# Auto-create tables on startup (idempotent — safe to run repeatedly)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IUCEE-EWB HITAM Backend",
    description="Dedicated API for managing dynamic content, events, and subscribers.",
    version="1.0.0",
)

# CORS — reads from FRONTEND_URLS env var (comma-separated list of allowed origins)
origins = settings.allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

from app.routers import events, subscribers  # noqa: E402

app.include_router(events.router)
app.include_router(subscribers.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "IUCEE-EWB HITAM API is running"}
