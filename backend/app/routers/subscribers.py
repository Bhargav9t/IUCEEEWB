import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.subscribers import Subscriber as SubscriberModel
from app.schemas.subscribers import Subscriber, SubscriberCreate
from app.config import settings

router = APIRouter(prefix="", tags=["subscribers"])

def send_welcome_email(email: str):
    if not settings.smtp_username or not settings.smtp_password:
        print("[SMTP] Mail credentials not fully configured. Skipping welcome email.")
        return
    
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Welcome to IUCEE-EWB HITAM! ✨"
        msg['From'] = f"IUCEE-EWB HITAM <{settings.smtp_username}>"
        msg['To'] = email
        
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Welcome to IUCEE-EWB HITAM</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #fafafa;
                    color: #1f2937;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 40px auto;
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .header {
                    background-color: #059669;
                    padding: 32px;
                    text-align: center;
                }
                .header h1 {
                    color: #ffffff;
                    margin: 0;
                    font-size: 24px;
                    font-weight: 800;
                    letter-spacing: -0.025em;
                }
                .content {
                    padding: 32px;
                    line-height: 1.6;
                }
                .content p {
                    margin-top: 0;
                    margin-bottom: 16px;
                    font-size: 15px;
                }
                .accent-box {
                    background-color: #f0fdf4;
                    border-left: 4px solid #10b981;
                    padding: 16px;
                    border-radius: 4px;
                    margin: 24px 0;
                }
                .accent-box p {
                    margin: 0;
                    color: #065f46;
                    font-weight: 500;
                }
                .footer {
                    background-color: #f9fafb;
                    padding: 24px;
                    text-align: center;
                    border-top: 1px solid #f3f4f6;
                    font-size: 12px;
                    color: #6b7280;
                }
                .footer a {
                    color: #10b981;
                    text-decoration: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>IUCEE-EWB HITAM ✨</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>Thank you for subscribing to the official newsletter of the <strong>IUCEE-EWB HITAM</strong> student chapter!</p>
                    <div class="accent-box">
                        <p>We build sustainable, community-driven hardware and software engineering solutions that make a tangible difference in the real world.</p>
                    </div>
                    <p>From now on, you will receive our monthly updates including:</p>
                    <ul>
                        <li>Recaps of our latest deployed engineering projects</li>
                        <li>Invitations to upcoming campus and community events</li>
                        <li>Tech workshops, research highlights, and opportunities to get involved</li>
                    </ul>
                    <p>We are thrilled to have you join our journey of engineering for impact.</p>
                    <p>Best regards,<br><strong>The IUCEE-EWB HITAM Team</strong></p>
                </div>
                <div class="footer">
                    <p>© 2026 IUCEE-EWB HITAM. All rights reserved.</p>
                    <p>Sent on behalf of <a href="mailto:ewb@hitam.org">ewb@hitam.org</a>. If you received this by mistake, you can ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        part = MIMEText(html_content, 'html')
        msg.attach(part)
        
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.smtp_username, settings.smtp_password)
        server.sendmail(settings.smtp_username, email, msg.as_string())
        server.quit()
        
        print(f"[SMTP] Welcome email successfully sent to {email} via {settings.smtp_username}")
    except Exception as e:
        print(f"[SMTP] Error sending welcome email to {email}: {e}")


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
    
    background_tasks.add_task(send_welcome_email, sub.email)
    return new_sub
