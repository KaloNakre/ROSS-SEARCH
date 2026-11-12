from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.base import Base


class SupervisorExpertise(Base):
    __tablename__ = "supervisor_expertise"
    __table_args__ = (
        UniqueConstraint("supervisor_id", "interest_id", name="uq_supervisor_expertise"),
    )

    id = Column(Integer, primary_key=True, index=True)
    supervisor_id = Column(Integer, ForeignKey("supervisors.id", ondelete="CASCADE"), nullable=False, index=True)
    interest_id = Column(Integer, ForeignKey("research_interests.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    supervisor = relationship("Supervisor", back_populates="supervisor_expertise_items")
    interest = relationship("ResearchInterest")


class Supervisor(Base):
    __tablename__ = "supervisors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    full_name = Column(String(200), nullable=False, index=True)
    designation = Column(String(100), nullable=True)
    department = Column(String(200), nullable=False, index=True)
    room = Column(String(100), nullable=True)
    phone = Column(String(30), nullable=True)
    about = Column(Text, nullable=True)
    education = Column(String(300), nullable=True)
    available_slots = Column(Integer, default=5, nullable=False)
    max_slots = Column(Integer, default=5, nullable=False)
    accepting_teams = Column(Boolean, default=True, nullable=False, index=True)
    profile_image_url = Column(String(500), nullable=True)

    user = relationship("User", backref="supervisor_profile")
    supervisor_expertise_items = relationship("SupervisorExpertise", back_populates="supervisor", cascade="all, delete-orphan")
    expertise = relationship("ResearchInterest", secondary="supervisor_expertise", viewonly=True)
    publications = relationship("SupervisorPublication", back_populates="supervisor", cascade="all, delete-orphan")
    teams = relationship("Team", back_populates="supervisor")


class SupervisorPublication(Base):
    __tablename__ = "supervisor_publications"

    id = Column(Integer, primary_key=True, index=True)
    supervisor_id = Column(Integer, ForeignKey("supervisors.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(500), nullable=False)
    venue = Column(String(200), nullable=True)
    year = Column(Integer, nullable=True, index=True)

    supervisor = relationship("Supervisor", back_populates="publications")
