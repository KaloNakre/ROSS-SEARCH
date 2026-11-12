from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.team import TeamStatus, MemberRole


class TeamMemberOut(BaseModel):
    id: int
    student_id: int
    full_name: str
    student_number: str
    department: Optional[str] = None
    role: MemberRole

    model_config = {"from_attributes": True}


class TeamCreate(BaseModel):
    name: str
    project_title: Optional[str] = None
    domain: Optional[str] = None
    department: Optional[str] = None
    section: Optional[str] = None
    description: Optional[str] = None
    max_members: int = 5
    supervisor_id: Optional[int] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = None
    project_title: Optional[str] = None
    domain: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TeamStatus] = None
    supervisor_id: Optional[int] = None


class TeamOut(BaseModel):
    id: int
    name: str
    project_title: Optional[str] = None
    domain: Optional[str] = None
    department: Optional[str] = None
    section: Optional[str] = None
    description: Optional[str] = None
    status: TeamStatus
    max_members: int
    leader_id: Optional[int] = None
    supervisor_id: Optional[int] = None
    supervisor_name: Optional[str] = None
    leader_name: Optional[str] = None
    members_count: int = 0
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class TeamDetailOut(TeamOut):
    members: List[TeamMemberOut] = []


class AddMemberRequest(BaseModel):
    student_id: int

