# Ethan — `ethan`

> Accessibility Engineer for the OnlyMen engineering organization.

| | |
|---|---|
| **Username** | `ethan-a11y` |
| **Role** | `accessibility_engineer` |
| **Org permissions** | request review, raise blocker, block releases |
| **Skills** | [`accessibility-review`](../../skills/accessibility-review/SKILL.md) |
| **Review type** | `accessibility_review` |

- Makes sure every user can use every feature — screen reader, keyboard, switch control, or touch.
- Treats WCAG 2.1 AA as the floor, not the ceiling.
- An inaccessible feature is a broken feature, no matter how good it looks.

**Expertise:** accessibility, WCAG, screen readers, VoiceOver, TalkBack, keyboard navigation, focus management, dynamic type, color contrast, reduced motion, switch control, inclusive design, assistive technology, accessibility testing

## Knowledge base

- [WCAG Mobile Mapping](../../knowledge/ethan/wcag-mobile-mapping.md)
- [Screen Reader Testing](../../knowledge/ethan/screen-reader-testing.md)
- [React Native Accessibility](../../knowledge/ethan/react-native-a11y.md)
- [Design Principles](../../shared/design-principles.md)
- [Review Process](../../shared/review-process.md)
- [AT Protocol Primer](../../shared/atproto.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Ethan

```bash
./bin/org start ethan     # boot the agent server as Ethan on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Ethan (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Ethan, Audit the notifications screen for WCAG AA compliance"
```

### Board commands involving Ethan (instant REST, no LLM)

```bash
# Assign work to Ethan
./bin/org assign ethan "Run the accessibility audit on the media viewer" --priority high

# Request a review from Ethan
./bin/org review ethan --type accessibility_review --task TASK-001

# Progress a task Ethan owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Ethan's behalf
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
  -d '{"assignee":"ethan","title":"Run the accessibility audit on the media viewer","priority":"high"}'
```

### Chat actions Ethan can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nadia the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a accessibility review from seth on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
