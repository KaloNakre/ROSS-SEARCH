from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, require_admin
from app.models.user import User
from app.models.student import Student, student_interests
from app.models.research_interest import ResearchInterest
from app.schemas.student import StudentOut, StudentProfileUpdate, InterestUpdateRequest

router = APIRouter(prefix="/api/students", tags=["Students"])


def _enrich(student: Student, db: Session) -> dict:
    """Attach email from User table to StudentOut."""
    out = StudentOut.model_validate(student)
    out.email = student.user.email if student.user else None
    return out


@router.get("/me", response_model=StudentOut)
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(404, "Student profile not found")
    result = StudentOut.model_validate(student)
    result.email = current_user.email
    return result


@router.put("/me", response_model=StudentOut)
def update_my_profile(
    payload: StudentProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(404, "Student profile not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(student, field, value)
    db.commit()
    db.refresh(student)
    result = StudentOut.model_validate(student)
    result.email = current_user.email
    return result


@router.put("/me/interests", response_model=StudentOut)
def update_my_interests(
    payload: InterestUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(404, "Student profile not found")
    interests = db.query(ResearchInterest).filter(ResearchInterest.id.in_(payload.interest_ids)).all()
    student.interests = interests
    db.commit()
    db.refresh(student)
    result = StudentOut.model_validate(student)
    result.email = current_user.email
    return result


@router.get("/section/{section}", response_model=List[StudentOut])
def search_by_section(
    section: str,
    interest: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Student).filter(Student.section == section)
    if interest:
        q = q.join(Student.interests).filter(ResearchInterest.name.ilike(f"%{interest}%"))
    students = q.all()
    result = []
    for s in students:
        out = StudentOut.model_validate(s)
        out.email = s.user.email if s.user else None
        result.append(out)
    return result


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(404, "Student not found")
    out = StudentOut.model_validate(student)
    out.email = student.user.email if student.user else None
    return out


@router.get("/", response_model=List[StudentOut])
def list_students(
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    q = db.query(Student)
    if search:
        q = q.filter(Student.full_name.ilike(f"%{search}%"))
    students = q.offset(skip).limit(limit).all()
    result = []
    for s in students:
        out = StudentOut.model_validate(s)
        out.email = s.user.email if s.user else None
        result.append(out)
    return result

