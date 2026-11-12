from pydantic import BaseModel
from typing import Optional, List


class InterestOut(BaseModel):
    id: int
    name: str
    category: Optional[str] = None

    model_config = {"from_attributes": True}


class StudentProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    section: Optional[str] = None
    batch: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    project_title: Optional[str] = None
    preferred_domain: Optional[str] = None
    team_status: Optional[str] = None


class StudentOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    student_id: str
    department: str
    section: Optional[str] = None
    batch: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    project_title: Optional[str] = None
    preferred_domain: Optional[str] = None
    profile_image_url: Optional[str] = None
    team_status: Optional[str] = None
    email: Optional[str] = None
    interests: List[InterestOut] = []

    model_config = {"from_attributes": True}


class InterestUpdateRequest(BaseModel):
    interest_ids: List[int]

