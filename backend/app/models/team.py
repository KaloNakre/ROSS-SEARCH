import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.base import Base


class TeamStatus(str, enum.Enum):
    forming = "In Formation"
    complete = "Formation Complete"
    active = "Active"
    closed = "Closed"


class MemberRole(str, enum.Enum):
    leader = "Leader"
    member = "Member"


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    project_title = Column(String(500), nullable=True)
    domain = Column(String(200), nullable=True, index=True)
    department = Column(String(200), nullable=True)
    section = Column(String(20), nullable=True, index=True)
    description = Column(Text, nullable=True)
    status = Column(SAEnum(TeamStatus), default=TeamStatus.forming, nullable=False, index=True)
    max_members = Column(Integer, default=5, nullable=False)
    leader_id = Column(Integer, ForeignKey("students.id", ondelete="SET NULL"), nullable=True, index=True)
    supervisor_id = Column(Integer, ForeignKey("supervisors.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    leader = relationship("Student", foreign_keys=[leader_id])
    supervisor = relationship("Supervisor", back_populates="teams")
    members = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"
    __table_args__ = (
        UniqueConstraint("team_id", "student_id", name="uq_team_student"),
    )

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(SAEnum(MemberRole), default=MemberRole.member, nullable=False)
    joined_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    team = relationship("Team", back_populates="members")
    student = relationship("Student", back_populates="team_memberships")
