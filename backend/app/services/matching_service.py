from app.services.skill_extractor import extract_skills


def compare_skills(resume_text: str, job_description: str) -> dict:
    """
    Compare skills found in the resume with skills required
    in the job description.
    """

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