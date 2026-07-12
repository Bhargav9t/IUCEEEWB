from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class JourneyNode(Base):
    __tablename__ = "journey_nodes"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, index=True, nullable=False, unique=True)
    date = Column(String, nullable=False)
    title = Column(String, nullable=False)
    desc = Column(Text, nullable=False)
    icon = Column(String, nullable=False)
    image = Column(String, nullable=True)
    link = Column(String, nullable=True)
    sort_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
