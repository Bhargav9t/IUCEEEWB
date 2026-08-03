import os
import sys
import argparse
import asyncio

# Ensure backend directory is in sys.path when running from workspace root or backend dir
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import SessionLocal
from app.models.subscribers import Subscriber
from app.services.email import send_bulk_newsletter


def main():
    parser = argparse.ArgumentParser(description="Send automated monthly newsletter to all active subscribers.")
    parser.add_argument("--subject", type=str, default=None, help="Newsletter email subject")
    parser.add_argument("--body", type=str, default=None, help="Newsletter email body text")
    args = parser.parse_args()

    subject = args.subject or os.getenv("NEWSLETTER_SUBJECT", "IUCEE-EWB HITAM Monthly Newsletter Update")
    body = args.body or os.getenv(
        "NEWSLETTER_BODY",
        "Hello,\n\nWelcome to this month's update from the IUCEE EWB HITAM Student Chapter!\n\n"
        "We are continuing our mission of humanitarian engineering, community projects, and technological innovation. "
        "Visit our website at https://iuceeewb.vercel.app to read about our latest milestones.\n\n"
        "Best regards,\nIUCEE-EWB HITAM Team"
    )

    db = SessionLocal()
    try:
        subscribers = db.query(Subscriber).filter(Subscriber.is_active == True).all()
        emails = [s.email for s in subscribers if s.email]

        if not emails:
            print("[Newsletter Script] No active subscribers found in database.", flush=True)
            return

        print(f"[Newsletter Script] Found {len(emails)} active subscribers. Preparing dispatch...", flush=True)
        
        # Run async send_bulk_newsletter
        success = asyncio.run(send_bulk_newsletter(emails, subject, body))
        if success:
            print("[Newsletter Script] Newsletter successfully sent to subscribers.", flush=True)
        else:
            print("[Newsletter Script] Newsletter dispatch returned with warnings or failures.", flush=True)
    except Exception as e:
        print(f"[Newsletter Script] Error executing newsletter script: {e}", flush=True)
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
