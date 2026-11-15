import os
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
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
]


DEMO_STUDENTS = [
    {
        "email": "robayet.cse@diu.edu.bd",
        "full_name": "Robayet Islam",
        "student_id": "232-35-809",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Natural Language Processing",
        "phone": "+880 1711 000809",
        "created_days_ago": 5,
    },
    {
        "email": "kamal.hossain@diu.edu.bd",
        "full_name": "Kamal Hossain",
        "student_id": "201-15-102",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Machine Learning",
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
        "phone": "+880 1711 100103",
        "created_days_ago": 4,
    },
    {
        "email": "tamim.sami@diu.edu.bd",
        "full_name": "Tamim Hasan Sami",
        "student_id": "201-15-313",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Machine Learning",
        "phone": "+880 1711 100313",
        "created_days_ago": 4,
    },
    {
        "email": "riya.saha@diu.edu.bd",
        "full_name": "Riya Saha",
        "student_id": "201-15-715",
        "department": "Department of Computer Science and Engineering",
        "section": "60_A",
        "preferred_domain": "Cyber Security",
        "phone": "+880 1711 100715",
        "created_days_ago": 3,
    },
    {
        "email": "tanvir.ahmed@diu.edu.bd",
        "full_name": "Tanvir Ahmed",
        "student_id": "201-15-204",
        "department": "Department of Software Engineering",
        "section": "60_B",
        "preferred_domain": "Cloud Computing & DevOps",
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
        "phone": "+880 1711 100408",
        "created_days_ago": 1,
    },
]


def run_demo_seeder(db: Session):
    """Seed 4 supervisors and 10 students if not already populated."""
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
            seeded_supervisors_count += 1

    # 2. Seed Students
    for st_data in DEMO_STUDENTS:
        user = db.query(User).filter(User.email == st_data["email"]).first()
        if not user:
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
                phone=st_data["phone"],
            )
            db.add(student)
            seeded_students_count += 1

    db.commit()
    return {
        "success": True,
        "seeded_supervisors": seeded_supervisors_count,
        "seeded_students": seeded_students_count,
        "message": f"Successfully loaded {seeded_supervisors_count} faculty supervisors and {seeded_students_count} student accounts."
    }
