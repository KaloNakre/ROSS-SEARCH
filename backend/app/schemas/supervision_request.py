from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.supervision_request import RequestStatus


class SupervisionRequestCreate(BaseModel):
    supervisor_id: int
    message: Optional[str] = None


class SupervisionRequestOut(BaseModel):
    id: int
    student_id: int
    supervisor_id: int
    status: RequestStatus
    message: Optional[str] = None
    response_note: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    # Enriched display fields (populated manually in routes)
    supervisor_name: Optional[str] = None
    supervisor_department: Optional[str] = None
    student_name: Optional[str] = None
    student_id_code: Optional[str] = None

    model_config = {"from_attributes": True}


class SupervisionRequestRespond(BaseModel):
    response_note: Optional[str] = None

