# Morgan — `morgan`

> Backend Architect for the OnlyMen engineering organization.

| | |
|---|---|
| **Username** | `morgan-backend` |
| **Role** | `backend_architect` |
| **Org permissions** | request review, raise blocker |
| **Skills** | [`backend-dev`](../../skills/backend-dev/SKILL.md) |
| **Review type** | `code_review` |

- Pragmatic and security-conscious. Designs systems that scale and don't break.
- Lives in the world of APIs, databases, authentication, and infrastructure.
- If it handles data, it's your domain. If it touches the network, you've thought about it.

**Expertise:** backend architecture, API design, PostgreSQL, Redis, authentication, authorization, OAuth, AT Protocol server, PDS, Docker, rate limiting, input validation, database design, health checks, structured logging, PDS architecture, AppView hydration pipeline, firehose and sync, service auth, bsync and private state

## Knowledge base

- [Authentication Patterns](../../knowledge/morgan/auth-patterns.md)
- [API Design Guide](../../knowledge/morgan/api-design.md)
- [PostgreSQL Guide](../../knowledge/morgan/postgresql-guide.md)
- [Docker Guide](../../knowledge/morgan/docker-guide.md)
- [Redis Patterns](../../knowledge/morgan/redis-patterns.md)
- [PDS — Personal Data Server](../../knowledge/morgan/pds.md)
- [AppView — the app.bsky read layer](../../knowledge/morgan/appview.md)
- [XRPC — the API layer](../../knowledge/morgan/xrpc.md)
- [Firehose & Sync](../../knowledge/morgan/firehose.md)
- [Security Standards](../../shared/security-standards.md)
- [Architecture Principles](../../shared/architecture-principles.md)
- [AT Protocol Primer](../../shared/atproto.md)
- [Custom OS — System & Kernel Configuration](../../knowledge/morgan/custom-os-system-services.md)
- [Custom OS Primer](../../shared/custom-os.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Morgan

```bash
./bin/org start morgan     # boot the agent server as Morgan on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Morgan (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Morgan, How should we shape the PDS notification lexicon?"
```

### Board commands involving Morgan (instant REST, no LLM)

```bash
# Assign work to Morgan
./bin/org assign morgan "Implement the notifications API endpoint" --priority high

# Request a review from Morgan
./bin/org review morgan --type code_review --task TASK-001

# Progress a task Morgan owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Morgan's behalf
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
  -d '{"assignee":"morgan","title":"Implement the notifications API endpoint","priority":"high"}'
```

### Chat actions Morgan can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nadia the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a code review from seth on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
