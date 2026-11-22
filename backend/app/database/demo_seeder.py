import os
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.student import Student, StudentInterest
from app.models.supervisor import Supervisor, SupervisorExpertise
from app.models.research_interest import ResearchInterest
from app.models.team import Team, TeamMember, MemberRole
from app.core.security import hash_password


DEMO_SUPERVISORS = [
    {
        "email": "dr.syed.tareq@diu.edu.bd",
        "full_name": "Dr. Syed Tareq",
        "designation": "Associate Professor",
        "department": "Department of Computer Science and Engineering",
        "room": "Faculty Annex-302, Daffodil Smart City",
        "phone": "+880 1712 345678",
        "about": "Research area focuses on Low-Resource Natural Language Processing, Transformer models, and Machine Learning.",
        "education": "Ph.D. in Computer Science (NUS); M.Sc. in CSE (BUET)",
        "available_slots": 4,
        "max_slots": 5,
        "accepting_teams": True,
        "created_days_ago": 12,
    },
    {
        "email": "dr.ashraf.ali@diu.edu.bd",
        "full_name": "Prof. Dr. Ashraf Ali",
        "designation": "Professor",
        "department": "Department of Computer Science and Engineering",
        "room": "Main Academic Bldg-402, DSC",
        "phone": "+880 1819 876543",
        "about": "Specializes in Cyber-Physical Systems Security, SCADA anomaly detection, and Distributed Network Protocols.",
        "education": "Ph.D. in Cyber Security (Melbourne); B.Sc. in CSE (DU)",
        "available_slots": 3,
        "max_slots": 5,
        "accepting_teams": True,
        "created_days_ago": 10,
    },
    {
        "email": "dr.rokibul.hasan@diu.edu.bd",
        "full_name": "Dr. Rokibul Hasan",
        "designation": "Assistant Professor",
        "department": "Department of Software Engineering",
        "room": "Engineering Annex-204, DSC",
        "phone": "+880 1911 234567",
        "about": "Research in Automated Software Quality Assurance, Cloud-Native Distributed Microservices, and DevOps Pipelines.",
        "education": "Ph.D. in Software Engineering (KAIST); B.Sc. in SWE (DIU)",
        "available_slots": 5,
        "max_slots": 5,
        "accepting_teams": True,
        "created_days_ago": 8,
    },
    {
        "email": "dr.nusrat.jahan@diu.edu.bd",
        "full_name": "Dr. Nusrat Jahan",
        "designation": "Associate Professor",
        "department": "Department of Computer Science and Engineering",
        "room": "Academic Annex-501, DSC",
        "phone": "+880 1612 987654",
        "about": "Working on Computer Vision, Medical Diagnostic Imaging, and Explainable AI in Diagnostic Radiography.",
        "education": "Ph.D. in Biomedical Informatics (UT Austin); M.Sc. in CSE (DU)",
        "available_slots": 2,
        "max_slots": 5,
        "accepting_teams": True,
        "created_days_ago": 6,
    },
    {
        "email": "dr.touhid.bhuiyan@diu.edu.bd",
        "full_name": "Prof. Dr. Touhid Bhuiyan",
        "designation": "Professor & Head",
        "department": "Department of Computer Science and Engineering",
        "room": "Main Academic Bldg-501, DSC",
        "phone": "+880 1713 456789",
        "about": "Research interests include Cyber Security, Information Assurance, Intelligent Threat Intelligence, and Trust Models in Cloud.",
        "education": "Ph.D. in Cyber Security (QUT, Australia); M.Sc. in CSE",
        "available_slots": 3,
        "max_slots": 5,
        "accepting_teams": True,
        "created_days_ago": 14,
    },
]


DEMO_STUDENTS = [
    {
        "email": "arif.hossain@diu.edu.bd",
        "full_name": "Arif Hossain",
        "student_id": "201-15-101",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Natural Language Processing",
        "project_title": "Bengali Sentiment Analysis and Opinion Mining Using Hybrid BiLSTM-BERT Models",
        "phone": "+880 1711 000101",
        "created_days_ago": 5,
    },
    {
        "email": "kamal.hossain@diu.edu.bd",
        "full_name": "Kamal Hossain",
        "student_id": "201-15-102",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Machine Learning",
        "project_title": "Federated Learning Optimization for Edge Device Model Training",
        "phone": "+880 1711 100102",
        "created_days_ago": 4,
    },
    {
        "email": "jamal.uddin@diu.edu.bd",
        "full_name": "Jamal Uddin",
        "student_id": "201-15-103",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Cyber Security",
        "project_title": "Cyber-Physical SCADA Network Threat Detection Using Deep Autoencoders",
        "phone": "+880 1711 100103",
        "created_days_ago": 4,
    },
    {
        "email": "nabila.chowdhury@diu.edu.bd",
        "full_name": "Nabila Chowdhury",
        "student_id": "201-15-104",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Machine Learning",
        "project_title": "Context-Aware Dialogue Systems using Bidirectional Attention",
        "phone": "+880 1711 100204",
        "created_days_ago": 4,
    },
    {
        "email": "farhan.islam@diu.edu.bd",
        "full_name": "Farhan Islam",
        "student_id": "201-15-105",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Cyber Security",
        "project_title": "Zero-Trust Cloud Architecture and Binary Memory Safety",
        "phone": "+880 1711 100205",
        "created_days_ago": 3,
    },
    {
        "email": "tanvir.ahmed@diu.edu.bd",
        "full_name": "Tanvir Ahmed",
        "student_id": "201-15-204",
        "department": "Department of Software Engineering",
        "section": "60_B",
        "preferred_domain": "Cloud Computing & DevOps",
        "project_title": "Cloud-Native Microservices Autoscaling Using Reinforcement Learning",
        "phone": "+880 1711 100204",
        "created_days_ago": 3,
    },
    {
        "email": "mehedi.hasan@diu.edu.bd",
        "full_name": "Mehedi Hasan",
        "student_id": "201-15-205",
        "department": "Department of Computer Science and Engineering",
        "section": "60_B",
        "preferred_domain": "Computer Vision",
        "project_title": "Automated Brain Tumor Segmentation from Multi-Modal MRI Using Attention U-Net",
        "phone": "+880 1711 100205",
        "created_days_ago": 2,
    },
    {
        "email": "sadia.afrin@diu.edu.bd",
        "full_name": "Sadia Afrin",
        "student_id": "201-15-306",
        "department": "Department of Computer Science and Engineering",
        "section": "61_A",
        "preferred_domain": "Data Science & Big Data",
        "project_title": "Real-Time Streaming Big Data Analytics for High-Volume Sensor Networks",
        "phone": "+880 1711 100306",
        "created_days_ago": 2,
    },
    {
        "email": "naimur.rahman@diu.edu.bd",
        "full_name": "Naimur Rahman",
        "student_id": "201-15-307",
        "department": "Department of Software Engineering",
        "section": "61_A",
        "preferred_domain": "Blockchain & Distributed Systems",
        "project_title": "Decentralized Academic Credential Verification Framework on Polygon",
        "phone": "+880 1711 100307",
        "created_days_ago": 1,
    },
    {
        "email": "farhana.yeasmin@diu.edu.bd",
        "full_name": "Farhana Yeasmin",
        "student_id": "201-15-408",
        "department": "Department of Computer Science and Engineering",
        "section": "60_C",
        "preferred_domain": "Bioinformatics & Healthcare AI",
        "project_title": "Early Stage Skin Melanoma Classification Using Explainable Deep CNNs",
        "phone": "+880 1711 100408",
        "created_days_ago": 1,
    },
]


def run_demo_seeder(db: Session):
    """Seed 5 supervisors and 10 students if not already populated."""
    now = datetime.now(timezone.utc)
    seeded_supervisors_count = 0
    seeded_students_count = 0

    # 1. Seed Supervisors
    for s_data in DEMO_SUPERVISORS:
        user = db.query(User).filter(User.email == s_data["email"]).first()
        if not user:
            created_time = now - timedelta(days=s_data["created_days_ago"])
            user = User(
                email=s_data["email"],
                password_hash=hash_password("Diu@12345"),
                role=UserRole.supervisor,
                is_active=True,
                created_at=created_time,
            )
            db.add(user)
            db.flush()

            sup = Supervisor(
                user_id=user.id,
                full_name=s_data["full_name"],
                designation=s_data["designation"],
                department=s_data["department"],
                room=s_data["room"],
                phone=s_data["phone"],
                about=s_data["about"],
                education=s_data["education"],
                available_slots=s_data["available_slots"],
                max_slots=s_data["max_slots"],
                accepting_teams=s_data["accepting_teams"],
            )
            db.add(sup)
            db.flush()
            seeded_supervisors_count += 1

            # Map supervisor expertise domains
            for interest in db.query(ResearchInterest).all():
                if interest.name.lower() in sup.about.lower():
                    exists_exp = db.query(SupervisorExpertise).filter(
                        SupervisorExpertise.supervisor_id == sup.id,
                        SupervisorExpertise.interest_id == interest.id
                    ).first()
                    if not exists_exp:
                        db.add(SupervisorExpertise(supervisor_id=sup.id, interest_id=interest.id))

    # 2. Seed Students
    for st_data in DEMO_STUDENTS:
        existing_user = db.query(User).filter(User.email == st_data["email"]).first()
        existing_matric = db.query(Student).filter(Student.student_id == st_data["student_id"]).first()
        if not existing_user and not existing_matric:
            created_time = now - timedelta(days=st_data["created_days_ago"], hours=2)
            user = User(
                email=st_data["email"],
                password_hash=hash_password("Diu@12345"),
                role=UserRole.student,
                is_active=True,
                created_at=created_time,
            )
            db.add(user)
            db.flush()

            student = Student(
                user_id=user.id,
                full_name=st_data["full_name"],
                student_id=st_data["student_id"],
                department=st_data["department"],
                section=st_data["section"],
                preferred_domain=st_data["preferred_domain"],
                project_title=st_data.get("project_title"),
                phone=st_data["phone"],
            )
            db.add(student)
            db.flush()
            seeded_students_count += 1

            # Map student interest junction
            interest = db.query(ResearchInterest).filter(
                ResearchInterest.name.ilike(f"%{st_data['preferred_domain']}%")
            ).first()
            if interest:
                exists_si = db.query(StudentInterest).filter(
                    StudentInterest.student_id == student.id,
                    StudentInterest.interest_id == interest.id
                ).first()
                if not exists_si:
                    db.add(StudentInterest(student_id=student.id, interest_id=interest.id))

    db.commit()
    return {
        "success": True,
        "seeded_supervisors": seeded_supervisors_count,
        "seeded_students": seeded_students_count,
        "message": f"Successfully loaded {seeded_supervisors_count} faculty supervisors and {seeded_students_count} student accounts."
    }
