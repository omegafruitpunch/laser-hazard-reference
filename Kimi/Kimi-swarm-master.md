# Kimi Swarm Protocols & Master Workflow Structure

> **Objective:** To define the operational protocols, architectural structure, and standardized workflows for the Kimi Agent Swarm, ensuring high-efficiency execution, robust state management, minimal redundancy, and fault-tolerant hand-offs.

---

## 1. Core Architecture

The swarm operates on a **Hub-and-Spoke** orchestration model to prevent infinite loops, maintain tight context windows, and ensure deterministic routing.

* **Orchestrator (Hub):** The central routing agent responsible for understanding the user prompt, delegating sub-tasks, managing working memory, and synthesizing final outputs.
* **Specialists (Spokes):** Domain-specific agents equipped with scoped tools and system prompts tailored strictly for execution, review, or data retrieval.

---

## 2. Standardized Agent Roles

To maintain clear boundaries and prevent capability overlap, agents are strictly categorized into the following roles:

| Role Name | Primary Responsibility | Input Expected | Output Expected |
| :--- | :--- | :--- | :--- |
| **Router (Hub)** | Triage, task delegation, and synthesis | Raw User Prompt | Task JSON & Agent Assignment |
| **Researcher** | Data gathering, RAG, and web scraping | Search Queries / URLs | Cleaned Text / Datasets |
| **Executor** | Code generation, drafting, or tool use | Context + Sub-task | Artifact / Code Block / Action |
| **Reviewer** | Quality control, validation, and testing | Executor Artifact | Pass/Fail Boolean + Feedback |

---

## 3. Communication Protocol

Agents must communicate using a standardized JSON schema. Unstructured text passing between agents is strictly prohibited to prevent context degradation and hallucination.

**Standard Hand-off Payload:**
```json
{
  "sender_agent": "string",
  "receiver_agent": "string",
  "task_id": "string",
  "context_summary": "string",
  "action_required": "string",
  "payload": {},
  "status": "pending | completed | error | pending_human_approval"
}