import express, { Express, Request, Response } from 'express'
import { WebSocketServer } from 'ws'
import { createServer } from 'http'
import { loadAgents, loadAgent } from './agents'
import { createTaskQueue, Task, Message } from './task-queue'
import { createAgentExecutor } from './agent-executor'
import { resolve } from 'path'

const PORT = process.env.PORT || 3000
const API_KEY = process.env.ANTHROPIC_API_KEY
const PROJECT_ROOT = process.env.PROJECT_ROOT || resolve(process.cwd(), '..')

if (!API_KEY) {
  console.error('ANTHROPIC_API_KEY environment variable is required')
  process.exit(1)
}

const app: Express = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

const taskQueue = createTaskQueue()
const executor = createAgentExecutor(API_KEY, PROJECT_ROOT)

// Middleware
app.use(express.json())

// CORS for local dashboard
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Broadcast to all connected clients
function broadcast(event: string, data: unknown) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ event, data }))
    }
  })
}

// REST API

// List all agents
app.get('/api/agents', (req: Request, res: Response) => {
  const agents = loadAgents()
  res.json({
    agents: agents.map((a) => ({
      name: a.name,
      username: a.username,
      role: a.settings.ORG_ROLE,
      bio: a.bio[0],
    })),
  })
})

// Get agent details
app.get('/api/agents/:name', (req: Request, res: Response) => {
  try {
    const agent = loadAgent(req.params.name)
    res.json(agent)
  } catch {
    res.status(404).json({ error: 'Agent not found' })
  }
})

// Create task
app.post('/api/tasks', (req: Request, res: Response) => {
  const { assignee, title, description, priority = 'medium', deadline } = req.body

  const task = taskQueue.createTask({
    title,
    description,
    assignee,
    status: 'assigned',
    priority,
    deadline: deadline ? new Date(deadline) : undefined,
  })

  broadcast('task:created', task)
  res.json(task)
})

// List tasks
app.get('/api/tasks', (req: Request, res: Response) => {
  const { assignee, status } = req.query
  const tasks = taskQueue.listTasks({
    assignee: assignee as string,
    status: status as any,
  })
  res.json({ tasks })
})

// Get task
app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const task = taskQueue.getTask(req.params.id)
  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }
  const messages = taskQueue.getMessages(req.params.id)
  res.json({ task, messages })
})

// Execute task (dispatch to agent)
app.post('/api/tasks/:id/execute', async (req: Request, res: Response) => {
  const { id } = req.params
  const task = taskQueue.getTask(id)

  if (!task) {
    res.status(404).json({ error: 'Task not found' })
    return
  }

  try {
    const agent = loadAgent(task.assignee)
    taskQueue.updateTask(id, { status: 'in_progress' })
    broadcast('task:updated', taskQueue.getTask(id))

    // Add user message
    const userMsg = taskQueue.addMessage(id, {
      taskId: id,
      agentName: task.assignee,
      role: 'user',
      content: task.description,
    })
    broadcast('message:added', userMsg)

    // Get conversation history
    const history = taskQueue.getMessages(id)

    // Execute with agent
    const response = await executor.executeTask(agent, task.description, task.title, history)

    // Add agent response
    const agentMsg = taskQueue.addMessage(id, {
      taskId: id,
      agentName: agent.name,
      role: 'agent',
      content: response,
    })
    broadcast('message:added', agentMsg)

    // Mark task as review
    taskQueue.updateTask(id, { status: 'review' })
    broadcast('task:updated', taskQueue.getTask(id))

    res.json({ task: taskQueue.getTask(id), response })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    taskQueue.updateTask(id, { status: 'blocked', error: message })
    broadcast('task:updated', taskQueue.getTask(id))
    res.status(500).json({ error: message })
  }
})

// Approve/reject task
app.post('/api/tasks/:id/approve', (req: Request, res: Response) => {
  const { approved } = req.body
  const task = taskQueue.updateTask(req.params.id, {
    status: approved ? 'done' : 'blocked',
  })
  broadcast('task:updated', task)
  res.json(task)
})

// Add message to task
app.post('/api/tasks/:id/messages', (req: Request, res: Response) => {
  const { agentName, role, content } = req.body
  const message = taskQueue.addMessage(req.params.id, {
    taskId: req.params.id,
    agentName,
    role,
    content,
  })
  broadcast('message:added', message)
  res.json(message)
})

// WebSocket
wss.on('connection', (ws) => {
  console.log('Client connected')

  // Send initial state
  ws.send(
    JSON.stringify({
      event: 'init',
      data: {
        tasks: taskQueue.listTasks(),
        agents: loadAgents().map((a) => ({ name: a.name, username: a.username })),
      },
    }),
  )

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString())
      console.log('Message from client:', msg)
    } catch {
      console.error('Invalid JSON from client')
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Serve static dashboard (if exists)
app.use(express.static(resolve(process.cwd(), 'dashboard')))

server.listen(PORT, () => {
  console.log(`🚀 Agent Runtime server listening on http://localhost:${PORT}`)
  console.log(`📊 Dashboard: http://localhost:${PORT}`)
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`)
})
