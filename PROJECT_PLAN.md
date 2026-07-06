# NexusOps AI - Project Plan

## Architecture Overview
The platform consists of a containerized FastAPI backend and a React frontend, orchestrated via Docker Compose.

### Agent Collaboration Flow
1. **User Input:** The user submits an operations task via the React Frontend.
2. **Planner Agent:** The backend routes the request to the Planner Agent, which generates a step-by-step execution plan.
3. **Research Agent:** For each step requiring external context, the Research Agent gathers data.
4. **Executor Agent:** The Executor takes the plan and research context and performs the necessary actions (e.g., API calls, script execution).
5. **Reviewer Agent:** The Reviewer evaluates the output of the Executor against the original plan and safety constraints. If it fails, the workflow routes back to the Planner or Executor.

### Data Flow
- Frontend <-> Backend via REST API.
- Backend <-> AI Provider (Fireworks AI) via API.
- State is managed in-memory (or a lightweight DB if needed later) for the MVP.
