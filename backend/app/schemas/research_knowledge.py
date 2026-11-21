from typing import List, Optional, Dict, Any
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
    id: Optional[int] = None
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
    arxiv_id: Optional[str] = None
    doi: Optional[str] = None
    source: Optional[str] = "Academic Repository"
    is_open_access: bool = True

class TwentyPointPaperAnalysis(BaseModel):
    title: Optional[str] = "Research Paper"
    authors: Optional[str] = "Identified in Document Metadata"
    year: Optional[int] = 2026
    domain: Optional[str] = "Computer Science"
    ai_engine: Optional[str] = "PyMuPDF Neural NLP Engine"
    confidence_score: Optional[float] = 0.95

    # 20 Academic Research Analysis Dimensions
    research_objective: str
    research_problem: str
    research_gap: str
    research_motivation: str
    proposed_methodology: str
    dataset_description: str
    dataset_size: str
    features_parameters: str
    models_algorithms: str
    experimental_setup: str
    evaluation_metrics: str
    experimental_results: str
    accuracy_performance: str
    strengths: str
    limitations: str
    future_directions: str
    novel_contributions: str
    related_work: str
    important_findings: str
    research_opportunities: str

    # Backward compatibility with 9-point keys
    problem_statement: Optional[str] = None
    objectives: Optional[str] = None
    methodology: Optional[str] = None
    dataset: Optional[str] = None
    model_technology: Optional[str] = None
    findings: Optional[str] = None
    future_work: Optional[str] = None

# Backward compatibility alias
StructuredPaperSummary = TwentyPointPaperAnalysis

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

    # Core 20 Points
    research_objective: Optional[str] = None
    research_problem: Optional[str] = None
    research_gap: Optional[str] = None
    research_motivation: Optional[str] = None
    proposed_methodology: Optional[str] = None
    dataset_description: Optional[str] = None
    dataset_size: Optional[str] = None
    features_parameters: Optional[str] = None
    models_algorithms: Optional[str] = None
    experimental_setup: Optional[str] = None
    evaluation_metrics: Optional[str] = None
    experimental_results: Optional[str] = None
    accuracy_performance: Optional[str] = None
    strengths: Optional[str] = None
    limitations: Optional[str] = None
    future_directions: Optional[str] = None
    novel_contributions: Optional[str] = None
    related_work: Optional[str] = None
    important_findings: Optional[str] = None
    research_opportunities: Optional[str] = None

    # Backward compatible fields
    problem_statement: Optional[str] = None
    objectives: Optional[str] = None
    methodology: Optional[str] = None
    dataset: Optional[str] = None
    model_technology: Optional[str] = None
    findings: Optional[str] = None
    future_work: Optional[str] = None

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

# --- Personal Reading List / Library Schemas ---
class SavedPaperCreate(BaseModel):
    title: str
    authors: Optional[str] = None
    year: Optional[int] = None
    domain: Optional[str] = None
    venue: Optional[str] = None
    abstract: Optional[str] = None
    doi: Optional[str] = None
    arxiv_id: Optional[str] = None
    pdf_url: Optional[str] = None
    notes: Optional[str] = None
    reading_status: Optional[str] = "unread"  # unread, reading, completed
    tags: Optional[str] = None

class SavedPaperUpdate(BaseModel):
    notes: Optional[str] = None
    reading_status: Optional[str] = None
    tags: Optional[str] = None

class SavedPaperOut(SavedPaperCreate):
    id: int
    student_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Public AI Research Chat Schemas ---
class ChatMessageItem(BaseModel):
    role: str  # 'user' | 'assistant' | 'system'
    content: str

class PublicChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessageItem]] = []
    context_paper_id: Optional[int] = None
    model_choice: Optional[str] = "auto"

class PublicChatResponse(BaseModel):
    reply: str
    model_used: str
    timestamp: datetime = datetime.utcnow()

# --- Browser Extension Domain Intelligence Schemas ---
class DomainAuditRequest(BaseModel):
    url_or_domain: str

class DomainAuditResponse(BaseModel):
    domain: str
    url: str
    tls_active: bool
    risk_level: str  # 'LOW', 'MODERATE', 'HIGH', 'CRITICAL'
    security_score: int  # 0 - 100
    security_headers: Dict[str, Any]
    missing_headers: List[str]
    server_technologies: List[str]
    ai_analysis_summary: str
    raw_status_code: Optional[int] = None
    audit_timestamp: datetime = datetime.utcnow()
