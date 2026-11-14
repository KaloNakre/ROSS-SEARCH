import sys
import os
import random
import string

# Append Anaconda site-packages for SQLAlchemy & Argon2
sys.path.append(r"D:\Anaconda\Lib\site-packages")

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), 'app'))
if backend_dir not in sys.path:
    sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi import HTTPException
from app.database.connection import engine, SessionLocal
from app.database.base import Base
from app.models import user, student, supervisor, research_interest, team, supervision_request
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.team import Team
from app.schemas.auth import RegisterRequest, SupervisorRegisterRequest, LoginRequest
from app.schemas.team import TeamCreate
from app.api.routes.auth import register, register_supervisor, login
from app.api.routes.teams import create_team
from app.api.routes.admin import get_database_overview, get_database_table_data

# Ensure all database tables exist
Base.metadata.create_all(bind=engine)

def random_string(length=6):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

def run_suite(iteration: int):
    print(f"\n==================================================================")
    print(f"▶ EXECUTING AUTOMATED FULL SYSTEM VERIFICATION — ITERATION {iteration}/3")
    print(f"==================================================================")
    
    db = SessionLocal()
    try:
        # ── 1. Invalid Email Validation Check ────────────────────────
        invalid_email_tested = False
        try:
            invalid_payload = RegisterRequest(
                full_name="Invalid Email Test",
                student_id="011-201-999",
                department="Department of Computer Science and Engineering",
                email="1234",  # Invalid email format (missing @ and domain)
                password="Password@123"
            )
            register(invalid_payload, db=db)
        except (ValueError, HTTPException) as err:
            invalid_email_tested = True
            print(f"  ✔ [Pass] Step 1: Invalid email ('1234') successfully rejected (Caught: {type(err).__name__})")
        assert invalid_email_tested, "Expected validation error for invalid email '1234'!"

        # ── 2. Valid Student Registration ────────────────────────────
        rand_id = random_string(5)
        student_email = f"student_{rand_id}@diu.edu.bd"
        student_payload = RegisterRequest(
            full_name=f"Robayet Student {rand_id}",
            student_id=f"201-15-{random.randint(100, 999)}",
            department="Department of Computer Science and Engineering",
            email=student_email,
            password="Password@123"
        )
        reg_result = register(student_payload, db=db)
        assert reg_result.access_token, "No access token returned for student"
        created_student = db.query(Student).join(User).filter(User.email == student_email).first()
        assert created_student is not None, "Student record was not saved to database"
        student_user = db.query(User).filter(User.email == student_email).first()
        print(f"  ✔ [Pass] Step 2: Student registered & persisted in DB ({student_email}, ID: {created_student.id})")

        # ── 3. Valid Supervisor Registration ─────────────────────────
        sup_email = f"supervisor_{rand_id}@diu.edu.bd"
        sup_payload = SupervisorRegisterRequest(
            full_name=f"Dr. Faculty Member {rand_id}",
            department="Department of Software Engineering",
            designation="Associate Professor",
            email=sup_email,
            password="Password@123"
        )
        sup_result = register_supervisor(sup_payload, db=db)
        assert sup_result.access_token, "No access token returned for supervisor"
        created_sup = db.query(Supervisor).join(User).filter(User.email == sup_email).first()
        assert created_sup is not None, "Supervisor record was not saved to database"
        print(f"  ✔ [Pass] Step 3: Supervisor registered & persisted in DB ({sup_email}, ID: {created_sup.id})")

        # ── 4. Team Creation (The User's Screenshot Scenario) ─────────
        # Scenario A: Nominated Supervisor = '-- Assign Later --' (supervisor_id = None)
        team_payload_1 = TeamCreate(
            name=f"Fault Tolerant Architecture {rand_id}",
            project_title="Decentralized Consensus Protocol Framework",
            domain="Cyber Security",
            department="Department of Software Engineering",
            section="60_B",
            description="Comprehensive analysis of consensus mechanics under Byzantine failure conditions.",
            supervisor_id=None
        )
        team_res_1 = create_team(team_payload_1, current_user=student_user, db=db)
        assert team_res_1.id is not None, "Team was not assigned an ID"
        assert team_res_1.name == team_payload_1.name
        assert team_res_1.section == "60_B"
        assert team_res_1.supervisor_id is None
        assert len(team_res_1.members) == 1
        assert team_res_1.members[0].role == "Leader"
        print(f"  ✔ [Pass] Step 4a: Team created with '-- Assign Later --' (ID: {team_res_1.id}, Name: '{team_res_1.name}', Leader: Verified)")

        # Scenario B: Team with Batch 40+ Section (e.g. 40_A)
        student_40_email = f"student_batch40_{rand_id}@diu.edu.bd"
        st_40_payload = RegisterRequest(
            full_name=f"Batch 40 Senior Student {rand_id}",
            student_id=f"191-15-{random.randint(100, 999)}",
            department="Department of Computer Science and Engineering",
            email=student_40_email,
            password="Password@123"
        )
        register(st_40_payload, db=db)
        user_40 = db.query(User).filter(User.email == student_40_email).first()

        team_payload_2 = TeamCreate(
            name=f"Batch 40 Pioneers {rand_id}",
            project_title="Scalable Graph Neural Networks for Citations",
            domain="Machine Learning",
            department="Department of Computer Science and Engineering",
            section="40_A",
            description="High throughput GNN batch training with sub-graph partitioning.",
            supervisor_id=created_sup.id
        )
        team_res_2 = create_team(team_payload_2, current_user=user_40, db=db)
        assert team_res_2.id is not None
        assert team_res_2.section == "40_A"
        assert team_res_2.supervisor_id == created_sup.id
        print(f"  ✔ [Pass] Step 4b: Batch 40 Team created with Section '40_A' & Assigned Supervisor (ID: {team_res_2.id})")

        # ── 5. Admin Authentication & Database Studio Verification ───
        admin_login_res = login(LoginRequest(email="admin@diu.edu.bd", password="Admin@12345"), db=db)
        assert admin_login_res.access_token, "Admin login failed"
        admin_user = db.query(User).filter(User.email == "admin@diu.edu.bd").first()
        print(f"  ✔ [Pass] Step 5a: Admin authenticated successfully (admin@diu.edu.bd)")

        # Verify Database Studio overview endpoint
        overview = get_database_overview(db=db, _admin=admin_user)
        table_counts = {t["id"]: t["count"] for t in overview["tables"]}
        assert table_counts["users"] > 0
        assert table_counts["students"] > 0
        assert table_counts["teams"] > 0
        print(f"  ✔ [Pass] Step 5b: Admin DB Overview live ({table_counts['users']} Users, {table_counts['students']} Students, {table_counts['teams']} Teams)")

        # Verify Students table streaming
        students_table = get_database_table_data("students", db=db, _admin=admin_user)
        assert any(s["email"] == student_email for s in students_table), "Created student not found in admin students table"
        print(f"  ✔ [Pass] Step 5c: Newly created student confirmed in Admin Students Table ({len(students_table)} total rows)")

        # Verify Teams table streaming
        teams_table = get_database_table_data("teams", db=db, _admin=admin_user)
        assert any(t["team_name"] == team_payload_1.name for t in teams_table), "Created team not found in admin teams table"
        print(f"  ✔ [Pass] Step 5d: Newly created teams confirmed in Admin Teams Table ({len(teams_table)} total rows)")

        print(f"✨ ITERATION {iteration}/3 PASSED WITH 100% SUCCESS!\n")

    finally:
        db.close()

def main():
    print("=" * 70)
    print("  ROSS-SEARCH COMPREHENSIVE AUTOMATED VERIFICATION SUITE")
    print("  Author: Robayet Islam (ID: 809) | DIU FYP/Thesis Platform")
    print("=" * 70)
    
    for i in range(1, 4):
        run_suite(i)

    print("=" * 70)
    print("  🎉 ALL 3 ITERATIONS COMPLETED WITH ZERO ERRORS!")
    print("  Status: Student Reg -> Sup Reg -> Team Create -> Admin DB: 100% HEALTHY")
    print("=" * 70)

if __name__ == "__main__":
    main()
