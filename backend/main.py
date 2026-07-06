from fastapi import FastAPI

app = FastAPI(
    title="NexusOps AI API",
    description="Backend API for the NexusOps AI operations platform",
    version="0.1.0"
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "NexusOps AI backend is running."}

# Mock Endpoints for MVP Agents
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
