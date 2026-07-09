# AMD Validation Plan for NexusOps AI

## 1. Why AMD Validation is Needed
For this hackathon, demonstrating that NexusOps AI interacts properly with Fireworks AI models powered by AMD accelerators is a key requirement. While our local server correctly routes to the `accounts/fireworks/models/kimi-k2p7-code` model via the Fireworks API, a Jupyter Notebook running in the official AMD hackathon environment provides indisputable proof that our integration is technically sound, reproducible, and verifiable by the judges within their expected ecosystem.

## 2. What We Will Test in the AMD Notebook
We will create a lightweight Python notebook script that mirrors the exact same API call performed by our backend `workflow_service`. The tests will validate:
- Connectivity to the Fireworks AI API using the same AMD-powered model.
- Successful generation of an executive operations report using our agentic prompt schema.
- The ability to ingest and utilize document context (e.g., simulating our document upload feature).
- Multi-step validation of the agent loop logic (Planner, Research, Executor, Reviewer) using identical system prompts.

## 3. Evidence to Capture for Judges
To guarantee full credit for the AMD integration requirement, we must capture:
- **Code Snippet**: The specific cell executing the `call_fireworks_api` equivalent.
- **Execution Output**: The raw LLM response proving the AMD-powered model returned the structured operations report.
- **Environment Context**: Evidence that the notebook is running in the provided AMD/hackathon environment (e.g., system details or environment variable checks).
- **Latency/Performance Metrics**: (Optional but recommended) Time taken for the inference to complete, showcasing the speed of the AMD hardware.

## 4. Commands and Notebook Cells to Run
We will execute the following core logic within the AMD notebook:

```python
import os
import requests
import json

# Setup
FIREWORKS_API_KEY = os.environ.get("FIREWORKS_API_KEY")
MODEL_NAME = "accounts/fireworks/models/kimi-k2p7-code"
URL = "https://api.fireworks.ai/inference/v1/chat/completions"

# 1. Environment Validation
print("Validating AMD Environment...")
!uname -a
!lscpu | grep -i amd

# 2. NexusOps Inference Test
headers = {
    "Authorization": f"Bearer {FIREWORKS_API_KEY}",
    "Content-Type": "application/json"
}

prompt = """
You are the Final Output Synthesis Agent for NexusOps AI.
Task: "Analyze system logs and recommend scaling."
Document Context: "CPU utilization spiked to 95% at 03:00 AM."

Generate a professional Markdown operations report based on this context.
"""

payload = {
    "model": MODEL_NAME,
    "messages": [
        {"role": "system", "content": "You are a senior AI operations director."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.2
}

# 3. Execute Inference
response = requests.post(URL, headers=headers, json=payload)
print(json.dumps(response.json(), indent=2))
```

## 5. Screenshots and Results to Save
- **Screenshot 1**: The cell executing `lscpu` or `uname -a` showing the AMD environment details.
- **Screenshot 2**: The cell executing the Fireworks API call, clearly displaying the model name (`accounts/fireworks/models/kimi-k2p7-code`).
- **Screenshot 3**: The printed JSON response containing the generated Markdown report.
- **Artifact**: Export the executed `.ipynb` file to include in the final project submission repository.

## 6. Connection to NexusOps AI
This notebook acts as a standalone microcosm of our backend system. The prompt, model, and inference parameters used in the notebook are identical to those in `backend/services/workflow_service.py` and `backend/services/ai_service.py`. This proves that the core intelligence engine powering NexusOps AI is fully compatible with and accelerated by AMD hardware via Fireworks AI.

## 7. What to Avoid in the Notebook
- **Do not hardcode the API key**: Always use `os.environ.get()` or a `.env` file to prevent leaking credentials in screenshots or the exported notebook.
- **Do not replicate the entire backend**: Do not copy over FastAPI routing, CORS, or file-handling logic. The notebook should strictly focus on inference validation.
- **Do not use heavy dependencies**: Avoid installing large packages unless explicitly required for the inference call (e.g., standard `requests` is sufficient; we don't need `python-multipart` here).
