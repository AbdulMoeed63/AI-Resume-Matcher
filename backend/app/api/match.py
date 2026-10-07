from fastapi import APIRouter, HTTPException, Depends

from app.core.security import get_current_user

from app.models.resume import get_resume_by_id
from app.models.job_description import get_job_description_by_id
from app.models.match import (
    create_match,
    get_matches_by_user,
    delete_matches_by_user
)

from app.services.ml_service import calculate_semantic_similarity

from app.services.matching_service import (
    compare_skills,
    calculate_education_score,
    calculate_experience_score
)

from app.services.ai_explanation_service import (
    generate_match_explanation
)


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

    resume = get_resume_by_id(resume_id)

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    if resume["user_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this resume."
        )

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

    # --------------------------------------------------
    # 1. Semantic similarity
    # --------------------------------------------------

    semantic_score = calculate_semantic_similarity(
        resume["cleaned_text"],
        job["description"]
    )

    # --------------------------------------------------
    # 2. Skill matching
    # --------------------------------------------------

    skill_result = compare_skills(
        resume["cleaned_text"],
        job["description"]
    )

    skill_score = skill_result["skill_match_score"]

    # --------------------------------------------------
    # 3. Education matching
    # --------------------------------------------------

    education_score = calculate_education_score(
        resume["cleaned_text"],
        job["description"]
    )

    # --------------------------------------------------
    # 4. Experience matching
    # --------------------------------------------------

    experience_score = calculate_experience_score(
        resume["cleaned_text"],
        job["description"]
    )

    # --------------------------------------------------
    # 5. Calculate final score
    #
    # Original weights:
    # Semantic    = 50%
    # Skills      = 25%
    # Education   = 10%
    # Experience  = 15%
    #
    # If education/experience are not specified,
    # their weights are removed and the remaining
    # weights are normalized.
    # --------------------------------------------------

    weighted_score = (
        semantic_score * 0.50
        +
        skill_score * 0.25
    )

    available_weight = 0.50 + 0.25

    if education_score is not None:
        weighted_score += (
            education_score * 0.10
        )

        available_weight += 0.10

    if experience_score is not None:
        weighted_score += (
            experience_score * 0.15
        )

        available_weight += 0.15

    final_score = (
        weighted_score / available_weight
    )

    final_score = round(
        final_score,
        2
    )

    # --------------------------------------------------
    # 6. AI explanation
    # --------------------------------------------------

    ai_explanation = generate_match_explanation(
        final_score=final_score,
        semantic_score=semantic_score,
        skill_score=skill_score,
        education_score=education_score,
        experience_score=experience_score,
        matched_skills=skill_result["matched_skills"],
        missing_skills=skill_result["missing_skills"]
    )

    # --------------------------------------------------
    # 7. Save match
    # --------------------------------------------------

    match_data = {
        "user_id": str(current_user["_id"]),
        "resume_id": resume_id,
        "job_id": job_id,

        "semantic_score": semantic_score,
        "skill_score": skill_score,

        "education_score": education_score,
        "experience_score": experience_score,

        "final_score": final_score,

        "matched_skills": skill_result["matched_skills"],
        "missing_skills": skill_result["missing_skills"],

        "ai_explanation": ai_explanation
    }

    match_id = create_match(
        match_data
    )

    return {
        "message": "Resume matching completed successfully",

        "match_id": match_id,

        "resume": resume["filename"],
        "job_title": job["title"],

        "semantic_score": semantic_score,
        "skill_score": skill_score,

        "education_score": education_score,
        "experience_score": experience_score,

        "final_score": final_score,

        "matched_skills": skill_result["matched_skills"],
        "missing_skills": skill_result["missing_skills"],

        "ai_explanation": ai_explanation
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

            "semantic_score": match.get(
                "semantic_score",
                0
            ),

            "skill_score": match.get(
                "skill_score",
                0
            ),

            "education_score": match.get(
                "education_score"
            ),

            "experience_score": match.get(
                "experience_score"
            ),

            "final_score": match.get(
                "final_score",
                0
            ),

            "matched_skills": match.get(
                "matched_skills",
                []
            ),

            "missing_skills": match.get(
                "missing_skills",
                []
            ),

            "ai_explanation": match.get(
                "ai_explanation",
                ""
            ),

            "created_at": match["created_at"]
        })

    return {
        "matches": results
    }


@router.delete("/history")
def delete_my_match_history(
    current_user=Depends(get_current_user)
):

    deleted_count = delete_matches_by_user(
        str(current_user["_id"])
    )

    return {
        "message": "Match history cleared successfully",
        "deleted_count": deleted_count
    }