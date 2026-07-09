from fastapi import FastAPI, Form, File, UploadFile, HTTPException
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
from services.workflow_service import run_workflow

@app.post("/api/workflow/run")
async def api_run_workflow(
    task: str = Form(...),
    document: UploadFile = File(None)
):
    document_context = None
    document_name = None
    
    if document is not None and document.filename:
        if not (document.filename.endswith(".txt") or document.filename.endswith(".md")):
            raise HTTPException(status_code=400, detail="Only .txt and .md files are supported.")
        
        content_bytes = await document.read(1024 * 1024 + 1)
        if len(content_bytes) > 1024 * 1024:
            raise HTTPException(status_code=400, detail="File size exceeds the 1MB limit.")
            
        try:
            document_context = content_bytes.decode('utf-8')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="File must be valid UTF-8 text.")
            
        document_name = document.filename
        
    return run_workflow(task, document_context, document_name)
