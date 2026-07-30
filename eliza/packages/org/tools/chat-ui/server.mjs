#!/usr/bin/env bun
/**
 * Localhost control plane for the OnlyMen AI engineering organization.
 *
 * It owns the shared SQLite state, starts Eliza specialists on demand, keeps
 * Andrew warm, persists conversations, mirrors approved work into GitHub, and
 * launches approval-gated Codex worktree executions.
 */
import { mkdirSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { openControlPlane } from './control-plane.mjs'
import { executeWork } from './executor.mjs'
import { createIssue, githubStatus } from './github.mjs'
import { publishWork } from './publisher.mjs'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const orgRoot = resolve(currentDirectory, '..', '..')
const elizaRoot = resolve(orgRoot, '..', '..')
const agentRoot = resolve(orgRoot, '..', 'agent')
const charactersDirectory = join(orgRoot, 'characters')
const repoRoot = resolve(
  process.env.ONLYMEN_REPO_ROOT ?? join(elizaRoot, '..'),
)
const stateRoot = resolve(
  process.env.ONLYMEN_ORG_STATE_ROOT ??
    join(process.env.HOME ?? '/tmp', '.local', 'state', 'onlymen', 'agents'),
)
const worktreeRoot = resolve(
  process.env.ONLYMEN_WORKTREE_ROOT ??
    join(process.env.HOME ?? '/tmp', '.local', 'share', 'onlymen', 'worktrees'),
)
const basePort = Number(process.env.CHAT_UI_BASE_PORT ?? 2140)
const uiPort = Number(process.env.CHAT_UI_PORT ?? 4173)
const backend = process.env.ELIZA_RUN_BACKEND ?? 'claude-sdk'
const idleTimeoutMs = Number(process.env.ONLYMEN_AGENT_IDLE_MS ?? 30 * 60 * 1000)

mkdirSync(stateRoot, { recursive: true })
mkdirSync(worktreeRoot, { recursive: true })
const controlPlane = openControlPlane(stateRoot)
const subscribers = new Set()
const textEncoder = new TextEncoder()

const characterFiles = readdirSync(charactersDirectory)
  .filter((file) => file.endsWith('.json'))
  .sort()

/** @type {Map<string, {
 * name:string, bio:string[], adjectives:string[], role:string, port:number,
 * proc:any, status:"stopped"|"booting"|"ready"|"error", agentId:string|null,
 * error:string|null, lastActive:number
 * }>} */
const agents = new Map()

for (const [index, file] of characterFiles.entries()) {
  const id = file.replace(/\.json$/, '')
  const character = JSON.parse(
    readFileSync(join(charactersDirectory, file), 'utf8'),
  )
  agents.set(id, {
    name: character.name,
    bio: character.bio ?? [],
    adjectives: character.adjectives ?? [],
    role: character.settings?.ORG_ROLE ?? '',
    port: basePort + index,
    proc: null,
    status: 'stopped',
    agentId: null,
    error: null,
    lastActive: Date.now(),
  })
}

function emit(type, payload = {}) {
  const event = { type, payload, at: new Date().toISOString() }
  const encoded = textEncoder.encode(`data: ${JSON.stringify(event)}\n\n`)
  for (const controller of subscribers) {
    try {
      controller.enqueue(encoded)
    } catch {
      subscribers.delete(controller)
    }
  }
}

function roster() {
  return [...agents.entries()].map(([id, agent]) => ({
    id,
    name: agent.name,
    bio: agent.bio,
    adjectives: agent.adjectives,
    role: agent.role,
    status: agent.status,
    error: agent.error,
    port: agent.port,
  }))
}

function jsonError(status, message) {
  return Response.json({ error: message }, { status })
}

async function readJson(request) {
  const value = await request.json()
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('JSON object body required')
  }
  return value
}

function requiredString(body, key) {
  const value = body[key]
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${key} is required`)
  }
  return value.trim()
}

async function run(command, cwd = repoRoot) {
  const processHandle = Bun.spawn(command, {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(processHandle.stdout).text(),
    new Response(processHandle.stderr).text(),
    processHandle.exited,
  ])
  if (exitCode !== 0) {
    throw new Error(`${command[0]} failed (${exitCode}): ${stderr.trim()}`)
  }
  return stdout.trim()
}

async function health(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
      signal: AbortSignal.timeout(2000),
    })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

async function fetchAgentId(port) {
  const response = await fetch(`http://127.0.0.1:${port}/api/agents`, {
    signal: AbortSignal.timeout(5000),
  })
  const body = await response.json()
  return body.agents?.[0]?.id ?? null
}

async function startAgent(id) {
  const agent = agents.get(id)
  if (!agent) throw new Error(`unknown agent ${id}`)
  if (agent.status === 'ready' || agent.status === 'booting') return agent

  agent.status = 'booting'
  agent.error = null
  agent.lastActive = Date.now()
  emit('agent.status', { id, status: agent.status })

  const agentStateDirectory = join(stateRoot, id)
  mkdirSync(agentStateDirectory, { recursive: true })
  const elizaConfigPath = join(agentStateDirectory, 'eliza.json')
  if (!(await Bun.file(elizaConfigPath).exists())) {
    await Bun.write(
      elizaConfigPath,
      JSON.stringify(
        {
          plugins: {
            entries: {
              '@onlymen/plugin-org-coordinator': { enabled: true },
            },
          },
        },
        null,
        2,
      ),
    )
  }

  const characterJson = readFileSync(
    join(charactersDirectory, `${id}.json`),
    'utf8',
  )
  const logPath = join(agentStateDirectory, 'server.log')
  const processHandle = Bun.spawn({
    cmd: ['bun', '--conditions=eliza-source', 'src/bin.ts', 'serve'],
    cwd: agentRoot,
    env: {
      ...process.env,
      ELIZA_STATE_DIR: agentStateDirectory,
      ELIZA_API_PORT: String(agent.port),
      ELIZA_CHAT_VIA_CLI: backend,
      ELIZA_PLANNER_NATIVE_TOOLS: '0',
      ELIZA_AGENT_CHARACTER_JSON: characterJson,
    },
    stdout: Bun.file(logPath),
    stderr: Bun.file(logPath),
  })
  agent.proc = processHandle

  void (async () => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      await Bun.sleep(4000)
      const response = await health(agent.port)
      if (response?.ready) {
        agent.agentId = await fetchAgentId(agent.port).catch(() => null)
        agent.status = agent.agentId ? 'ready' : 'error'
        if (!agent.agentId) {
          agent.error = 'server became ready without returning an agent id'
        }
        emit('agent.status', { id, status: agent.status, error: agent.error })
        return
      }
      if (processHandle.exitCode !== null) {
        agent.status = 'error'
        agent.error = `process exited with ${processHandle.exitCode}; see ${logPath}`
        emit('agent.status', { id, status: agent.status, error: agent.error })
        return
      }
    }
    agent.status = 'error'
    agent.error = `readiness timed out; see ${logPath}`
    emit('agent.status', { id, status: agent.status, error: agent.error })
  })()
  return agent
}

async function stopAgent(id, reason = 'manual') {
  const agent = agents.get(id)
  if (!agent) throw new Error(`unknown agent ${id}`)
  if (agent.proc && agent.proc.exitCode === null) {
    agent.proc.kill('SIGTERM')
    await Promise.race([agent.proc.exited, Bun.sleep(5000)])
    if (agent.proc.exitCode === null) agent.proc.kill('SIGKILL')
  }
  agent.proc = null
  agent.agentId = null
  agent.status = 'stopped'
  agent.error = null
  emit('agent.status', { id, status: agent.status, reason })
}

async function waitForAgent(id) {
  const agent = await startAgent(id)
  for (let attempt = 0; attempt < 65; attempt += 1) {
    if (agent.status === 'ready') return agent
    if (agent.status === 'error') throw new Error(agent.error ?? `${id} failed`)
    await Bun.sleep(4000)
  }
  throw new Error(`${id} did not become ready`)
}

async function chat(id, message) {
  const agent = await waitForAgent(id)
  if (!agent.agentId) throw new Error(`agent ${id} has no runtime id`)
  agent.lastActive = Date.now()
  controlPlane.saveMessage(id, 'user', message)
  emit('conversation.message', { agentId: id, role: 'user', text: message })

  const response = await fetch(
    `http://127.0.0.1:${agent.port}/api/agents/${agent.agentId}/message`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userId: 'jerry', text: message }),
      signal: AbortSignal.timeout(300000),
    },
  )
  if (!response.ok) {
    throw new Error(`chat failed: ${response.status} ${await response.text()}`)
  }
  const result = await response.json()
  controlPlane.saveMessage(id, 'agent', result.response)
  emit('conversation.message', {
    agentId: id,
    role: 'agent',
    text: result.response,
  })
  return result
}

async function dispatchWork(item) {
  try {
    const message = [
      `You have been assigned ${item.id}${item.issue_number ? ` / GitHub #${item.issue_number}` : ''}.`,
      `Title: ${item.title}`,
      `Priority: ${item.priority}`,
      `Base commit: ${item.base_sha}`,
      '',
      item.description,
      '',
      'Inspect the real repository and refine the implementation and review plan.',
      'Do not edit yet; Codex execution starts separately from the approval queue.',
    ].join('\n')
    await chat(item.assignee, message)
    controlPlane.activity(
      'work.dispatched',
      `${item.id} delivered to ${item.assignee}`,
      { workItemId: item.id, agentId: item.assignee },
    )
  } catch (error) {
    controlPlane.updateWork(item.id, { status: 'failed' })
    controlPlane.activity(
      'work.dispatch_failed',
      error instanceof Error ? error.message : String(error),
      { workItemId: item.id, agentId: item.assignee },
    )
    emit('work.failed', { id: item.id, error: String(error) })
  }
}

const idleTimer = setInterval(() => {
  const cutoff = Date.now() - idleTimeoutMs
  for (const [id, agent] of agents) {
    if (
      id !== 'andrew' &&
      agent.status === 'ready' &&
      agent.lastActive < cutoff
    ) {
      void stopAgent(id, 'idle timeout')
    }
  }
}, 60_000)

const indexHtml = readFileSync(join(currentDirectory, 'index.html'), 'utf8')

const server = Bun.serve({
  port: uiPort,
  hostname: '127.0.0.1',
  async fetch(request) {
    const url = new URL(request.url)
    try {
      if (url.pathname === '/' && request.method === 'GET') {
        return new Response(indexHtml, {
          headers: { 'content-type': 'text/html; charset=utf-8' },
        })
      }
      if (url.pathname === '/api/health' && request.method === 'GET') {
        return Response.json({
          ready: true,
          repoRoot,
          stateRoot,
          worktreeRoot,
          gitHead: await run(['git', 'rev-parse', '--short', 'HEAD']),
        })
      }
      if (url.pathname === '/api/events' && request.method === 'GET') {
        let streamController
        const stream = new ReadableStream({
          start(controller) {
            streamController = controller
            subscribers.add(controller)
            controller.enqueue(
              textEncoder.encode(
                `data: ${JSON.stringify({ type: 'connected', at: new Date().toISOString() })}\n\n`,
              ),
            )
          },
          cancel() {
            subscribers.delete(streamController)
          },
        })
        return new Response(stream, {
          headers: {
            'content-type': 'text/event-stream',
            'cache-control': 'no-cache',
            connection: 'keep-alive',
          },
        })
      }
      if (url.pathname === '/api/bootstrap' && request.method === 'GET') {
        let github
        try {
          github = await githubStatus(repoRoot)
        } catch (error) {
          github = { error: error instanceof Error ? error.message : String(error) }
        }
        return Response.json({
          roster: roster(),
          work: controlPlane.listWork(),
          approvals: controlPlane.listApprovals(),
          activity: controlPlane.recentActivity(),
          github,
        })
      }
      if (url.pathname === '/api/roster' && request.method === 'GET') {
        return Response.json(roster())
      }
      if (url.pathname === '/api/work' && request.method === 'GET') {
        return Response.json(controlPlane.listWork())
      }
      if (url.pathname === '/api/work' && request.method === 'POST') {
        const body = await readJson(request)
        const assignee = requiredString(body, 'assignee')
        if (!agents.has(assignee)) throw new Error(`unknown assignee ${assignee}`)
        const priority =
          typeof body.priority === 'string' ? body.priority : 'medium'
        if (!['critical', 'high', 'medium', 'low'].includes(priority)) {
          throw new Error(`invalid priority ${priority}`)
        }
        const baseSha = await run(['git', 'rev-parse', 'HEAD'])
        const created = controlPlane.createWork({
          title: requiredString(body, 'title'),
          description:
            typeof body.description === 'string' && body.description.trim()
              ? body.description.trim()
              : requiredString(body, 'title'),
          assignee,
          priority,
          baseSha,
        })
        emit('work.proposed', created)
        return Response.json(created, { status: 201 })
      }
      if (url.pathname === '/api/approvals' && request.method === 'GET') {
        return Response.json(controlPlane.listApprovals())
      }
      if (url.pathname === '/api/activity' && request.method === 'GET') {
        return Response.json(controlPlane.recentActivity())
      }

      const startMatch = url.pathname.match(/^\/api\/agents\/([^/]+)\/start$/)
      if (startMatch && request.method === 'POST') {
        await startAgent(startMatch[1])
        return Response.json({ ok: true })
      }
      const stopMatch = url.pathname.match(/^\/api\/agents\/([^/]+)\/stop$/)
      if (stopMatch && request.method === 'POST') {
        await stopAgent(stopMatch[1])
        return Response.json({ ok: true })
      }
      const statusMatch = url.pathname.match(/^\/api\/agents\/([^/]+)\/status$/)
      if (statusMatch && request.method === 'GET') {
        const agent = agents.get(statusMatch[1])
        if (!agent) return jsonError(404, 'unknown agent')
        return Response.json({ status: agent.status, error: agent.error })
      }
      const messageMatch = url.pathname.match(
        /^\/api\/agents\/([^/]+)\/messages$/,
      )
      if (messageMatch && request.method === 'GET') {
        if (!agents.has(messageMatch[1])) return jsonError(404, 'unknown agent')
        return Response.json(controlPlane.messages(messageMatch[1]))
      }
      const chatMatch = url.pathname.match(/^\/api\/agents\/([^/]+)\/chat$/)
      if (chatMatch && request.method === 'POST') {
        const body = await readJson(request)
        return Response.json(
          await chat(chatMatch[1], requiredString(body, 'message')),
        )
      }
      const approvalMatch = url.pathname.match(
        /^\/api\/approvals\/([^/]+)\/decision$/,
      )
      if (approvalMatch && request.method === 'POST') {
        const body = await readJson(request)
        const approval = controlPlane.database
          .query('SELECT * FROM approvals WHERE id = ?')
          .get(approvalMatch[1])
        if (!approval) return jsonError(404, 'approval not found')
        const item = controlPlane.getWork(approval.work_item_id)
        if (!item) return jsonError(404, 'work item not found')
        const decision = requiredString(body, 'decision')

        let issue = null
        if (
          decision === 'approved' &&
          approval.kind === 'execution' &&
          !item.issue_number
        ) {
          issue = await createIssue(repoRoot, item)
          controlPlane.updateWork(item.id, {
            issueNumber: issue.number,
            issueUrl: issue.url,
          })
        }
        const decided = controlPlane.decideApproval(
          approval.id,
          decision,
          typeof body.note === 'string' ? body.note : null,
        )
        if (decision === 'approved' && approval.kind === 'execution') {
          const updated = controlPlane.updateWork(item.id, { status: 'approved' })
          void dispatchWork(updated)
        }
        if (decision === 'rejected' && approval.kind === 'execution') {
          controlPlane.updateWork(item.id, { status: 'cancelled' })
        }
        emit('approval.decided', { approval: decided, issue })
        return Response.json({ approval: decided, issue })
      }
      const executeMatch = url.pathname.match(/^\/api\/work\/([^/]+)\/execute$/)
      if (executeMatch && request.method === 'POST') {
        const item = controlPlane.getWork(executeMatch[1])
        if (!item) return jsonError(404, 'work item not found')
        const approval = controlPlane.database
          .query(`
            SELECT * FROM approvals
            WHERE work_item_id = ? AND kind = 'execution' AND status = 'approved'
            ORDER BY requested_at DESC LIMIT 1
          `)
          .get(item.id)
        if (!approval) return jsonError(409, 'execution is not approved')
        const running = controlPlane.database
          .query(
            `SELECT id FROM execution_runs
             WHERE work_item_id = ? AND status = 'running' LIMIT 1`,
          )
          .get(item.id)
        if (running) return jsonError(409, `execution ${running.id} is running`)

        void executeWork({
          item,
          controlPlane,
          repoRoot,
          worktreeRoot,
          onEvent: (event) =>
            emit('execution.event', { workItemId: item.id, event }),
        }).catch((error) => {
          controlPlane.updateWork(item.id, { status: 'failed' })
          controlPlane.activity(
            'execution.failed',
            error instanceof Error ? error.message : String(error),
            { workItemId: item.id, agentId: item.assignee },
          )
          emit('execution.failed', { workItemId: item.id, error: String(error) })
        })
        return Response.json({ accepted: true, workItemId: item.id }, { status: 202 })
      }
      const publicationMatch = url.pathname.match(
        /^\/api\/work\/([^/]+)\/request-publication$/,
      )
      if (publicationMatch && request.method === 'POST') {
        const item = controlPlane.getWork(publicationMatch[1])
        if (!item) return jsonError(404, 'work item not found')
        const approval = controlPlane.requestApproval(item.id, 'publication')
        emit('approval.requested', approval)
        return Response.json(approval, { status: 201 })
      }
      const publishMatch = url.pathname.match(/^\/api\/work\/([^/]+)\/publish$/)
      if (publishMatch && request.method === 'POST') {
        const item = controlPlane.getWork(publishMatch[1])
        if (!item) return jsonError(404, 'work item not found')
        const published = await publishWork({ item, controlPlane, repoRoot })
        emit('publication.completed', published)
        return Response.json(published, { status: 201 })
      }
      return new Response('not found', { status: 404 })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return jsonError(400, message)
    }
  },
})

async function shutdown() {
  clearInterval(idleTimer)
  for (const id of agents.keys()) {
    await stopAgent(id, 'console shutdown').catch(() => undefined)
  }
  controlPlane.close()
  server.stop(true)
  process.exit(0)
}

process.on('SIGINT', () => void shutdown())
process.on('SIGTERM', () => void shutdown())

console.log(`OnlyMen Engineering Office: http://127.0.0.1:${uiPort}`)
console.log(`Repository: ${repoRoot}`)
console.log(`State: ${stateRoot}`)
console.log(`Roster: ${[...agents.keys()].join(', ')}`)
void startAgent('andrew')
