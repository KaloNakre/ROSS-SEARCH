from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.team import Team, TeamMember, MemberRole, TeamJoinRequest, JoinRequestStatus, TeamStatus
from app.schemas.team import (
    TeamCreate,
    TeamUpdate,
    TeamOut,
    TeamDetailOut,
    AddMemberRequest,
    TeamMemberOut,
    JoinRequestCreate,
    JoinRequestOut,
)

router = APIRouter(prefix="/api/teams", tags=["Teams"])


def _build_team_out(team: Team) -> TeamOut:
    out = TeamOut(
        id=team.id,
        name=team.name,
        project_title=team.project_title,
        domain=team.domain,
        department=team.department,
        section=team.section,
        description=team.description,
        status=team.status,
        max_members=team.max_members,
        leader_id=team.leader_id,
        supervisor_id=team.supervisor_id,
        supervisor_name=team.supervisor.full_name if team.supervisor else None,
        leader_name=team.leader.full_name if team.leader else None,
        members_count=len(team.members),
        created_at=team.created_at,
    )
    return out


def _build_team_detail(team: Team) -> TeamDetailOut:
    base = _build_team_out(team)
    members = []
    for m in team.members:
        members.append(TeamMemberOut(
            id=m.id,
            student_id=m.student_id,
            full_name=m.student.full_name if m.student else "Unknown",
            student_number=m.student.student_id if m.student else "",
            department=m.student.department if m.student else None,
            role=m.role,
        ))
    return TeamDetailOut(**base.model_dump(), members=members)


@router.post("/", response_model=TeamDetailOut, status_code=status.HTTP_201_CREATED)
def create_team(
    payload: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(400, "Only students can create teams")

    team = Team(
        name=payload.name,
        project_title=payload.project_title,
        domain=payload.domain,
        department=payload.department or student.department,
        section=payload.section or student.section,
        description=payload.description,
        max_members=payload.max_members,
        leader_id=student.id,
        supervisor_id=payload.supervisor_id,
    )
    db.add(team)
    db.flush()

    leader_member = TeamMember(team_id=team.id, student_id=student.id, role=MemberRole.leader)
    db.add(leader_member)
    db.commit()
    db.refresh(team)
    return _build_team_detail(team)


@router.get("/my-teams", response_model=List[TeamOut])
def my_teams(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []
    memberships = db.query(TeamMember).filter(TeamMember.student_id == student.id).all()
    return [_build_team_out(m.team) for m in memberships]


@router.get("/", response_model=List[TeamOut])
def search_teams(
    search: Optional[str] = Query(None),
    domain: Optional[str] = Query(None),
    section: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Team)
    if search:
        q = q.filter(Team.name.ilike(f"%{search}%") | Team.project_title.ilike(f"%{search}%"))
    if domain:
        q = q.filter(Team.domain.ilike(f"%{domain}%"))
    if section:
        q = q.filter(Team.section == section)
    teams = q.all()
    return [_build_team_out(t) for t in teams]


@router.get("/{team_id}", response_model=TeamDetailOut)
def get_team(team_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(404, "Team not found")
    return _build_team_detail(team)


@router.put("/{team_id}", response_model=TeamOut)
def update_team(
    team_id: int,
    payload: TeamUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(404, "Team not found")
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or (team.leader_id != student.id and current_user.role.value != "admin"):
        raise HTTPException(403, "Only the team leader or admin can update the team")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(team, field, value)
    db.commit()
    db.refresh(team)
    return _build_team_out(team)


@router.delete("/{team_id}", status_code=204)
def delete_team(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(404, "Team not found")
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or (team.leader_id != student.id and current_user.role.value != "admin"):
        raise HTTPException(403, "Only the team leader or admin can delete the team")

    # 1. Delete associated join requests
    db.query(TeamJoinRequest).filter(TeamJoinRequest.team_id == team.id).delete()

    # 2. Reset student status for all members
    for member in team.members:
        if member.student:
            member.student.team_status = "Looking for Team"

    # 3. Delete team (SQLAlchemy cascades all team_members)
    db.delete(team)
    db.commit()


@router.post("/{team_id}/members", response_model=TeamDetailOut)
def add_member(
    team_id: int,
    payload: AddMemberRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(404, "Team not found")
    if len(team.members) >= team.max_members:
        raise HTTPException(400, "Team is already full")
    if db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.student_id == payload.student_id).first():
        raise HTTPException(400, "Student is already a team member")
    member = TeamMember(team_id=team_id, student_id=payload.student_id, role=MemberRole.member)
    db.add(member)
    
    # Update student team status
    student = db.query(Student).filter(Student.id == payload.student_id).first()
    if student:
        student.team_status = "Assigned (Member)"
        
    db.commit()
    db.refresh(team)
    return _build_team_detail(team)


@router.delete("/{team_id}/members/{student_id}", response_model=TeamDetailOut)
def remove_member(
    team_id: int,
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(404, "Team not found")
    leader_student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not leader_student or (team.leader_id != leader_student.id and current_user.role.value != "admin"):
        raise HTTPException(403, "Only the team leader or admin can remove members")
    if team.leader_id == student_id:
        raise HTTPException(400, "Cannot remove the team leader")
    member = db.query(TeamMember).filter(TeamMember.team_id == team_id, TeamMember.student_id == student_id).first()
    if not member:
        raise HTTPException(404, "Member not found in this team")
    
    # Reset student status
    student = db.query(Student).filter(Student.id == student_id).first()
    if student:
        student.team_status = "Looking for Team"

    db.delete(member)
    db.commit()
    db.refresh(team)
    return _build_team_detail(team)


# ── Team Join Requests ("Add to the Team" Flow) ────────────────────────────────

def _build_join_request_out(req: TeamJoinRequest) -> JoinRequestOut:
    return JoinRequestOut(
        id=req.id,
        team_id=req.team_id,
        team_name=req.team.name if req.team else None,
        student_id=req.student_id,
        student_name=req.student.full_name if req.student else "Student",
        student_number=req.student.student_id if req.student else "",
        department=req.student.department if req.student else None,
        section=req.student.section if req.student else None,
        preferred_domain=req.student.preferred_domain if req.student else None,
        message=req.message,
        status=req.status.value if hasattr(req.status, 'value') else str(req.status),
        created_at=req.created_at,
    )


@router.post("/{team_id}/join-requests", response_model=JoinRequestOut, status_code=status.HTTP_201_CREATED)
def request_to_join_team(
    team_id: int,
    payload: JoinRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(400, "Only students can submit team join requests")

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(404, "Target team not found")

    # Check if team is full
    if len(team.members) >= team.max_members:
        raise HTTPException(400, "This team already has maximum members")

    # Check if student is already in a team
    existing_membership = db.query(TeamMember).filter(TeamMember.student_id == student.id).first()
    if existing_membership:
        raise HTTPException(400, "You are already a member of a research team. Leave your current team before requesting to join another.")

    # Check if duplicate pending request exists
    existing_req = db.query(TeamJoinRequest).filter(
        TeamJoinRequest.team_id == team_id,
        TeamJoinRequest.student_id == student.id,
        TeamJoinRequest.status == JoinRequestStatus.pending
    ).first()
    if existing_req:
        raise HTTPException(400, "You already have a pending join request for this team.")

    req = TeamJoinRequest(
        team_id=team_id,
        student_id=student.id,
        message=payload.message or "I would like to join your research team and collaborate on this project.",
        status=JoinRequestStatus.pending
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return _build_join_request_out(req)


@router.get("/{team_id}/join-requests", response_model=List[JoinRequestOut])
def get_team_join_requests(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(404, "Team not found")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or (team.leader_id != student.id and current_user.role.value != "admin"):
        raise HTTPException(403, "Only the team leader or administrator can view join requests")

    reqs = db.query(TeamJoinRequest).filter(
        TeamJoinRequest.team_id == team_id,
        TeamJoinRequest.status == JoinRequestStatus.pending
    ).all()
    return [_build_join_request_out(r) for r in reqs]


@router.get("/my/join-requests", response_model=List[JoinRequestOut])
def get_my_sent_join_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student:
        return []

    reqs = db.query(TeamJoinRequest).filter(TeamJoinRequest.student_id == student.id).all()
    return [_build_join_request_out(r) for r in reqs]


@router.post("/join-requests/{request_id}/accept", response_model=TeamDetailOut)
def accept_join_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(TeamJoinRequest).filter(TeamJoinRequest.id == request_id).first()
    if not req:
        raise HTTPException(404, "Join request not found")

    team = req.team
    if not team:
        raise HTTPException(404, "Associated team no longer exists")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or (team.leader_id != student.id and current_user.role.value != "admin"):
        raise HTTPException(403, "Only the team leader or administrator can accept join requests")

    if len(team.members) >= team.max_members:
        raise HTTPException(400, "Team is already full")

    # Add as member
    existing = db.query(TeamMember).filter(TeamMember.team_id == team.id, TeamMember.student_id == req.student_id).first()
    if not existing:
        member = TeamMember(team_id=team.id, student_id=req.student_id, role=MemberRole.member)
        db.add(member)

    # Update applicant's team status
    applicant = db.query(Student).filter(Student.id == req.student_id).first()
    if applicant:
        applicant.team_status = "Assigned (Member)"

    req.status = JoinRequestStatus.accepted

    # If full now, update team status
    if len(team.members) + 1 >= team.max_members:
        team.status = TeamStatus.complete

    # Cancel other pending join requests of this student
    other_reqs = db.query(TeamJoinRequest).filter(
        TeamJoinRequest.student_id == req.student_id,
        TeamJoinRequest.id != req.id,
        TeamJoinRequest.status == JoinRequestStatus.pending
    ).all()
    for o in other_reqs:
        o.status = JoinRequestStatus.cancelled

    db.commit()
    db.refresh(team)
    return _build_team_detail(team)


@router.post("/join-requests/{request_id}/reject")
def reject_join_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(TeamJoinRequest).filter(TeamJoinRequest.id == request_id).first()
    if not req:
        raise HTTPException(404, "Join request not found")

    team = req.team
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or (team and team.leader_id != student.id and current_user.role.value != "admin"):
        raise HTTPException(403, "Only the team leader or administrator can reject join requests")

    req.status = JoinRequestStatus.rejected
    db.commit()
    return {"success": True, "message": "Join request has been declined."}


@router.delete("/join-requests/{request_id}")
def cancel_join_request(
    request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(TeamJoinRequest).filter(TeamJoinRequest.id == request_id).first()
    if not req:
        raise HTTPException(404, "Join request not found")

    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    if not student or (req.student_id != student.id and current_user.role.value != "admin"):
        raise HTTPException(403, "Only the applicant or administrator can cancel this request")

    db.delete(req)
    db.commit()
    return {"success": True, "message": "Join request cancelled successfully"}


