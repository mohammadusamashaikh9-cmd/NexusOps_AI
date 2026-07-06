# NexusOps AI

An enterprise AI operations platform built for the **AMD Developer Hackathon ACT II, Track 3 (Unicorn / Open Innovation)**.

## Project Goal
Build a robust platform where four AI agents collaborate autonomously to complete complex operations tasks:
1. **Planner Agent:** Breaks down user requests into actionable workflows.
2. **Research Agent:** Gathers necessary context, documentation, and system states.
3. **Executor Agent:** Interacts with external systems to execute the planned actions.
4. **Reviewer Agent:** Validates the execution and ensures quality and safety.

## Tech Stack
- **Backend:** FastAPI + Python
- **Frontend:** React + TypeScript + Tailwind CSS
- **AI Model Layer:** Mock mode initially, progressing to Fireworks AI / Gemma.
- **Compute:** AMD GPU notebook (Future Phase).
- **Deployment:** Docker / docker-compose ready.

## Getting Started
(Detailed instructions will be added as the project progresses)

1. Clone the repository.
2. Copy `.env.example` to `.env` and configure it.
3. Run `docker-compose up --build`.
