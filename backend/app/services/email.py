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

    # Extract first name from email prefix (e.g., bhargav.reddy@gmail.com -> Bhargav)
    name = email.split("@")[0].split(".")[0].split("-")[0].split("_")[0].title()

    try:
        response = resend.Emails.send(
            {
                "from": f"IUCEE EWB HITAM <{settings.from_email}>",
                "to": email.lower(),
                "subject": "Welcome to the IUCEE-EWB-HITAM Community!",
                "html": f"""
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
                    "from": f"IUCEE EWB HITAM <{settings.from_email}>",
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