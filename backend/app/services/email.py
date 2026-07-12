import resend
from app.config import settings

# Configure Resend API key
if settings.resend_api_key:
    resend.api_key = settings.resend_api_key


async def send_welcome_email(email: str):
    """Send a welcome email to a new subscriber."""

    print("=" * 50)
    print(f"Attempting to send email to: {email}")
    print(f"API Key Present: {bool(settings.resend_api_key)}")
    print("=" * 50)

    if not settings.resend_api_key:
        print("[DEV MODE] No Resend API key found")
        return False

    try:
        response = resend.Emails.send(
            {
                "from": "IUCEE EWB HITAM <onboarding@resend.dev>",
                "to": email.lower(),
                "subject": "Welcome to IUCEE EWB HITAM Newsletter!",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #10b981; margin: 0;">
                            Welcome to IUCEE EWB HITAM!
                        </h1>
                    </div>

                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Hi there!
                    </p>

                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        Thank you for subscribing to our newsletter.
                        You'll now receive updates about:
                    </p>

                    <ul style="font-size: 16px; color: #333; line-height: 1.8;">
                        <li>🎯 Upcoming events and workshops</li>
                        <li>📰 Latest project announcements</li>
                        <li>✨ News from our engineering community</li>
                        <li>🤝 Volunteer and collaboration opportunities</li>
                    </ul>

                    <p style="font-size: 16px; color: #333; line-height: 1.6;">
                        We're excited to have you in our community.
                    </p>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="font-size: 14px; color: #666; margin: 0;">
                            Best regards,<br>
                            <strong>IUCEE EWB HITAM Team</strong>
                        </p>

                        <p style="font-size: 12px; color: #999; margin: 10px 0 0 0;">
                            <a href="https://iuceeewb.org"
                               style="color: #10b981; text-decoration: none;">
                               Visit our website
                            </a>
                        </p>
                    </div>
                </div>
                """,
            }
        )

        print("=" * 50)
        print("EMAIL SENT SUCCESSFULLY")
        print("Response:")
        print(response)
        print("=" * 50)

        return True

    except Exception as e:
        import traceback

        print("=" * 50)
        print("EMAIL ERROR")
        print(str(e))
        traceback.print_exc()
        print("=" * 50)

        return False


async def send_bulk_newsletter(emails: list, subject: str, body_text: str, attachment_data: dict = None):
    """Send a bulk newsletter email to all subscribers with an optional attachment."""
    import base64

    print("=" * 50)
    print(f"Attempting to send bulk newsletter to {len(emails)} subscribers")
    print(f"Subject: {subject}")
    print(f"API Key Present: {bool(settings.resend_api_key)}")
    print("=" * 50)

    if not settings.resend_api_key:
        print("[DEV MODE] No Resend API key found. Skipping actual email dispatch.")
        print(f"Newsletter Body:\n{body_text}")
        if attachment_data:
            print(f"Attachment file: {attachment_data.get('filename')}")
        return False

    try:
        attachments = []
        if attachment_data:
            attachments.append({
                "filename": attachment_data["filename"],
                "content": attachment_data["content"]
            })

        for recipient in emails:
            try:
                email_payload = {
                    "from": "IUCEE EWB HITAM <newsletter@resend.dev>",
                    "to": recipient.lower(),
                    "subject": subject,
                    "html": f"""
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
                        <div style="text-align: center; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px;">
                            <h2 style="color: #10b981; margin: 0;">IUCEE-EWB HITAM Newsletter</h2>
                        </div>
                        <div style="color: #333; font-size: 16px; white-space: pre-wrap;">{body_text}</div>
                        <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #888; text-align: center;">
                            <p>You received this email because you subscribed to the IUCEE-EWB HITAM newsletter.</p>
                            <p><a href="https://iuceeewb.org" style="color: #10b981; text-decoration: none;">Visit our website</a></p>
                        </div>
                    </div>
                    """
                }
                if attachments:
                    email_payload["attachments"] = attachments

                resend.Emails.send(email_payload)
                print(f"Newsletter successfully sent to: {recipient}")
            except Exception as inner_e:
                print(f"Error sending email to {recipient}: {inner_e}")

        return True
    except Exception as e:
        print("Bulk newsletter dispatch exception:", e)
        return False