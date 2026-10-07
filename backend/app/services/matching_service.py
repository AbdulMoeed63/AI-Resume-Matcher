from app.services.skill_extractor import extract_skills
from app.services.profile_extractor import (
    extract_profile_information,
    extract_required_experience,
    extract_required_education,
    EDUCATION_RANK
)


def compare_skills(
    resume_text: str,
    job_description: str
) -> dict:

    resume_skills = set(
        skill.lower()
        for skill in extract_skills(resume_text)
    )

    job_skills = set(
        skill.lower()
        for skill in extract_skills(job_description)
    )

    matched_skills = sorted(
        resume_skills.intersection(job_skills)
    )

    missing_skills = sorted(
        job_skills.difference(resume_skills)
    )

    if job_skills:
        skill_score = (
            len(matched_skills) / len(job_skills)
        ) * 100
    else:
        skill_score = 0.0

    return {
        "resume_skills": sorted(resume_skills),
        "required_skills": sorted(job_skills),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "skill_match_score": round(skill_score, 2)
    }


def calculate_education_score(
    resume_text: str,
    job_description: str
):

    resume_education = extract_profile_information(
        resume_text
    )["education"]["education_level"]

    required_education = extract_required_education(
        job_description
    )["education_level"]

    # Education was not mentioned in the job description.
    # Therefore, it should NOT receive a perfect score.
    if required_education is None:
        return None

    # Requirement exists, but resume education could not be detected.
    if resume_education is None:
        return 0.0

    resume_rank = EDUCATION_RANK.get(
        resume_education,
        0
    )

    required_rank = EDUCATION_RANK.get(
        required_education,
        0
    )

    if resume_rank >= required_rank:
        return 100.0

    if resume_rank == required_rank - 1:
        return 70.0

    return 40.0


def calculate_experience_score(
    resume_text: str,
    job_description: str
):

    resume_years = extract_profile_information(
        resume_text
    )["experience_years"]

    required_years = extract_required_experience(
        job_description
    )

    # Experience was not mentioned in the job description.
    # Therefore, it should NOT receive a perfect score.
    if required_years == 0:
        return None

    if resume_years >= required_years:
        return 100.0

    score = (
        resume_years / required_years
    ) * 100

    return round(
        max(0.0, min(100.0, score)),
        2
    )