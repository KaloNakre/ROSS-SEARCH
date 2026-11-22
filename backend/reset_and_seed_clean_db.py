"""
Clean Database Reset & Complete Seed Script for ROSS-SEARCH.
Seeds:
- 12 DIU Research Domains
- Default Admins
- Exactly 5 Supervisors (Professors/Associate Professors with domains)
- Exactly 10 Students (with claimed unique thesis titles & domain interests)
- Previous Departmental Projects (FYP archives)
- Shared Paper Knowledge (with AI 20-point summaries & PDF links)
- Realistic Student Query Logs (search history across domains)
- Downloaded Personal Library Records
"""
import os
import sys

# Ensure backend directory is in python path
backend_dir = os.path.abspath(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database.connection import engine, SessionLocal
from app.database.base import Base
from app.models.user import User, UserRole
from app.models.student import Student, StudentInterest
from app.models.supervisor import Supervisor, SupervisorExpertise
from app.models.research_interest import ResearchInterest
from app.models.research_knowledge import PreviousProject, SharedPaperKnowledge, ResearchQueryLog, StudentSavedPaper
from app.core.security import hash_password, verify_password
from app.database.demo_seeder import run_demo_seeder
from app.database.demo_seeder_module2 import seed_module2_demo_data

def reset_and_seed():
    print("=" * 70)
    print("RESETTING & SEEDING CLEAN ROSS-SEARCH DATABASE")
    print(f"Engine Target: {engine.url}")
    print("=" * 70)

    # 1. Drop all tables and recreate freshly
    print("\n[1/6] Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("      Creating all tables from SQLAlchemy models...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 2. Seed Default Research Domains
        print("\n[2/6] Seeding 12 DIU Research Domains...")
        domains = [
            "Machine Learning", "Natural Language Processing", "Computer Vision",
            "Cyber Security", "Data Science & Big Data", "Cloud Computing & DevOps",
            "Human-Computer Interaction (HCI)", "Internet of Things (IoT)",
            "Software Engineering & Testing", "Blockchain & Distributed Systems",
            "Bioinformatics & Healthcare AI", "Robotics & Embedded Systems"
        ]
        for d in domains:
            db.add(ResearchInterest(name=d))
        db.commit()
        print(f"      Seeded {len(domains)} research domains.")

        # 3. Seed Default Admins
        print("\n[3/6] Seeding Administrator Accounts...")
        admin_pass = os.environ.get("ADMIN_PASSWORD", "Admin@12345")
        admin_accounts = [
            ("admin@diu.edu.bd", admin_pass),
            ("admin@ross-search.diu.edu.bd", admin_pass)
        ]
        for email_acc, pass_plain in admin_accounts:
            admin_user = User(
                email=email_acc,
                password_hash=hash_password(pass_plain),
                role=UserRole.admin,
                is_active=True,
            )
            db.add(admin_user)
        db.commit()
        print(f"      Seeded {len(admin_accounts)} Admin accounts.")

        # 4. Seed Supervisors & Students
        print("\n[4/6] Seeding 5 Supervisors & 10 Students with domain interests & unique project titles...")
        seeder_res = run_demo_seeder(db)
        print(f"      {seeder_res['message']}")

        # 5. Seed Module 2 (Previous projects, shared papers with AI summaries, search query logs, library)
        print("\n[5/6] Seeding Module 2 Research Intelligence Data...")
        seed_module2_demo_data(db)

        # 6. Verification Audit
        print("\n[6/6] Verifying Clean Database State:")
        table_counts = {
            "Users": db.query(User).count(),
            "Supervisors": db.query(Supervisor).count(),
            "Students": db.query(Student).count(),
            "Research Interests": db.query(ResearchInterest).count(),
            "Student Interests (Junction)": db.query(StudentInterest).count(),
            "Supervisor Expertise (Junction)": db.query(SupervisorExpertise).count(),
            "Previous Projects": db.query(PreviousProject).count(),
            "Shared Paper Knowledge (AI Summaries)": db.query(SharedPaperKnowledge).count(),
            "Research Query Logs": db.query(ResearchQueryLog).count(),
            "Student Saved Papers (Downloaded Library)": db.query(StudentSavedPaper).count(),
        }
        for name, count in table_counts.items():
            print(f"  * {name:<42} : {count} records")

        # Verify password authentication works for admin, supervisor, student
        print("\n--- AUTHENTICATION INTEGRITY CHECK ---")
        test_student = db.query(User).filter(User.email == "arif.hossain@diu.edu.bd").first()
        student_auth = verify_password("Diu@12345", test_student.password_hash) if test_student else False
        test_supervisor = db.query(User).filter(User.email == "dr.syed.tareq@diu.edu.bd").first()
        supervisor_auth = verify_password("Diu@12345", test_supervisor.password_hash) if test_supervisor else False
        test_admin = db.query(User).filter(User.email == "admin@diu.edu.bd").first()
        admin_auth = verify_password(admin_pass, test_admin.password_hash) if test_admin else False

        print(f"  Student Auth (arif.hossain@diu.edu.bd)      : {'PASS' if student_auth else 'FAIL'}")
        print(f"  Supervisor Auth (dr.syed.tareq@diu.edu.bd)  : {'PASS' if supervisor_auth else 'FAIL'}")
        print(f"  Admin Auth (admin@diu.edu.bd)              : {'PASS' if admin_auth else 'FAIL'}")

        print("\n" + "=" * 70)
        print("DATABASE RESET AND SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 70)

    finally:
        db.close()

if __name__ == "__main__":
    reset_and_seed()
