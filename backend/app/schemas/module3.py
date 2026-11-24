from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==============================================================================
# 1. Academic Templates Schemas
# ==============================================================================

class AcademicTemplateBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    file_name: str = Field(..., min_length=3, max_length=200)
    file_path: Optional[str] = None
    file_type: str = Field("pptx", description="pptx, ppt, docx, pdf")
    category: str = Field("proposal", description="proposal, defense, thesis, guideline")
    description: Optional[str] = None
    file_size_kb: Optional[int] = 250

class AcademicTemplateCreate(AcademicTemplateBase):
    pass

class AcademicTemplateOut(AcademicTemplateBase):
    id: int
    download_count: int
    is_active: bool
    uploaded_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# 2. Project Submissions & Feedback Schemas
# ==============================================================================

class ProjectSubmissionCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=250)
    phase: str = Field("proposal", description="proposal, lit_review, methodology, prototype, final_thesis")
    version: Optional[int] = 1
    file_name: str = Field(..., min_length=3, max_length=250)
    file_path: Optional[str] = None
    file_size_kb: Optional[int] = 500
    document_text: Optional[str] = None
    team_id: Optional[int] = None

class ProjectSubmissionReview(BaseModel):
    status: str = Field(..., description="approved, revision_required, rejected, under_review")
    feedback_remarks: str = Field(..., min_length=5, max_length=2000)

class ProjectSubmissionOut(BaseModel):
    id: int
    team_id: Optional[int] = None
    student_id: int
    supervisor_id: Optional[int] = None
    title: str
    phase: str
    version: int
    file_name: str
    file_path: Optional[str] = None
    file_size_kb: int
    status: str
    feedback_remarks: Optional[str] = None
    reviewer_name: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# 3. Project Milestones Schemas
# ==============================================================================

class ProjectMilestoneBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = None
    phase_order: int = 1
    deadline: datetime
    status: str = "pending"
    progress_percentage: int = 0

class ProjectMilestoneCreate(ProjectMilestoneBase):
    team_id: int

class ProjectMilestoneUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None
    progress_percentage: Optional[int] = None
    completed_at: Optional[datetime] = None

class ProjectMilestoneOut(ProjectMilestoneBase):
    id: int
    team_id: int
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# 4. AI Document Checking Schemas
# ==============================================================================

class DetectedSectionItem(BaseModel):
    section_name: str
    status: str  # present, incomplete, missing
    confidence: float
    excerpt: Optional[str] = None

class GrammarSpellingItem(BaseModel):
    type: str  # spelling, grammar, academic_tone, punctuation
    issue: str
    suggestion: str
    context: Optional[str] = None

class ProposalDocumentCheckRequest(BaseModel):
    document_title: str
    document_type: str = "proposal"  # proposal, pptx_presentation, thesis_chapter
    raw_text: Optional[str] = None
    target_template_id: Optional[int] = None

class ProposalDocumentCheckOut(BaseModel):
    id: Optional[int] = None
    document_title: str
    document_type: str
    overall_compliance_score: int  # 0 to 100
    structure_status: str  # compliant, partially_compliant, non_compliant
    detected_sections: List[DetectedSectionItem]
    missing_sections: List[str]
    grammar_spelling_issues: List[GrammarSpellingItem]
    summary_findings: str
    recommendations: str
    created_at: datetime


# ==============================================================================
# 5. AI Practice Viva Preparation Schemas
# ==============================================================================

class VivaQuestionItem(BaseModel):
    id: int
    category: str  # objectives, methodology, dataset, results, limitations, novelty
    question: str
    model_answer_points: List[str]
    defense_tips: str
    difficulty: str  # Moderate, Challenging, Core

class VivaGenerateRequest(BaseModel):
    project_title: str
    domain: str
    abstract: Optional[str] = None
    document_text: Optional[str] = None
    questions_count: Optional[int] = 6

class VivaSessionOut(BaseModel):
    id: int
    student_id: int
    team_id: Optional[int] = None
    project_title: str
    domain: str
    questions_count: int
    questions_data: List[VivaQuestionItem]
    ai_engine: str
    created_at: datetime

    class Config:
        from_attributes = True


# ==============================================================================
# 6. Departmental FYP Analytics Schemas
# ==============================================================================

class DomainDistributionItem(BaseModel):
    domain: str
    count: int
    percentage: float

class SupervisorWorkloadItem(BaseModel):
    supervisor_id: int
    supervisor_name: str
    designation: str
    assigned_teams: int
    max_slots: int
    utilization_percentage: float
    status: str  # Available, Near Capacity, Full

class ProjectStageDistribution(BaseModel):
    proposal_stage: int
    literature_review: int
    development_prototype: int
    pre_defense: int
    completed: int

class DepartmentalAnalyticsOut(BaseModel):
    total_projects: int
    total_active_students: int
    total_supervisors: int
    overall_completion_rate: float
    domain_distribution: List[DomainDistributionItem]
    project_stages: ProjectStageDistribution
    supervisor_workloads: List[SupervisorWorkloadItem]
    average_compliance_score: float
    pending_supervisor_reviews: int
    upcoming_milestones_count: int
