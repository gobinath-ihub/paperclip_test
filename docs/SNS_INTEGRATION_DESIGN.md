# Research and Design: External API Layer for SNS Integration

**Task ID:** GEN-69
**Status:** Draft
**Date:** 16 June 2026

## 1. Overview
The goal is to enable external platforms, specifically the **SNS Agent Workbench**, to integrate with Paperclip. SNS will use Paperclip as an external execution engine for organizational workflows involving various agents (CEO, CTO, etc.).

## 2. Requirement Mapping
Based on GEN-68 and GEN-69, the following capabilities are required:

| Feature | SNS Requirement | Existing Paperclip API | Gap / Design Need |
| :--- | :--- | :--- | :--- |
| **Task Creation** | Submit problem statements programmatically | `POST /api/companies/:companyId/issues` | Needs a public, simplified endpoint. |
| **Workflow Execution** | Trigger organizational workflows | `POST /api/agents/:agentId/heartbeat/invoke` | Needs higher-level "workflow" trigger. |
| **Agent Invocation** | Call specific agents | `POST /api/agents/:agentId/heartbeat/invoke` | Authentication and scope management. |
| **Run Monitoring** | Monitor execution progress | `GET /api/issues/:issueId` | Real-time status/event stream or webhooks. |
| **Result Retrieval** | Retrieve executive recommendations | `GET /api/issues/:issueId/documents/:key` | Unified "Final Result" extraction. |

## 3. Proposed Architecture: External API Layer (v1)

The External API Layer will act as a "Public Gateway" to the Paperclip Control Plane. It will simplify the internal complex API into a few developer-friendly endpoints optimized for external platforms.

### 3.1 Authentication Strategy
We propose a **Permanent API Key** mechanism for initial integration, followed by **OAuth2** for multi-tenant support.
- **API Keys:** Generated per company/platform (e.g., `sns_live_...`).
- **Scope:** Keys will be scoped to specific projects or the entire company.

### 3.2 Key Endpoints (Detailed Spec)

#### `POST /api/v1/external/submit`
Submits a business problem statement and triggers a workflow.
- **Request Body:**
```json
{
  "title": "Quarterly Expansion Strategy",
  "description": "Analyze the potential for expanding into the EU market...",
  "workflow": "executive_review",
  "callbackUrl": "https://sns-agent-workbench.com/webhooks/task-update"
}
```
- **Success Response (202 Accepted):**
```json
{
  "taskId": "GEN-105",
  "status": "pending",
  "statusUrl": "/api/v1/external/tasks/GEN-105"
}
```

#### `GET /api/v1/external/tasks/:id`
Retrieves current status and aggregated results.
- **Success Response (200 OK):**
```json
{
  "taskId": "GEN-105",
  "status": "in_progress",
  "workflow": "executive_review",
  "progress": 65,
  "startedAt": "2026-06-16T08:00:00Z",
  "currentAgent": "CTO",
  "finalOutput": null
}
```
- **On Completion:**
```json
{
  "taskId": "GEN-105",
  "status": "done",
  "finalOutput": {
    "executiveSummary": "...",
    "strategicImpact": "...",
    "technicalFeasibility": "...",
    "financialViability": "...",
    "confidenceScore": 85
  }
}
```

## 6. Sample Workflow: Executive Review Logic Flow
The `executive-review-skill` will follow this state machine:

1. **STATE_INIT:** Lead Agent (CEO) is assigned. Skill reads `description`.
2. **STATE_DELEGATE:** 
   - Create subtask A (CTO): "Technical Assessment of [Title]".
   - Create subtask B (CFO): "Financial Risk Analysis of [Title]".
   - Set current task status to `blocked` by A and B.
3. **STATE_SYNTHESIZE (Triggered by child completion):**
   - CEO wakes. Reads subtask A and B outputs from their `result` documents.
   - CEO performs final synthesis.
   - CEO writes to the main `result` document.
4. **STATE_COMPLETE:**
   - CEO marks main task `done`.

## 7. Prototype Implementation Plan (Phased)

### Phase 1: Mock External Gateway
- Implement a simple Express route in `apps/server` that accepts the `submit` payload.
- Manually trigger a CEO task via Paperclip API to simulate the workflow start.

### Phase 2: Executive Review Skill Prototype
- Implement the `executive-review-skill` as a set of instructions/logic.
- Test the delegation and synthesis flow within Paperclip.

### Phase 3: Result Extraction & Webhooks
- Implement the logic to pull the `result` document and format it for the external API response.
- Add a basic webhook dispatcher for task completion events.

## 8. Next Steps
1. Finalize the `executive-review-skill` logic as a portable Paperclip Skill.
2. Present this refined design and prototype plan to the board.
