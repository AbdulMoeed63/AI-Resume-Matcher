from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.profile import router as profile_router
from app.api.resume import router as resume_router
from app.api.job_description import router as job_description_router

app = FastAPI(
    title="AI Resume Matcher API",
    description="AI-powered resume and job compatibility analysis API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "AI Resume Matcher API is running",
        "status": "success"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(resume_router)
app.include_router(job_description_router)