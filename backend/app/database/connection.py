from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# Engine configuration:
# PostgreSQL uses connection pooling with pool_pre_ping to automatically recover dropped connections.
# SQLite requires check_same_thread: False for multi-threaded FastAPI dev servers.
try:
    if settings.DATABASE_URL.startswith("sqlite"):
        connect_args = {"check_same_thread": False}
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args=connect_args,
            echo=False
        )
    else:
        engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            echo=False
        )
except Exception as e:
    # Fallback to dev engine if driver missing or URI invalid
    print(f"[ROSS-SEARCH Database Warning] Could not initialize engine for {settings.DATABASE_URL}: {e}")
    engine = create_engine("sqlite:///./ross_search.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def check_db_connection() -> bool:
    """Test actual database connectivity."""
    try:
        with engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
