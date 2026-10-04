import re


def clean_resume_text(text: str) -> str:

    # Replace multiple spaces/tabs with a single space
    text = re.sub(r"[ \t]+", " ", text)

    # Replace multiple newlines with a single newline
    text = re.sub(r"\n+", "\n", text)

    # Remove leading/trailing spaces from each line
    lines = []

    for line in text.split("\n"):
        line = line.strip()

        if line:
            lines.append(line)

    # Join the cleaned lines
    cleaned_text = "\n".join(lines)

    return cleaned_text.strip()