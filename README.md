# NexusOps AI

An enterprise AI operations platform built for the **AMD Developer Hackathon ACT II, Track 3 (Unicorn / Open Innovation)**.

## Project Goal
Build a robust platform where four AI agents collaborate autonomously to complete complex operations tasks:
1. **Planner Agent:** Breaks down user requests into actionable workflows.
2. **Research Agent:** Gathers necessary context, documentation, and system states.
3. **Executor Agent:** Interacts with external systems to execute the planned actions.
4. **Reviewer Agent:** Validates the execution and ensures quality and safety.

## Demo Video
Demo video link: To be added before final submission.

## Validation Evidence
Proof of AMD hardware and Fireworks AI integration:
- [AMD Validation Plan](docs/AMD_VALIDATION_PLAN.md)
- [AMD Notebook Execution](notebooks/amd_validation_nexusops.ipynb)
- [Evidence Screenshots](docs/evidence/)

## Tech Stack
- **Backend:** FastAPI + Python
- **Frontend:** React + TypeScript + Tailwind CSS
- **AI Model Layer:** Mock fallback mode plus live Fireworks AI inference using a confirmed serverless LLM.
- **Compute:** AMD Hackathon Jupyter notebook validation with ROCm / AMD hardware evidence.
- **Deployment:** Docker / docker-compose ready.

## Getting Started

1. Clone the repository.
2. Copy `.env.example` to `.env` and configure it.

### Option A: Run with Docker (Recommended)
Run the following command to spin up both the frontend and backend:
```bash
docker-compose up --build
```

### Option B: Run Locally
**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Accessing the Application
- **Frontend Dashboard:** http://localhost:5173
- **Backend API Docs:** http://localhost:8000/docs
- **Backend Health Endpoint:** http://localhost:8000/api/health

## AI Engine Modes
NexusOps AI operates in two distinct backend modes, controlled by the `USE_MOCK_AI` environment variable in your `.env` file:

1. **Mock Mode (Default):** Runs instantly using local simulated data. Perfect for UI/UX development and testing without incurring API costs. Triggered when `USE_MOCK_AI=true` or if the Fireworks API key is missing/invalid.
2. **Fireworks AI Mode:** Enables live Fireworks AI inference for task breakdown, agent loop execution, and final report generation. The current tested serverless model is configured through FIREWORKS_MODEL. Requires `USE_MOCK_AI=false` and a valid `FIREWORKS_API_KEY`.
