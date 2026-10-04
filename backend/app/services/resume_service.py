from io import BytesIO

from pypdf import PdfReader
from docx import Document


def extract_text_from_pdf(file_content: bytes) -> str:
    pdf_file = BytesIO(file_content)

    reader = PdfReader(pdf_file)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()

        if page_text:
            text += page_text + "\n"

    return text.strip()


def extract_text_from_docx(file_content: bytes) -> str:
    docx_file = BytesIO(file_content)

    document = Document(docx_file)

    text = ""

    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            text += paragraph.text + "\n"

    return text.strip()


def extract_resume_text(
    file_content: bytes,
    filename: str
) -> str:

    filename_lower = filename.lower()

    if filename_lower.endswith(".pdf"):
        return extract_text_from_pdf(file_content)

    elif filename_lower.endswith(".docx"):
        return extract_text_from_docx(file_content)

    else:
        raise ValueError(
            "Unsupported file format. Please upload a PDF or DOCX file."
        )