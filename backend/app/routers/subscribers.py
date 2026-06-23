from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.subscribers import Subscriber as SubscriberModel
from app.schemas.subscribers import Subscriber, SubscriberCreate
from app.services.email import send_welcome_email

router = APIRouter(prefix="", tags=["subscribers"])


@router.post("/subscribe", response_model=Subscriber)
def subscribe(
    sub: SubscriberCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    db_sub = db.query(SubscriberModel).filter(SubscriberModel.email == sub.email).first()
    if db_sub:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_sub = SubscriberModel(email=sub.email)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    
    # Send welcome email in background    
    background_tasks.add_task(send_welcome_email, sub.email)
    return new_sub

@router.get("/subscribers", response_model=List[Subscriber])
def get_subscribers(db: Session = Depends(get_db)):
    return db.query(SubscriberModel).all()
