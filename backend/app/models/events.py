from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    date = Column(DateTime(timezone=True), nullable=False)
    image_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    registration_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
