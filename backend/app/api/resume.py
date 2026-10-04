
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from app.core.security import get_current_user

from app.services.resume_service import extract_resume_text
from app.services.text_cleaner import clean_resume_text
from app.services.skill_extractor import extract_skills

from app.models.resume import (
    create_resume,
    get_resume_by_id,
    get_resumes_by_user
)


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    allowed_extensions = [".pdf", ".docx"]

    filename = file.filename.lower()

    if not any(filename.endswith(ext) for ext in allowed_extensions):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    try:
        # Read uploaded file
        file_content = await file.read()

        # Extract text from PDF/DOCX
        extracted_text = extract_resume_text(
            file_content,
            file.filename
        )

        if not extracted_text:
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the resume."
            )

        # Clean extracted text
        cleaned_text = clean_resume_text(
            extracted_text
        )

        if not cleaned_text:
            raise HTTPException(
                status_code=400,
                detail="Resume text is empty after cleaning."
            )

        # Extract skills
        skills = extract_skills(
            cleaned_text
        )

        # Prepare resume data for MongoDB
        resume_data = {
            "user_id": str(current_user["_id"]),
            "filename": file.filename,
            "extracted_text": extracted_text,
            "cleaned_text": cleaned_text,
            "skills": skills
        }

        # Save resume to MongoDB
        resume_id = create_resume(resume_data)

        return {
            "message": "Resume uploaded successfully",
            "resume_id": resume_id,
            "filename": file.filename,
            "text_length": len(cleaned_text),
            "skills": skills,
            "extracted_text": cleaned_text
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing resume: {str(e)}"
        )

@router.get("/")
def get_my_resumes(
    current_user=Depends(get_current_user)
):

    resumes = get_resumes_by_user(
        str(current_user["_id"])
    )

    results = []

    for resume in resumes:
        results.append({
            "id": str(resume["_id"]),
            "filename": resume["filename"],
            "skills": resume["skills"],
            "created_at": resume["created_at"]
        })

    return {
        "resumes": results
    }

@router.get("/{resume_id}")
def get_resume(
    resume_id: str,
    current_user=Depends(get_current_user)
):

    resume = get_resume_by_id(resume_id)

    if resume is None:
        raise HTTPException(
            status_code=404,
            detail="Resume not found."
        )

    if resume["user_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=403,
            detail="You do not have access to this resume."
        )

    return {
        "id": str(resume["_id"]),
        "filename": resume["filename"],
        "extracted_text": resume["extracted_text"],
        "cleaned_text": resume["cleaned_text"],
        "skills": resume["skills"],
        "created_at": resume["created_at"]
    }