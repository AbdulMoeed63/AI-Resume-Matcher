from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

from app.core.security import get_current_user
from app.models.job_description import (
    create_job_description,
    get_job_description_by_id,
    get_job_descriptions_by_user
)


router = APIRouter(
    prefix="/job-description",
    tags=["Job Description"]
)


class JobDescriptionCreate(BaseModel):
    title: str
    company: str | None = None
    description: str


@router.post("/")
def create_job_description_api(
    job: JobDescriptionCreate,
    current_user=Depends(get_current_user)
):

    if not job.description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    job_data = {
        "user_id": str(current_user["_id"]),
        "title": job.title,
        "company": job.company,
        "description": job.description
    }

    job_id = create_job_description(job_data)

    return {
        "message": "Job description created successfully",
        "job_id": job_id,
        "title": job.title,
        "company": job.company
    }

@router.get("/")
def get_my_job_descriptions(
    current_user=Depends(get_current_user)
):

    jobs = get_job_descriptions_by_user(
        str(current_user["_id"])
    )

    results = []

    for job in jobs:
        results.append({
            "id": str(job["_id"]),
            "title": job["title"],
            "company": job["company"],
            "created_at": job["created_at"]
        })

    return {
        "job_descriptions": results
    }

@router.get("/{job_id}")
def get_job_description(
    job_id: str,
    current_user=Depends(get_current_user)
):

    job = get_job_description_by_id(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job description not found."
        )

    if job["user_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this job description."
        )

    return {
        "id": str(job["_id"]),
        "title": job["title"],
        "company": job["company"],
        "description": job["description"],
        "created_at": job["created_at"]
    }