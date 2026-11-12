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

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.database.connection import check_db_connection
from app.api.routes import auth

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
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Phase 3A: Mount Authentication Router
app.include_router(auth.router)


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
