from fastapi import FastAPI

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