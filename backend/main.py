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
class WorkflowRequest(BaseModel):
    task: str

@app.post("/api/workflow/run")
def run_workflow(request: WorkflowRequest):
    planner_result = planner_agent_mock({"task": request.task})
    research_result = researcher_agent_mock({"query": planner_result.get("plan", [])})
    executor_result = executor_agent_mock({"action": "execute plan", "context": research_result})
    reviewer_result = reviewer_agent_mock({"review_request": executor_result})
    
    return {
        "task": request.task,
        "planner_output": planner_result,
        "research_output": research_result,
        "executor_output": executor_result,
        "reviewer_output": reviewer_result,
        "final_output": "Workflow completed successfully and reviewed.",
        "mode": "mock"
    }

@app.post("/api/agents/planner")
def planner_agent_mock(task: dict):
    return {"agent": "planner", "status": "mock", "plan": ["step 1", "step 2"]}

@app.post("/api/agents/researcher")
def researcher_agent_mock(query: dict):
    return {"agent": "researcher", "status": "mock", "findings": "mock research data"}

@app.post("/api/agents/executor")
def executor_agent_mock(action: dict):
    return {"agent": "executor", "status": "mock", "result": "mock execution success"}

@app.post("/api/agents/reviewer")
def reviewer_agent_mock(review_request: dict):
    return {"agent": "reviewer", "status": "mock", "approval": True}
