"""
One-time admin account creation script.
Run from backend/ directory:
    python seed_admin.py

Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env or as environment variables.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.database.connection import SessionLocal, engine
from app.database.base import Base
from app.models import user, student, supervisor, research_interest, team  # noqa
from app.models.user import User, UserRole
from app.core.security import hash_password

Base.metadata.create_all(bind=engine)

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@ross-search.diu.edu.bd")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")

if not ADMIN_PASSWORD:
    print("ERROR: Set ADMIN_PASSWORD environment variable before running this script.")
    sys.exit(1)

db = SessionLocal()
try:
    existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if existing:
        print(f"Admin already exists: {ADMIN_EMAIL}")
    else:
        admin = User(
            email=ADMIN_EMAIL,
            password_hash=hash_password(ADMIN_PASSWORD),
            role=UserRole.admin,
        )
        db.add(admin)
        db.commit()
        print(f"Admin account created: {ADMIN_EMAIL}")
finally:
    db.close()

