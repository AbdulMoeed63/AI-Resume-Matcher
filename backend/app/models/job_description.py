from app.database import job_descriptions_collection
from datetime import datetime, timezone


def create_job_description(job_data: dict):
    job_data["created_at"] = datetime.now(timezone.utc)

    result = job_descriptions_collection.insert_one(job_data)

    return str(result.inserted_id)


def get_job_descriptions_by_user(user_id: str):
    return list(
        job_descriptions_collection.find(
            {"user_id": user_id}
        ).sort("created_at", -1)
    )


def get_job_description_by_id(job_id: str):
    from bson import ObjectId

    return job_descriptions_collection.find_one(
        {"_id": ObjectId(job_id)}
    )