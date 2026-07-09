from services.trace_service import TraceService

def get_mock_workflow(task: str, document_context: str | None = None, document_name: str | None = None, error_mode: bool = False) -> dict:
    status = "error_fallback_mock" if error_mode else "mock"
    
    # Generate deterministic trace
    tracer = TraceService()
    tracer.add_trace("task_received", "completed", f"Received task: {task[:50]}...")
    tracer.add_trace("planner", "completed", "Decomposed task into execution plan.")
    tracer.add_trace("research", "completed", "Ingested vector data from shared memory.")
    tracer.add_trace("executor", "completed", "Generated code sequences and API calls.")
    tracer.add_trace("reviewer", "completed", "Validated output integrity against safety protocols.")
    tracer.add_trace("final_report", "completed", "Final operations report generated.")
    
    # Lightweight reviewer score
    reviewer_score = {
        "clarity": 95,
        "completeness": 90,
        "actionability": 92,
        "risk": "low",
        "decision": "pass"
    }

    mock_final_output = f"""# NexusOps AI Operations Report

## Task
{task}

## Document Context
- File: {document_name if document_name else 'No document attached'}
- Summary: {'Mock extracted document.' if document_context else 'No document provided.'}

## Planner Summary
Analyzed metrics and decomposed the task into an execution plan.

## Research Summary
Ingested vector data from shared memory and found inefficiencies in cluster A.

## Execution Summary
Generated code sequences and deployed optimization patch.

## Review
Validated output integrity. Score: 95/100, Risk: Low, Decision: Pass.

## Final Recommendation
Workflow completed successfully and reviewed{ ' (Fallback Mode)' if error_mode else '' }.
"""

    response = {
        "task": task,
        "planner_output": {"agent": "planner", "status": status, "plan": ["Analyze metrics", "Optimize routes"]},
        "research_output": {"agent": "researcher", "status": status, "findings": "Found inefficiencies in cluster A."},
        "executor_output": {"agent": "executor", "status": status, "result": "Deployed optimization patch."},
        "reviewer_output": {"agent": "reviewer", "status": status, "approval": True},
        "final_output": mock_final_output,
        "mode": "fallback_mock" if error_mode else "mock",
        "trace": tracer.get_traces(),
        "reviewer_score": reviewer_score
    }
    
    if document_name:
        response["document_attached"] = True
        response["document_name"] = document_name
        
    return response
