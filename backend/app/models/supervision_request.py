from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Enum as SAEnum
from sqlalchemy.orm import relationship
import enum

from app.database.base import Base


class RequestStatus(str, enum.Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"
    withdrawn = "withdrawn"


class SupervisionRequest(Base):
    """
    Tracks a student's formal request to be supervised by a faculty member.
    One active request is enforced per student-supervisor pair at schema level.
    """
    __tablename__ = "supervision_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    supervisor_id = Column(
        Integer,
        ForeignKey("supervisors.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    status = Column(
        SAEnum(RequestStatus),
        default=RequestStatus.pending,
        nullable=False,
        index=True,
    )
    message = Column(Text, nullable=True)
    response_note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    student = relationship("Student", backref="supervision_requests")
    supervisor = relationship("Supervisor", backref="supervision_requests")

