from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class AcademicTemplate(Base):
    """
    Official FYP/Thesis PPT, PPTX, DOCX, and PDF presentation and report templates
    managed by Administrators for students and supervisors.
    """
    __tablename__ = "academic_templates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    file_name = Column(String(200), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_type = Column(String(20), nullable=False, default="pptx")  # pptx, ppt, docx, pdf
    category = Column(String(50), nullable=False, default="proposal")  # proposal, defense, thesis, guideline
    description = Column(Text, nullable=True)
    file_size_kb = Column(Integer, default=250)
    download_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    uploader = relationship("User", foreign_keys=[uploaded_by])


class ProjectSubmission(Base):
    """
    Student project document submissions (proposals, reports, thesis drafts)
    supporting version control (v1, v2...), file attachments, and supervisor feedback.
    """
    __tablename__ = "project_submissions"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    supervisor_id = Column(Integer, ForeignKey("supervisors.id", ondelete="SET NULL"), nullable=True, index=True)
    title = Column(String(250), nullable=False)
    phase = Column(String(50), nullable=False, default="proposal")  # proposal, lit_review, methodology, prototype, final_thesis
    version = Column(Integer, nullable=False, default=1)
    file_name = Column(String(250), nullable=False)
    file_path = Column(String(500), nullable=True)
    file_size_kb = Column(Integer, default=500)
    document_text = Column(Text, nullable=True)  # Extracted text for AI checking & viva question generation
    status = Column(String(30), nullable=False, default="pending")  # pending, under_review, revision_required, approved, rejected
    feedback_remarks = Column(Text, nullable=True)
    reviewer_name = Column(String(150), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    team = relationship("Team", foreign_keys=[team_id])
    student = relationship("Student", foreign_keys=[student_id])
    supervisor = relationship("Supervisor", foreign_keys=[supervisor_id])


class ProjectMilestone(Base):
    """
    FYP/Thesis phase milestones, target deadlines, and completion tracking.
    """
    __tablename__ = "project_milestones"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    phase_order = Column(Integer, default=1)  # 1 to 5
    deadline = Column(DateTime, nullable=False)
    status = Column(String(30), default="pending")  # pending, in_progress, completed, overdue
    progress_percentage = Column(Integer, default=0)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    team = relationship("Team", foreign_keys=[team_id])


class ProposalDocumentCheck(Base):
    """
    AI document analysis records: checking proposal/thesis structure,
    required sections, grammar, spelling, and compliance score against official DIU templates.
    """
    __tablename__ = "proposal_document_checks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=True, index=True)
    document_title = Column(String(250), nullable=False)
    document_type = Column(String(50), default="proposal")  # proposal, pptx_presentation, thesis_chapter
    overall_compliance_score = Column(Integer, default=80)  # 0 to 100
    structure_status = Column(String(50), default="compliant")  # compliant, partially_compliant, non_compliant
    detected_sections = Column(JSON, nullable=True)  # List of identified sections
    missing_sections = Column(JSON, nullable=True)   # List of missing required sections
    grammar_spelling_issues = Column(JSON, nullable=True)  # List of grammar/syntax/clarity recommendations
    summary_findings = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", foreign_keys=[student_id])


class VivaPracticeSession(Base):
    """
    AI-generated defense and viva practice questions with model answers and evaluation rubrics.
    """
    __tablename__ = "viva_practice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="SET NULL"), nullable=True, index=True)
    project_title = Column(String(250), nullable=False)
    domain = Column(String(100), nullable=False)
    questions_count = Column(Integer, default=6)
    questions_data = Column(JSON, nullable=False)  # Array of question objects with category, question, model_answer, tips
    ai_engine = Column(String(100), default="DIU Academic Defense Neural Model")
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", foreign_keys=[student_id])
    team = relationship("Team", foreign_keys=[team_id])
