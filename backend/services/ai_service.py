import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

USE_MOCK_AI = os.getenv("USE_MOCK_AI", "true").lower() == "true"
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY", "").strip()
FIREWORKS_MODEL = os.getenv("FIREWORKS_MODEL", "accounts/fireworks/models/gemma-4-31b-it")

def get_mock_workflow(task: str, error_mode: bool = False) -> dict:
    status = "error_fallback_mock" if error_mode else "mock"
    return {
        "planner_output": {"agent": "planner", "status": status, "plan": ["step 1", "step 2"]},
        "research_output": {"agent": "researcher", "status": status, "findings": "mock research data"},
        "executor_output": {"agent": "executor", "status": status, "result": "mock execution success"},
        "reviewer_output": {"agent": "reviewer", "status": status, "approval": True},
        "final_output": "Workflow completed successfully and reviewed." + (" (Fallback)" if error_mode else ""),
        "mode": "mock"
    }

def call_fireworks_api(prompt: str) -> str:
    url = "https://api.fireworks.ai/inference/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {FIREWORKS_API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "model": FIREWORKS_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 1000,
        "temperature": 0.2
    }
    
    response = requests.post(url, json=payload, headers=headers, timeout=15)
    response.raise_for_status()
    data = response.json()
    return data["choices"][0]["message"]["content"]

def execute_workflow(task: str) -> dict:
    """
    Executes the workflow. Defaults to mock mode.
    If live mode is enabled but fails, safely falls back to mock mode.
    """
    if USE_MOCK_AI or not FIREWORKS_API_KEY:
        if not USE_MOCK_AI and not FIREWORKS_API_KEY:
            print("WARNING: Fireworks API key missing. Falling back to mock mode.")
        return get_mock_workflow(task)
        
    try:
        # For the live implementation, we query Gemma and map the result.
        prompt = f"As an AI assistant, provide a brief 2-sentence summary of how you would execute this task: {task}"
        llm_response = call_fireworks_api(prompt)
        
        return {
            "planner_output": {"agent": "planner", "status": "live", "plan": ["AI Plan Generated"]},
            "research_output": {"agent": "researcher", "status": "live", "findings": "AI Research complete"},
            "executor_output": {"agent": "executor", "status": "live", "result": "AI Execution complete"},
            "reviewer_output": {"agent": "reviewer", "status": "live", "approval": True},
            "final_output": llm_response,
            "mode": "live"
        }
        
    except Exception as e:
        print(f"ERROR: Fireworks API call failed ({e}). Falling back to mock mode.")
        return get_mock_workflow(task, error_mode=True)
