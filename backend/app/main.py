import os
import sys

# Ensure backend directory and any shared packages are on Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
for p in [r"D:\Anaconda\Lib\site-packages", r"D:\Python\Lib\site-packages"]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.append(p)

from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.connection import check_db_connection, engine, SessionLocal
from app.database.base import Base
from app.models import user, student, supervisor, research_interest, team
from app.models.research_interest import ResearchInterest
from app.models.supervision_request import SupervisionRequest
from app.api.routes import auth, students, supervisors, teams, admin, research, supervision_requests


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ensure database tables exist and default seed data is populated on boot."""
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            if db.query(ResearchInterest).count() == 0:
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
                print("[ROSS-SEARCH Startup] Seeded default DIU research domains.")
        finally:
            db.close()
    except Exception as e:
        print(f"[ROSS-SEARCH Startup Notice] Database initialization: {e}")
    yield


# OpenAPI metadata description
TAGS_METADATA = [
    {
        "name": "Health",
        "description": "System health and database connectivity diagnostics.",
    },
    {
        "name": "Authentication",
        "description": "Student registration, login, logout, and token management.",
    },
    {
        "name": "Students",
        "description": "Student profiles, academic records, and domain preferences.",
    },
    {
        "name": "Supervisors",
        "description": "Supervisor directory, research expertise, and thesis slot management.",
    },
    {
        "name": "Teams",
        "description": "FYP and thesis team formation, member management, and collaboration.",
    },
    {
        "name": "Supervision Requests",
        "description": "Student supervision request flow — send, accept, reject, and dashboard.",
    },
    {
        "name": "Admin",
        "description": "System administration, user role management, and operational stats.",
    },
]

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "ROSS-SEARCH Backend API — A Research-Oriented Smart Search and Shared Knowledge Platform "
        "for FYP and Thesis Development at Daffodil International University (DIU)."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=TAGS_METADATA,
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Modular API Routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(supervisors.router)
app.include_router(teams.router)
app.include_router(admin.router)
app.include_router(research.router)
app.include_router(supervision_requests.router)


@app.get("/", tags=["Health"], summary="API Root")
def root():
    """Root endpoint verifying API availability and active version."""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs",
        "health": "/api/health",
        "auth": "/api/auth"
    }


@app.get(
    "/api/health",
    tags=["Health"],
    summary="Service Health Check",
    response_description="Current system and database health status"
)
def health_check():
    """
    Health check endpoint verifying:
    - API operational state
    - Live database connectivity status
    """
    db_connected = check_db_connection()
    status_code = status.HTTP_200_OK if db_connected else status.HTTP_503_SERVICE_UNAVAILABLE
    
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "healthy" if db_connected else "degraded",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "database": {
                "connected": db_connected,
                "url_target": settings.DATABASE_URL.split("@")[-1] if "@" in settings.DATABASE_URL else settings.DATABASE_URL.split("///")[-1],
                "type": "postgresql" if "postgres" in settings.DATABASE_URL else "sqlite"
            }
        }
    )


@app.get(
    "/api/database/overview",
    tags=["Health"],
    summary="Module 1 Database Tables & Status Overview",
    response_description="Summary of all Module 1 database tables and row counts"
)
def database_overview():
    """
    Provides a live, public overview of all Module 1 tables and records.
    Allows easy verification of system database state from any browser.
    """
    from app.models.user import User
    from app.models.student import Student, StudentInterest
    from app.models.supervisor import Supervisor, SupervisorExpertise
    from app.models.research_interest import ResearchInterest
    from app.models.team import Team, TeamMember
    from app.models.supervision_request import SupervisionRequest

    db = SessionLocal()
    try:
        tables = {
            "users": {
                "description": "User accounts and role-based access (student, supervisor, admin)",
                "count": db.query(User).count(),
            },
            "students": {
                "description": "Student profiles, academic ID, department, section",
                "count": db.query(Student).count(),
            },
            "supervisors": {
                "description": "Faculty supervisor profiles, slots, and availability",
                "count": db.query(Supervisor).count(),
            },
            "research_interests": {
                "description": "Research domains (ML, NLP, Cybersecurity, etc.)",
                "count": db.query(ResearchInterest).count(),
            },
            "supervisor_expertise": {
                "description": "Junction table linking supervisors to research domains",
                "count": db.query(SupervisorExpertise).count(),
            },
            "student_interests": {
                "description": "Junction table linking students to preferred research domains",
                "count": db.query(StudentInterest).count(),
            },
            "teams": {
                "description": "FYP/Thesis teams created by students",
                "count": db.query(Team).count(),
            },
            "team_members": {
                "description": "Students joined in thesis teams",
                "count": db.query(TeamMember).count(),
            },
            "supervision_requests": {
                "description": "Supervision requests sent by students to supervisors (pending, accepted, rejected)",
                "count": db.query(SupervisionRequest).count(),
            },
        }
        return {
            "status": "online",
            "module": "Module 1: User, Supervisor and Team Management",
            "database_type": "postgresql" if "postgres" in settings.DATABASE_URL else "sqlite",
            "total_tables": len(tables),
            "tables": tables,
        }
    finally:
        db.close()

