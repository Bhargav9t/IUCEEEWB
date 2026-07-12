from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: datetime
    image_url: Optional[str] = None
    location: Optional[str] = None
    registration_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
