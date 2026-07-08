from services.trace_service import TraceService

def get_mock_workflow(task: str, error_mode: bool = False) -> dict:
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

    return {
        "task": task,
        "planner_output": {"agent": "planner", "status": status, "plan": ["Analyze metrics", "Optimize routes"]},
        "research_output": {"agent": "researcher", "status": status, "findings": "Found inefficiencies in cluster A."},
        "executor_output": {"agent": "executor", "status": status, "result": "Deployed optimization patch."},
        "reviewer_output": {"agent": "reviewer", "status": status, "approval": True},
        "final_output": f"Workflow completed successfully and reviewed. Executed task: {task}" + (" (Fallback)" if error_mode else ""),
        "mode": "fallback_mock" if error_mode else "mock",
        "trace": tracer.get_traces(),
        "reviewer_score": reviewer_score
    }
