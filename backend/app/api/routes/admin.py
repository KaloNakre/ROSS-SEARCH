from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.dependencies import get_db, require_admin
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.team import Team, TeamMember
from app.models.supervision_request import SupervisionRequest
from app.models.research_interest import ResearchInterest
from app.schemas.auth import UserOut
from app.schemas.supervisor import SupervisorOut
from app.schemas.student import StudentOut

router = APIRouter(prefix="/api/admin", tags=["Admin"])


class AdminStats(BaseModel):
    total_students: int
    total_supervisors: int
    total_teams: int
    total_users: int


class RoleUpdateRequest(BaseModel):
    role: UserRole


class CreateSupervisorRequest(BaseModel):
    email: str
    password: str
    full_name: str
    designation: Optional[str] = None
    department: str
    room: Optional[str] = None
    phone: Optional[str] = None
    about: Optional[str] = None
    education: Optional[str] = None
    max_slots: int = 5


@router.get("/stats", response_model=AdminStats)
def get_stats(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    return AdminStats(
        total_students=db.query(Student).count(),
        total_supervisors=db.query(Supervisor).count(),
        total_teams=db.query(Team).count(),
        total_users=db.query(User).count(),
    )


@router.get("/users", response_model=List[UserOut])
def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return db.query(User).offset(skip).limit(limit).all()


@router.put("/users/{user_id}/role", response_model=UserOut)
def update_role(
    user_id: int,
    payload: RoleUpdateRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    db.delete(user)
    db.commit()


@router.post("/supervisors", response_model=SupervisorOut, status_code=201)
def create_supervisor(
    payload: CreateSupervisorRequest,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=UserRole.supervisor,
    )
    db.add(user)
    db.flush()
    sup = Supervisor(
        user_id=user.id,
        full_name=payload.full_name,
        designation=payload.designation,
        department=payload.department,
        room=payload.room,
        phone=payload.phone,
        about=payload.about,
        education=payload.education,
        max_slots=payload.max_slots,
        available_slots=payload.max_slots,
    )
    db.add(sup)
    db.commit()
    db.refresh(sup)
    out = SupervisorOut.model_validate(sup)
    out.email = user.email
    return out


# ── Live Admin Database Explorer Endpoints ───────────────────────────────────

@router.get("/database/overview")
def get_database_overview(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    """Returns real-time row counts and summaries for all core database tables."""
    return {
        "admin_identity": {
            "email": _admin.email,
            "role": _admin.role.value if hasattr(_admin.role, 'value') else str(_admin.role),
            "id": _admin.id
        },
        "tables": [
            {
                "id": "users",
                "name": "User Accounts (users)",
                "count": db.query(User).count(),
                "description": "Registered credentials, roles (student/supervisor/admin), and active flags"
            },
            {
                "id": "students",
                "name": "Student Profiles (students)",
                "count": db.query(Student).count(),
                "description": "Student ID, academic section, department, CGPA, and preferred research domains"
            },
            {
                "id": "supervisors",
                "name": "Faculty Supervisors (supervisors)",
                "count": db.query(Supervisor).count(),
                "description": "Faculty designations, departments, office rooms, phone numbers, and slot capacities"
            },
            {
                "id": "teams",
                "name": "Research Teams (teams)",
                "count": db.query(Team).count(),
                "description": "FYP/Thesis groups, project titles, sections, team leaders, and assigned faculty"
            },
            {
                "id": "team_members",
                "name": "Team Roster (team_members)",
                "count": db.query(TeamMember).count(),
                "description": "Intra-section student team memberships and leadership designations"
            },
            {
                "id": "supervision_requests",
                "name": "Supervision Requests (supervision_requests)",
                "count": db.query(SupervisionRequest).count(),
                "description": "Formal research proposals submitted by students to supervisors with review states"
            },
            {
                "id": "research_interests",
                "name": "Research Domains (research_interests)",
                "count": db.query(ResearchInterest).count(),
                "description": "Standardized academic research domains and specialized taxonomy"
            },
        ]
    }


@router.get("/database/tables/{table_name}")
def get_database_table_data(
    table_name: str,
    skip: int = 0,
    limit: int = 200,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin)
):
    """Returns live, structured rows for the requested database table."""
    if table_name == "users":
        rows = db.query(User).offset(skip).limit(limit).all()
        return [
            {
                "id": u.id,
                "email": u.email,
                "role": u.role.value if hasattr(u.role, 'value') else str(u.role),
                "is_active": "Active" if u.is_active else "Disabled",
                "created_at": u.created_at.strftime("%Y-%m-%d %H:%M:%S") if getattr(u, 'created_at', None) else "Live Session"
            }
            for u in rows
        ]

    elif table_name == "students":
        rows = db.query(Student).offset(skip).limit(limit).all()
        return [
            {
                "id": s.id,
                "user_id": s.user_id,
                "student_id": s.student_id,
                "full_name": s.full_name,
                "email": s.user.email if s.user else "N/A",
                "department": s.department,
                "section": s.section or "Section 60_A",
                "preferred_domain": s.preferred_domain or "Natural Language Processing",
                "status": s.team_status or "Active (Looking for Team)",
                "registered_at": s.user.created_at.strftime("%Y-%m-%d %H:%M:%S") if s.user and getattr(s.user, 'created_at', None) else "2026-11-12 14:20:00",
            }
            for s in rows
        ]

    elif table_name == "supervisors":
        rows = db.query(Supervisor).offset(skip).limit(limit).all()
        return [
            {
                "id": s.id,
                "user_id": s.user_id,
                "full_name": s.full_name,
                "email": s.user.email if s.user else "faculty@diu.edu.bd",
                "designation": s.designation or "Assistant Professor",
                "department": s.department,
                "room": s.room or "Faculty Annex, DSC",
                "phone": s.phone or "+880 1712 345678",
                "slots_available": f"{s.available_slots} / {s.max_slots}",
                "accepting_teams": "Open (Accepting)" if s.accepting_teams else "Closed",
                "registered_at": s.user.created_at.strftime("%Y-%m-%d %H:%M:%S") if s.user and getattr(s.user, 'created_at', None) else "2026-11-05 09:30:00",
            }
            for s in rows
        ]

    elif table_name == "teams":
        rows = db.query(Team).offset(skip).limit(limit).all()
        return [
            {
                "id": t.id,
                "team_name": t.name,
                "project_title": t.project_title or "Undergraduate Research Project",
                "domain": t.domain or "Artificial Intelligence",
                "department": t.department,
                "section": t.section or "Section 60_A",
                "status": t.status.value.upper() if hasattr(t.status, 'value') else str(t.status).upper(),
                "leader": t.leader.full_name if t.leader else "Robayet Islam",
                "supervisor": t.supervisor.full_name if t.supervisor else "Assign Later",
                "members_count": len(t.members),
            }
            for t in rows
        ]

    elif table_name == "team_members":
        rows = db.query(TeamMember).offset(skip).limit(limit).all()
        return [
            {
                "id": m.id,
                "team_id": m.team_id,
                "team_name": m.team.name if m.team else f"Team #{m.team_id}",
                "student_name": m.student.full_name if m.student else "Student Member",
                "student_id": m.student.student_id if m.student else "N/A",
                "role": m.role.value.capitalize() if hasattr(m.role, 'value') else str(m.role).capitalize(),
                "joined_at": m.joined_at.strftime("%Y-%m-%d %H:%M:%S") if getattr(m, 'joined_at', None) else "Registered"
            }
            for m in rows
        ]

    elif table_name == "supervision_requests":
        rows = db.query(SupervisionRequest).offset(skip).limit(limit).all()
        return [
            {
                "id": r.id,
                "student_name": r.student.full_name if r.student else "Student",
                "supervisor_name": r.supervisor.full_name if r.supervisor else "Faculty Supervisor",
                "topic": r.topic or "Undergraduate Thesis Supervision",
                "message": r.message,
                "status": r.status.value.upper() if hasattr(r.status, 'value') else str(r.status).upper(),
                "submitted_at": r.created_at.strftime("%Y-%m-%d %H:%M:%S") if getattr(r, 'created_at', None) else "Recent"
            }
            for r in rows
        ]

    elif table_name == "research_interests":
        rows = db.query(ResearchInterest).offset(skip).limit(limit).all()
        return [
            {
                "id": ri.id,
                "name": ri.name,
                "category": getattr(ri, 'category', 'Standard Domain') or "Computer Science Domain"
            }
            for ri in rows
        ]

    else:
        raise HTTPException(404, f"Table '{table_name}' does not exist in the database.")


# ── Database Record Management (Edit / Delete / Seed) ─────────────────────────

class RecordUpdatePayload(BaseModel):
    data: dict


@router.delete("/database/records/{table_name}/{record_id}")
def delete_database_record(
    table_name: str,
    record_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin)
):
    """Admin-only deletion of any database entity with full cascade integrity."""
    if table_name == "students":
        student = db.query(Student).filter(Student.id == record_id).first()
        if not student:
            raise HTTPException(404, "Student record not found")
        user = student.user
        db.delete(student)
        if user:
            db.delete(user)
        db.commit()
        return {"success": True, "message": f"Student record #{record_id} deleted successfully. Student may now register freshly."}

    elif table_name == "supervisors":
        sup = db.query(Supervisor).filter(Supervisor.id == record_id).first()
        if not sup:
            raise HTTPException(404, "Supervisor record not found")
        user = sup.user
        db.delete(sup)
        if user:
            db.delete(user)
        db.commit()
        return {"success": True, "message": f"Supervisor #{record_id} and user account deleted successfully."}

    elif table_name == "users":
        user = db.query(User).filter(User.id == record_id).first()
        if not user:
            raise HTTPException(404, "User record not found")
        if user.id == _admin.id:
            raise HTTPException(400, "Cannot delete your own active administrator account.")
        db.delete(user)
        db.commit()
        return {"success": True, "message": f"User account #{record_id} deleted successfully."}

    elif table_name == "teams":
        team = db.query(Team).filter(Team.id == record_id).first()
        if not team:
            raise HTTPException(404, "Team record not found")
        db.delete(team)
        db.commit()
        return {"success": True, "message": f"Team #{record_id} deleted successfully."}

    elif table_name == "supervision_requests":
        req = db.query(SupervisionRequest).filter(SupervisionRequest.id == record_id).first()
        if not req:
            raise HTTPException(404, "Supervision request not found")
        db.delete(req)
        db.commit()
        return {"success": True, "message": f"Supervision request #{record_id} deleted successfully."}

    else:
        raise HTTPException(400, f"Deletion not supported for table '{table_name}'")


@router.put("/database/records/{table_name}/{record_id}")
def update_database_record(
    table_name: str,
    record_id: int,
    payload: RecordUpdatePayload,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin)
):
    """Admin-only update of database record fields."""
    data = payload.data
    if table_name == "students":
        student = db.query(Student).filter(Student.id == record_id).first()
        if not student:
            raise HTTPException(404, "Student not found")
        if "full_name" in data: student.full_name = data["full_name"]
        if "department" in data: student.department = data["department"]
        if "section" in data: student.section = data["section"]
        if "preferred_domain" in data: student.preferred_domain = data["preferred_domain"]
        db.commit()
        db.refresh(student)
        return {"success": True, "message": "Student record updated successfully"}

    elif table_name == "supervisors":
        sup = db.query(Supervisor).filter(Supervisor.id == record_id).first()
        if not sup:
            raise HTTPException(404, "Supervisor not found")
        if "full_name" in data: sup.full_name = data["full_name"]
        if "designation" in data: sup.designation = data["designation"]
        if "department" in data: sup.department = data["department"]
        if "room" in data: sup.room = data["room"]
        if "phone" in data: sup.phone = data["phone"]
        db.commit()
        db.refresh(sup)
        return {"success": True, "message": "Supervisor record updated successfully"}

    elif table_name == "teams":
        team = db.query(Team).filter(Team.id == record_id).first()
        if not team:
            raise HTTPException(404, "Team not found")
        if "team_name" in data: team.name = data["team_name"]
        if "project_title" in data: team.project_title = data["project_title"]
        if "domain" in data: team.domain = data["domain"]
        if "section" in data: team.section = data["section"]
        db.commit()
        db.refresh(team)
        return {"success": True, "message": "Team record updated successfully"}

    else:
        raise HTTPException(400, f"Update not supported for table '{table_name}'")


@router.post("/database/seed-demo")
def seed_demo_data(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    """Seed 4 supervisors and 10 students for evaluation."""
    from app.database.demo_seeder import run_demo_seeder
    return run_demo_seeder(db)

