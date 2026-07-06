from fastapi import FastAPI
from pydantic import BaseModel
from typing import Any, Dict

app = FastAPI(
    title="NexusOps AI API",
    description="Backend API for the NexusOps AI operations platform",
    version="0.1.0"
)

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "NexusOps AI backend is running."}

# Mock Endpoints for MVP Agents
from services.ai_service import execute_workflow

class WorkflowRequest(BaseModel):
    task: str

@app.post("/api/workflow/run")
def run_workflow(request: WorkflowRequest):
    return execute_workflow(request.task)
