from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, oauth2_scheme
from app.core.security import hash_password, verify_password, create_access_token, decode_token
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.supervisor import Supervisor
from app.models.revoked_token import RevokedToken
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserOut,
    UserProfileDetails,
    LogoutResponse,
    SupervisorRegisterRequest,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Student self-registration.
    - Validates required inputs.
    - Rejects duplicate email and student ID.
    - Hashes password using Argon2id.
    - Unconditionally assigns student role.
    """
    normalized_email = payload.email.lower().strip()

    # Reject duplicate email
    if db.query(User).filter(User.email == normalized_email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Reject duplicate student ID
    if db.query(Student).filter(Student.student_id == payload.student_id).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student ID already registered"
        )

    # Create new user record with student role
    user = User(
        email=normalized_email,
        password_hash=hash_password(payload.password),
        role=UserRole.student,
        is_active=True,
    )
    db.add(user)
    db.flush()

    # Create associated student academic profile
    student = Student(
        user_id=user.id,
        full_name=payload.full_name,
        student_id=payload.student_id,
        department=payload.department,
    )
    db.add(student)
    db.commit()
    db.refresh(user)

    # Issue signed JWT token
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, role=user.role.value, user_id=user.id)


@router.post("/register/supervisor", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_supervisor(payload: SupervisorRegisterRequest, db: Session = Depends(get_db)):
    """
    Supervisor self-registration.
    - Faculty members register with their own credentials.
    - Automatically assigns supervisor role.
    - Creates both User and Supervisor profile in a single transaction.
    """
    normalized_email = payload.email.lower().strip()

    if db.query(User).filter(User.email == normalized_email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = User(
        email=normalized_email,
        password_hash=hash_password(payload.password),
        role=UserRole.supervisor,
        is_active=True,
    )
    db.add(user)
    db.flush()

    supervisor = Supervisor(
        user_id=user.id,
        full_name=payload.full_name,
        designation=payload.designation,
        department=payload.department,
        available_slots=5,
        max_slots=5,
        accepting_teams=True,
    )
    db.add(supervisor)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, role=user.role.value, user_id=user.id)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate user credentials and issue signed JWT access token.
    - Validates password via Argon2id.
    - Rejects deactivated or nonexistent accounts.
    """
    normalized_email = payload.email.lower().strip()
    user = db.query(User).filter(User.email == normalized_email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return TokenResponse(access_token=token, role=user.role.value, user_id=user.id)


@router.post("/logout", response_model=LogoutResponse)
def logout(
    current_user: User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """
    Revoke the current JWT access token and store it in the revocation table.
    Subsequent requests with this token are rejected.
    """
    payload, _ = decode_token(token)
    if payload:
        jti = payload.get("jti")
        exp_ts = payload.get("exp")
        expires_at = (
            datetime.fromtimestamp(exp_ts, tz=timezone.utc)
            if exp_ts
            else datetime.now(timezone.utc)
        )

        if jti:
            existing = db.query(RevokedToken).filter(RevokedToken.jti == jti).first()
            if not existing:
                revoked = RevokedToken(
                    jti=jti,
                    token=token,
                    user_id=current_user.id,
                    expires_at=expires_at,
                )
                db.add(revoked)
                db.commit()

    return LogoutResponse(message="Logged out successfully")


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Return the authenticated user's safe profile details.
    Never exposes passwords, hashes, or sensitive system credentials.
    """
    profile_details = None

    if current_user.role == UserRole.student:
        student = db.query(Student).filter(Student.user_id == current_user.id).first()
        if student:
            profile_details = UserProfileDetails(
                full_name=student.full_name,
                student_id=student.student_id,
                department=student.department,
                section=student.section,
                preferred_domain=student.preferred_domain,
            )
    elif current_user.role == UserRole.supervisor:
        supervisor = db.query(Supervisor).filter(Supervisor.user_id == current_user.id).first()
        if supervisor:
            profile_details = UserProfileDetails(
                full_name=supervisor.full_name,
                designation=supervisor.designation,
                department=supervisor.department,
            )

    return UserOut(
        id=current_user.id,
        email=current_user.email,
        role=current_user.role,
        is_active=current_user.is_active,
        profile=profile_details,
    )
