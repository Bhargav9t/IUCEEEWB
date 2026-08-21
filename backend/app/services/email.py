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


def _get_smtp_server():
    """Helper to connect, authenticate, and return an active SMTP server object."""
    host = settings.smtp_host or "smtp.gmail.com"
    port = settings.smtp_port or 587

    if port == 465:
        server = smtplib.SMTP_SSL(host, port)
    else:
        server = smtplib.SMTP(host, port)
        server.starttls()

    server.login(settings.smtp_username, settings.smtp_password)
    return server


def send_email_via_smtp(to_email: str, subject: str, html_content: str, attachment_data: dict = None) -> bool:
    """Send a single email using SMTP (e.g. Gmail)."""
    if not settings.smtp_username or not settings.smtp_password:
        print("[SMTP] Missing username or password", flush=True)
        return False

    sender = settings.smtp_sender_email
    try:
        # Create message container
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"IUCEE EWB HITAM <{sender}>"
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
            
        # Connect to SMTP server
        server = _get_smtp_server()
        server.sendmail(sender, to_email, msg.as_string())
        server.quit()
        
        print(f"[SMTP] Email successfully sent to: {to_email}", flush=True)
        return True
    except Exception as e:
        print(f"[SMTP] Error sending email to {to_email}: {e}", flush=True)
        return False


def send_bulk_emails_via_smtp(recipients: list, subject: str, html_contents: list, attachment_data: dict = None) -> bool:
    """Send multiple emails in a single SMTP session to all subscribers."""
    if not settings.smtp_username or not settings.smtp_password:
        print("[SMTP] Missing username or password for bulk send", flush=True)
        return False

    sender = settings.smtp_sender_email
    success_count = 0
    fail_count = 0

    try:
        server = _get_smtp_server()
        
        for recipient, html in zip(recipients, html_contents):
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = f"IUCEE EWB HITAM <{sender}>"
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
                    
                server.sendmail(sender, recipient, msg.as_string())
                success_count += 1
                print(f"[SMTP] Bulk email successfully sent to: {recipient}", flush=True)
            except Exception as inner_e:
                fail_count += 1
                print(f"[SMTP] Error sending bulk email to {recipient}: {inner_e}", flush=True)
                
        try:
            server.quit()
        except Exception:
            pass

        print(f"[SMTP] Bulk send finished. Sent: {success_count}, Failed: {fail_count}", flush=True)
        return success_count > 0 or len(recipients) == 0
    except Exception as e:
        print(f"[SMTP] Bulk email session exception: {e}", flush=True)
        return False


async def send_welcome_email(email: str):
    """Send a welcome email to a new subscriber using Resend Python SDK."""
    print("=" * 50)
    print(f"Attempting to send welcome email via Resend to: {email}")
    print("=" * 50)

    if not settings.resend_api_key:
        print("[Resend] Warning: RESEND_API_KEY environment variable is not set. Welcome email skipped.", flush=True)
        return False

    resend.api_key = settings.resend_api_key

    # Extract first name from email prefix (e.g., john.doe@gmail.com -> John)
    name = email.split("@")[0].split(".")[0].split("-")[0].split("_")[0].title()
    subject = "Welcome to the IUCEE-EWB HITAM Newsletter!"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f6f8; padding: 40px 16px;">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
                        <!-- Header Banner -->
                        <tr>
                            <td style="background-color: #059669; padding: 32px 24px; text-align: center; color: #ffffff;">
                                <h1 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">IUCEE EWB HITAM</h1>
                                <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.92;">Engineers Without Borders Student Chapter</p>
                            </td>
                        </tr>
                        <!-- Body Content -->
                        <tr>
                            <td style="padding: 36px 32px 24px 32px; color: #374151;">
                                <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827; font-weight: 600;">Welcome, {name}!</h2>
                                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 18px 0;">
                                    Thank you for subscribing to our newsletter. We're thrilled to have you as part of our community!
                                </p>
                                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
                                    Here is what you can look forward to receiving directly in your inbox:
                                </p>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px 0;">
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 15px; line-height: 1.5; color: #4b5563;">
                                            🚀 <strong>Project Spotlights:</strong> Updates on impactful community engineering initiatives.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 15px; line-height: 1.5; color: #4b5563;">
                                            📅 <strong>Events & Workshops:</strong> Invitations to technical bootcamps, hackathons, and guest sessions.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 15px; line-height: 1.5; color: #4b5563;">
                                            💡 <strong>Opportunities:</strong> Ways to collaborate, build, and lead community projects.
                                        </td>
                                    </tr>
                                </table>
                                <p style="font-size: 15px; line-height: 1.6; margin: 0 0 28px 0;">
                                    Stay connected with us and explore our ongoing work:
                                </p>
                                <div style="text-align: center; margin-bottom: 28px;">
                                    <a href="https://iuceeewb.vercel.app/" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 24px; border-radius: 8px;">Visit Website</a>
                                </div>
                                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 14px; color: #6b7280; line-height: 1.5;">
                                    <p style="margin: 0;">Best regards,</p>
                                    <p style="margin: 4px 0 0 0; font-weight: 600; color: #111827;">IUCEE-EWB-HITAM Team</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    try:
        response = resend.Emails.send(
            {
                "from": "IUCEE-EWB HITAM <newsletter@iucee.hitam.org>",
                "to": email.lower(),
                "subject": subject,
                "html": html_content,
            }
        )
        print("[Resend] Welcome email sent successfully:", response, flush=True)
        return True
    except Exception as e:
        print("[Resend] Error sending welcome email:", e, flush=True)
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
        print(f"[SMTP] Attempting bulk dispatch via SMTP ({settings.smtp_username})...", flush=True)
        success = send_bulk_emails_via_smtp(
            [r.lower() for r in emails],
            subject,
            html_contents,
            attachment_data
        )
        if success:
            return True
        print("[SMTP] Bulk dispatch failed. Attempting Resend fallback...", flush=True)
    else:
        print("[SMTP NOTICE] SMTP_USERNAME / SMTP_PASSWORD not set. Falling back to Resend API.", flush=True)
        print("[RESEND NOTICE] Free-tier Resend restricts recipients to your account email only. Configure SMTP credentials to email all subscribers.", flush=True)

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
                "from": f"IUCEE EWB HITAM <{settings.resend_sender_email}>",
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