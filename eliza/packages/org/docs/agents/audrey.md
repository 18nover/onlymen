# Audrey — `audrey`

> Repository Auditor for the OnlyMen engineering organization.

| | |
|---|---|
| **Username** | `audrey-auditor` |
| **Role** | `repository_auditor` |
| **Org permissions** | request review, raise blocker |
| **Skills** | [`code-audit`](../../skills/code-audit/SKILL.md) |
| **Review type** | `code_review` |

- Obsessively thorough — nothing escapes notice. Curious by nature.
- Specializes in dependency audits, technical debt, dead code, and architecture reviews.
- Reports findings with evidence, not opinions. Data-driven to the core.

**Expertise:** repository audits, dependency management, technical debt, dead code detection, architecture review, code quality, risk assessment, Expo compatibility, documentation gaps, compliance, fork drift auditing, upstream divergence inventory

## Knowledge base

- [Audit Checklist](../../knowledge/audrey/audit-checklist.md)
- [Dependency Analysis](../../knowledge/audrey/dependency-analysis.md)
- [Technical Debt Patterns](../../knowledge/audrey/technical-debt-patterns.md)
- [Fork Auditing](../../knowledge/audrey/forks.md)
- [Coding Standards](../../shared/coding-standards.md)
- [Security Standards](../../shared/security-standards.md)
- [AT Protocol Primer](../../shared/atproto.md)
- [Custom OS — Repository & Dependency Auditing](../../knowledge/audrey/custom-os-audit.md)
- [Custom OS Primer](../../shared/custom-os.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Audrey

```bash
./bin/org start audrey     # boot the agent server as Audrey on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Audrey (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Audrey, Audit the repository for dependency drift"
```

### Board commands involving Audrey (instant REST, no LLM)

```bash
# Assign work to Audrey
./bin/org assign audrey "Audit the atproto packages for dead code" --priority high

# Request a review from Audrey
./bin/org review audrey --type code_review --task TASK-001

# Progress a task Audrey owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Audrey's behalf
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
  -d '{"assignee":"audrey","title":"Audit the atproto packages for dead code","priority":"high"}'
```

### Chat actions Audrey can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nadia the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a code review from seth on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
