from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
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
    abstract = Column(Text, nullable=True)

    # 9-point structured AI analysis according to ROSS-SEARCH Module 2 specifications
    problem_statement = Column(Text, nullable=False)
    objectives = Column(Text, nullable=False)
    methodology = Column(Text, nullable=False)
    dataset = Column(Text, nullable=False)
    model_technology = Column(Text, nullable=False)
    findings = Column(Text, nullable=False)
    limitations = Column(Text, nullable=False)
    research_gap = Column(Text, nullable=False)
    future_work = Column(Text, nullable=False)

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
