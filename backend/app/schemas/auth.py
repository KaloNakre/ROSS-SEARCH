import re
from pydantic import BaseModel, field_validator
from typing import Optional
from app.models.user import UserRole

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


class RegisterRequest(BaseModel):
    """
    Student self-registration schema.
    Public registration strictly assigns student role automatically.
    No role parameter is accepted from the client.
    """
    email: str
    password: str
    full_name: str
    student_id: str
    department: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if not EMAIL_REGEX.match(cleaned):
            raise ValueError("Please provide a valid email address")
        return cleaned

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v.strip()) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters long")
        return cleaned

    @field_validator("student_id")
    @classmethod
    def validate_student_id(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 3:
            raise ValueError("Student ID must be at least 3 characters long")
        return cleaned

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Department cannot be empty")
        return cleaned


class LoginRequest(BaseModel):
    """Credentials schema for account login."""
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if not EMAIL_REGEX.match(cleaned):
            raise ValueError("Please provide a valid email address")
        return cleaned

    @field_validator("password")
    @classmethod
    def validate_password_not_empty(cls, v: str) -> str:
        if not v:
            raise ValueError("Password cannot be empty")
        return v


class TokenResponse(BaseModel):
    """JWT access token response model."""
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int


class UserProfileDetails(BaseModel):
    full_name: Optional[str] = None
    student_id: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    section: Optional[str] = None
    preferred_domain: Optional[str] = None


class UserOut(BaseModel):
    """Safe authenticated user representation. Never contains password hashes or secrets."""
    id: int
    email: str
    role: UserRole
    is_active: bool
    profile: Optional[UserProfileDetails] = None

    model_config = {"from_attributes": True}


class LogoutResponse(BaseModel):
    """Response returned upon successful token revocation."""
    message: str = "Logged out successfully"


class SupervisorRegisterRequest(BaseModel):
    """
    Supervisor self-registration schema.
    Faculty members register directly; account is marked supervisor role.
    """
    email: str
    password: str
    full_name: str
    designation: str
    department: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        cleaned = v.strip().lower()
        if not EMAIL_REGEX.match(cleaned):
            raise ValueError("Please provide a valid email address")
        return cleaned

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v.strip()) < 6:
            raise ValueError("Password must be at least 6 characters long")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, v: str) -> str:
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Full name must be at least 2 characters long")
        return cleaned

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Department cannot be empty")
        return cleaned
