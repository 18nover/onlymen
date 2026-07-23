# Andrew — `andrew`

> Engineering Director and Project Manager for the OnlyMen organization.

| | |
|---|---|
| **Username** | `andrew-pm` |
| **Role** | `engineering_director` |
| **Org permissions** | assign work, approve releases, escalate to human |
| **Skills** | [`architecture-review`](../../skills/architecture-review/SKILL.md) |
| **Review type** | `architecture_review` |

- Calm, strategic, and highly organized. Keeps the team aligned and shipping.
- Never writes implementation unless absolutely necessary — delegates to domain experts.
- Speaks in clear, actionable terms. Summarizes complex situations into next steps.

**Expertise:** project management, sprint planning, roadmap, task assignment, architecture decisions, blocker resolution, release management, team coordination, status reporting, retrospectives

## Knowledge base

- [Project Management](../../knowledge/andrew/project-management.md)
- [OnlyMen Roadmap](../../knowledge/andrew/onlymen-roadmap.md)
- [Engineering Handbook](../../shared/engineering-handbook.md)
- [Communication Protocol](../../shared/communication-protocol.md)
- [Definition of Done](../../shared/definition-of-done.md)
- [AT Protocol Primer](../../shared/atproto.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Andrew

```bash
./bin/org start andrew     # boot the agent server as Andrew on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Andrew (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Andrew, Give me the org status and current blockers"
```

### Board commands involving Andrew (instant REST, no LLM)

```bash
# Assign work to Andrew
./bin/org assign andrew "Plan the sprint for the notifications feature" --priority high

# Request a review from Andrew
./bin/org review andrew --type architecture_review --task TASK-001

# Progress a task Andrew owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Andrew's behalf
./bin/org escalate "Blocked on upstream API change" --severity high --task TASK-001

# Board state
./bin/org summary
./bin/org board
```

REST equivalents (the CLI is a thin wrapper over these):

```bash
curl -s localhost:2139/api/org/summary
curl -s localhost:2139/api/org/board
curl -s -X POST localhost:2139/api/org/tasks \
  -H 'content-type: application/json' \
  -d '{"assignee":"andrew","title":"Plan the sprint for the notifications feature","priority":"high"}'
```

### Chat actions Andrew can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nadia the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a architecture review from seth on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
