from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.events import Event as EventModel
from app.schemas.events import Event, EventCreate
from app.config import settings

router = APIRouter(tags=["events"])

def verify_admin_key(x_admin_key: str = Header(...)):
    if x_admin_key != settings.secret_admin_key:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid admin key")

@router.post("/admin/events", response_model=Event)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    admin: None = Depends(verify_admin_key),
):
    db_event = EventModel(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.get("/events", response_model=List[Event])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return (
        db.query(EventModel)
        .filter(EventModel.date >= datetime.now(timezone.utc))
        .order_by(EventModel.date.asc())
        .offset(skip)
        .limit(limit)
        .all()
    )
