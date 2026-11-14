from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.base import Base


class StudentInterest(Base):
    __tablename__ = "student_interests"
    __table_args__ = (
        UniqueConstraint("student_id", "interest_id", name="uq_student_interest"),
    )

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    interest_id = Column(Integer, ForeignKey("research_interests.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    student = relationship("Student", back_populates="student_interest_items")
    interest = relationship("ResearchInterest")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    full_name = Column(String(200), nullable=False, index=True)
    student_id = Column(String(50), unique=True, nullable=False, index=True)
    department = Column(String(200), nullable=False)
    section = Column(String(20), nullable=True, index=True)
    batch = Column(String(50), nullable=True)
    phone = Column(String(30), nullable=True)
    bio = Column(Text, nullable=True)
    project_title = Column(String(500), nullable=True)
    preferred_domain = Column(String(200), nullable=True, index=True)
    profile_image_url = Column(String(500), nullable=True)
    team_status = Column(String(50), default="Looking for Team", index=True)

    user = relationship("User", backref="student_profile")
    student_interest_items = relationship("StudentInterest", back_populates="student", cascade="all, delete-orphan")
    interests = relationship("ResearchInterest", secondary="student_interests", viewonly=True)
    team_memberships = relationship("TeamMember", back_populates="student")


student_interests = StudentInterest
