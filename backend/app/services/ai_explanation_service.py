def generate_match_explanation(
    final_score: float,
    semantic_score: float,
    skill_score: float,
    education_score,
    experience_score,
    matched_skills: list,
    missing_skills: list
):

    # --------------------------------------------------
    # SUMMARY
    # --------------------------------------------------

    if final_score >= 80:

        summary = (
            f"Your resume is a strong match for this position "
            f"with an overall compatibility score of "
            f"{final_score}%. Your background aligns well with "
            f"the available job requirements."
        )

    elif final_score >= 60:

        summary = (
            f"Your resume is a good match with an overall "
            f"compatibility score of {final_score}%. You meet "
            f"many of the available requirements, although "
            f"there are some areas that could be strengthened."
        )

    elif final_score >= 40:

        summary = (
            f"Your resume has a partial match with an overall "
            f"compatibility score of {final_score}%. You have "
            f"some relevant qualifications, but several areas "
            f"need improvement."
        )

    else:

        summary = (
            f"Your resume currently has a low compatibility "
            f"score of {final_score}%. Several important job "
            f"requirements may not be sufficiently represented "
            f"in your resume."
        )

    # --------------------------------------------------
    # STRENGTHS
    # --------------------------------------------------

    strengths = []

    if semantic_score >= 70:

        strengths.append(
            "Your resume has strong semantic alignment "
            "with the job description."
        )

    elif semantic_score >= 50:

        strengths.append(
            "Your resume has a reasonable level of "
            "contextual alignment with the job."
        )

    if skill_score >= 80:

        strengths.append(
            "You possess most of the technical skills "
            "identified in the job requirements."
        )

    elif skill_score >= 60:

        strengths.append(
            "You possess a good portion of the required "
            "technical skills."
        )

    # Education is only discussed when the job
    # description actually specifies it.

    if education_score is not None:

        if education_score >= 80:

            strengths.append(
                "Your educational background meets or exceeds "
                "the identified education requirement."
            )

    # Experience is only discussed when the job
    # description actually specifies it.

    if experience_score is not None:

        if experience_score >= 80:

            strengths.append(
                "Your experience level is well aligned with "
                "the requirements of the position."
            )

    if matched_skills:

        skill_text = ", ".join(
            matched_skills[:8]
        )

        strengths.append(
            f"Relevant skills detected in your resume include: "
            f"{skill_text}."
        )

    if not strengths:

        strengths.append(
            "Some relevant information was detected in "
            "your resume, but the overall alignment is limited."
        )

    # --------------------------------------------------
    # SKILL GAPS
    # --------------------------------------------------

    skill_gaps = []

    if missing_skills:

        missing_text = ", ".join(
            missing_skills[:10]
        )

        skill_gaps.append(
            f"Important skills not detected in your resume: "
            f"{missing_text}."
        )

    if skill_score < 60:

        skill_gaps.append(
            "Your technical skill coverage is one of the "
            "main areas that could be improved."
        )

    # Only evaluate education when it exists.

    if (
        education_score is not None
        and education_score < 70
    ):

        skill_gaps.append(
            "Your education does not fully match the "
            "identified education requirement."
        )

    # Only evaluate experience when it exists.

    if (
        experience_score is not None
        and experience_score < 70
    ):

        skill_gaps.append(
            "Your experience level appears lower than "
            "the requirement identified in the job description."
        )

    if semantic_score < 60:

        skill_gaps.append(
            "Your resume could be better aligned with the "
            "language and responsibilities used in the job description."
        )

    if not skill_gaps:

        skill_gaps.append(
            "No major compatibility gaps were identified "
            "from the available matching information."
        )

    # --------------------------------------------------
    # RECOMMENDATIONS
    # --------------------------------------------------

    recommendations = []

    if missing_skills:

        recommendations.append(
            "Develop and demonstrate the missing technical "
            "skills through projects, courses, or practical work."
        )

    if skill_score < 70:

        recommendations.append(
            "Add relevant technical projects and clearly "
            "mention the technologies you have used."
        )

    if semantic_score < 70:

        recommendations.append(
            "Customize your resume for each job by using "
            "relevant keywords and responsibilities from the "
            "job description where they genuinely apply."
        )

    # Only recommend experience improvement if
    # experience is actually required.

    if (
        experience_score is not None
        and experience_score < 70
    ):

        recommendations.append(
            "Build practical experience through internships, "
            "freelance work, university projects, or personal projects."
        )

    # Only recommend education improvement if
    # education is actually required.

    if (
        education_score is not None
        and education_score < 70
    ):

        recommendations.append(
            "Highlight relevant coursework, certifications, "
            "and academic projects related to the position."
        )

    if len(recommendations) < 3:

        recommendations.append(
            "Continue building practical projects that "
            "demonstrate your strongest technical abilities."
        )

    # --------------------------------------------------
    # BUILD EXPLANATION
    # --------------------------------------------------

    explanation = f"""
SUMMARY

{summary}

STRENGTHS

"""

    for strength in strengths[:5]:

        explanation += (
            f"• {strength}\n"
        )

    explanation += """

SKILL GAPS

"""

    for gap in skill_gaps[:5]:

        explanation += (
            f"• {gap}\n"
        )

    explanation += """

RECOMMENDATION

"""

    for recommendation in recommendations[:3]:

        explanation += (
            f"• {recommendation}\n"
        )

    return explanation.strip()