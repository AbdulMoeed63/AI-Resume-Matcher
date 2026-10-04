from app.services.matching_service import compare_skills


resume_text = """
Python developer with experience in Django, FastAPI,
MongoDB, REST APIs and Machine Learning.
"""


job_description = """
We need a Python developer with Django, FastAPI,
MongoDB, Docker, Machine Learning and AWS experience.
"""


result = compare_skills(
    resume_text,
    job_description
)

print("\nResume Skills:")
print(result["resume_skills"])

print("\nRequired Skills:")
print(result["required_skills"])

print("\nMatched Skills:")
print(result["matched_skills"])

print("\nMissing Skills:")
print(result["missing_skills"])

print("\nSkill Match Score:")
print(f'{result["skill_match_score"]}%')