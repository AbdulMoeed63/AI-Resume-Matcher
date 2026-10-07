from datetime import datetime, timedelta, timezone

from app.database import database


password_resets_collection = database["password_resets"]


def create_reset_code(
    email: str,
    code_hash: str
):
    expires_at = (
        datetime.now(timezone.utc)
        + timedelta(minutes=10)
    )

    password_resets_collection.delete_many(
        {
            "email": email
        }
    )

    password_resets_collection.insert_one(
        {
            "email": email,
            "code_hash": code_hash,
            "expires_at": expires_at,
            "verified": False,
            "created_at": datetime.now(timezone.utc)
        }
    )


def get_reset_code(email: str):
    return password_resets_collection.find_one(
        {
            "email": email
        }
    )


def mark_code_verified(email: str):
    password_resets_collection.update_one(
        {
            "email": email
        },
        {
            "$set": {
                "verified": True
            }
        }
    )


def delete_reset_code(email: str):
    password_resets_collection.delete_many(
        {
            "email": email
        }
    )