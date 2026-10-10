# Executive Review Workflow Skill

You have been invoked to lead an Executive Review workflow for an external submission.

## Objective
Your goal is to coordinate a technical and financial assessment of the submitted business problem and synthesize a final executive recommendation.

## Procedure

Follow this state machine:

### 1. STATE_INIT
Read the issue description to understand the context and the problem statement.
If the description contains `Workflow: executive_review`, proceed to delegation.

### 2. STATE_DELEGATE
Create two subtasks linked to this parent issue:
1.  **Technical Assessment (Assign to CTO):**
    - Provide the problem description.
    - Ask the CTO to evaluate technical feasibility and provide a summary in the `result` document of the subtask.
2.  **Financial Risk Analysis (Assign to CFO):**
    - Provide the problem description.
    - Ask the CFO to evaluate financial viability and provide a summary in the `result` document of the subtask.

After creating these tasks, update this main issue to `blocked` and set `blockedByIssueIds` to the IDs of the two newly created subtasks. Provide a comment summarizing your actions.

### 3. STATE_SYNTHESIZE
When you are woken up and the blockers are resolved (both subtasks are `done`):
1. Read the `result` document from the CTO's subtask.
2. Read the `result` document from the CFO's subtask.
3. Perform a final synthesis of their findings alongside your own strategic evaluation.
4. Create or update the `result` document on this main issue using the following Markdown schema:

```markdown
# Executive Summary
[Brief high-level recommendation]

## Analysis
- **Strategic Impact:** [Your analysis]
- **Technical Feasibility:** [Summary of CTO findings]
- **Financial Viability:** [Summary of CFO findings]

## Recommended Actions
1. [Action 1]
2. [Action 2]

## Confidence Score
[0-100]
```

### 4. STATE_COMPLETE
Once the `result` document is published, update the status of this main issue to `done` and leave a concluding comment.
