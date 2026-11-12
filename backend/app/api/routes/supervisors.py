from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, require_supervisor
from app.models.user import User, UserRole
from app.models.supervisor import Supervisor
from app.models.research_interest import ResearchInterest
from app.schemas.supervisor import SupervisorOut, SupervisorProfileUpdate, ExpertiseUpdateRequest

router = APIRouter(prefix="/api/supervisors", tags=["Supervisors"])


@router.get("/", response_model=List[SupervisorOut])
def list_supervisors(
    search: Optional[str] = Query(None, description="Search by name or expertise"),
    domain: Optional[str] = Query(None, description="Filter by research domain"),
    accepting: Optional[bool] = Query(None, description="Filter accepting_teams"),
    db: Session = Depends(get_db),
):
    q = db.query(Supervisor)
    if search:
        q = q.filter(
            Supervisor.full_name.ilike(f"%{search}%") |
            Supervisor.department.ilike(f"%{search}%")
        )
    if domain:
        q = q.join(Supervisor.expertise).filter(ResearchInterest.name.ilike(f"%{domain}%"))
    if accepting is not None:
        q = q.filter(Supervisor.accepting_teams == accepting)
    supervisors = q.all()
    result = []
    for s in supervisors:
        out = SupervisorOut.model_validate(s)
        out.email = s.user.email if s.user else None
        result.append(out)
    return result


@router.get("/me", response_model=SupervisorOut)
def get_my_profile(current_user: User = Depends(require_supervisor), db: Session = Depends(get_db)):
    sup = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
    if not sup:
        raise HTTPException(404, "Supervisor profile not found")
    out = SupervisorOut.model_validate(sup)
    out.email = current_user.email
    return out


@router.put("/me", response_model=SupervisorOut)
def update_my_profile(
    payload: SupervisorProfileUpdate,
    current_user: User = Depends(require_supervisor),
    db: Session = Depends(get_db),
):
    sup = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
    if not sup:
        raise HTTPException(404, "Supervisor profile not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(sup, field, value)
    db.commit()
    db.refresh(sup)
    out = SupervisorOut.model_validate(sup)
    out.email = current_user.email
    return out


@router.put("/me/expertise", response_model=SupervisorOut)
def update_expertise(
    payload: ExpertiseUpdateRequest,
    current_user: User = Depends(require_supervisor),
    db: Session = Depends(get_db),
):
    sup = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
    if not sup:
        raise HTTPException(404, "Supervisor profile not found")
    interests = db.query(ResearchInterest).filter(ResearchInterest.id.in_(payload.interest_ids)).all()
    sup.expertise = interests
    db.commit()
    db.refresh(sup)
    out = SupervisorOut.model_validate(sup)
    out.email = current_user.email
    return out


@router.get("/{supervisor_id}", response_model=SupervisorOut)
def get_supervisor(supervisor_id: int, db: Session = Depends(get_db)):
    sup = db.query(Supervisor).filter(Supervisor.id == supervisor_id).first()
    if not sup:
        raise HTTPException(404, "Supervisor not found")
    out = SupervisorOut.model_validate(sup)
    out.email = sup.user.email if sup.user else None
    return out

