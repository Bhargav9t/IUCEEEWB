from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JourneyNodeBase(BaseModel):
    node_id: str
    date: str
    title: str
    desc: str
    icon: str
    image: Optional[str] = None
    link: Optional[str] = None
    sort_order: Optional[int] = 0

class JourneyNodeCreate(JourneyNodeBase):
    pass

class JourneyNode(JourneyNodeBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}
