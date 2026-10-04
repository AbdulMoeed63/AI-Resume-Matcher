import re


SKILLS = [
    # Programming languages
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "C#",
    "PHP",
    "Go",
    "R",

    # Web / Backend
    "Django",
    "FastAPI",
    "Flask",
    "Node.js",
    "Express.js",
    "React",
    "Next.js",

    # Databases
    "MongoDB",
    "MySQL",
    "PostgreSQL",
    "SQL",
    "SQLite",

    # AI / ML
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "NLP",
    "Natural Language Processing",
    "Computer Vision",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",

    # Cloud / DevOps
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Git",
    "GitHub",

    # Other
    "REST API",
    "REST APIs",
    "API",
    "Data Analysis",
    "Data Science"
]


def extract_skills(text: str) -> list[str]:

    found_skills = []

    for skill in SKILLS:

        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, text, re.IGNORECASE):
            found_skills.append(skill)

    return found_skills