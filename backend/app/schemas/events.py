from pydantic import BaseModel, model_validator
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    image_url: Optional[str] = None
    location: Optional[str] = None
    registration_url: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    external_url: Optional[str] = None
    externalUrl: Optional[str] = None
    is_featured: Optional[bool] = False
    isFeatured: Optional[bool] = False

    @model_validator(mode="before")
    @classmethod
    def sync_aliases(cls, data):
        if isinstance(data, dict):
            # Resolve externalUrl / external_url
            ext_url = data.get("external_url") or data.get("externalUrl")
            data["external_url"] = ext_url
            data["externalUrl"] = ext_url

            # Resolve isFeatured / is_featured
            featured = data.get("is_featured") if data.get("is_featured") is not None else data.get("isFeatured", False)
            data["is_featured"] = bool(featured)
            data["isFeatured"] = bool(featured)
        elif hasattr(data, "__dict__"):
            ext_url = getattr(data, "external_url", None) or getattr(data, "externalUrl", None)
            featured = bool(getattr(data, "is_featured", False) or getattr(data, "isFeatured", False))
            setattr(data, "external_url", ext_url)
            setattr(data, "externalUrl", ext_url)
            setattr(data, "is_featured", featured)
            setattr(data, "isFeatured", featured)
        return data

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    created_at: datetime

    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }
