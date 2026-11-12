import os
import sys

# Setup paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

for p in [r"D:\Anaconda\Lib\site-packages", r"D:\Python\Lib\site-packages"]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.append(p)

print("[1/5] Testing environment & dependency imports...", flush=True)
import fastapi
import uvicorn
import sqlalchemy
import pydantic
import alembic
import argon2
import jwt

print(f"  FastAPI: {fastapi.__version__}", flush=True)
print(f"  SQLAlchemy: {sqlalchemy.__version__}", flush=True)
print(f"  Pydantic: {pydantic.__version__}", flush=True)
print(f"  Alembic: {alembic.__version__}", flush=True)
print(f"  Argon2: {argon2.__name__}", flush=True)
print(f"  JWT: {jwt.__name__}", flush=True)

print("\n[2/5] Testing application configuration...", flush=True)
from app.core.config import settings
print(f"  App Name: {settings.APP_NAME}", flush=True)
print(f"  App Version: {settings.APP_VERSION}", flush=True)
print(f"  Database URL: {settings.DATABASE_URL}", flush=True)
print(f"  CORS Origins: {settings.cors_origins}", flush=True)

print("\n[3/5] Testing database models, schema & connectivity...", flush=True)
from app.database.connection import check_db_connection, SessionLocal
from app.models import (
    User, UserRole,
    Student, StudentInterest,
    Supervisor, SupervisorExpertise, SupervisorPublication,
    ResearchInterest,
    Team, TeamMember, TeamStatus, MemberRole
)
from sqlalchemy import text

db_ok = check_db_connection()
print(f"  Database connectivity test: {'PASSED' if db_ok else 'FAILED'}", flush=True)
assert db_ok is True, "Database connection check failed"

with SessionLocal() as session:
    result = session.execute(text("SELECT 1")).scalar()
    print(f"  Raw SQL query test: SELECT 1 -> {result}", flush=True)
    assert result == 1, "Raw SQL query failed"

    # Verify tables exist in database
    tables_query = session.execute(text("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")).fetchall()
    table_names = [t[0] for t in tables_query]
    print(f"  Verified Database Tables: {table_names}", flush=True)
    for expected in ["users", "students", "supervisors", "research_interests", "student_interests", "supervisor_expertise", "supervisor_publications", "teams", "team_members", "alembic_version"]:
        assert expected in table_names, f"Missing table: {expected}"
    print("  All 10 required database tables verified!", flush=True)

print("\n[4/5] Testing FastAPI routes & Swagger OpenAPI schema...", flush=True)
from app.main import app, root, health_check

# Test root function
res_root = root()
print(f"  GET / response: {res_root}", flush=True)
assert res_root["status"] == "online"

# Test health check function
res_health = health_check()
print(f"  GET /api/health status code: {res_health.status_code}", flush=True)
import json
health_body = json.loads(res_health.body.decode())
print(f"  GET /api/health body: {health_body}", flush=True)
assert res_health.status_code == 200
assert health_body["status"] == "healthy"

# Test OpenAPI Schema generation (Swagger documentation)
openapi_schema = app.openapi()
print(f"  OpenAPI Schema generated successfully!", flush=True)
print(f"  API Title: {openapi_schema['info']['title']}", flush=True)
print(f"  API Version: {openapi_schema['info']['version']}", flush=True)
print(f"  Documented Paths: {list(openapi_schema['paths'].keys())}", flush=True)
assert "/api/health" in openapi_schema["paths"]
assert "/" in openapi_schema["paths"]

print("\n[5/5] Testing Argon2 password hashing & JWT tokens...", flush=True)
from app.core.security import hash_password, verify_password, create_access_token, decode_token

hashed = hash_password("SecurePassword2026")
print(f"  Argon2 Hash Generated: {hashed[:35]}...", flush=True)
assert verify_password("SecurePassword2026", hashed) is True
assert verify_password("WrongPassword", hashed) is False
print("  Argon2 Verification: PASSED", flush=True)

token = create_access_token({"sub": "42", "role": "student"})
decoded = decode_token(token)
print(f"  JWT Token Created & Decoded: sub={decoded.get('sub')}, role={decoded.get('role')}", flush=True)
assert decoded.get("sub") == "42"
assert decoded.get("role") == "student"

print("\n========================================================")
print(">>> ALL PHASE 2 BACKEND FOUNDATION TESTS PASSED! <<<")
print("========================================================", flush=True)
