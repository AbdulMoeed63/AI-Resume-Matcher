import re


DEGREE_PATTERNS = {
    "phd": [
        r"\bph\.?d\.?\b",
        r"\bdoctorate\b"
    ],
    "masters": [
        r"\bmaster'?s\b",
        r"\bm\.?s\.?\b",
        r"\bm\.?sc\.?\b",
        r"\bmba\b"
    ],
    "bachelors": [
        r"\bbachelor'?s\b",
        r"\bb\.?s\.?\b",
        r"\bb\.?sc\.?\b",
        r"\bb\.?e\.?\b",
        r"\bba\b"
    ],
    "associate": [
        r"\bassociate'?s\b"
    ],
    "diploma": [
        r"\bdiploma\b"
    ]
}


EDUCATION_RANK = {
    "diploma": 1,
    "associate": 2,
    "bachelors": 3,
    "masters": 4,
    "phd": 5
}


def extract_education(text: str) -> dict:
    text_lower = text.lower()

    education_level = None

    for level in ["phd", "masters", "bachelors", "associate", "diploma"]:

        for pattern in DEGREE_PATTERNS[level]:

            if re.search(pattern, text_lower):
                education_level = level
                break

        if education_level:
            break

    return {
        "education_level": education_level
    }


def extract_experience_years(text: str) -> float:

    text_lower = text.lower()

    patterns = [
        r"(\d+(?:\.\d+)?)\+?\s*years?\s+of\s+experience",
        r"(\d+(?:\.\d+)?)\+?\s*years?\s+experience",
        r"experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\+?\s*years?"
    ]

    for pattern in patterns:

        match = re.search(pattern, text_lower)

        if match:
            return float(match.group(1))

    return 0.0


def extract_profile_information(text: str) -> dict:

    education = extract_education(text)

    experience_years = extract_experience_years(text)

    return {
        "education": education,
        "experience_years": experience_years
    }


def extract_required_experience(text: str) -> float:

    text_lower = text.lower()

    patterns = [
        r"(\d+(?:\.\d+)?)\+?\s*years?\s+of\s+experience",
        r"(\d+(?:\.\d+)?)\+?\s*years?\s+experience",
        r"minimum\s+of\s+(\d+(?:\.\d+)?)\+?\s*years?",
        r"at\s+least\s+(\d+(?:\.\d+)?)\+?\s*years?"
    ]

    for pattern in patterns:

        match = re.search(pattern, text_lower)

        if match:
            return float(match.group(1))

    return 0.0


def extract_required_education(text: str) -> dict:

    education = extract_education(text)

    return education