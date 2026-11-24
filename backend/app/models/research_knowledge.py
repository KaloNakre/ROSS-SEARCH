from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from datetime import datetime
from app.database.base import Base

class PreviousProject(Base):
    """Previous departmental FYP / Thesis archive for DIU students."""
    __tablename__ = "previous_projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False, index=True)
    abstract = Column(Text, nullable=False)
    domain = Column(String(100), nullable=False, index=True)
    batch = Column(String(50), nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    supervisor_name = Column(String(150), nullable=False)
    team_members = Column(Text, nullable=False) # JSON or comma-separated string
    keywords = Column(String(300), nullable=True)
    grade = Column(String(10), nullable=True, default="A+")
    github_or_paper_url = Column(String(300), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AcademicPaperCache(Base):
    """Cached genuine peer-reviewed open-access papers from arXiv, Crossref, and repositories."""
    __tablename__ = "academic_papers_cache"

    id = Column(Integer, primary_key=True, index=True)
    doi = Column(String(150), unique=True, nullable=True, index=True)
    arxiv_id = Column(String(50), unique=True, nullable=True, index=True)
    title = Column(String(400), nullable=False, index=True)
    authors = Column(String(400), nullable=False)
    year = Column(Integer, nullable=False, index=True)
    domain = Column(String(100), nullable=False, index=True)
    venue = Column(String(200), nullable=True)
    citations = Column(Integer, default=0)
    citation_source = Column(String(100), default="OpenAlex/Crossref/arXiv")
    abstract = Column(Text, nullable=False)
    keywords = Column(String(400), nullable=True)
    pdf_url = Column(String(500), nullable=False)
    source_url = Column(String(500), nullable=True)
    is_open_access = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class StudentSavedPaper(Base):
    """Student's personal research library and reading list."""
    __tablename__ = "student_saved_papers"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    paper_cache_id = Column(Integer, nullable=True, index=True)
    title = Column(String(400), nullable=False)
    authors = Column(String(400), nullable=False)
    year = Column(Integer, nullable=True)
    domain = Column(String(100), nullable=True)
    venue = Column(String(200), nullable=True)
    abstract = Column(Text, nullable=True)
    doi = Column(String(150), nullable=True)
    arxiv_id = Column(String(50), nullable=True)
    pdf_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    reading_status = Column(String(50), default="unread")
    tags = Column(String(200), nullable=True)
    is_reading_list = Column(Boolean, default=True)
    is_downloaded = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)


class SharedPaperKnowledge(Base):
    """Shared database of research papers and AI-generated structured summaries for future students."""
    __tablename__ = "shared_paper_knowledge"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False, index=True)
    authors = Column(String(300), nullable=False)
    year = Column(Integer, nullable=True)
    journal_or_conference = Column(String(200), nullable=True)
    domain = Column(String(100), nullable=False, index=True)
    uploaded_by_name = Column(String(150), nullable=True)
    uploaded_by_id = Column(String(50), nullable=True)
    file_name = Column(String(200), nullable=True)
    paper_url = Column(String(500), nullable=True)
    abstract = Column(Text, nullable=True)
    ai_engine = Column(String(100), default="PyMuPDF Academic Neural Parser")

    # Complete 20-Point Structured Academic Research Analysis (Phase 4 Specification)
    research_objective = Column(Text, nullable=True)
    research_problem = Column(Text, nullable=True)
    research_gap = Column(Text, nullable=True)
    research_motivation = Column(Text, nullable=True)
    proposed_methodology = Column(Text, nullable=True)
    dataset_description = Column(Text, nullable=True)
    dataset_size = Column(Text, nullable=True)
    features_parameters = Column(Text, nullable=True)
    models_algorithms = Column(Text, nullable=True)
    experimental_setup = Column(Text, nullable=True)
    evaluation_metrics = Column(Text, nullable=True)
    experimental_results = Column(Text, nullable=True)
    accuracy_performance = Column(Text, nullable=True)
    strengths = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    future_directions = Column(Text, nullable=True)
    novel_contributions = Column(Text, nullable=True)
    related_work = Column(Text, nullable=True)
    important_findings = Column(Text, nullable=True)
    research_opportunities = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

class ResearchQueryLog(Base):
    """Audit log of student research discovery queries."""
    __tablename__ = "research_query_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String(150), nullable=True)
    student_id = Column(String(50), nullable=True)
    domain = Column(String(100), nullable=True)
    query_text = Column(String(300), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ExtensionDomainAuditLog(Base):
    """Security and domain intelligence audit log from browser extension."""
    __tablename__ = "extension_domain_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(200), nullable=False, index=True)
    target_url = Column(String(500), nullable=False)
    tls_active = Column(Boolean, default=True)
    risk_level = Column(String(50), default="LOW") # LOW, MODERATE, HIGH, CRITICAL
    security_score = Column(Integer, default=85)
    missing_headers = Column(Text, nullable=True)
    server_tech = Column(String(250), nullable=True)
    server_header = Column(String(150), nullable=True)
    hsts_enabled = Column(Boolean, default=False)
    csp_enabled = Column(Boolean, default=False)
    x_frame_options = Column(String(100), nullable=True)
    findings_summary = Column(Text, nullable=True)
    ai_analysis_report = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

