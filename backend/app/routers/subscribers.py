from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Form, File, UploadFile, Header
from sqlalchemy.orm import Session
from typing import List, Optional
import base64
from app.database import get_db
from app.models.subscribers import Subscriber as SubscriberModel
from app.schemas.subscribers import Subscriber, SubscriberCreate
from app.services.email import send_welcome_email, send_bulk_newsletter
from app.config import settings

router = APIRouter(prefix="", tags=["subscribers"])

def verify_admin_key(x_admin_key: str = Header(...)):
    if x_admin_key != settings.secret_admin_key:
        raise HTTPException(status_code=403, detail="Forbidden: Invalid admin key")


@router.post("/subscribe", response_model=Subscriber)
def subscribe(
    sub: SubscriberCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    email_normalized = sub.email.strip().lower()
    db_sub = db.query(SubscriberModel).filter(SubscriberModel.email == email_normalized).first()
    if db_sub:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_sub = SubscriberModel(email=email_normalized)
    db.add(new_sub)
    db.commit()
    db.refresh(new_sub)
    
    # Send welcome email in background    
    background_tasks.add_task(send_welcome_email, sub.email)
    return new_sub

@router.get("/subscribers", response_model=List[Subscriber])
def get_subscribers(db: Session = Depends(get_db)):
    return db.query(SubscriberModel).all()

@router.post("/admin/send-newsletter")
async def send_newsletter(
    background_tasks: BackgroundTasks,
    subject: str = Form(...),
    body: str = Form(...),
    attachment: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    admin: None = Depends(verify_admin_key),
):
    subscribers = db.query(SubscriberModel).filter(SubscriberModel.is_active == True).all()
    emails = [sub.email for sub in subscribers]
    
    if not emails:
        return {"status": "ok", "message": "No active subscribers to mail."}

    attachment_data = None
    if attachment:
        try:
            content = await attachment.read()
            content_base64 = base64.b64encode(content).decode("utf-8")
            attachment_data = {
                "filename": attachment.filename,
                "content": content_base64
            }
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read attachment: {str(e)}")

    background_tasks.add_task(
        send_bulk_newsletter,
        emails,
        subject,
        body,
        attachment_data
    )

    return {"status": "ok", "message": f"Newsletter successfully queued for {len(emails)} subscribers."}

