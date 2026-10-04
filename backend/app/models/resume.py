from app.database import resumes_collection
from datetime import datetime, timezone


def create_resume(resume_data: dict):
    resume_data["created_at"] = datetime.now(timezone.utc)

    result = resumes_collection.insert_one(resume_data)

    return str(result.inserted_id)


def get_resumes_by_user(user_id: str):
    return list(
        resumes_collection.find(
            {"user_id": user_id}
        ).sort("created_at", -1)
    )


def get_resume_by_id(resume_id: str):
    from bson import ObjectId

    return resumes_collection.find_one(
        {"_id": ObjectId(resume_id)}
    )