# Kimi-Knowledge (Agent Working Memory & Knowledge Base)

> **[AGENT INSTRUCTIONS - READ BEFORE MODIFYING]**
> You are accessing the `Kimi-Knowledge.md` file. This is the central source of truth and working memory for the Kimi swarm agents and kimi-code. 
> 
> **When populating or updating this file, you MUST adhere strictly to the following rules:**
> 1. **Search Before Adding:** Always review existing sections to prevent duplicate entries. Update existing nodes rather than appending redundant information.
> 2. **Maintain Hierarchy:** Use strict Markdown headings (`##`, `###`, `####`) to categorize information. Do not skip heading levels.
> 3. **Tagging System:** Append relevant metadata tags at the end of new sections in the format `[Tags: #tag1, #tag2]` to improve semantic retrieval.
> 4. **Timestamps:** Prefix major updates or logs with the current date `[YYYY-MM-DD]`.
> 5. **Conciseness:** Keep descriptions brief and heavily favor code blocks, bullet points, and exact file paths over long prose. 
> 6. **State Tracking:** Move completed tasks from "Active Context" to "Resolved Architecture" or "Known Issues" as appropriate.

---

## 1. Project Overview & Core Directives
* **Goal:** [Briefly define the core objective of the project]
* **Primary Tech Stack:** [e.g., Python, React, Docker, Postgres]
* **Repository Root:** `/` (Assume all paths are relative to this root)

## 2. Active Working Context (Swarm State)
*Use this section for ongoing tasks, immediate next steps, or temporary memory hand-offs between swarm agents.*

* **Current Focus:** [Agent updates this with the immediate task]
* **Active Files:** * `path/to/file1.ext` - [Reason it is being edited]
* **Pending Blockers:** * [List any errors, missing API keys, or dependencies needed]

## 3. Architecture & Conventions
*Document established patterns, folder structures, and coding standards here so agents do not hallucinate structural decisions.*

### 3.1. Directory Structure Map
```text
/src
  /components  # React UI components
  /api         # Backend integrations