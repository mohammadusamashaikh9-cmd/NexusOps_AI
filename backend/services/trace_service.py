from typing import List, Dict

class TraceService:
    def __init__(self):
        self.traces: List[Dict[str, str]] = []

    def add_trace(self, step: str, status: str, message: str):
        self.traces.append({
            "step": step,
            "status": status,
            "message": message
        })

    def get_traces(self) -> List[Dict[str, str]]:
        return self.traces

def create_workflow_trace() -> TraceService:
    return TraceService()
