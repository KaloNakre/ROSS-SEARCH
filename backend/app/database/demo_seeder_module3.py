from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.team import Team, TeamMember, TeamStatus, MemberRole
from app.models.module3 import (
    AcademicTemplate,
    ProjectSubmission,
    ProjectMilestone,
    ProposalDocumentCheck,
    VivaPracticeSession
)

DEMO_TEMPLATES = [
    {
        "title": "Official DIU FYP Proposal Master PPTX Template",
        "file_name": "DIU_FYP_Proposal_Master_Template.pptx",
        "file_path": "/templates/DIU_FYP_Proposal_Master_Template.pptx",
        "file_type": "pptx",
        "category": "proposal",
        "description": "Standard Daffodil International University proposal presentation deck. Contains approved slide master with Problem Statement, Objectives, Lit Review, Methodology, Timeline, and References slides.",
        "file_size_kb": 420
    },
    {
        "title": "Final Thesis Defense Slide Deck Master Template",
        "file_name": "DIU_Thesis_Defense_Deck_Master.pptx",
        "file_path": "/templates/DIU_Thesis_Defense_Deck_Master.pptx",
        "file_type": "pptx",
        "category": "defense",
        "description": "Official 20-slide thesis defense deck with DIU institutional typography, experimental result tables, confusion matrix graphics, and contribution rubrics.",
        "file_size_kb": 580
    },
    {
        "title": "Standard FYP Final Report Word & LaTeX Template",
        "file_name": "DIU_Thesis_Report_Standard.docx",
        "file_path": "/templates/DIU_Thesis_Report_Standard.docx",
        "file_type": "docx",
        "category": "thesis",
        "description": "IEEE-compliant dissertation layout with pre-configured Chapter 1-5 styles, declaration page, certificate of approval, and automated table of contents.",
        "file_size_kb": 310
    },
    {
        "title": "Departmental FYP & Thesis Academic Style Guide (PDF)",
        "file_name": "DIU_FYP_Academic_Style_Guide.pdf",
        "file_path": "/templates/DIU_FYP_Academic_Style_Guide.pdf",
        "file_type": "pdf",
        "category": "guideline",
        "description": "Official Department of Computer Science & Engineering guide detailing citation formatting, plagiarism clearance thresholds (<20%), and grading criteria.",
        "file_size_kb": 890
    }
]

def run_module3_seeder(db: Session):
    """Seed initial official academic templates, project milestones, and review submissions."""
    now = datetime.utcnow()

    # Find admin user for uploader attribution
    admin_user = db.query(User).filter(User.role == UserRole.admin).first()
    admin_id = admin_user.id if admin_user else None

    # 1. Seed Templates
    seeded_templates = 0
    for tmpl_data in DEMO_TEMPLATES:
        exists = db.query(AcademicTemplate).filter(AcademicTemplate.file_name == tmpl_data["file_name"]).first()
        if not exists:
            tmpl = AcademicTemplate(
                title=tmpl_data["title"],
                file_name=tmpl_data["file_name"],
                file_path=tmpl_data["file_path"],
                file_type=tmpl_data["file_type"],
                category=tmpl_data["category"],
                description=tmpl_data["description"],
                file_size_kb=tmpl_data["file_size_kb"],
                download_count=18,
                is_active=True,
                uploaded_by=admin_id
            )
            db.add(tmpl)
            seeded_templates += 1
    db.commit()

    # 1b. Seed Demo Teams if none exist
    students = db.query(Student).all()
    supervisors = db.query(Supervisor).all()
    if db.query(Team).count() == 0 and len(students) >= 4 and len(supervisors) >= 2:
        # Team 1: NLP Explorers
        team1 = Team(
            name="Neural NLP Explorers",
            description="Transformer architecture optimization for low-resource Bengali sentiment analysis.",
            domain="Natural Language Processing",
            leader_id=students[0].id,
            supervisor_id=supervisors[0].id,
            max_members=4,
            status=TeamStatus.active
        )
        db.add(team1)
        db.flush()

        db.add(TeamMember(team_id=team1.id, student_id=students[0].id, role=MemberRole.leader))
        db.add(TeamMember(team_id=team1.id, student_id=students[3].id, role=MemberRole.member))

        # Team 2: CyberGuard AI
        team2 = Team(
            name="CyberGuard Anomaly Detectors",
            description="Deep neural network log analysis for SCADA and ICS cyber-physical security.",
            domain="Cyber Security",
            leader_id=students[2].id,
            supervisor_id=supervisors[1].id,
            max_members=4,
            status=TeamStatus.active
        )
        db.add(team2)
        db.flush()

        db.add(TeamMember(team_id=team2.id, student_id=students[2].id, role=MemberRole.leader))
        db.add(TeamMember(team_id=team2.id, student_id=students[1].id, role=MemberRole.member))
        db.commit()

    # 2. Seed Milestones for existing teams
    seeded_milestones = 0
    teams = db.query(Team).all()
    for team in teams:
        existing_m = db.query(ProjectMilestone).filter(ProjectMilestone.team_id == team.id).first()
        if not existing_m:
            standard_phases = [
                ("Phase 1: Topic Proposal & Defense", "Submit formal proposal slide deck and register topic.", 1, now + timedelta(days=14), "completed", 100),
                ("Phase 2: Literature Review & Problem Formulation", "Comprehensive study of landmark papers, taxonomy, and research gaps.", 2, now + timedelta(days=45), "in_progress", 65),
                ("Phase 3: Methodology & Experimental Design", "Dataset curation, architectural design, and baseline benchmark setup.", 3, now + timedelta(days=75), "pending", 20),
                ("Phase 4: Implementation & Evaluation", "Model training, experimental results collection, and ablation study.", 4, now + timedelta(days=105), "pending", 0),
                ("Phase 5: Final Thesis Defense & Viva", "Final thesis draft submission, plagiarism clearance, and viva defense.", 5, now + timedelta(days=135), "pending", 0),
            ]
            for title, desc, p_order, deadline, status_val, progress_val in standard_phases:
                m = ProjectMilestone(
                    team_id=team.id,
                    title=title,
                    description=desc,
                    phase_order=p_order,
                    deadline=deadline,
                    status=status_val,
                    progress_percentage=progress_val,
                    completed_at=now - timedelta(days=2) if status_val == "completed" else None
                )
                db.add(m)
                seeded_milestones += 1
    db.commit()

    # 3. Seed Sample Project Submissions with Supervisor Reviews
    seeded_submissions = 0
    students = db.query(Student).all()
    supervisors = db.query(Supervisor).all()

    if students and supervisors:
        st1 = students[0]  # Arif Hossain
        sup1 = supervisors[0]  # Dr. Syed Tareq
        team1 = teams[0] if teams else None

        exists_sub1 = db.query(ProjectSubmission).filter(
            ProjectSubmission.title == "Formal Topic Proposal Slide Deck"
        ).first()

        if not exists_sub1:
            sub1 = ProjectSubmission(
                team_id=team1.id if team1 else None,
                student_id=st1.id,
                supervisor_id=sup1.id,
                title="Formal Topic Proposal Slide Deck",
                phase="proposal",
                version=1,
                file_name="NLP_Transformer_Proposal_v1.pptx",
                file_path="/uploads/submissions/NLP_Transformer_Proposal_v1.pptx",
                file_size_kb=450,
                document_text="Formal Research Proposal on Attention Is All You Need and Transformer Neural Models for Bengali NLP.",
                status="approved",
                feedback_remarks="Approved without reservations. Research objectives are clearly defined. Proceed immediately to Phase 2 Literature Review.",
                reviewer_name=sup1.full_name,
                reviewed_at=now - timedelta(days=3)
            )
            db.add(sub1)
            seeded_submissions += 1

        if len(students) > 1 and len(supervisors) > 1:
            st2 = students[1]  # Kamal Hossain
            sup2 = supervisors[1]  # Dr. Ashraf Ali
            team2 = teams[1] if len(teams) > 1 else None

            exists_sub2 = db.query(ProjectSubmission).filter(
                ProjectSubmission.title == "Decentralized Machine Learning Proposal v1"
            ).first()

            if not exists_sub2:
                sub2 = ProjectSubmission(
                    team_id=team2.id if team2 else None,
                    student_id=st2.id,
                    supervisor_id=sup2.id,
                    title="Decentralized Machine Learning Proposal v1",
                    phase="proposal",
                    version=1,
                    file_name="Federated_Learning_Proposal_v1.pptx",
                    file_path="/uploads/submissions/Federated_Learning_Proposal_v1.pptx",
                    file_size_kb=510,
                    document_text="Proposal for Privacy-Preserving Federated Learning across Edge Devices.",
                    status="revision_required",
                    feedback_remarks="Good conceptual direction. However, clarify the client-server aggregation protocol and specify which benchmark dataset will be used.",
                    reviewer_name=sup2.full_name,
                    reviewed_at=now - timedelta(days=5)
                )
                db.add(sub2)

                sub2_revised = ProjectSubmission(
                    team_id=team2.id if team2 else None,
                    student_id=st2.id,
                    supervisor_id=sup2.id,
                    title="Decentralized Machine Learning Proposal v2 (Revised)",
                    phase="proposal",
                    version=2,
                    file_name="Federated_Learning_Proposal_v2_Revised.pptx",
                    file_path="/uploads/submissions/Federated_Learning_Proposal_v2_Revised.pptx",
                    file_size_kb=530,
                    document_text="Revised Proposal incorporating Federated Averaging (FedAvg) protocol and MNIST/CIFAR-10 non-IID benchmarks.",
                    status="approved",
                    feedback_remarks="Revisions are satisfactory. Aggregation scheme is now mathematically grounded. Proposal is formally approved.",
                    reviewer_name=sup2.full_name,
                    reviewed_at=now - timedelta(days=1)
                )
                db.add(sub2_revised)
                seeded_submissions += 2

    db.commit()

    # 4. Seed Sample AI Document Check
    if students:
        st = students[0]
        exists_check = db.query(ProposalDocumentCheck).filter(ProposalDocumentCheck.student_id == st.id).first()
        if not exists_check:
            check = ProposalDocumentCheck(
                student_id=st.id,
                document_title="Attention Transformer Bengali NLP Proposal",
                document_type="proposal",
                overall_compliance_score=88,
                structure_status="compliant",
                detected_sections=[
                    {"section_name": "Title & Executive Abstract", "status": "present", "confidence": 0.98},
                    {"section_name": "Problem Statement & Motivation", "status": "present", "confidence": 0.95},
                    {"section_name": "Research Objectives & Scope", "status": "present", "confidence": 0.96},
                    {"section_name": "Literature Review & Related Work", "status": "present", "confidence": 0.92},
                    {"section_name": "Proposed Methodology & Architecture", "status": "present", "confidence": 0.94},
                    {"section_name": "Work Plan, Milestones & Timeline", "status": "present", "confidence": 0.90},
                    {"section_name": "References & Bibliography (IEEE/APA)", "status": "present", "confidence": 0.95}
                ],
                missing_sections=["Dataset & Experimental Setup"],
                grammar_spelling_issues=[
                    {"type": "academic_tone", "issue": "Informal phrase 'a lot of' detected.", "suggestion": "Replace with 'substantial volume of'."}
                ],
                summary_findings="Proposal meets DIU structural standards with high compliance.",
                recommendations="Add a dedicated subsection on dataset class distribution and tokenization splits."
            )
            db.add(check)
            db.commit()

    print(f"[Module 3 Seeder] Seeded {seeded_templates} templates, {seeded_milestones} milestones, {seeded_submissions} submissions.")
