from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.core.dependencies import get_db, require_admin
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.team import Team
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

