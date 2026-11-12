from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.team import Team, TeamMember, MemberRole
from app.schemas.team import TeamCreate, TeamUpdate, TeamOut, TeamDetailOut, AddMemberRequest, TeamMemberOut

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
    db.delete(member)
    db.commit()
    db.refresh(team)
    return _build_team_detail(team)

