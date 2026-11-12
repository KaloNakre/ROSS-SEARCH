from sqlalchemy import Column, Integer, String
from app.database.base import Base


class ResearchInterest(Base):
    __tablename__ = "research_interests"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=True, index=True)
