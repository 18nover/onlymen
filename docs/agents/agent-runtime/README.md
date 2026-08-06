# OnlyMen Agent Runtime

A modern **private admin dashboard** for managing your 13-agent engineering team. Dispatch tasks to specialized AI engineers, watch them work together in real-time, and build OnlyMen with a team of Bluesky-expert agents.

## Features

- **13 Specialized Agents** — Each with deep domain expertise (backend, mobile, design, security, etc.)
- **Admin Dashboard** — Private web-based control plane to create tasks and monitor progress
- **Real-time Updates** — WebSocket-powered live task dispatch and agent-to-agent communication
- **Agent Collaboration** — Agents can request work from each other
- **Project Context** — Agents read/analyze your actual codebase
- **Task Queue** — Create, track, approve, or reject work
- **Bluesky Forking Focus** — Agents trained on ATProto, PDS/AppView, lexicons, and rebranding

## Quick Start

### Prerequisites

- Node.js 22+
- Docker & Docker Compose
- Anthropic API key (`sk-ant-...`)

### Local Development

```bash
# 1. Set your API key
export ANTHROPIC_API_KEY=sk-ant-xxxx

# 2. Install dependencies
cd agent-runtime
npm install
cd ..

# 3. Start the runtime
npm run dev

# 4. Open the dashboard
open http://localhost:3000
```

### Docker (Recommended)

```bash
# 1. Create .env.agent-runtime with your API key
cp .env.agent-runtime.example .env.agent-runtime
# Edit .env.agent-runtime to add ANTHROPIC_API_KEY

# 2. Build and run
docker compose up

# 3. Open dashboard
open http://localhost:3000
```

## How It Works

### Create a Task

1. **Select an Agent** — Click on an engineer (Andrew, Devon, Morgan, etc.)
2. **Describe the Work** — Write what you want them to do
3. **Set Priority** — Critical, High, Medium, Low
4. **Execute** — The agent processes your request in real-time

### Monitor Progress

- **Console Output** — See agent responses and conversations in real-time
- **Task Status** — Track Assigned → In Progress → Review → Done
- **Real-time Updates** — WebSocket keeps the dashboard live

### Approve or Reject

- **Review Responses** — Read the agent's work
- **Approve** — Move task to Done
- **Reject** — Send back for refinement

## Agent Roster

| Agent | Role | Expertise |
|---|---|---|
| **Andrew** | Engineering Director | Project management, coordination, decisions |
| **Devon** | DevOps Engineer | Docker, CI/CD, deployment, infrastructure |
| **Quinn** | QA Engineer | Testing, quality assurance, edge cases |
| **Audrey** | Repository Auditor | Technical debt, security, dependencies |
| **Morgan** | Backend Architect | APIs, databases, PDS/AppView, ATProto |
| **Lexi** | Lexicon Specialist | AT Protocol lexicons, schemas, NSIDs |
| **Nadia** | React Native Architect | Mobile app, Expo, navigation, state |
| **Desiree** | Design System Architect | UI components, design language, ALF |
| **Ethan** | Accessibility Engineer | WCAG, screen readers, a11y reviews |
| **Parker** | Performance Engineer | Profiling, optimization, memory/battery |
| **Penelope** | Technical Writer | Documentation, runbooks, API docs |
| **Seth** | Security Engineer | Threat modeling, secrets, encryption |
| **Karen** | Moderation Specialist | Content safety, moderation tools, Ozone |

## API Reference

### REST

```bash
# List agents
curl http://localhost:3000/api/agents

# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"assignee":"morgan","title":"Design auth flow","description":"...","priority":"high"}'

# List tasks
curl http://localhost:3000/api/tasks

# Get task
curl http://localhost:3000/api/tasks/:id

# Execute task
curl -X POST http://localhost:3000/api/tasks/:id/execute

# Approve/reject
curl -X POST http://localhost:3000/api/tasks/:id/approve \
  -H "Content-Type: application/json" \
  -d '{"approved":true}'
```

### WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3000')

ws.onmessage = (e) => {
  const { event, data } = JSON.parse(e.data)
  console.log(event, data) // 'task:created', 'task:updated', 'message:added', etc.
}
```

## Architecture

```
┌─────────────────────────────────────────────┐
│        Admin Dashboard (React)              │
│   http://localhost:3000                     │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴─────┐
        │   REST API │
        └──────┬─────┘
               │
       ┌───────┴────────┐
       │  Task Queue    │
       │  Message Broker│
       └───────┬────────┘
               │
    ┌──────────┴─────────────┐
    │  Agent Executor        │
    │  (Claude API)          │
    └──────────┬─────────────┘
               │
    ┌──────────┴─────────────┐
    │  13 Agent Contexts     │
    │  (system prompts,      │
    │   knowledge bases)     │
    └────────────────────────┘
```

## Configuration

### Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-xxxx    # Claude API key (required)
PORT=3000                         # Server port (default: 3000)
NODE_ENV=development              # development or production
PROJECT_ROOT=/path/to/project     # Project root for file access (default: ../)
```

## Development

### Build

```bash
cd agent-runtime
npm run build
```

### Test

```bash
npm run test
```

### Lint

```bash
npm run lint
```

### Watch TypeScript

```bash
npm run dev
```

## Deployment

### Production Build

```bash
# Build Docker image
docker build -f Dockerfile.agent-runtime -t onlymen-runtime:latest .

# Run with API key
docker run -e ANTHROPIC_API_KEY=sk-ant-xxxx -p 3000:3000 onlymen-runtime:latest
```

### Security Notes

- **Admin-only Access** — No authentication yet; run on localhost only
- **Never commit API keys** — Use environment variables
- **File Access** — Agents can read/write files in your project; restrict filesystem access as needed
- **Rate Limiting** — Add rate limits before exposing to the internet

## Next Steps

1. **Expand Knowledge** — Add Bluesky fork and ATProto docs to `knowledge/<agent>/`
2. **Add Authentication** — Implement admin login
3. **File Operations** — Enable agents to create/modify files
4. **Agent Communication** — Allow agents to invoke each other's work
5. **Persistence** — Move task queue to database (SQLite, PostgreSQL)
6. **CI/CD Integration** — Dispatch tasks from GitHub Actions

## Roadmap

- [ ] Database persistence (SQLite/PostgreSQL)
- [ ] Admin authentication & authorization
- [ ] File I/O tools for agents
- [ ] Agent-to-agent work requests
- [ ] Audit log / decision records
- [ ] GitHub integration (pull requests, issues)
- [ ] Scheduled tasks / cron
- [ ] Multi-project support
- [ ] Agent performance metrics

## License

Archived from elizaOS project; see original repo for terms.
