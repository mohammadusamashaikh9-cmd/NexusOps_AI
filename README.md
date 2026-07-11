# NexusOps AI

An enterprise AI operations platform built for the **AMD Developer Hackathon ACT II, Track 3 (Unicorn / Open Innovation)**.

NexusOps AI provides a robust, multi-agent workspace designed to break down and execute complex operations tasks autonomously, bringing premium enterprise workflows to modern LLMs.

---

## AMD Compute Usage
This project leverages **AMD hardware** for its AI inference engine through the **Fireworks AI** platform (which utilizes AMD Instinct MI300X accelerators for models like Llama/Gemma). 

*Note: As required for the hackathon, direct AMD hardware validation logic and test executions have been documented. The live deployment is designed to query endpoints accelerated by AMD hardware.*

- **AMD Validation Plan:** [docs/AMD_VALIDATION_PLAN.md](docs/AMD_VALIDATION_PLAN.md)
- **AMD Notebook Execution (Pending evidence / executed tests):** [notebooks/amd_validation_nexusops.ipynb](notebooks/amd_validation_nexusops.ipynb)

---

## Submission Assets
- GitHub Repository: https://github.com/mohammadusamashaikh9-cmd/NexusOps_AI
- Demo Video: https://drive.google.com/file/d/1miTM-ID4E2WaE8nYKohun2sw45Q1z28B/view?usp=drive_link
- Slide Deck: https://drive.google.com/file/d/1lq8UIVZ6n3aLi6z1mVOG4irRPgA8L_5C/view?usp=drive_link
- Live Demo / Hosted URL: Not deployed; local demo is shown in the demo video and can be run using the setup instructions below.

---

## Key Features
- **Multi-agent workflow:** Dynamic coordination between specialized AI roles.
  - **Planner Agent:** Breaks down user requests into actionable workflows.
  - **Research Agent:** Gathers necessary context, documentation, and system states.
  - **Executor Agent:** Interacts with external systems to execute the planned actions.
  - **Reviewer Agent:** Validates the execution and ensures quality and safety.
- **Audit Trace:** Transparent, step-by-step logging of the entire agent execution loop.
- **Enterprise Document Support:** Native upload support for **PDF, DOCX, TXT, and MD** files to provide rich context to the AI workflow.
- **Report Export:** Instantly export generated operations reports in **Markdown, PDF, or DOCX** formats.
- **FastAPI Backend:** Lightweight, asynchronous Python backend tailored for high-speed LLM integration.
- **React Dashboard:** Premium, dark-themed enterprise UI with real-time state management.
- **Fireworks/Gemma Readiness:** Pre-configured to support serverless LLM calls via Fireworks AI, ensuring seamless inference on advanced models.

---

## Demo Workflow
1. **Initialize Session:** The user opens the NexusOps AI dashboard.
2. **Provide Context:** The user attaches an enterprise document (e.g., a PDF report or DOCX requirements file).
3. **Issue Command:** The user types a high-level operational command (e.g., "Analyze this system report and generate a remediation plan").
4. **Agent Execution:** The Multi-Agent backend spins up, triggering the Planner, Researcher, Executor, and Reviewer sequence.
5. **Review Audit Trace:** The user monitors the live Audit Trace to see exactly what decisions the AI agents are making in real-time.
6. **Export Output:** The final report is generated and can be cleanly exported to PDF or DOCX for executive review.

---

## Local Setup

### 1. Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# On Windows: .venv\Scripts\activate
# On Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*(The backend will be available at `http://localhost:8000`)*

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will be available at `http://localhost:5173`)*

---

## Repository Structure
```text
NexusOps_AI/
├── backend/                  # FastAPI backend application
│   ├── main.py               # Main application entrypoint
│   ├── requirements.txt      # Python dependencies
│   └── services/             # Core agent and workflow services
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── App.tsx           # Main dashboard UI component
│   │   └── index.css         # Custom premium styling
│   └── package.json          # Node dependencies
├── docs/                     # Validation documentation and plans
├── notebooks/                # Jupyter notebooks for AMD validation tests
└── README.md                 # Project documentation
```

---

## Security / No Secrets
**Note to reviewers:** This repository does not contain any hardcoded API keys or sensitive secrets. Any API endpoints that require authentication (like the Fireworks API) retrieve their keys securely via local `.env` variables (`FIREWORKS_API_KEY`). 

---

## Track 3 Submission Checklist
- [x] Track 3: Unicorn / Open Innovation alignment
- [x] GitHub repository URL provided
- [x] Demo video included
- [x] Slide deck included
- [ ] Live demo / hosted URL optional
- [x] AMD compute usage demonstrated/documented
- [x] No Docker image required for Track 3 submission
