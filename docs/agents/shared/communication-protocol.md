# Communication Protocol

## Overview

OnlyMen agents communicate via a hybrid system: **events** for notifications, **shared memory** for artifacts, and **direct messages** for discussion.

## Event Types

Events are emitted via the ElizaOS plugin event system. All events are prefixed with `ORG_`.

| Event | Emitter | Consumers | Payload |
|-------|---------|-----------|---------|
| `ORG_TASK_ASSIGNED` | Andrew | Target agent | `{ taskId, assignee, description, priority, deadline }` |
| `ORG_REVIEW_REQUESTED` | Any agent | Reviewer agent | `{ taskId, reviewer, artifact, type, urgency }` |
| `ORG_REVIEW_COMPLETE` | Reviewer | Andrew, requester | `{ taskId, reviewer, verdict, findings[], severity }` |
| `ORG_BLOCKER_RAISED` | Any agent | Andrew | `{ taskId, agent, blocker, severity, context }` |
| `ORG_DECISION_MADE` | Any agent | All agents | `{ decisionId, title, rationale, alternatives[], author }` |
| `ORG_SPRINT_UPDATED` | Andrew | All agents | `{ sprintId, phase, tasks[] }` |
| `ORG_ESCALATION` | Any agent | Andrew + domain lead | `{ issue, from, severity, deadline }` |
| `ORG_FINDINGS_REPORTED` | Audrey/Quinn/Seth | Andrew | `{ scope, findings[], severity, recommendations[] }` |
| `ORG_APPROVAL_GRANTED` | Andrew | Implementer | `{ taskId, approver, conditions[] }` |
| `ORG_APPROVAL_DENIED` | Andrew | Implementer | `{ taskId, approver, reasons[], required[] }` |

## Message Format

Direct agent-to-agent messages follow this structure:

```json
{
  "from": "nadia-rn",
  "to": "morgan-backend",
  "type": "review_request",
  "priority": "high",
  "subject": "Auth flow architecture review",
  "body": "I need your input on the OAuth integration...",
  "artifacts": ["decision-001-oauth-flow.md"],
  "deadline": "2h",
  "context": {
    "taskId": "TASK-042",
    "sprint": "sprint-12"
  }
}
```

## Shared Memory

Agents read and write to shared memory stores:

| Store | Purpose | Access |
|-------|---------|--------|
| `decisions/` | Architecture Decision Records | Read: all, Write: author + Andrew |
| `artifacts/` | Code reviews, audit reports, test results | Read: relevant agents, Write: author |
| `blockers/` | Active blockers and their status | Read: all, Write: author + Andrew |
| `sprint/` | Current sprint state and task assignments | Read: all, Write: Andrew only |
| `findings/` | Audit findings, security issues, bugs | Read: all, Write: auditors |

## Communication Rules

1. **Always include context.** Reference task IDs, sprint IDs, and relevant artifacts.
2. **Be specific.** "This needs work" is useless. "The auth middleware doesn't validate JWT expiry" is actionable.
3. **Respect domains.** Don't implement in another agent's domain without asking.
4. **Async by default.** Don't block waiting for a response unless it's a real blocker.
5. **Escalate when stuck.** If you're going in circles, bring Andrew in.
6. **Summarize decisions.** After a debate, the winner writes an ADR.

## Escalation Paths

```
Level 1: Agent-to-agent direct message
Level 2: Agent raises blocker → Andrew
Level 3: Andrew convenes multi-agent review
Level 4: Andrew escalates to human operator
```

Escalate when:
- Two agents disagree on architecture after one round of debate
- A blocker has been open for >2 hours
- A security issue is discovered (always escalate to Seth + Andrew)
- A decision affects more than 2 agents
