from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class PreviousProjectOut(BaseModel):
    id: int
    title: str
    abstract: str
    domain: str
    batch: str
    year: int
    supervisor_name: str
    team_members: str
    keywords: Optional[str] = None
    grade: Optional[str] = "A+"
    github_or_paper_url: Optional[str] = None

    class Config:
        from_attributes = True

class AcademicPaperOut(BaseModel):
    id: int
    title: str
    authors: str
    year: int
    domain: str
    venue: str
    citations: int
    abstract: str
    keywords: List[str]
    pdf_url: str
    download_url: str
    key_findings: str

class StructuredPaperSummary(BaseModel):
    title: Optional[str] = "Research Paper"
    authors: Optional[str] = "Unknown Authors"
    year: Optional[int] = 2026
    domain: Optional[str] = "Computer Science"
    ai_engine: Optional[str] = "PyMuPDF Neural NLP Engine"
    problem_statement: str
    objectives: str
    methodology: str
    dataset: str
    model_technology: str
    findings: str
    limitations: str
    research_gap: str
    future_work: str

class SharedPaperKnowledgeCreate(BaseModel):
    title: str
    authors: str
    year: Optional[int] = 2026
    journal_or_conference: Optional[str] = None
    domain: str
    uploaded_by_name: Optional[str] = None
    uploaded_by_id: Optional[str] = None
    file_name: Optional[str] = None
    abstract: Optional[str] = None
    problem_statement: str
    objectives: str
    methodology: str
    dataset: str
    model_technology: str
    findings: str
    limitations: str
    research_gap: str
    future_work: str

class SharedPaperKnowledgeOut(SharedPaperKnowledgeCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SimilarityCheckRequest(BaseModel):
    title: str
    abstract: Optional[str] = ""
    domain: Optional[str] = None

class MatchedProjectComparison(BaseModel):
    id: int
    title: str
    batch: str
    year: int
    supervisor_name: str
    similarity_percentage: float
    matched_keywords: List[str]
    overlap_analysis: str

class SimilarityCheckResponse(BaseModel):
    query_title: str
    query_domain: Optional[str]
    highest_similarity: float
    risk_level: str  # "Original", "Low", "Moderate", "High Duplicate Risk"
    can_register: bool
    duplicate_conflict_details: Optional[str] = None
    verdict_summary: str
    top_matches: List[MatchedProjectComparison]
    recommendation: str
    ai_novelty_suggestions: List[str]

class RegisterThesisTopicRequest(BaseModel):
    title: str
    domain: Optional[str] = None
