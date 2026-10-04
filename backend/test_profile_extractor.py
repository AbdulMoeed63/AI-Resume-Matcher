from app.services.profile_extractor import extract_profile_information


resume_text = """
Abdul Moeed

BS Software Engineering

Python Developer and Machine Learning enthusiast.

I have 2 years of experience developing Python applications,
Django web applications and machine learning projects.
"""


result = extract_profile_information(resume_text)

print("\nEducation:")
print(result["education"])

print("\nExperience:")
print(result["experience_years"], "years")