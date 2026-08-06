# ✨ Your Agent Runtime is Ready

You now have a **complete private admin dashboard** for coordinating your 13-agent engineering team on the OnlyMen Bluesky fork project.

---

## 🚀 What You Got

### 1. **Agent Runtime Server** (`agent-runtime/`)

- Express.js server on `http://localhost:3000`
- WebSocket for real-time task dispatch & agent messaging
- Claude integration for agent execution
- Task queue & message history persistence (in-memory)

### 2. **Admin Dashboard** (`agent-runtime/dashboard/index.html`)

- Beautiful dark theme with real-time updates
- List all 13 agents
- Select an agent & describe a task
- Watch real-time progress in console
- Approve/reject task results

### 3. **Agent System** (`characters/*.json` + `knowledge/`)

- 13 pre-configured AI engineers with distinct personalities
- Domain-specific knowledge documents per agent
- System prompts grounded in your Bluesky fork work

### 4. **Docker Support** (`docker-compose.yml`)

- Run everything in one command
- Isolated environment with proper networking
- Easy to scale or add services

---

## ⚡ Quick Start (Pick One)

### Option A: Local Dev (Right Now)

```bash
export ANTHROPIC_API_KEY=sk-ant-xxxx
cd agent-runtime
npm install && npm run build && npm start
# Open http://localhost:3000
```

### Option B: Docker (Recommended for Later)

```bash
# Edit .env.agent-runtime with your API key
docker compose up
# Open http://localhost:3000
```

---

## 📋 Your First Task

1. **Open** <http://localhost:3000>
2. **Click** "Morgan" (Backend Architect)
3. **Fill in:**

   ```json
   Title: Design age verification schema for OnlyMen PDS

   Description: We fork Bluesky's PDS to add age verification.
   Design the database schema, explain the flow, and note
   any AT Protocol changes needed.
   ```

4. **Click** "Create & Execute"
5. **Watch** Morgan think and respond in the console

---

## 📚 Next Steps (By Priority)

### Priority 1: Customize Agents (1-2 hours)

Read: [`AGENTS_CUSTOMIZATION.md`](./AGENTS_CUSTOMIZATION.md)

This shows you how to:

- Add Bluesky fork context to each agent's system prompt
- Create knowledge documents for your specific fork
- Make agents experts on your rebranding, AT Protocol changes, and architecture

Example edits:

```json
// characters/morgan.json - Add this to "system" field:
"## Your Expertise\n
- Forking Bluesky safely (tracking upstream changes)\n
- AT Protocol schema design\n
- Age verification database architecture"
```

### Priority 2: Create Knowledge Docs (2-4 hours)

Add domain-specific documents:

```bash
knowledge/morgan/
├── bluesky-fork-checklist.md     # What changed from upstream
├── age-verification-schema.md    # Database design
└── pds-customization.md          # Infrastructure changes

shared/
├── bluesky-fork-overview.md      # High-level strategy
└── at-protocol-changes.md        # Custom lexicons
```

### Priority 3: Enable File I/O (Optional)

Let agents read/write your actual codebase:

```typescript
// In agent-executor.ts, add file tools
const tools = [
  { name: 'read_file', fn: (path) => readFileSync(path) },
  { name: 'write_file', fn: (path, content) => writeFileSync(path, content) },
]
```

### Priority 4: Add Persistence (Optional)

Move task queue to SQLite:

```typescript
const db = new Database('onlymen.db')
taskQueue.tasks.forEach(t => db.exec('INSERT...'))
```

### Priority 5: Deploy (Later)

Push to VPS or cloud provider.

---

## 📖 Documentation Map

| Document | Purpose | Read Time |
| ---------- | --------- | ----------- |
| **RUNTIME_QUICKSTART.md** | How to use the dashboard & API | 10 min |
| **AGENTS_CUSTOMIZATION.md** | Make agents experts on your fork | 20 min |
| **AGENTS.md** | 13-agent roster (unchanged) | 10 min |
| **README.md** (agent-runtime) | Architecture & deployment | 15 min |

---

## 🎯 Common First Tasks

Try these to get a feel for the system:

### For **Lexi** (Lexicon Specialist)
>
> "Audit the AT Protocol upstream lexicons. What do we keep (app.bsky.*, com.atproto.*)? What custom lexicons do we need for OnlyMen (com.onlymen.ageassurance, etc.)? Create a naming convention."

### For **Morgan** (Backend Architect)
>
> "Design the database schema for age verification in our PDS fork. Include: user age data storage, verification record tracking, DID integration. Constraints: GDPR compliance, efficient querying for age-restricted feeds."

### For **Devon** (DevOps Engineer)
>
> "Design a Docker Compose setup for local development with PDS, AppView, mock firehose, and Ozone moderation. Include health checks, logging, and documented port mappings."

### For **Nadia** (React Native Architect)
>
> "Build the age gate flow for OnlyMen signup. Use Expo Router for navigation, include biometric option, support multiple verification methods. Where does it fit in the app architecture?"

### For **Andrew** (Engineering Director)
>
> "Create a 12-week roadmap for launching OnlyMen. Break it into phases: Setup (fork + local dev), MVP (age verification + basic moderation), Beta (community features), Release (public access). What are the blockers?"

---

## 🔧 API Quick Reference

```bash
# Create task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "assignee": "morgan",
    "title": "Design auth flow",
    "description": "Create OAuth2 flow...",
    "priority": "high"
  }'

# List tasks
curl http://localhost:3000/api/tasks

# Execute task
curl -X POST http://localhost:3000/api/tasks/:id/execute

# Get task + messages
curl http://localhost:3000/api/tasks/:id

# Approve task
curl -X POST http://localhost:3000/api/tasks/:id/approve \
  -d '{"approved": true}' \
  -H "Content-Type: application/json"
```

---

## ⚙️ Configuration

### .env.agent-runtime

```env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx  # Get from https://console.anthropic.com
PORT=3000
NODE_ENV=development
PROJECT_ROOT=/path/to/onlymen
```

### To change agent personalities or knowledge

- Edit `characters/<name>.json`
- Add/update `knowledge/<agent>/*.md`
- Restart server

---

## 🏗️ Architecture at a Glance

```json
┌─────────────────────────────────────┐
│   Admin Dashboard                   │
│   (http://localhost:3000)           │
│   - Select agent                    │
│   - Create task                     │
│   - Watch real-time progress        │
└────────────┬────────────────────────┘
             │
    ┌────────┴─────────┐
    │  REST + WebSocket │
    │  Express.js       │
    │  :3000            │
    └────────┬──────────┘
             │
    ┌────────▼──────────┐
    │ Task Queue        │
    │ Message Broker    │
    └────────┬──────────┘
             │
    ┌────────▼──────────┐
    │ Agent Executor    │
    │ (Claude API)      │
    └────────┬──────────┘
             │
    ┌────────▼──────────┐
    │ 13 Agents         │
    │ (JSON configs +   │
    │  knowledge docs)  │
    └───────────────────┘
```

---

## 🚨 Troubleshooting

| Issue | Solution |
| ------- | ---------- |
| "Cannot connect to server" | `npm start` running on :3000? Try `curl http://localhost:3000/api/health` |
| "ANTHROPIC_API_KEY not set" | `export ANTHROPIC_API_KEY=sk-ant-xxxx` or add to `.env.agent-runtime` |
| "Dashboard looks broken" | Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R) |
| "TypeScript won't compile" | `cd agent-runtime && npm install && npm run build` |
| "WebSocket disconnects" | Server crashed? Check terminal output. Browser console shows details. |

---

## 🎓 Learn More

- **AT Protocol Primer:** `shared/atproto.md` (context on how Bluesky works)
- **Engineering Handbook:** `shared/engineering-handbook.md` (team standards)
- **Agent Roster:** `AGENTS.md` (full 13-agent breakdown)

---

## ✅ Final Checklist

- [x] Agent runtime server built & running ✅
- [x] Admin dashboard created & styled ✅
- [x] 13 agents configured & ready ✅
- [x] Docker support added ✅
- [x] Documentation complete ✅
- [ ] **Next: Customize agents for your Bluesky fork** ← Start here
- [ ] Create knowledge documents for your domains
- [ ] Dispatch your first task
- [ ] Refine agent prompts based on responses
- [ ] Add file I/O capabilities
- [ ] Move to database persistence
- [ ] Deploy to production

---

## 🚀 Ready?

```bash
# 1. Start the runtime
export ANTHROPIC_API_KEY=sk-ant-xxxx
cd agent-runtime
npm start

# 2. Open the dashboard
open http://localhost:3000

# 3. Select an agent and create your first task!
```

**You're now working with a team of 13 AI engineers.** Each has expertise, personality, and knowledge about building OnlyMen. Treat them like you'd treat a real engineering org — give clear direction, approve quality work, and watch them collaborate.

**Questions?** Check RUNTIME_QUICKSTART.md or AGENTS_CUSTOMIZATION.md.

**Happy building! 🛠️🚀**
