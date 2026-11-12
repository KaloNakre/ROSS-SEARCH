"""
Seed initial reference data: research interests and one admin account.
Called once on application startup.
"""
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models.research_interest import ResearchInterest
from app.models.user import User, UserRole
from app.core.security import hash_password


INITIAL_INTERESTS = [
    ("Machine Learning", "Artificial Intelligence"),
    ("Data Science", "Data Analytics"),
    ("Cyber Security", "Security & Networks"),
    ("AI & Robotics", "Artificial Intelligence"),
    ("Natural Language Processing", "Artificial Intelligence"),
    ("Computer Vision", "Artificial Intelligence"),
    ("Internet of Things", "Embedded Systems"),
    ("Cloud Computing", "Distributed Systems"),
    ("Bioinformatics", "Interdisciplinary"),
    ("Blockchain", "Security & Networks"),
    ("Human-Computer Interaction", "Software Systems"),
    ("Others", "General"),
]


def seed_initial_data():
    db: Session = SessionLocal()
    try:
        # Seed research interests
        for name, category in INITIAL_INTERESTS:
            if not db.query(ResearchInterest).filter(ResearchInterest.name == name).first():
                db.add(ResearchInterest(name=name, category=category))

        # NOTE: We do NOT create a default admin here because that would
        # hardcode credentials. Instead, run the seed_admin.py script manually
        # and set a strong password via environment variable.

        db.commit()
        print("[ROSS-SEARCH] Seed data loaded successfully.")
    except Exception as e:
        db.rollback()
        print(f"[ROSS-SEARCH] Seed error: {e}")
    finally:
        db.close()

