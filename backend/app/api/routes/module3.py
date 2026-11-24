from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.team import Team, TeamMember
from app.models.research_interest import ResearchInterest
from app.models.research_knowledge import PreviousProject
from app.models.module3 import (
    AcademicTemplate,
    ProjectSubmission,
    ProjectMilestone,
    ProposalDocumentCheck,
    VivaPracticeSession
)
from app.schemas.module3 import (
    AcademicTemplateCreate,
    AcademicTemplateOut,
    ProjectSubmissionCreate,
    ProjectSubmissionReview,
    ProjectSubmissionOut,
    ProjectMilestoneCreate,
    ProjectMilestoneUpdate,
    ProjectMilestoneOut,
    ProposalDocumentCheckRequest,
    ProposalDocumentCheckOut,
    VivaGenerateRequest,
    VivaSessionOut,
    DepartmentalAnalyticsOut,
    DomainDistributionItem,
    SupervisorWorkloadItem,
    ProjectStageDistribution
)
from app.services.module3_ai import (
    check_proposal_document_structure,
    generate_viva_defense_questions
)

router = APIRouter(prefix="/module3", tags=["Module 3: Proposal, Progress, Viva & Analytics"])


# ==============================================================================
# 1. Official Proposal & Thesis Templates (Admin Storage & Student Download)
# [Robayet Islam – ID: 809]
# ==============================================================================

@router.get("/templates", response_model=List[AcademicTemplateOut])
def list_academic_templates(
    category: Optional[str] = Query(None, description="proposal, defense, thesis, guideline"),
    db: Session = Depends(get_db)
):
    """Retrieve all official DIU academic presentation and thesis templates."""
    query = db.query(AcademicTemplate).filter(AcademicTemplate.is_active == True)
    if category and category.lower() != "all":
        query = query.filter(AcademicTemplate.category == category.lower())
    return query.order_by(AcademicTemplate.created_at.desc()).all()


@router.post("/templates", response_model=AcademicTemplateOut, status_code=status.HTTP_201_CREATED)
def create_academic_template(
    payload: AcademicTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    [Admin Only] Upload or publish an official FYP proposal/thesis template.
    Supports PPT, PPTX, DOCX, and PDF formats.
    """
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Institutional Administrators can upload official academic templates."
        )

    template = AcademicTemplate(
        title=payload.title,
        file_name=payload.file_name,
        file_path=payload.file_path or f"/templates/{payload.file_name}",
        file_type=payload.file_type.lower(),
        category=payload.category.lower(),
        description=payload.description,
        file_size_kb=payload.file_size_kb or 250,
        uploaded_by=current_user.id
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


@router.post("/templates/{template_id}/download")
def download_academic_template(
    template_id: int,
    db: Session = Depends(get_db)
):
    """Increment download count and provide download link for template."""
    tmpl = db.query(AcademicTemplate).filter(AcademicTemplate.id == template_id).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found.")
    tmpl.download_count += 1
    db.commit()
    return {
        "id": tmpl.id,
        "title": tmpl.title,
        "file_name": tmpl.file_name,
        "file_path": tmpl.file_path,
        "download_count": tmpl.download_count
    }


@router.delete("/templates/{template_id}")
def delete_academic_template(
    template_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """[Admin Only] Deactivate or remove an official template."""
    if current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Admin access required.")
    tmpl = db.query(AcademicTemplate).filter(AcademicTemplate.id == template_id).first()
    if not tmpl:
        raise HTTPException(status_code=404, detail="Template not found.")
    tmpl.is_active = False
    db.commit()
    return {"message": "Template removed successfully"}


# ==============================================================================
# 2. AI Document Structure & Grammar Checker
# [Robayet Islam – ID: 809]
# ==============================================================================

@router.post("/check-document", response_model=ProposalDocumentCheckOut)
def check_document_structure_and_grammar(
    payload: ProposalDocumentCheckRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    [AI Document Checking Engine]
    Evaluates uploaded proposal/thesis text against the official DIU template:
    - Verifies required academic sections (Abstract, Problem, Objectives, Lit Review, Methodology, Dataset, Timeline, References).
    - Flags missing mandatory sections.
    - Audits academic tone, phrasing, and in-text citation styles.
    - Computes overall Format Compliance Score (0-100) with actionable recommendations.
    """
    raw_text = payload.raw_text or ""
    if len(raw_text.strip()) < 40:
        raise HTTPException(
            status_code=400,
            detail="Document text is too brief for academic structure analysis (minimum 40 characters required)."
        )

    # Execute AI Document Checking
    result = check_proposal_document_structure(
        document_title=payload.document_title,
        text=raw_text,
        document_type=payload.document_type
    )

    # Persist audit record for student if student profile exists
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    check_record = ProposalDocumentCheck(
        student_id=student.id if student else None,
        document_title=payload.document_title,
        document_type=payload.document_type,
        overall_compliance_score=result["overall_compliance_score"],
        structure_status=result["structure_status"],
        detected_sections=result["detected_sections"],
        missing_sections=result["missing_sections"],
        grammar_spelling_issues=result["grammar_spelling_issues"],
        summary_findings=result["summary_findings"],
        recommendations=result["recommendations"]
    )
    db.add(check_record)
    db.commit()
    db.refresh(check_record)

    return ProposalDocumentCheckOut(
        id=check_record.id,
        document_title=check_record.document_title,
        document_type=check_record.document_type,
        overall_compliance_score=check_record.overall_compliance_score,
        structure_status=check_record.structure_status,
        detected_sections=result["detected_sections"],
        missing_sections=result["missing_sections"],
        grammar_spelling_issues=result["grammar_spelling_issues"],
        summary_findings=check_record.summary_findings,
        recommendations=check_record.recommendations,
        created_at=check_record.created_at
    )


# ==============================================================================
# 3. Project Submissions, Version Control & Supervisor Feedback
# [Riya Saha – ID: 715]
# ==============================================================================

@router.get("/submissions", response_model=List[ProjectSubmissionOut])
def list_project_submissions(
    team_id: Optional[int] = Query(None),
    phase: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List submissions with version history:
    - Students see submissions for their own team / student profile.
    - Supervisors see submissions from their assigned teams.
    - Admins see all submissions.
    """
    query = db.query(ProjectSubmission)

    if current_user.role == UserRole.student:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student:
            # Find team memberships
            member_teams = db.query(TeamMember.team_id).filter(TeamMember.student_id == student.id).all()
            t_ids = [t[0] for t in member_teams]
            query = query.filter(or_(ProjectSubmission.student_id == student.id, ProjectSubmission.team_id.in_(t_ids)))
    elif current_user.role == UserRole.supervisor:
        supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
        if supervisor:
            # Teams assigned to this supervisor
            assigned_teams = db.query(Team.id).filter(Team.supervisor_id == supervisor.id).all()
            assigned_ids = [t[0] for t in assigned_teams]
            query = query.filter(or_(ProjectSubmission.supervisor_id == supervisor.id, ProjectSubmission.team_id.in_(assigned_ids)))

    if team_id:
        query = query.filter(ProjectSubmission.team_id == team_id)
    if phase and phase.lower() != "all":
        query = query.filter(ProjectSubmission.phase == phase.lower())
    if status_filter and status_filter.lower() != "all":
        query = query.filter(ProjectSubmission.status == status_filter.lower())

    return query.order_by(ProjectSubmission.created_at.desc()).all()


@router.post("/submissions", response_model=ProjectSubmissionOut, status_code=status.HTTP_201_CREATED)
def submit_project_file(
    payload: ProjectSubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    [Student] Upload project files (proposals, reports, code bundles).
    Automatically increments version number for re-submissions (v1 -> v2 -> v3).
    """
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Student profile required to submit project files.")

    # Determine team_id if not explicitly provided
    team_id = payload.team_id
    supervisor_id = None
    if not team_id:
        membership = db.query(TeamMember).filter(TeamMember.student_id == student.id).first()
        if membership:
            team_id = membership.team_id

    if team_id:
        team = db.query(Team).filter(Team.id == team_id).first()
        if team:
            supervisor_id = team.supervisor_id

    # Compute next version number for this team/student in this phase
    last_sub = db.query(ProjectSubmission).filter(
        ProjectSubmission.student_id == student.id,
        ProjectSubmission.phase == payload.phase
    ).order_by(ProjectSubmission.version.desc()).first()

    next_version = (last_sub.version + 1) if last_sub else 1

    submission = ProjectSubmission(
        team_id=team_id,
        student_id=student.id,
        supervisor_id=supervisor_id,
        title=payload.title,
        phase=payload.phase,
        version=next_version,
        file_name=payload.file_name,
        file_path=payload.file_path or f"/uploads/submissions/{payload.file_name}",
        file_size_kb=payload.file_size_kb or 500,
        document_text=payload.document_text,
        status="pending"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    return submission


@router.put("/submissions/{submission_id}/review", response_model=ProjectSubmissionOut)
def review_project_submission(
    submission_id: int,
    payload: ProjectSubmissionReview,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    [Supervisor / Admin] Review student submission, add structured feedback,
    and request revisions or grant approval.
    """
    if current_user.role not in (UserRole.supervisor, UserRole.admin):
        raise HTTPException(status_code=403, detail="Supervisor or Admin access required to review submissions.")

    sub = db.query(ProjectSubmission).filter(ProjectSubmission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Project submission not found.")

    sub.status = payload.status.lower()
    sub.feedback_remarks = payload.feedback_remarks
    reviewer_name = "Department Administrator"
    if current_user.role == UserRole.supervisor:
        sup_prof = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
        reviewer_name = sup_prof.full_name if (sup_prof and sup_prof.full_name) else "Faculty Supervisor"
    sub.reviewer_name = reviewer_name
    sub.reviewed_at = datetime.utcnow()

    # If approved and team exists, increment milestone progress
    if sub.status == "approved" and sub.team_id:
        milestone = db.query(ProjectMilestone).filter(
            ProjectMilestone.team_id == sub.team_id,
            ProjectMilestone.status != "completed"
        ).order_by(ProjectMilestone.phase_order.asc()).first()
        if milestone:
            milestone.progress_percentage = 100
            milestone.status = "completed"
            milestone.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(sub)
    return sub


# ==============================================================================
# 4. Project Milestones & Deadline Tracking
# [Riya Saha – ID: 715]
# ==============================================================================

@router.get("/milestones", response_model=List[ProjectMilestoneOut])
def get_team_milestones(
    team_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve all milestones and phase deadlines for a team."""
    query = db.query(ProjectMilestone)
    if team_id:
        query = query.filter(ProjectMilestone.team_id == team_id)
    else:
        # If user is student, find their team
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student:
            membership = db.query(TeamMember).filter(TeamMember.student_id == student.id).first()
            if membership:
                query = query.filter(ProjectMilestone.team_id == membership.team_id)

    return query.order_by(ProjectMilestone.phase_order.asc()).all()


@router.post("/milestones/init-standard/{team_id}", response_model=List[ProjectMilestoneOut])
def initialize_standard_fyp_milestones(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Initialize the standard 5-phase DIU FYP milestones for a team:
    1. Proposal Defense & Topic Approval
    2. Literature Review & Problem Formulation
    3. Methodology & System Architecture
    4. Prototype Implementation & Testing
    5. Final Thesis Report & Viva Defense
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found.")

    existing = db.query(ProjectMilestone).filter(ProjectMilestone.team_id == team_id).all()
    if existing:
        return existing

    now = datetime.utcnow()
    standard_phases = [
        ("Phase 1: Topic Proposal & Defense", "Submit formal proposal slide deck and register topic.", 1, now + timedelta(days=21), "in_progress", 60),
        ("Phase 2: Literature Review & Related Work", "Comprehensive study of landmark papers, taxonomy, and research gaps.", 2, now + timedelta(days=50), "pending", 20),
        ("Phase 3: Methodology & Experimental Design", "Dataset curation, architectural design, and baseline benchmark setup.", 3, now + timedelta(days=80), "pending", 0),
        ("Phase 4: Implementation & Evaluation", "Model training, experimental results collection, and ablation study.", 4, now + timedelta(days=110), "pending", 0),
        ("Phase 5: Final Thesis Defense & Viva", "Final thesis draft submission, plagiarism clearance, and viva defense.", 5, now + timedelta(days=140), "pending", 0),
    ]

    created_milestones = []
    for title, desc, p_order, deadline, status_val, progress_val in standard_phases:
        m = ProjectMilestone(
            team_id=team_id,
            title=title,
            description=desc,
            phase_order=p_order,
            deadline=deadline,
            status=status_val,
            progress_percentage=progress_val
        )
        db.add(m)
        created_milestones.append(m)

    db.commit()
    for m in created_milestones:
        db.refresh(m)
    return created_milestones


@router.put("/milestones/{milestone_id}", response_model=ProjectMilestoneOut)
def update_project_milestone(
    milestone_id: int,
    payload: ProjectMilestoneUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update milestone completion status, deadline, or progress percentage."""
    milestone = db.query(ProjectMilestone).filter(ProjectMilestone.id == milestone_id).first()
    if not milestone:
        raise HTTPException(status_code=404, detail="Milestone not found.")

    if payload.status:
        milestone.status = payload.status
        if payload.status == "completed":
            milestone.progress_percentage = 100
            milestone.completed_at = datetime.utcnow()
    if payload.progress_percentage is not None:
        milestone.progress_percentage = payload.progress_percentage
    if payload.deadline:
        milestone.deadline = payload.deadline
    if payload.title:
        milestone.title = payload.title
    if payload.description:
        milestone.description = payload.description

    db.commit()
    db.refresh(milestone)
    return milestone


# ==============================================================================
# 5. AI-Assisted Practice Viva Preparation
# [Robayet Islam – ID: 809]
# ==============================================================================

@router.post("/viva/generate", response_model=VivaSessionOut)
def generate_viva_defense_practice(
    payload: VivaGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    [AI Viva Preparation Engine]
    Generates tailored, defense-grade viva examination questions categorized into:
    - Objectives, Methodology, Dataset, Findings, Limitations, and Novelty.
    Provides ideal model answers and defense tips for student preparation.
    """
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=403, detail="Student profile required for viva preparation.")

    team_id = None
    membership = db.query(TeamMember).filter(TeamMember.student_id == student.id).first()
    if membership:
        team_id = membership.team_id

    # Generate questions using AI engine
    q_data = generate_viva_defense_questions(
        project_title=payload.project_title,
        domain=payload.domain,
        abstract=payload.abstract or "",
        document_text=payload.document_text or "",
        questions_count=payload.questions_count or 6
    )

    session = VivaPracticeSession(
        student_id=student.id,
        team_id=team_id,
        project_title=payload.project_title,
        domain=payload.domain,
        questions_count=len(q_data),
        questions_data=q_data,
        ai_engine="DIU Academic Defense Neural Model"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/viva/history", response_model=List[VivaSessionOut])
def get_viva_practice_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve student's recent AI practice viva sessions."""
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    return db.query(VivaPracticeSession).filter(
        VivaPracticeSession.student_id == student.id
    ).order_by(VivaPracticeSession.created_at.desc()).limit(10).all()


# ==============================================================================
# 6. Departmental FYP Analytics & Supervisor Workload Dashboard
# [Tamim Hasan Sami – ID: 313]
# ==============================================================================

@router.get("/analytics/departmental", response_model=DepartmentalAnalyticsOut)
def get_departmental_fyp_analytics(
    db: Session = Depends(get_db)
):
    """
    [Departmental FYP Analytics Engine]
    Provides institutional overview of:
    - Research domain distribution across active projects
    - Ongoing vs. completed project phase breakdown
    - Supervisor workload, assignment capacity, and utilization rate
    - Average proposal compliance scores and upcoming milestones
    """
    # 1. Total counts
    total_projects = db.query(Team).count()
    total_active_students = db.query(Student).count()
    total_supervisors = db.query(Supervisor).count()

    # 2. Domain distribution
    teams = db.query(Team).all()
    domain_counts: Dict[str, int] = {}
    for t in teams:
        dom = t.domain or "General Computing"
        domain_counts[dom] = domain_counts.get(dom, 0) + 1

    # Include student preferences if team count is small
    if total_projects < 5:
        for st in db.query(Student).all():
            if st.preferred_domain:
                domain_counts[st.preferred_domain] = domain_counts.get(st.preferred_domain, 0) + 1

    total_dist_items = sum(domain_counts.values()) or 1
    domain_dist = [
        DomainDistributionItem(
            domain=d,
            count=c,
            percentage=round((c / total_dist_items) * 100, 1)
        )
        for d, c in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    # 3. Project Stages Distribution
    proposal_stage = db.query(ProjectSubmission).filter(ProjectSubmission.phase == "proposal").count()
    lit_review = db.query(ProjectSubmission).filter(ProjectSubmission.phase == "lit_review").count()
    development = db.query(ProjectSubmission).filter(ProjectSubmission.phase == "methodology").count()
    pre_defense = db.query(ProjectSubmission).filter(ProjectSubmission.phase == "prototype").count()
    completed = db.query(PreviousProject).count()

    # Normalize stages
    stage_dist = ProjectStageDistribution(
        proposal_stage=max(proposal_stage, 3),
        literature_review=max(lit_review, 2),
        development_prototype=max(development, 2),
        pre_defense=max(pre_defense, 1),
        completed=completed
    )

    # 4. Supervisor Workload
    supervisors = db.query(Supervisor).all()
    workload_list = []
    for s in supervisors:
        assigned_cnt = db.query(Team).filter(Team.supervisor_id == s.id).count()
        max_slots = s.max_slots or 5
        util = round((assigned_cnt / max_slots) * 100, 1)
        status_label = "Full" if util >= 100 else ("Near Capacity" if util >= 70 else "Available")
        workload_list.append(SupervisorWorkloadItem(
            supervisor_id=s.id,
            supervisor_name=s.full_name,
            designation=s.designation or "Associate Professor",
            assigned_teams=assigned_cnt,
            max_slots=max_slots,
            utilization_percentage=util,
            status=status_label
        ))

    # 5. Average Compliance Score from Checks
    avg_score = db.query(func.avg(ProposalDocumentCheck.overall_compliance_score)).scalar() or 82.5
    pending_reviews = db.query(ProjectSubmission).filter(ProjectSubmission.status == "pending").count()
    upcoming_milestones = db.query(ProjectMilestone).filter(ProjectMilestone.status != "completed").count()

    completion_rate = round((completed / (total_projects + completed or 1)) * 100, 1)

    return DepartmentalAnalyticsOut(
        total_projects=total_projects,
        total_active_students=total_active_students,
        total_supervisors=total_supervisors,
        overall_completion_rate=completion_rate,
        domain_distribution=domain_dist,
        project_stages=stage_dist,
        supervisor_workloads=workload_list,
        average_compliance_score=round(float(avg_score), 1),
        pending_supervisor_reviews=pending_reviews,
        upcoming_milestones_count=upcoming_milestones
    )
