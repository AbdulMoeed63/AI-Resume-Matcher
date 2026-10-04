from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.models.user import create_user, get_user_by_email
from app.core.security import (
    hash_password,
    verify_password,
    get_current_user
)
from app.core.config import JWT_SECRET_KEY, JWT_ALGORITHM
from jose import jwt
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate):

    existing_user = get_user_by_email(user.email)

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password
    }

    user_id = create_user(user_data)

    return {
        "id": user_id,
        "name": user.name,
        "email": user.email
    }


@router.post("/login")
def login_user(user: UserLogin):

    # Find user
    existing_user = get_user_by_email(user.email)

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = verify_password(
        user.password,
        existing_user["password"]
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Create JWT payload
    expire = datetime.utcnow() + timedelta(minutes=60)

    payload = {
        "sub": str(existing_user["_id"]),
        "email": existing_user["email"],
        "exp": expire
    }

    # Generate JWT
    access_token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_my_profile(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"]
    }