from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.config import settings
from app.database import Base, engine, SessionLocal

# Import models so SQLAlchemy registers them with Base before create_all
import app.models.events       # noqa: F401
import app.models.subscribers  # noqa: F401
import app.models.journey      # noqa: F401

# Auto-create tables on startup (idempotent — safe to run repeatedly)
Base.metadata.create_all(bind=engine)

startup_logs = []

# Dynamic Migration: Add registration_url column to events if missing (compatible with SQLite & Postgres)
def run_migrations():
    should_recreate_journey = False
    try:
        is_postgres = "postgresql" in str(engine.url)
        with engine.begin() as conn:
            if is_postgres:
                # Check for outdated columns in journey_nodes
                res_old = conn.execute(text(
                    "SELECT column_name FROM information_schema.columns WHERE table_name='journey_nodes' AND column_name='year_or_date';"
                )).fetchone()
                if res_old:
                    startup_logs.append("Migration: Dropping outdated journey_nodes table in Postgres")
                    conn.execute(text("DROP TABLE journey_nodes CASCADE;"))
                    should_recreate_journey = True
                else:
                    # Check column existence in PostgreSQL for events table
                    res = conn.execute(text(
                        "SELECT column_name FROM information_schema.columns WHERE table_name='events' AND column_name='registration_url';"
                    )).fetchone()
                    if not res:
                        startup_logs.append("Migration: Adding registration_url column to events table in Postgres")
                        conn.execute(text("ALTER TABLE events ADD COLUMN registration_url VARCHAR;"))
                    else:
                        startup_logs.append("Migration check: registration_url already exists in Postgres")

                    # Check and add columns for journey_nodes in Postgres
                    journey_cols = {
                        "node_id": "VARCHAR",
                        "date": "VARCHAR",
                        "title": "VARCHAR",
                        "desc": "TEXT",
                        "icon": "VARCHAR",
                        "image": "VARCHAR",
                        "link": "VARCHAR",
                        "sort_order": "INTEGER DEFAULT 0"
                    }
                    for col, col_type in journey_cols.items():
                        res_col = conn.execute(text(
                            f"SELECT column_name FROM information_schema.columns WHERE table_name='journey_nodes' AND column_name='{col}';"
                        )).fetchone()
                        if not res_col:
                            startup_logs.append(f"Migration: Adding {col} column to journey_nodes table in Postgres")
                            col_name = f'"{col}"' if col == "desc" else col
                            conn.execute(text(f"ALTER TABLE journey_nodes ADD COLUMN {col_name} {col_type};"))
            else:
                # SQLite check
                res_old = conn.execute(text("PRAGMA table_info(journey_nodes);")).fetchall()
                columns_old = [row[1] for row in res_old]
                if "year_or_date" in columns_old:
                    startup_logs.append("Migration: Dropping outdated journey_nodes table in SQLite")
                    conn.execute(text("DROP TABLE journey_nodes;"))
                    should_recreate_journey = True
                else:
                    # Check column existence in SQLite for events table
                    res = conn.execute(text("PRAGMA table_info(events);")).fetchall()
                    columns = [row[1] for row in res]
                    if "registration_url" not in columns:
                        startup_logs.append("Migration: Adding registration_url column to events table in SQLite")
                        conn.execute(text("ALTER TABLE events ADD COLUMN registration_url VARCHAR;"))
                    else:
                        startup_logs.append("Migration check: registration_url already exists in SQLite")

                    # Check and add columns for journey_nodes in SQLite
                    res_journey = conn.execute(text("PRAGMA table_info(journey_nodes);")).fetchall()
                    journey_columns = [row[1] for row in res_journey]
                    journey_cols = {
                        "node_id": "VARCHAR",
                        "date": "VARCHAR",
                        "title": "VARCHAR",
                        "desc": "TEXT",
                        "icon": "VARCHAR",
                        "image": "VARCHAR",
                        "link": "VARCHAR",
                        "sort_order": "INTEGER DEFAULT 0"
                    }
                    for col, col_type in journey_cols.items():
                        if col not in journey_columns:
                            startup_logs.append(f"Migration: Adding {col} column to journey_nodes table in SQLite")
                            col_name = f'"{col}"' if col == "desc" else col
                            conn.execute(text(f"ALTER TABLE journey_nodes ADD COLUMN {col_name} {col_type};"))
        
        if should_recreate_journey:
            startup_logs.append("Recreating journey_nodes table schema")
            Base.metadata.create_all(bind=engine)
            
    except Exception as e:
        startup_logs.append(f"Migration warning: {str(e)}")
        print("Migration warning:", e)

run_migrations()

# Seeding Logic: Seed default journey nodes if table is empty
def seed_journey():
    from app.models.journey import JourneyNode
    db = SessionLocal()
    try:
        count = db.query(JourneyNode).count()
        startup_logs.append(f"JourneyNode count check: found {count} nodes in database")
        if count == 0:
            startup_logs.append("Seeding default journey nodes...")
            print("Seeding default journey nodes...")
            default_nodes = [
                {"node_id": "01", "date": "AUG 2019", "title": "THE BEGINNING", "desc": "Chapter established as a non-profit for community engineering.", "icon": "Flag", "sort_order": 1},
                {"node_id": "founder", "date": "2019", "title": "THE FIRST TEAM", "desc": "The founding members and pioneers who laid the core foundation.", "icon": "Users", "link": "/history/first-team", "sort_order": 2},
                {"node_id": "02", "date": "NOV 8-9, 2024", "title": "INNOFIESTA 2024", "desc": "Flagship multidisciplinary fest at HITAM.", "icon": "Zap", "sort_order": 3},
                {"node_id": "03", "date": "MAR 29, 2025", "title": "AKSHAYA PATRA VISIT", "desc": "Industrial visit to the world's largest automated NGO kitchen.", "icon": "Factory", "sort_order": 4},
                {"node_id": "04", "date": "MAY 9-10, 2025", "title": "HACK YOUR PATH 6.0", "desc": "24-hour hackathon with 60 interdisciplinary teams.", "icon": "Code", "sort_order": 5},
                {"node_id": "05", "date": "MAY 27, 2025", "title": "RESEARCH WRITING WORKSHOP", "desc": "Training on paper structure and citation practices.", "icon": "BookOpen", "sort_order": 6},
                {"node_id": "06", "date": "JULY 11-13, 2025", "title": "AUNSF 3.0", "desc": "Participation in Aeronox and Ignova domains at Anurag University.", "icon": "Rocket", "sort_order": 7},
                {"node_id": "07", "date": "JULY 25, 2025", "title": "INTRODUCTION TO ICTIEE", "desc": "Session on academic research publication culture.", "icon": "FileText", "sort_order": 8},
                {"node_id": "08", "date": "JULY 26 & 28, 2025", "title": "DT PROJECT EXPO I", "desc": "Showcasing prototypes developed through Design Thinking.", "icon": "Lightbulb", "sort_order": 9},
                {"node_id": "09", "date": "AUG 31, 2025", "title": "ICTIEE SUBMISSIONS", "desc": "4 research papers submitted on GenAI, AR, and Gamification.", "icon": "Upload", "sort_order": 10},
                {"node_id": "10", "date": "SEP 5, 2025", "title": "THINKSPRINT IDEATHON", "desc": "SDG-focused ideathon involving 7 pitching teams.", "icon": "Brain", "sort_order": 11},
                {"node_id": "11", "date": "OCT 25, 2025", "title": "SCHOOL VISITS", "desc": "Needs assessment at Krushi Home and ZPHS Gowdavelly.", "icon": "School", "sort_order": 12},
                {"node_id": "12", "date": "OCT 31, 2025", "title": "AKSHAYAKALPA FARM VISIT", "desc": "Exploration of tech integration in organic farming.", "icon": "Leaf", "sort_order": 13},
                {"node_id": "13", "date": "DEC 9, 2025", "title": "MR. PETER INTERACTION", "desc": "Session with ED of EWB East Africa on humanitarian engineering.", "icon": "Globe", "sort_order": 14},
                {"node_id": "14", "date": "DEC 19-20, 2025", "title": "DT PROJECT EXPO II", "desc": "Platform for human-centered solutions addressing real-world problems.", "icon": "Wrench", "sort_order": 15},
                {"node_id": "15", "date": "JAN 7-10, 2026", "title": "ICTIEE 2026 AWARD", "desc": "Won the Student Chapter Award at the national conference.", "icon": "Trophy", "sort_order": 16},
                {"node_id": "16", "date": "JAN 15, 2026", "title": "IASF MENTORSHIP", "desc": "AI Crop Disease & Waste Mgmt projects selected for elite mentorship.", "icon": "Sprout", "sort_order": 17},
                {"node_id": "17", "date": "JAN 20, 2026", "title": "EDUAITHON TOP 15", "desc": "Team Label2Learn ranked among the top 15 teams nationally.", "icon": "Medal", "sort_order": 18},
                {"node_id": "18", "date": "JAN 28-29, 2026", "title": "INNOFIESTA 2026", "desc": "Innovation event featuring Reverse Engineering challenges.", "icon": "Cpu", "sort_order": 19},
                {"node_id": "19", "date": "FEB 2026", "title": "RO PLANT INSTALLATION", "desc": "Implementation of safe drinking water infrastructure at ZPHS Gowdavelly.", "icon": "Droplets", "sort_order": 20},
                {"node_id": "investiture-ceremony", "date": "MAR 2026", "title": "INVESTITURE CEREMONY", "desc": "Official induction of the new executive board and core team.", "icon": "Medal", "link": "/investiture-ceremony", "sort_order": 21},
                {"node_id": "present-team", "date": "2026", "title": "PRESENT TEAM", "desc": "Meet the current members driving our chapter's mission forward.", "icon": "Users", "link": "/team", "sort_order": 22},
                {"node_id": "20", "date": "APR 10, 2026", "title": "IGNITE 2026", "desc": "Welcoming the incoming batch to the chapter.", "icon": "PartyPopper", "link": "/ignite", "sort_order": 23},
                {"node_id": "22", "date": "APR 15, 2026", "title": "HELPING HEARTS NGO VISIT", "desc": "A visit to Helping Hearts NGO.", "icon": "Users", "image": "/images/events/NGOvisit%231.jpeg", "sort_order": 24},
                {"node_id": "24", "date": "APR 20, 2026", "title": "IASF ADDRESSAL EVENT", "desc": "Project addressal and validation event for the IUCEEE Annual Student Forum projects.", "icon": "Brain", "image": "/images/events/iasf-addressal.jpg", "link": "/iasf-addressal-event", "sort_order": 25},
                {"node_id": "23", "date": "APR 25, 2026", "title": "WILLIAM OAKES VISIT", "desc": "Interactive mentorship and project design review session by Dr. William Oakes from Purdue University.", "icon": "School", "sort_order": 26},
                {"node_id": "21", "date": "FUTURE", "title": "TO BE CONTINUED...", "desc": "Our journey of impact and innovation never stops.", "icon": "Hourglass", "sort_order": 27}
            ]
            for n in default_nodes:
                db.add(JourneyNode(**n))
            db.commit()
            startup_logs.append("Successfully seeded journey nodes.")
            print("Successfully seeded journey nodes.")
    except Exception as e:
        startup_logs.append(f"Seeding warning: {str(e)}")
        print("Seeding warning:", e)
    finally:
        db.close()

seed_journey()

app = FastAPI(
    title="IUCEE-EWB HITAM Backend",
    description="Dedicated API for managing dynamic content, events, and subscribers.",
    version="1.0.0",
)

# CORS — reads from FRONTEND_URLS env var (comma-separated list of allowed origins)
origins = settings.allowed_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

from app.routers import events, subscribers, journey  # noqa: E402

app.include_router(events.router)
app.include_router(subscribers.router)
app.include_router(journey.router)


@app.get("/")
def root():
    return {"status": "ok", "message": "IUCEE-EWB HITAM API is running"}


@app.get("/admin/debug-db")
def debug_db():
    from sqlalchemy import inspect
    try:
        inspector = inspect(engine)
        schema_info = {}
        for table_name in inspector.get_table_names():
            cols = []
            for col in inspector.get_columns(table_name):
                cols.append(f"{col['name']} ({str(col['type'])})")
            schema_info[table_name] = cols
    except Exception as e:
        schema_info = {"error": str(e)}

    return {
        "database_url": str(engine.url).split("@")[-1],  # hide credentials
        "startup_logs": startup_logs,
        "schema": schema_info
    }


@app.get("/admin/debug-email")
def debug_email(to_email: str):
    from app.services.email import send_email_via_smtp
    import resend

    html = "<p>This is a test email sent from the deployed instance debug endpoint.</p>"

    # 1. Try SMTP first if configured
    if settings.smtp_username and settings.smtp_password:
        success = send_email_via_smtp(to_email.lower(), "IUCEE EWB HITAM SMTP Debug", html)
        if success:
            return {"status": "success", "provider": "smtp", "message": "Email sent successfully via SMTP"}
        else:
            return {"status": "error", "provider": "smtp", "message": "Failed to send email via SMTP"}

    # 2. Fallback to Resend
    if not settings.resend_api_key:
        return {"status": "error", "message": "No email configuration found (SMTP and Resend are both empty)"}

    try:
        resend.api_key = settings.resend_api_key
        payload = {
            "from": f"IUCEE EWB HITAM <{settings.from_email}>",
            "to": to_email.lower(),
            "subject": "IUCEE EWB HITAM Resend Debug",
            "html": html
        }
        res = resend.Emails.send(payload)
        return {"status": "success", "provider": "resend", "response": res}
    except Exception as e:
        return {"status": "error", "provider": "resend", "details": str(e)}
