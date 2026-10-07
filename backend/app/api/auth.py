import os
import secrets

from fastapi import (
    APIRouter,
    HTTPException,
    Depends,
    Body
)

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserResponse
)

from app.models.user import (
    create_user,
    get_user_by_email,
    update_user_password,
    get_user_by_google_id,
    add_google_account,
    create_google_user
)

from app.models.password_reset import (
    create_reset_code,
    get_reset_code,
    mark_code_verified,
    delete_reset_code
)

from app.services.email_service import (
    send_reset_code
)

from app.core.security import (
    hash_password,
    verify_password,
    get_current_user
)

from app.core.config import (
    JWT_SECRET_KEY,
    JWT_ALGORITHM
)

from jose import jwt

from datetime import (
    datetime,
    timedelta,
    timezone
)


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register_user(user: UserCreate):

    existing_user = get_user_by_email(
        user.email
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(
        user.password
    )

    user_data = {
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "auth_provider": "local"
    }

    user_id = create_user(
        user_data
    )

    return {
        "id": user_id,
        "name": user.name,
        "email": user.email
    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login_user(user: UserLogin):

    existing_user = get_user_by_email(
        user.email
    )

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Google-only users may not have a password
    if not existing_user.get("password"):
        raise HTTPException(
            status_code=401,
            detail=(
                "This account uses Google Sign-In. "
                "Please continue with Google."
            )
        )

    password_valid = verify_password(
        user.password,
        existing_user["password"]
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=60)
    )

    payload = {
        "sub": str(existing_user["_id"]),
        "email": existing_user["email"],
        "exp": expire
    }

    access_token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# FORGOT PASSWORD — SEND CODE
# =========================================================

@router.post("/forgot-password")
async def forgot_password(email: str):

    existing_user = get_user_by_email(
        email
    )

    # Don't reveal whether an email exists
    if not existing_user:
        return {
            "message": (
                "If an account exists with this email, "
                "a password reset code has been sent."
            )
        }

    # Generate secure 6-digit code
    reset_code = str(
        secrets.randbelow(900000) + 100000
    )

    # Hash the code before storing it
    code_hash = hash_password(
        reset_code
    )

    create_reset_code(
        email,
        code_hash
    )

    try:

        await send_reset_code(
            email,
            reset_code
        )

    except Exception as error:

        print(
            "Email sending error:",
            error
        )

        delete_reset_code(
            email
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to send password reset email."
        )

    return {
        "message": (
            "If an account exists with this email, "
            "a password reset code has been sent."
        )
    }


# =========================================================
# VERIFY RESET CODE
# =========================================================

@router.post("/verify-reset-code")
def verify_reset_code(
    email: str,
    code: str
):

    reset_data = get_reset_code(
        email
    )

    if not reset_data:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired reset code."
        )

    expires_at = reset_data["expires_at"]

    # Handle timezone safely
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if datetime.now(timezone.utc) > expires_at:

        delete_reset_code(
            email
        )

        raise HTTPException(
            status_code=400,
            detail="Reset code has expired."
        )

    if reset_data.get("verified"):

        return {
            "message": "Reset code already verified."
        }

    if not verify_password(
        code,
        reset_data["code_hash"]
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid reset code."
        )

    mark_code_verified(
        email
    )

    return {
        "message": "Reset code verified successfully."
    }


# =========================================================
# RESET PASSWORD
# =========================================================

@router.post("/reset-password")
def reset_password(
    email: str,
    new_password: str
):

    reset_data = get_reset_code(
        email
    )

    if not reset_data:

        raise HTTPException(
            status_code=400,
            detail="Password reset session not found."
        )

    expires_at = reset_data["expires_at"]

    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(
            tzinfo=timezone.utc
        )

    if datetime.now(timezone.utc) > expires_at:

        delete_reset_code(
            email
        )

        raise HTTPException(
            status_code=400,
            detail="Password reset session has expired."
        )

    if not reset_data.get("verified"):

        raise HTTPException(
            status_code=400,
            detail="Please verify the reset code first."
        )

    if len(new_password) < 6:

        raise HTTPException(
            status_code=400,
            detail=(
                "Password must be at least "
                "6 characters long."
            )
        )

    hashed_password = hash_password(
        new_password
    )

    updated = update_user_password(
        email,
        hashed_password
    )

    if not updated:

        raise HTTPException(
            status_code=404,
            detail="User account not found."
        )

    delete_reset_code(
        email
    )

    return {
        "message": "Password reset successfully."
    }


# =========================================================
# GOOGLE SIGN-IN
# =========================================================

@router.post("/google")
def google_login(
    credential: str = Body(..., embed=True)
):

    google_client_id = os.getenv(
        "GOOGLE_CLIENT_ID"
    )

    if not google_client_id:

        raise HTTPException(
            status_code=500,
            detail="Google Client ID is not configured."
        )

    # -----------------------------------------------------
    # VERIFY GOOGLE ID TOKEN
    # -----------------------------------------------------

    try:

        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            google_client_id
        )

    except ValueError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Google authentication token."
        )

    # -----------------------------------------------------
    # GET GOOGLE USER INFORMATION
    # -----------------------------------------------------

    google_id = idinfo.get("sub")
    email = idinfo.get("email")
    name = idinfo.get(
        "name",
        "Google User"
    )

    if not google_id or not email:

        raise HTTPException(
            status_code=400,
            detail=(
                "Google account information "
                "is incomplete."
            )
        )

    # -----------------------------------------------------
    # FIND USER BY GOOGLE ID
    # -----------------------------------------------------

    existing_user = get_user_by_google_id(
        google_id
    )

    # -----------------------------------------------------
    # GOOGLE ACCOUNT DOES NOT EXIST YET
    # -----------------------------------------------------

    if existing_user is None:

        # Check whether the email already belongs
        # to an existing local account.
        existing_user = get_user_by_email(
            email
        )

        # -------------------------------------------------
        # EXISTING LOCAL ACCOUNT
        # -------------------------------------------------

        if existing_user:

            add_google_account(
                str(existing_user["_id"]),
                google_id
            )

        # -------------------------------------------------
        # COMPLETELY NEW GOOGLE ACCOUNT
        # -------------------------------------------------

        else:

            user_id = create_google_user(
                name,
                email,
                google_id
            )

            existing_user = get_user_by_email(
                email
            )

    # -----------------------------------------------------
    # CREATE OUR APPLICATION JWT
    # -----------------------------------------------------

    expire = (
        datetime.now(timezone.utc)
        + timedelta(minutes=60)
    )

    payload = {
        "sub": str(existing_user["_id"]),
        "email": existing_user["email"],
        "exp": expire
    }

    access_token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def get_my_profile(
    current_user=Depends(get_current_user)
):

    return {
        "id": str(current_user["_id"]),
        "name": current_user["name"],
        "email": current_user["email"]
    }