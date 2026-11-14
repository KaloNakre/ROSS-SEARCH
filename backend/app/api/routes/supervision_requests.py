from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.supervision_request import SupervisionRequest, RequestStatus
from app.schemas.supervision_request import (
    SupervisionRequestCreate,
    SupervisionRequestOut,
    SupervisionRequestRespond,
)

router = APIRouter(prefix="/api/supervision-requests", tags=["Supervision Requests"])


def _enrich(req: SupervisionRequest) -> SupervisionRequestOut:
    """Attach human-readable names to a request object."""
    out = SupervisionRequestOut.model_validate(req)
    if req.supervisor:
        out.supervisor_name = req.supervisor.full_name
        out.supervisor_department = req.supervisor.department
    if req.student:
        out.student_name = req.student.full_name
        out.student_id_code = req.student.student_id
    return out


# ─────────────────────────── Student endpoints ───────────────────────────────

@router.post("/", response_model=SupervisionRequestOut, status_code=status.HTTP_201_CREATED)
def send_request(
    payload: SupervisionRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Student submits a supervision request to a chosen faculty member.
    Only one active (pending/accepted) request per supervisor is allowed at a time.
    """
    if current_user.role != UserRole.student:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can send supervision requests")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    supervisor = db.query(Supervisor).filter(Supervisor.id == payload.supervisor_id).first()
    if not supervisor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supervisor not found")

    if not supervisor.accepting_teams:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This supervisor is not currently accepting new students"
        )

    # Reject duplicate active requests
    existing = (
        db.query(SupervisionRequest)
        .filter(
            SupervisionRequest.student_id == student.id,
            SupervisionRequest.supervisor_id == payload.supervisor_id,
            SupervisionRequest.status.in_([RequestStatus.pending, RequestStatus.accepted]),
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active request with this supervisor"
        )

    req = SupervisionRequest(
        student_id=student.id,
        supervisor_id=payload.supervisor_id,
        message=payload.message,
        status=RequestStatus.pending,
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return _enrich(req)


@router.get("/my-requests", response_model=List[SupervisionRequestOut])
def get_my_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Student views all their own supervision requests and their current status."""
    if current_user.role != UserRole.student:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can view their requests")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    requests = (
        db.query(SupervisionRequest)
        .filter(SupervisionRequest.student_id == student.id)
        .order_by(SupervisionRequest.created_at.desc())
        .all()
    )
    return [_enrich(r) for r in requests]


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
def withdraw_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Student withdraws a pending supervision request."""
    if current_user.role != UserRole.student:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only students can withdraw requests")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found")

    req = db.query(SupervisionRequest).filter(
        SupervisionRequest.id == request_id,
        SupervisionRequest.student_id == student.id,
    ).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    if req.status != RequestStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be withdrawn"
        )

    req.status = RequestStatus.withdrawn
    db.commit()


# ─────────────────────────── Supervisor endpoints ────────────────────────────

@router.get("/incoming", response_model=List[SupervisionRequestOut])
def get_incoming_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Supervisor views all incoming student supervision requests."""
    if current_user.role not in (UserRole.supervisor, UserRole.admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only supervisors can view incoming requests")

    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
    if not supervisor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supervisor profile not found")

    requests = (
        db.query(SupervisionRequest)
        .filter(SupervisionRequest.supervisor_id == supervisor.id)
        .order_by(SupervisionRequest.created_at.desc())
        .all()
    )
    return [_enrich(r) for r in requests]


@router.put("/{request_id}/accept", response_model=SupervisionRequestOut)
def accept_request(
    request_id: int,
    body: SupervisionRequestRespond = SupervisionRequestRespond(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Supervisor accepts a pending student supervision request.
    Decrements available_slots on the supervisor record.
    """
    if current_user.role != UserRole.supervisor:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only supervisors can accept requests")

    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
    if not supervisor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supervisor profile not found")

    req = db.query(SupervisionRequest).filter(
        SupervisionRequest.id == request_id,
        SupervisionRequest.supervisor_id == supervisor.id,
    ).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    if req.status != RequestStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be accepted"
        )

    if supervisor.available_slots <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No available supervision slots remaining"
        )

    req.status = RequestStatus.accepted
    req.response_note = body.response_note
    supervisor.available_slots = max(0, supervisor.available_slots - 1)
    db.commit()
    db.refresh(req)
    return _enrich(req)


@router.put("/{request_id}/reject", response_model=SupervisionRequestOut)
def reject_request(
    request_id: int,
    body: SupervisionRequestRespond = SupervisionRequestRespond(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Supervisor rejects a pending student supervision request."""
    if current_user.role != UserRole.supervisor:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only supervisors can reject requests")

    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
    if not supervisor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supervisor profile not found")

    req = db.query(SupervisionRequest).filter(
        SupervisionRequest.id == request_id,
        SupervisionRequest.supervisor_id == supervisor.id,
    ).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")

    if req.status != RequestStatus.pending:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending requests can be rejected"
        )

    req.status = RequestStatus.rejected
    req.response_note = body.response_note
    db.commit()
    db.refresh(req)
    return _enrich(req)


# ─────────────────────────── Supervisor dashboard ────────────────────────────

@router.get("/dashboard/stats")
def supervisor_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Supervisor dashboard summary: pending requests count, accepted students,
    available slots, and total registered students in the system.
    """
    if current_user.role not in (UserRole.supervisor, UserRole.admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Supervisors only")

    supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
    if not supervisor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Supervisor profile not found")

    from app.models.student import Student as StudentModel
    total_students = db.query(StudentModel).count()
    pending = db.query(SupervisionRequest).filter(
        SupervisionRequest.supervisor_id == supervisor.id,
        SupervisionRequest.status == RequestStatus.pending,
    ).count()
    accepted = db.query(SupervisionRequest).filter(
        SupervisionRequest.supervisor_id == supervisor.id,
        SupervisionRequest.status == RequestStatus.accepted,
    ).count()

    return {
        "supervisor_id": supervisor.id,
        "full_name": supervisor.full_name,
        "available_slots": supervisor.available_slots,
        "max_slots": supervisor.max_slots,
        "accepting_teams": supervisor.accepting_teams,
        "pending_requests": pending,
        "accepted_students": accepted,
        "total_registered_students": total_students,
    }

