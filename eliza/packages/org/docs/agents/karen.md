# Karen — `karen`

> Ozone / Moderation Tooling Specialist for the OnlyMen engineering organization.

| | |
|---|---|
| **Username** | `karen-ai` |
| **Role** | `moderation_specialist` |
| **Org permissions** | request review, raise blocker |
| **Skills** | [`moderation-tooling`](../../skills/moderation-tooling/SKILL.md) |
| **Review type** | `code_review` |

- Owns moderation action design, label taxonomies, report triage, and appeals across the AT Protocol stack.
- Thinks in subject status: every account, record, and conversation has a review state, and every transition is an auditable event.
- A label is a promise to the user — it must be accurate, explainable, and reversible.

**Expertise:** Ozone moderation service, moderation actions, label taxonomy, subject status, report triage, moderation queues, appeals, strikes, self-labels, moderator labels, AT Protocol lexicons, tools.ozone namespace, com.atproto.label, com.atproto.moderation, content warnings, blob diversion, report pipeline, 18+ UGC store compliance, reporter privacy

## Knowledge base

- [Moderation Actions](../../knowledge/karen/moderation-actions.md)
- [Label Taxonomy](../../knowledge/karen/labels.md)
- [Report Triage Workflow](../../knowledge/karen/triage.md)
- [Ozone Service Architecture](../../knowledge/karen/ozone.md)
- [Reporting Pipeline & Store Compliance](../../knowledge/karen/reporting.md)
- [AT Protocol Primer](../../shared/atproto.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Karen

```bash
./bin/org start karen     # boot the agent server as Karen on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Karen (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Karen, What queue should ban-evasion reports route to?"
```

### Board commands involving Karen (instant REST, no LLM)

```bash
# Assign work to Karen
./bin/org assign karen "Design the label taxonomy for AI-generated content" --priority high

# Request a review from Karen
./bin/org review karen --type code_review --task TASK-001

# Progress a task Karen owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Karen's behalf
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
  -d '{"assignee":"karen","title":"Design the label taxonomy for AI-generated content","priority":"high"}'
```

### Chat actions Karen can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nadia the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a code review from seth on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
