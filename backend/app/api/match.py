from fastapi import APIRouter, HTTPException, Depends

from app.core.security import get_current_user

from app.models.resume import get_resume_by_id
from app.models.job_description import get_job_description_by_id
from app.models.match import (
    create_match,
    get_matches_by_user
)

from app.services.ml_service import calculate_semantic_similarity
from app.services.matching_service import compare_skills


router = APIRouter(
    prefix="/match",
    tags=["Matching"]
)


@router.post("/")
def create_match_api(
    resume_id: str,
    job_id: str,
    current_user=Depends(get_current_user)
):
    # Get resume
    resume = get_resume_by_id(resume_id)

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    # Make sure resume belongs to current user
    if resume["user_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this resume."
        )

    # Get job description
    job = get_job_description_by_id(job_id)

    if job is None:
        raise HTTPException(
            status_code=404,
            detail="Job description not found."
        )

    # Make sure job belongs to current user
    if job["user_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this job description."
        )

    # Calculate semantic similarity
    semantic_score = calculate_semantic_similarity(
        resume["cleaned_text"],
        job["description"]
    )

    # Compare skills
    skill_result = compare_skills(
        resume["cleaned_text"],
        job["description"]
    )

    skill_score = skill_result["skill_match_score"]

    # Weighted final score
    final_score = (
        semantic_score * 0.7
        +
        skill_score * 0.3
    )

    final_score = round(final_score, 2)

    # Save match
    match_data = {
        "user_id": str(current_user["_id"]),
        "resume_id": resume_id,
        "job_id": job_id,
        "semantic_score": semantic_score,
        "skill_score": skill_score,
        "final_score": final_score,
        "matched_skills": skill_result["matched_skills"],
        "missing_skills": skill_result["missing_skills"]
    }

    match_id = create_match(match_data)

    return {
        "message": "Resume matching completed successfully",
        "match_id": match_id,
        "resume": resume["filename"],
        "job_title": job["title"],
        "semantic_score": semantic_score,
        "skill_score": skill_score,
        "final_score": final_score,
        "matched_skills": skill_result["matched_skills"],
        "missing_skills": skill_result["missing_skills"]
    }

@router.get("/")
def get_my_matches(
    current_user=Depends(get_current_user)
):
    matches = get_matches_by_user(
        str(current_user["_id"])
    )

    results = []

    for match in matches:
        results.append({
            "id": str(match["_id"]),
            "resume_id": match["resume_id"],
            "job_id": match["job_id"],
            "semantic_score": match["semantic_score"],
            "skill_score": match["skill_score"],
            "final_score": match["final_score"],
            "matched_skills": match["matched_skills"],
            "missing_skills": match["missing_skills"],
            "created_at": match["created_at"]
        })

    return {
        "matches": results
    }