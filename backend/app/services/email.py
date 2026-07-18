import resend
import smtplib
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders
from app.config import settings

# Configure Resend API key
if settings.resend_api_key:
    resend.api_key = settings.resend_api_key


def send_email_via_smtp(to_email: str, subject: str, html_content: str, attachment_data: dict = None) -> bool:
    """Send a single email using SMTP (e.g. Gmail)."""
    if not settings.smtp_username or not settings.smtp_password:
        print("[SMTP] Missing username or password", flush=True)
        return False

    try:
        # Create message container
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"IUCEE EWB HITAM <{settings.smtp_username}>"
        msg["To"] = to_email
        
        # Attach HTML body
        msg.attach(MIMEText(html_content, "html"))
        
        # Attach file if any
        if attachment_data:
            part = MIMEBase("application", "octet-stream")
            content_bytes = base64.b64decode(attachment_data["content"])
            part.set_payload(content_bytes)
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename={attachment_data['filename']}",
            )
            msg.attach(part)
            
        # Connect to SMTP server (Gmail STARTTLS)
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.smtp_username, settings.smtp_password)
        server.sendmail(settings.smtp_username, to_email, msg.as_string())
        server.quit()
        
        print(f"[SMTP] Email successfully sent to: {to_email}", flush=True)
        return True
    except Exception as e:
        print(f"[SMTP] Error sending email to {to_email}: {e}", flush=True)
        return False


def send_bulk_emails_via_smtp(recipients: list, subject: str, html_contents: list, attachment_data: dict = None) -> bool:
    """Send multiple emails in a single SMTP session."""
    if not settings.smtp_username or not settings.smtp_password:
        print("[SMTP] Missing username or password for bulk send", flush=True)
        return False
        
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.smtp_username, settings.smtp_password)
        
        for recipient, html in zip(recipients, html_contents):
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = f"IUCEE EWB HITAM <{settings.smtp_username}>"
                msg["To"] = recipient
                msg.attach(MIMEText(html, "html"))
                
                if attachment_data:
                    part = MIMEBase("application", "octet-stream")
                    content_bytes = base64.b64decode(attachment_data["content"])
                    part.set_payload(content_bytes)
                    encoders.encode_base64(part)
                    part.add_header(
                        "Content-Disposition",
                        f"attachment; filename={attachment_data['filename']}",
                    )
                    msg.attach(part)
                    
                server.sendmail(settings.smtp_username, recipient, msg.as_string())
                print(f"[SMTP] Bulk email successfully sent to: {recipient}", flush=True)
            except Exception as inner_e:
                print(f"[SMTP] Error sending bulk email to {recipient}: {inner_e}", flush=True)
                
        server.quit()
        return True
    except Exception as e:
        print(f"[SMTP] Bulk email session exception: {e}", flush=True)
        return False


async def send_welcome_email(email: str):
    """Send a welcome email to a new subscriber."""

    print("=" * 50)
    print(f"Attempting to send welcome email to: {email}")
    print("=" * 50)

    # Extract first name from email prefix (e.g., bhargav.reddy@gmail.com -> Bhargav)
    name = email.split("@")[0].split(".")[0].split("-")[0].split("_")[0].title()

    subject = "Welcome to the IUCEE-EWB-HITAM Community!"
    html_content = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; color: #374151;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
            
            <!-- Header Banner -->
            <div style="background-color: #10b981; padding: 32px; text-align: center; color: #ffffff;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">
                    IUCEE EWB HITAM
                </h2>
                <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 500;">
                    Engineers Without Borders Student Chapter
                </p>
            </div>
            
            <!-- Email Body -->
            <div style="padding: 32px 32px 24px 32px; text-align: left;">
                <p style="font-size: 16px; font-weight: 600; color: #111827; margin-top: 0; margin-bottom: 16px;">
                    Hi {name},
                </p>
                
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                    Thank you for subscribing! We are thrilled to have you join the <strong>IUCEE-EWB-HITAM Student Chapter</strong> community.
                </p>
                
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
                    You are now on the list to receive our latest updates. Moving forward, we'll keep you in the loop with:
                </p>
                
                <!-- Features List -->
                <div style="margin-bottom: 24px;">
                    <div style="margin-bottom: 12px;">
                        <span style="font-size: 18px; margin-right: 8px;">🚀</span>
                        <span style="font-size: 15px; line-height: 1.5; color: #4b5563;">
                            Updates on our latest tech and engineering projects
                        </span>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span style="font-size: 18px; margin-right: 8px;">📅</span>
                        <span style="font-size: 15px; line-height: 1.5; color: #4b5563;">
                            Announcements for upcoming events, workshops, and hackathons
                        </span>
                    </div>
                    <div style="margin-bottom: 12px;">
                        <span style="font-size: 18px; margin-right: 8px;">💡</span>
                        <span style="font-size: 15px; line-height: 1.5; color: #4b5563;">
                            Opportunities to get involved and collaborate with us
                        </span>
                    </div>
                </div>
                
                <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                    We promise not to spam your inbox. In the meantime, you can see what we are currently working on by visiting our website or following us on social media:
                </p>
                
                <!-- Social Buttons -->
                <div style="margin-bottom: 32px; text-align: center;">
                    <a href="https://iuceeewb.vercel.app/" style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; margin: 4px;">
                        Visit Our Website
                    </a>
                    <a href="https://www.instagram.com/iucee.ewb.hitam" style="display: inline-block; background-color: #e1306c; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; margin: 4px;">
                        Instagram
                    </a>
                    <a href="https://www.linkedin.com/in/ewbhitam" style="display: inline-block; background-color: #0077b5; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px; margin: 4px;">
                        LinkedIn
                    </a>
                </div>
                
                <p style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px;">
                    Welcome aboard!
                </p>
                
                <!-- Signature -->
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
                    <p style="font-size: 14px; color: #4b5563; line-height: 1.5; margin: 0;">
                        Best regards,<br>
                        <strong style="color: #111827;">IUCEE-EWB-HITAM Team</strong>
                    </p>
                </div>
            </div>
        </div>
    </div>
    """

    # 1. Try SMTP first if configured
    if settings.smtp_username and settings.smtp_password:
        success = send_email_via_smtp(email.lower(), subject, html_content)
        if success:
            return True

    # 2. Fallback to Resend
    if not settings.resend_api_key:
        print("[DEV MODE] No SMTP credentials or Resend API key found. Welcome email skipped.", flush=True)
        return False

    try:
        response = resend.Emails.send(
            {
                "from": f"IUCEE EWB HITAM <{settings.from_email}>",
                "to": email.lower(),
                "subject": subject,
                "html": html_content,
            }
        )
        print("EMAIL SENT SUCCESSFULLY VIA RESEND")
        print("Response:", response, flush=True)
        return True
    except Exception as e:
        print("Resend welcome email error:", e, flush=True)
        return False


async def send_bulk_newsletter(emails: list, subject: str, body_text: str, attachment_data: dict = None):
    """Send a bulk newsletter email to all subscribers with an optional attachment."""
    print("=" * 50)
    print(f"Attempting to send bulk newsletter to {len(emails)} subscribers")
    print(f"Subject: {subject}")
    print("=" * 50)

    html_contents = []
    for recipient in emails:
        html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
            <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                <h2 style="color: #10b981; margin: 0;">IUCEE-EWB HITAM Newsletter</h2>
            </div>
            <div style="color: #333; font-size: 16px; white-space: pre-wrap;">{body_text}</div>
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                <p>You received this email because you subscribed to the IUCEE-EWB-HITAM newsletter.</p>
                <p><a href="https://iuceeewb.vercel.app" style="color: #10b981; text-decoration: none;">Visit our website</a></p>
            </div>
        </div>
        """
        html_contents.append(html)

    # 1. Try SMTP first if configured
    if settings.smtp_username and settings.smtp_password:
        success = send_bulk_emails_via_smtp(
            [r.lower() for r in emails],
            subject,
            html_contents,
            attachment_data
        )
        if success:
            return True

    # 2. Fallback to Resend
    if not settings.resend_api_key:
        print("[DEV MODE] No SMTP credentials or Resend API key found. Skipping Resend bulk send.", flush=True)
        return False

    attachments = []
    if attachment_data:
        attachments.append({
            "filename": attachment_data["filename"],
            "content": attachment_data["content"]
        })

    for recipient, html in zip(emails, html_contents):
        try:
            email_payload = {
                "from": f"IUCEE EWB HITAM <{settings.from_email}>",
                "to": recipient.lower(),
                "subject": subject,
                "html": html
            }
            if attachments:
                email_payload["attachments"] = attachments

            resend.Emails.send(email_payload)
            print(f"Newsletter successfully sent via Resend to: {recipient}", flush=True)
        except Exception as inner_e:
            print(f"Error sending email via Resend to {recipient}: {inner_e}", flush=True)

    return True