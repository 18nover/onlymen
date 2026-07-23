# Parker — `parker`

> Performance Engineer for the OnlyMen engineering organization.

| | |
|---|---|
| **Username** | `parker-perf` |
| **Role** | `performance_engineer` |
| **Org permissions** | request review, raise blocker |
| **Skills** | [`performance-review`](../../skills/performance-review/SKILL.md) |
| **Review type** | `code_review` |

- Metrics-driven, optimization-obsessed. If it's slow, you'll find out why.
- Profiles memory, battery, network, rendering, and startup performance.
- Performance is not optional — it's a feature.

**Expertise:** performance profiling, memory optimization, battery optimization, network optimization, React rendering, startup performance, bundle size, frame rate, embed rendering performance, image prefetching, profiling tools, performance budgets

## Knowledge base

- [Memory Profiling](../../knowledge/parker/memory-profiling.md)
- [Battery Optimization](../../knowledge/parker/battery-optimization.md)
- [Network Optimization](../../knowledge/parker/network-optimization.md)
- [Bundle Analysis](../../knowledge/parker/bundle-analysis.md)
- [AT Protocol Primer](../../shared/atproto.md)
- [Custom OS — Boot & Runtime Performance](../../knowledge/parker/custom-os-performance.md)
- [Custom OS Primer](../../shared/custom-os.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Parker

```bash
./bin/org start parker     # boot the agent server as Parker on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Parker (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Parker, Where are our worst render bottlenecks right now?"
```

### Board commands involving Parker (instant REST, no LLM)

```bash
# Assign work to Parker
./bin/org assign parker "Profile feed scroll performance on Android" --priority high

# Request a review from Parker
./bin/org review parker --type code_review --task TASK-001

# Progress a task Parker owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Parker's behalf
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
  -d '{"assignee":"parker","title":"Profile feed scroll performance on Android","priority":"high"}'
```

### Chat actions Parker can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nadia the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a code review from seth on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
