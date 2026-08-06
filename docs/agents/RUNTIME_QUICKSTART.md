# Agent Runtime Quick Start

Your **private admin dashboard** for orchestrating 13 AI engineers is ready.

## What You Have

```plain
onlymen/
├── agent-runtime/              # New: Agent runtime server + dashboard
│   ├── src/
│   │   ├── server.ts          # Express + WebSocket server
│   │   ├── agent-executor.ts  # Invokes agents via Claude
│   │   ├── task-queue.ts      # Task & message management
│   │   └── agents.ts          # Load agent configs
│   ├── dashboard/
│   │   └── index.html         # React-based admin UI
│   └── package.json
├── characters/                 # Your 13 agent definitions (unchanged)
├── knowledge/                  # Agent knowledge bases (unchanged)
├── docker-compose.yml         # New: Run everything in Docker
├── .env.agent-runtime         # New: Configuration template
└── start-runtime.sh           # New: Quick-start script
```

## Getting Started (2 minutes)

### Option 1: Local Development (Recommended for now)

```bash
# 1. Get your Anthropic API key from https://console.anthropic.com
# Copy: sk-ant-...

# 2. Set the key
export ANTHROPIC_API_KEY=sk-ant-xxxx

# 3. Start
cd agent-runtime
npm install
npm run build
npm start
```

Then open: **<http://localhost:3000>**

### Option 2: Docker (Production-like)

```bash
# 1. Edit .env.agent-runtime
# Add your API key: ANTHROPIC_API_KEY=sk-ant-xxxx

# 2. Start
docker compose up
```

Then open: **<http://localhost:3000>**

---

## How to Use the Dashboard

### 1. **Select an Agent**

Left panel lists all 13 engineers. Click any name to select them.

```plain
👥 Agents
├─ Andrew (Engineering Director)
├─ Morgan (Backend Architect)
├─ Nadia (React Native Architect)
├─ Devon (DevOps Engineer)
├─ Quinn (QA Engineer)
... and 8 more
```

### 2. **Create a Task**

Fill in the task form:

```plain
📋 Create Task
Title: "Design auth flow for age verification"
Description: "Create secure OAuth2 flow that validates age on signup..."
Priority: High
```

**Click "Create & Execute"** — the agent starts working immediately.

### 3. **Watch Real-Time Progress**

**Console Output** shows:

- `Andrew: I'll break this into phases...`
- `Morgan: OAuth2 implementation with JWT validation...`
- `Task status: in_progress → review → done`

### 4. **Approve or Reject**

Once the agent finishes, you see two buttons:

- **✅ Approve** — Task complete
- **❌ Reject** — Send back for refinement

---

## Example Tasks

### For **Morgan** (Backend Architect)
>
> "Design the authentication schema for age verification. We fork Bluesky's auth, but add an age-gated DID service. Document the flow and any AT Protocol changes needed."

### For **Devon** (DevOps Engineer)
>
> "Set up Docker Compose for local development with PDS, AppView, and a mock firehose. Include health checks and logging."

### For **Nadia** (React Native Architect)
>
> "Build the age verification flow in Expo. Use Expo Router for navigation, TanStack Query for mutations. Show a biometric option."

### For **Quinn** (QA Engineer)
>
> "Create a test plan for the age verification feature. Include edge cases: fake documents, boundary ages, network failures, expired credentials."

### For **Lexi** (Lexicon Specialist)
>
> "Review the AT Protocol fork. Do we need custom lexicons for age verification, or do we extend app.bsky.ageassurance? Audit for conflicts with upstream."

---

## API Examples

### Create a Task Programmatically

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "assignee": "morgan",
    "title": "Design PDS schema",
    "description": "Set up PostgreSQL tables for age assurance data...",
    "priority": "high"
  }'
```

**Response:**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Design PDS schema",
  "assignee": "morgan",
  "status": "assigned",
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Execute a Task

```bash
curl -X POST http://localhost:3000/api/tasks/550e8400-e29b-41d4-a716-446655440000/execute
```

The agent processes and returns its response. Task moves to "review" status.

### Get Task & Messages

```bash
curl http://localhost:3000/api/tasks/550e8400-e29b-41d4-a716-446655440000
```

**Response:**

```json
{
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Design PDS schema",
    "status": "review",
    ...
  },
  "messages": [
    {
      "id": "msg-1",
      "taskId": "550e8400...",
      "agentName": "Morgan",
      "role": "agent",
      "content": "I'll design the schema with these tables...",
      "timestamp": "2024-01-15T10:31:00Z"
    }
  ]
}
```

### Approve a Task

```bash
curl -X POST http://localhost:3000/api/tasks/550e8400-e29b-41d4-a716-446655440000/approve \
  -H "Content-Type: application/json" \
  -d '{"approved": true}'
```

---

## WebSocket Events

The dashboard uses WebSocket for live updates. You can connect programmatically:

```javascript
const ws = new WebSocket('ws://localhost:3000')

ws.onmessage = (event) => {
  const { event: type, data } = JSON.parse(event.data)

  if (type === 'task:created') {
    console.log('New task:', data)
  }
  if (type === 'task:updated') {
    console.log('Task status:', data.status)
  }
  if (type === 'message:added') {
    console.log(`${data.agentName}: ${data.content}`)
  }
}
```

---

## Architecture

```plain
┌─────────────────────────────────────────────┐
│                Dashboard (HTML/JS)          │
│          Private Admin Portal               │
│        http://localhost:3000                │
└─────────────┬──────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │   REST + WebSocket│
    └─────────┬─────────┘
              │
       ┌──────▼────────┐
       │  Express.js   │
       │   Port 3000   │
       └──────┬────────┘
              │
    ┌─────────┴──────────┐
    │   Agent Executor   │
    │   (Claude API)     │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │  Agent Configs     │
    │  (JSON files)      │
    │  + Knowledge Bases │
    └────────────────────┘
```

---

## Configuration

### Environment Variables

Create `.env.agent-runtime`:

```env
# Required: Your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx

# Optional: Port (default 3000)
PORT=3000

# Optional: Environment
NODE_ENV=development

# Optional: Project root (default: parent directory)
PROJECT_ROOT=/path/to/project
```

### Docker Compose Override

Edit `docker-compose.yml` to add services (PostgreSQL, Redis, etc.):

```yaml
services:
  agent-runtime:
    ...
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: dev
    ports:
      - '5432:5432'
```

---

## Agent Personalities & Prompts

Each agent has a unique personality in `characters/<name>.json`:

```json
{
  "name": "Morgan",
  "role": "backend_architect",
  "bio": [
    "Designs and maintains backend architecture...",
    "Speaks in systems diagrams and data flows..."
  ],
  "system": "You are Morgan, the backend architect...",
  "topics": ["API design", "PostgreSQL", "AT Protocol", ...],
  "style": { "all": [...], "chat": [...] }
}
```

**You can edit these to:**

- Add Bluesky fork context
- Emphasize ATProto expertise
- Adjust tone/personality
- Add domain-specific knowledge files

---

## Next Steps

### 1. **Customize Agents for Bluesky Forking**

Edit `characters/<agent>.json` to emphasize Bluesky expertise. For example, Morgan's system prompt could include:

```plain
You are Morgan, the backend architect for OnlyMen — a fork of Bluesky built on AT Protocol.

Key context:
- Upstream repo: https://github.com/bluesky-social/atproto
- Your changes: Age verification lexicons, moderation tools, age-gated feeds
- You maintain: PDS fork, AppView fork, custom lexicons

Current focus: Age assurance on AT Protocol
```

### 2. **Add Knowledge Documents**

Each agent has a `knowledge/` folder with domain docs:

```plain
knowledge/
├── morgan/
│   ├── pds.md          (PDS architecture)
│   ├── appview.md      (AppView design)
│   ├── xrpc.md         (AT Protocol RPC)
│   └── firehose.md     (Event streaming)
├── nadia/
│   ├── client.md       (App architecture)
│   └── react-native-patterns.md
└── ... (per agent)
```

Add Bluesky fork docs here so agents reference them.

### 3. **Enable File Operations**

Agents currently read your project via LLM context. Later, you can add:

```typescript
// In agent-executor.ts
const tools = [
  {
    name: 'read_file',
    description: 'Read a file from the project',
    fn: (path) => readFileSync(path, 'utf-8'),
  },
  {
    name: 'write_file',
    description: 'Write a file to the project',
    fn: (path, content) => writeFileSync(path, content),
  },
]
```

Then agents can create/edit code directly.

### 4. **Set Up Persistence**

Currently, tasks live in memory. Add SQLite:

```typescript
import Database from 'better-sqlite3'

const db = new Database('onlymen.db')
taskQueue.tasks.forEach(t => db.exec('INSERT INTO tasks VALUES...'))
```

### 5. **Agent-to-Agent Work Requests**

Agents can request work from each other:

```typescript
// Morgan asks Lexi to review lexicon changes
const request = {
  from: 'morgan',
  to: 'lexi',
  task: 'Review the age assurance lexicon changes',
}
taskQueue.createTask({...request, assignee: 'lexi'})
```

---

## Troubleshooting

### "Cannot reach the agent server"

- Ensure `npm start` is running on port 3000
- Check: `curl http://localhost:3000/api/health`

### "ANTHROPIC_API_KEY not found"

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxx
# or add to .env.agent-runtime
```

### "TypeScript compilation fails"

```bash
cd agent-runtime
npm install
npm run build
```

### "WebSocket connection fails"

- Ensure the server is running
- Check browser console for errors
- Try: `curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:3000`

---

## Support & Next Reads

- **Agent Architecture:** See `AGENTS.md` for the 13-agent roster
- **Engineering Handbook:** See `shared/engineering-handbook.md` for standards
- **AT Protocol Primer:** See `shared/atproto.md` for Bluesky/ATProto context

---

**Ready to build OnlyMen with your team of engineers?**

```bash
npm start
# Open http://localhost:3000
# Select an agent & create your first task 🚀
```
