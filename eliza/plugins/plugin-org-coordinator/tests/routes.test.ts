/**
 * Tests for the deterministic /api/org REST routes: input validation (typed
 * 400s), not-found handling, and store side effects. Exercises the real
 * runtime singleton, so assertions track ids returned by the routes rather
 * than assuming an empty store.
 */
import { describe, expect, test } from 'bun:test'
import { orgRoutes } from '../src/routes/index.ts'

type Handler = NonNullable<(typeof orgRoutes)[number]['routeHandler']>

function route(method: string, path: string): Handler {
  const match = orgRoutes.find(r => r.type === method && r.path === path)
  if (!match?.routeHandler) throw new Error(`no ${method} ${path} route`)
  return match.routeHandler
}

function ctx(body: unknown = null, params: Record<string, string> = {}) {
  // Minimal RouteHandlerContext shape; the handlers only touch body/params.
  return { body, params } as never
}

async function call(method: string, path: string, body?: unknown, params?: Record<string, string>) {
  const result = await route(method, path)(ctx(body, params ?? {}))
  return result as { status: number; body: Record<string, never> & Record<string, unknown> }
}

describe('GET /api/org/summary and /api/org/board', () => {
  test('return the aggregate summary and the full snapshot', async () => {
    const summary = await call('GET', '/api/org/summary')
    expect(summary.status).toBe(200)
    expect(summary.body.summary).toHaveProperty('totalTasks')
    expect(Array.isArray(summary.body.agents)).toBe(true)

    const board = await call('GET', '/api/org/board')
    expect(board.status).toBe(200)
    for (const key of ['tasks', 'reviews', 'decisions', 'blockers', 'sprints', 'agentStatus']) {
      expect(Array.isArray((board.body as Record<string, unknown>)[key])).toBe(true)
    }
  })
})

describe('POST /api/org/tasks', () => {
  test('rejects non-object bodies and missing required fields with typed 400s', async () => {
    for (const body of [null, 'text', ['array']]) {
      const result = await call('POST', '/api/org/tasks', body)
      expect(result.status).toBe(400)
      expect((result.body.error as Record<string, unknown>).type).toBe('invalid_request')
    }

    const missing = await call('POST', '/api/org/tasks', { title: 'no assignee' })
    expect(missing.status).toBe(400)

    const badPriority = await call('POST', '/api/org/tasks', {
      title: 'x',
      assignee: 'nadia',
      priority: 'urgent',
    })
    expect(badPriority.status).toBe(400)
  })

  test('creates a task with defaults applied and reports it on the board', async () => {
    const created = await call('POST', '/api/org/tasks', { title: 'Route test task', assignee: 'quinn' })
    expect(created.status).toBe(201)
    const task = created.body.task as Record<string, unknown>
    expect(task.title).toBe('Route test task')
    expect(task.description).toBe('Route test task')
    expect(task.assigner).toBe('org-cli')
    expect(task.priority).toBe('medium')
    expect(task.status).toBe('pending')

    const board = await call('GET', '/api/org/board')
    const ids = (board.body.tasks as Array<{ id: string }>).map(t => t.id)
    expect(ids).toContain(task.id as string)
  })
})

describe('POST /api/org/tasks/:id/status', () => {
  test('validates the status value and 404s on unknown tasks', async () => {
    const invalid = await call('POST', '/api/org/tasks/:id/status', { status: 'paused' }, { id: 'TASK-001' })
    expect(invalid.status).toBe(400)

    const notFound = await call('POST', '/api/org/tasks/:id/status', { status: 'done' }, { id: 'TASK-999' })
    expect(notFound.status).toBe(404)
    expect((notFound.body.error as Record<string, unknown>).type).toBe('not_found')
  })

  test('updates an existing task', async () => {
    const created = await call('POST', '/api/org/tasks', { title: 'To be started', assignee: 'devon' })
    const id = (created.body.task as { id: string }).id

    const updated = await call('POST', '/api/org/tasks/:id/status', { status: 'in_progress' }, { id })
    expect(updated.status).toBe(200)
    expect((updated.body.task as Record<string, unknown>).status).toBe('in_progress')
  })
})

describe('POST /api/org/reviews', () => {
  test('requires a reviewer and a known review type', async () => {
    const missing = await call('POST', '/api/org/reviews', {})
    expect(missing.status).toBe(400)

    const badType = await call('POST', '/api/org/reviews', { reviewer: 'seth', type: 'vibe_review' })
    expect(badType.status).toBe(400)
  })

  test('creates a pending review with defaults', async () => {
    const created = await call('POST', '/api/org/reviews', { reviewer: 'ethan', type: 'accessibility_review' })
    expect(created.status).toBe(201)
    const review = created.body.review as Record<string, unknown>
    expect(review.status).toBe('pending')
    expect(review.requester).toBe('org-cli')
    expect(review.taskId).toBe('TASK-000')
  })
})

describe('POST /api/org/blockers', () => {
  test('requires a description and a known severity', async () => {
    const missing = await call('POST', '/api/org/blockers', {})
    expect(missing.status).toBe(400)

    const badSeverity = await call('POST', '/api/org/blockers', { description: 'x', severity: 'catastrophic' })
    expect(badSeverity.status).toBe(400)
  })

  test('creates a blocker and blocks the referenced task', async () => {
    const created = await call('POST', '/api/org/tasks', { title: 'Will be blocked', assignee: 'parker' })
    const taskId = (created.body.task as { id: string }).id

    const blocked = await call('POST', '/api/org/blockers', {
      taskId,
      agent: 'parker',
      description: 'waiting on infra',
      severity: 'high',
    })
    expect(blocked.status).toBe(201)

    const board = await call('GET', '/api/org/board')
    const task = (board.body.tasks as Array<{ id: string; status: string }>).find(t => t.id === taskId)
    expect(task?.status).toBe('blocked')
  })
})
