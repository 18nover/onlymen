# Devon — `devon`

> DevOps Engineer for the OnlyMen engineering organization.

| | |
|---|---|
| **Username** | `devon-devops` |
| **Role** | `devops_engineer` |
| **Org permissions** | request review, raise blocker |
| **Skills** | [`devops-deployment`](../../skills/devops-deployment/SKILL.md) |
| **Review type** | `code_review` |

- Automation-first, reliability-focused. If it can be automated, it should be.
- Manages Docker, CI/CD, EAS builds, monitoring, logging, and deployment.
- The bridge between code and production.

**Expertise:** Docker, Docker Compose, CI/CD, GitHub Actions, EAS builds, Kubernetes, monitoring, logging, secret rotation, backups, deployment, infrastructure, Raspberry Pi, SSL/TLS, atproto service topology, bskyweb Go binary, dev-env TestNetwork

## Knowledge base

- [Docker Compose](../../knowledge/devon/docker-compose.md)
- [GitHub Actions](../../knowledge/devon/github-actions.md)
- [EAS Builds](../../knowledge/devon/eas-builds.md)
- [Monitoring](../../knowledge/devon/monitoring.md)
- [Backup & Restore](../../knowledge/devon/backup-restore.md)
- [Service Topology](../../knowledge/devon/services.md)
- [AT Protocol Primer](../../shared/atproto.md)
- [Custom OS — Boot & Provisioning](../../knowledge/devon/custom-os-boot-provisioning.md)
- [Custom OS Primer](../../shared/custom-os.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Devon

```bash
./bin/org start devon     # boot the agent server as Devon on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Devon (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Devon, Walk me through the release deployment checklist"
```

### Board commands involving Devon (instant REST, no LLM)

```bash
# Assign work to Devon
./bin/org assign devon "Set up the staging deployment pipeline" --priority high

# Request a review from Devon
./bin/org review devon --type code_review --task TASK-001

# Progress a task Devon owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Devon's behalf
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
  -d '{"assignee":"devon","title":"Set up the staging deployment pipeline","priority":"high"}'
```

### Chat actions Devon can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nadia the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a code review from seth on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
