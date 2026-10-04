import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(MONGODB_URI)

database = client["ai_resume_matcher"]

users_collection = database["users"]
resumes_collection = database["resumes"]
job_descriptions_collection = database["job_descriptions"]
matches_collection = database["matches"]