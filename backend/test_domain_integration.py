#!/usr/bin/env python3
"""
Test domain selection, legacy string resolution, persistence, and reload verification.
Runs strictly on an ISOLATED temporary test database (test_temp.db) that is created and destroyed per run.
NEVER modifies production/development ross_search.db.
"""
import sys
import os
import shutil

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.database.base import Base
from app.core.dependencies import get_db
from app.models.user import User, UserRole
from app.models.student import Student, StudentInterest
from app.models.research_interest import ResearchInterest
from app.core.security import create_access_token
from app.main import app

TEST_DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_temp_domain.db")
TEST_DB_URL = f"sqlite:///{TEST_DB_FILE}"

def run_isolated_test():
    print("=================================================================")
    print(">> RUNNING DOMAIN TEST ON ISOLATED TEMPORARY DATABASE")
    print(f">> Target DB: {TEST_DB_FILE}")
    print("=================================================================")

    # 1. Clean any leftover test db
    if os.path.exists(TEST_DB_FILE):
        os.remove(TEST_DB_FILE)

    # 2. Create isolated test engine & tables
    test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    # 3. Override get_db in FastAPI app
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    db = TestingSessionLocal()
    try:
        # Seed 12 canonical interests into test db
        from app.database.seed import INITIAL_INTERESTS
        for name, cat in INITIAL_INTERESTS:
            db.add(ResearchInterest(name=name, category=cat))
        db.commit()

        # Seed test student
        test_user = User(
            email="isolated.student@diu.edu.bd",
            password_hash="testpass123",
            role=UserRole.student,
            is_active=True
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        test_student = Student(
            user_id=test_user.id,
            full_name="Isolated Test Student",
            student_id="201-15-999",
            department="Department of Computer Science and Engineering",
            section="60_A",
            preferred_domain="cyber"
        )
        db.add(test_student)
        db.commit()
        db.refresh(test_student)

        token = create_access_token({"sub": test_user.email, "role": test_user.role.value})
        headers = {"Authorization": f"Bearer {token}"}

        # Step A: Verify initial legacy string in isolated DB
        res_me = client.get("/api/students/me", headers=headers)
        assert res_me.status_code == 200
        assert res_me.json()["preferred_domain"] == "cyber"
        print("[1] Verified initial student profile has preferred_domain='cyber'")

        # Step B: Save selected domains [3, 5] (Cyber Security, Natural Language Processing)
        res_save = client.put("/api/students/me/interests", json={"interest_ids": [3, 5]}, headers=headers)
        assert res_save.status_code == 200
        saved_body = res_save.json()
        print(f"[2] PUT /api/students/me/interests succeeded: {res_save.status_code}")
        print(f"    Saved preferred_domain: '{saved_body['preferred_domain']}'")
        assert saved_body["preferred_domain"] == "Cyber Security, Natural Language Processing"

        # Step C: Verify reload in isolated DB
        res_reload = client.get("/api/students/me", headers=headers)
        reloaded_body = res_reload.json()
        reloaded_ids = [item["id"] for item in reloaded_body.get("interests", [])]
        print(f"[3] Reloaded interests from API: {reloaded_ids}")
        assert set(reloaded_ids) == {3, 5}
        assert reloaded_body["preferred_domain"] == "Cyber Security, Natural Language Processing"
        print("[4] VERIFICATION PASSED: Isolated DB test ran cleanly without touching production DB!")

    finally:
        db.close()
        app.dependency_overrides.clear()
        test_engine.dispose()
        # Clean up temporary DB file completely
        if os.path.exists(TEST_DB_FILE):
            os.remove(TEST_DB_FILE)
            print(f"[5] Temporary DB file {TEST_DB_FILE} safely destroyed.")

    print("=================================================================")
    print(">> ISOLATED TEST COMPLETED SUCCESSFULLY")
    print("=================================================================")

if __name__ == "__main__":
    run_isolated_test()
