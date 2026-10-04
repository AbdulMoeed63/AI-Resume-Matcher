from fastapi import APIRouter, Depends

from app.core.security import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/")
def get_profile(current_user=Depends(get_current_user)):
    return {
        "message": "Authenticated successfully",
        "user": {
            "id": str(current_user["_id"]),
            "name": current_user["name"],
            "email": current_user["email"]
        }
    }