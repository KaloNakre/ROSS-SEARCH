from pydantic import BaseModel
from typing import Optional, List
from app.schemas.student import InterestOut


class PublicationOut(BaseModel):
    id: int
    title: str
    venue: Optional[str] = None
    year: Optional[int] = None

    model_config = {"from_attributes": True}


class SupervisorProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[str] = None
    room: Optional[str] = None
    phone: Optional[str] = None
    about: Optional[str] = None
    education: Optional[str] = None
    available_slots: Optional[int] = None
    max_slots: Optional[int] = None
    accepting_teams: Optional[bool] = None
    profile_image_url: Optional[str] = None


class SupervisorOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    designation: Optional[str] = None
    department: str
    room: Optional[str] = None
    phone: Optional[str] = None
    about: Optional[str] = None
    education: Optional[str] = None
    available_slots: int = 5
    max_slots: int = 5
    accepting_teams: bool = True
    profile_image_url: Optional[str] = None
    email: Optional[str] = None
    expertise: List[InterestOut] = []
    publications: List[PublicationOut] = []

    model_config = {"from_attributes": True}


class ExpertiseUpdateRequest(BaseModel):
    interest_ids: List[int]

