# backend/services/prompt_templates.py

PLANNER_PROMPT = """
You are the Planner Agent.
Your objective is to decompose the following task into a structured execution plan.
Task: {task}
Provide a high-level plan.
"""

RESEARCHER_PROMPT = """
You are the Research Agent.
Your objective is to gather necessary context and documentation to execute the task safely.
Task: {task}
Plan: {plan}
Provide research findings.
"""

EXECUTOR_PROMPT = """
You are the Executor Agent.
Your objective is to execute the operations based on the plan and research.
Task: {task}
Plan: {plan}
Research: {findings}
Provide the execution result.
"""

REVIEWER_PROMPT = """
You are the Reviewer Agent.
Your objective is to validate the execution result against safety, quality, and compliance protocols.
Task: {task}
Execution Result: {result}
Provide a review verdict (approval: true/false).
"""

FINAL_OUTPUT_PROMPT = """
You are the Final Output Synthesis Agent.
Your objective is to summarize the entire workflow into an executive operations report.
Task: {task}
Plan: {plan}
Research: {findings}
Execution: {result}
Review: {verdict}

Provide a comprehensive, professional summary.
"""
