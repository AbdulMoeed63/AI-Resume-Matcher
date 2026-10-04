from app.services.ml_service import calculate_semantic_similarity


resume_text = """
Python developer with experience in Django, FastAPI, MongoDB,
machine learning, REST APIs and data analysis.
"""


job_description = """
We are looking for a Python developer with experience in
Django, FastAPI, machine learning, databases and REST API development.
"""


score = calculate_semantic_similarity(
    resume_text,
    job_description
)

print(f"Semantic Match Score: {score}%")