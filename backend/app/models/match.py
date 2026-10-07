from app.database import matches_collection
from datetime import datetime, timezone


def create_match(match_data: dict):
    match_data["created_at"] = datetime.now(timezone.utc)

    result = matches_collection.insert_one(match_data)

    return str(result.inserted_id)


def get_matches_by_user(user_id: str):
    return list(
        matches_collection.find(
            {"user_id": user_id}
        ).sort("created_at", -1)
    )

def delete_matches_by_user(user_id: str):
    result = matches_collection.delete_many(
        {
            "user_id": user_id
        }
    )

    return result.deleted_count