# Vision — `vision`

> Computer Vision and AI Engineer for the NottyBoi engineering organization.

| | |
|---|---|
| **Username** | `vision-ai` |
| **Role** | `computer_vision_engineer` |
| **Org permissions** | request review, raise blocker |
| **Skills** | [`computer-vision`](../../skills/computer-vision/SKILL.md) |
| **Review type** | `code_review` |

- Builds camera analysis, object detection, and AI-powered features.
- Always distinguishes between AI conclusions and verified facts.
- Privacy is non-negotiable — never implements facial recognition or identity tracking.

**Expertise:** computer vision, object detection, frame sampling, edge inference, Raspberry Pi, camera analysis, alert generation, confidence scores, deduplication, privacy-preserving AI, TensorFlow Lite, ONNX Runtime, image classification, model optimization

## Knowledge base

- [Object Detection](../../knowledge/vision/object-detection.md)
- [Frame Sampling](../../knowledge/vision/frame-sampling.md)
- [Edge Inference](../../knowledge/vision/edge-inference.md)
- [Alert System](../../knowledge/vision/alert-system.md)

## Commands

All commands run from `packages/org/` (or put `packages/org/bin` on your
PATH). The server must be running for everything except `start`/`agents`.

### Run Vision

```bash
./bin/org start vision     # boot the agent server as Vision on :2139
./bin/org status            # health + running agent
./bin/org logs 40           # tail the server log
./bin/org stop
```

### Talk to Vision (LLM chat — 1–3 min per turn)

```bash
./bin/org say "Vision, Which on-device model fits our moderation latency budget?"
```

### Board commands involving Vision (instant REST, no LLM)

```bash
# Assign work to Vision
./bin/org assign vision "Prototype NSFW image classification for uploads" --priority high

# Request a review from Vision
./bin/org review vision --type code_review --task TASK-001

# Progress a task Vision owns
./bin/org task TASK-001 in_progress
./bin/org task TASK-001 done

# Raise a blocker on Vision's behalf
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
  -d '{"assignee":"vision","title":"Prototype NSFW image classification for uploads","priority":"high"}'
```

### Chat actions Vision can trigger

When you chat (via `org say` or the dashboard), the planner can route to
these org actions — parameters are extracted from your message:

| Action | Parameters | Example message |
|---|---|---|
| `ASSIGN_WORK` | assignee, title, priority?, description?, deadline? | "Assign nova the search screen, high priority" |
| `REQUEST_REVIEW` | reviewer, type?, taskId? | "Request a code review from sentinel on TASK-001" |
| `ESCALATE` | description, severity?, taskId? | "Escalate: blocked on the SDK upgrade, critical" |
| `REPORT_COMPLETE` | taskId, summary? | "TASK-001 is done — shipped and tested" |
| `SUMMARIZE` | — | "Give me the org status" |
