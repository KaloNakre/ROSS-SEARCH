"""
ROSS-SEARCH — Phase 3A Authentication & Authorization Automated Test Suite
Covers all 16 required test cases using an isolated SQLite database.
"""
import os
import sys
import unittest
from datetime import timedelta

# Ensure paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

for p in [r"D:\Anaconda\Lib\site-packages", r"D:\Python\Lib\site-packages"]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.append(p)

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.revoked_token import RevokedToken
from app.api.routes.auth import register, login, logout, get_me
from app.schemas.auth import RegisterRequest, LoginRequest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    decode_token,
)
from app.core.dependencies import (
    get_current_user,
    require_student,
    require_supervisor,
    require_admin,
)

TEST_DB_FILE = os.path.join(CURRENT_DIR, "test_phase3a_auth.db")
TEST_DB_URL = f"sqlite:///{TEST_DB_FILE}"


class Phase3AAuthTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create fresh isolated database
        if os.path.exists(TEST_DB_FILE):
            try:
                os.remove(TEST_DB_FILE)
            except Exception:
                pass
        cls.engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
        cls.Session = sessionmaker(autocommit=False, autoflush=False, bind=cls.engine)
        Base.metadata.create_all(bind=cls.engine)

    @classmethod
    def tearDownClass(cls):
        cls.engine.dispose()
        if os.path.exists(TEST_DB_FILE):
            try:
                os.remove(TEST_DB_FILE)
            except Exception:
                pass

    def setUp(self):
        self.db = self.Session()

    def tearDown(self):
        self.db.close()

    def test_01_successful_student_registration(self):
        payload = RegisterRequest(
            email="test.student1@diu.edu.bd",
            password="StrongPassword2026",
            full_name="Candidate Student One",
            student_id="211-15-0001",
            department="Department of Computer Science and Engineering",
        )
        resp = register(payload, db=self.db)
        self.assertEqual(resp.role, "student")
        self.assertIsNotNone(resp.access_token)
        self.assertTrue(len(resp.access_token) > 20)

        # Verify database record
        user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        self.assertIsNotNone(user)
        self.assertEqual(user.role, UserRole.student)
        self.assertTrue(user.is_active)

        student = self.db.query(Student).filter(Student.user_id == user.id).first()
        self.assertIsNotNone(student)
        self.assertEqual(student.student_id, "211-15-0001")
        self.assertEqual(student.full_name, "Candidate Student One")

    def test_02_duplicate_email_rejection(self):
        payload = RegisterRequest(
            email="test.student1@diu.edu.bd",  # same email as test 1
            password="AnotherPassword123",
            full_name="Candidate Student Duplicate",
            student_id="211-15-0002",
            department="Department of Software Engineering",
        )
        with self.assertRaises(HTTPException) as ctx:
            register(payload, db=self.db)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Email already registered", ctx.exception.detail)

    def test_03_duplicate_student_id_rejection(self):
        payload = RegisterRequest(
            email="test.student2@diu.edu.bd",
            password="AnotherPassword123",
            full_name="Candidate Student Unique Email",
            student_id="211-15-0001",  # duplicate student ID from test 1
            department="Department of Software Engineering",
        )
        with self.assertRaises(HTTPException) as ctx:
            register(payload, db=self.db)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("Student ID already registered", ctx.exception.detail)

    def test_04_password_hashing_verification(self):
        user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        self.assertIsNotNone(user)
        # Verify plain password is NOT stored
        self.assertNotEqual(user.password_hash, "StrongPassword2026")
        # Verify Argon2id prefix and format
        self.assertTrue(user.password_hash.startswith("$argon2id$"))
        # Verify hash verification helper
        self.assertTrue(verify_password("StrongPassword2026", user.password_hash))
        self.assertFalse(verify_password("WrongPassword123", user.password_hash))

    def test_05_successful_login(self):
        login_payload = LoginRequest(
            email="test.student1@diu.edu.bd",
            password="StrongPassword2026",
        )
        resp = login(login_payload, db=self.db)
        self.assertIsNotNone(resp.access_token)
        self.assertEqual(resp.role, "student")
        self.assertEqual(resp.token_type, "bearer")

        # Decode token and verify claims
        payload, err = decode_token(resp.access_token)
        self.assertIsNone(err)
        self.assertEqual(payload["role"], "student")
        self.assertIn("jti", payload)

    def test_06_incorrect_password_rejection(self):
        login_payload = LoginRequest(
            email="test.student1@diu.edu.bd",
            password="IncorrectPassword999",
        )
        with self.assertRaises(HTTPException) as ctx:
            login(login_payload, db=self.db)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Incorrect email or password", ctx.exception.detail)

    def test_07_invalid_jwt_rejection(self):
        invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.signature"
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(token=invalid_token, db=self.db)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Could not validate credentials", ctx.exception.detail)

    def test_08_expired_jwt_rejection(self):
        user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        expired_token = create_access_token(
            {"sub": str(user.id), "role": user.role.value},
            expires_delta=timedelta(seconds=-60),  # expired 60s ago
        )
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(token=expired_token, db=self.db)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Token has expired", ctx.exception.detail)

    def test_09_authenticated_api_auth_me(self):
        user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        auth_user = get_current_user(token=token, db=self.db)

        me_response = get_me(current_user=auth_user, db=self.db)
        self.assertEqual(me_response.id, user.id)
        self.assertEqual(me_response.email, "test.student1@diu.edu.bd")
        self.assertEqual(me_response.role, UserRole.student)
        self.assertTrue(me_response.is_active)
        self.assertIsNotNone(me_response.profile)
        self.assertEqual(me_response.profile.student_id, "211-15-0001")
        # Ensure password_hash is not in the serialized model
        self.assertFalse(hasattr(me_response, "password_hash"))

    def test_10_unauthenticated_api_auth_me(self):
        # Empty or missing token
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(token="", db=self.db)
        self.assertEqual(ctx.exception.status_code, 401)

    def test_11_successful_logout(self):
        user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        auth_user = get_current_user(token=token, db=self.db)

        logout_resp = logout(current_user=auth_user, token=token, db=self.db)
        self.assertEqual(logout_resp.message, "Logged out successfully")

        # Verify entry in revoked_tokens table
        payload, _ = decode_token(token)
        jti = payload["jti"]
        revoked_entry = self.db.query(RevokedToken).filter(RevokedToken.jti == jti).first()
        self.assertIsNotNone(revoked_entry)
        self.assertEqual(revoked_entry.user_id, user.id)

    def test_12_revoked_token_rejection(self):
        user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        auth_user = get_current_user(token=token, db=self.db)

        # Logout to revoke token
        logout(current_user=auth_user, token=token, db=self.db)

        # Subsequent attempt to access using the revoked token must fail with HTTP 401
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(token=token, db=self.db)
        self.assertEqual(ctx.exception.status_code, 401)
        self.assertIn("Token has been revoked", ctx.exception.detail)

    def test_13_student_role_authorization(self):
        student_user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        # Student access allowed for student
        self.assertEqual(require_student(current_user=student_user), student_user)

        # Create supervisor user
        supervisor_user = User(
            email="test.supervisor1@diu.edu.bd",
            password_hash=hash_password("SupervisorPass2026"),
            role=UserRole.supervisor,
            is_active=True,
        )
        self.db.add(supervisor_user)
        self.db.commit()

        # Student access rejected for supervisor
        with self.assertRaises(HTTPException) as ctx:
            require_student(current_user=supervisor_user)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Student access required", ctx.exception.detail)

    def test_14_supervisor_role_authorization(self):
        student_user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        supervisor_user = self.db.query(User).filter(User.email == "test.supervisor1@diu.edu.bd").first()

        # Supervisor access allowed for supervisor
        self.assertEqual(require_supervisor(current_user=supervisor_user), supervisor_user)

        # Supervisor access rejected for student
        with self.assertRaises(HTTPException) as ctx:
            require_supervisor(current_user=student_user)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Supervisor access required", ctx.exception.detail)

    def test_15_admin_role_authorization(self):
        student_user = self.db.query(User).filter(User.email == "test.student1@diu.edu.bd").first()
        supervisor_user = self.db.query(User).filter(User.email == "test.supervisor1@diu.edu.bd").first()

        # Create admin user
        admin_user = User(
            email="test.admin1@diu.edu.bd",
            password_hash=hash_password("AdminPass2026"),
            role=UserRole.admin,
            is_active=True,
        )
        self.db.add(admin_user)
        self.db.commit()

        # Admin access allowed for admin
        self.assertEqual(require_admin(current_user=admin_user), admin_user)

        # Admin also satisfies require_student and require_supervisor
        self.assertEqual(require_student(current_user=admin_user), admin_user)
        self.assertEqual(require_supervisor(current_user=admin_user), admin_user)

        # Admin access rejected for student
        with self.assertRaises(HTTPException) as ctx:
            require_admin(current_user=student_user)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Admin access required", ctx.exception.detail)

        # Admin access rejected for supervisor
        with self.assertRaises(HTTPException) as ctx:
            require_admin(current_user=supervisor_user)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Admin access required", ctx.exception.detail)

    def test_16_inactive_account_rejection(self):
        # Create an inactive student user
        inactive_user = User(
            email="inactive.user@diu.edu.bd",
            password_hash=hash_password("InactivePass2026"),
            role=UserRole.student,
            is_active=False,
        )
        self.db.add(inactive_user)
        self.db.commit()

        # 1. Login attempt must be rejected with HTTP 403
        with self.assertRaises(HTTPException) as ctx:
            login(LoginRequest(email="inactive.user@diu.edu.bd", password="InactivePass2026"), db=self.db)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("Account is deactivated", ctx.exception.detail)

        # 2. Token-based request attempt must be rejected with HTTP 403
        inactive_token = create_access_token({"sub": str(inactive_user.id), "role": "student"})
        with self.assertRaises(HTTPException) as ctx:
            get_current_user(token=inactive_token, db=self.db)
        self.assertEqual(ctx.exception.status_code, 403)
        self.assertIn("User account is inactive", ctx.exception.detail)


if __name__ == "__main__":
    print("=" * 65)
    print("ROSS-SEARCH — Running Phase 3A Authentication & Authorization Tests")
    print("=" * 65)
    suite = unittest.TestLoader().loadTestsFromTestCase(Phase3AAuthTestCase)
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    if result.wasSuccessful():
        print("\n>>> ALL 16 PHASE 3A TESTS PASSED SUCCESSFULLY! <<<")
        sys.exit(0)
    else:
        print("\n>>> TESTS FAILED <<<")
        sys.exit(1)

