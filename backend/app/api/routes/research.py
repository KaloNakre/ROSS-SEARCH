from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.research_interest import ResearchInterest
from app.schemas.student import InterestOut

router = APIRouter(prefix="/api/research", tags=["Research Interests"])


@router.get("/interests", response_model=List[InterestOut])
def list_interests(db: Session = Depends(get_db)):
    return db.query(ResearchInterest).all()

