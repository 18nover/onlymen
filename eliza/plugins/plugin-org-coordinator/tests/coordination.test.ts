/**
 * Unit tests for the org coordination store: task/review/blocker lifecycles,
 * agent-status side effects, and the persistence hydrate/write-through hook.
 * Uses fresh service instances, not the runtime singleton.
 */
import { describe, expect, test } from 'bun:test'
import { OrgCoordinationService } from '../src/services/coordination.ts'
import type { OrgCoordinationState } from '../src/types/index.ts'

function makeService(): OrgCoordinationService {
  return new OrgCoordinationService()
}

function makeTask(service: OrgCoordinationService, overrides: Partial<Parameters<OrgCoordinationService['createTask']>[0]> = {}) {
  return service.createTask({
    title: 'Ship the thing',
    description: 'Ship it end to end',
    assignee: 'nadia',
    assigner: 'andrew',
    status: 'pending',
    priority: 'medium',
    ...overrides,
  })
}

describe('tasks', () => {
  test('createTask assigns sequential ids and initializes bookkeeping fields', () => {
    const service = makeService()
    const first = makeTask(service)
    const second = makeTask(service, { assignee: 'morgan' })

    expect(first.id).toBe('TASK-001')
    expect(second.id).toBe('TASK-002')
    expect(first.blockers).toEqual([])
    expect(first.artifacts).toEqual([])
    expect(Date.parse(first.createdAt)).not.toBeNaN()
    expect(service.getTask('TASK-001')?.title).toBe('Ship the thing')
  })

  test('createTask marks the assignee as working on the task', () => {
    const service = makeService()
    const task = makeTask(service)

    const status = service.getAgentStatuses().find(a => a.username === 'nadia')
    expect(status?.status).toBe('working')
    expect(status?.currentTask).toBe(task.id)
  })

  test('updateTaskStatus to done frees the assignee; unknown ids return undefined', () => {
    const service = makeService()
    const task = makeTask(service)

    expect(service.updateTaskStatus('TASK-999', 'done')).toBeUndefined()

    const done = service.updateTaskStatus(task.id, 'done')
    expect(done?.status).toBe('done')
    expect(service.getAgentStatuses().find(a => a.username === 'nadia')?.status).toBe('idle')
  })

  test('getTasksByAssignee and getTasksByStatus filter correctly', () => {
    const service = makeService()
    makeTask(service)
    makeTask(service, { assignee: 'morgan' })
    service.updateTaskStatus('TASK-002', 'in_progress')

    expect(service.getTasksByAssignee('morgan').map(t => t.id)).toEqual(['TASK-002'])
    expect(service.getTasksByStatus('pending').map(t => t.id)).toEqual(['TASK-001'])
  })
})

describe('reviews', () => {
  test('createReview starts pending and puts the reviewer into reviewing', () => {
    const service = makeService()
    const review = service.createReview({
      taskId: 'TASK-001',
      requester: 'nadia',
      reviewer: 'seth',
      type: 'security_review',
    })

    expect(review.id).toBe('REVIEW-001')
    expect(review.status).toBe('pending')
    expect(review.findings).toEqual([])
    expect(service.getAgentStatuses().find(a => a.username === 'seth')?.status).toBe('reviewing')
    expect(service.getPendingReviewsForAgent('seth').map(r => r.id)).toEqual(['REVIEW-001'])
  })

  test('completeReview records the verdict and frees the reviewer', () => {
    const service = makeService()
    const review = service.createReview({
      taskId: 'TASK-001',
      requester: 'nadia',
      reviewer: 'seth',
      type: 'code_review',
    })

    const completed = service.completeReview(review.id, 'approved', ['looks good'])
    expect(completed?.status).toBe('completed')
    expect(completed?.verdict).toBe('approved')
    expect(completed?.findings).toEqual(['looks good'])
    expect(completed?.completedAt).toBeDefined()
    expect(service.getPendingReviewsForAgent('seth')).toEqual([])
    expect(service.getAgentStatuses().find(a => a.username === 'seth')?.status).toBe('idle')

    expect(service.completeReview('REVIEW-999', 'approved', [])).toBeUndefined()
  })
})

describe('blockers', () => {
  test('createBlocker blocks the task and the reporting agent', () => {
    const service = makeService()
    const task = makeTask(service)
    const blocker = service.createBlocker({
      taskId: task.id,
      agent: 'nadia',
      description: 'waiting on lexicon decision',
      severity: 'high',
    })

    expect(blocker.id).toBe('BLOCKER-001')
    expect(service.getTask(task.id)?.status).toBe('blocked')
    expect(service.getTask(task.id)?.blockers).toEqual([blocker.id])
    expect(service.getAgentStatuses().find(a => a.username === 'nadia')?.status).toBe('blocked')
    expect(service.getActiveBlockers().map(b => b.id)).toEqual([blocker.id])
  })

  test('resolveBlocker un-blocks the task once its last blocker resolves', () => {
    const service = makeService()
    const task = makeTask(service)
    const first = service.createBlocker({
      taskId: task.id,
      agent: 'nadia',
      description: 'one',
      severity: 'medium',
    })
    const second = service.createBlocker({
      taskId: task.id,
      agent: 'nadia',
      description: 'two',
      severity: 'medium',
    })

    service.resolveBlocker(first.id, 'fixed upstream')
    expect(service.getTask(task.id)?.status).toBe('blocked')

    const resolved = service.resolveBlocker(second.id, 'decided')
    expect(resolved?.resolution).toBe('decided')
    expect(resolved?.resolvedAt).toBeDefined()
    expect(service.getTask(task.id)?.status).toBe('in_progress')
    expect(service.getActiveBlockers()).toEqual([])
    expect(service.getAgentStatuses().find(a => a.username === 'nadia')?.status).toBe('working')

    expect(service.resolveBlocker('BLOCKER-999', 'nope')).toBeUndefined()
  })
})

describe('summary', () => {
  test('getOrgSummary aggregates tasks, blockers, reviews, and agent states', () => {
    const service = makeService()
    const task = makeTask(service)
    makeTask(service, { assignee: 'morgan' })
    service.createReview({ taskId: task.id, requester: 'nadia', reviewer: 'seth', type: 'qa_review' })
    service.createBlocker({ taskId: task.id, agent: 'nadia', description: 'stuck', severity: 'critical' })

    const summary = service.getOrgSummary()
    expect(summary.totalTasks).toBe(2)
    expect(summary.tasksByStatus).toEqual({ blocked: 1, pending: 1 })
    expect(summary.activeBlockers).toBe(1)
    expect(summary.pendingReviews).toBe(1)
    // morgan working, seth reviewing; nadia is blocked
    expect(summary.agentsWorking).toBe(2)
    expect(summary.agentsBlocked).toBe(1)
  })
})

describe('persistence', () => {
  test('attachPersistence hydrates a snapshot and mutations write through', () => {
    const source = makeService()
    const task = makeTask(source)
    source.createReview({ taskId: task.id, requester: 'nadia', reviewer: 'seth', type: 'code_review' })
    const snapshot = source.snapshot()

    const persisted: OrgCoordinationState[] = []
    const restored = makeService()
    restored.attachPersistence(snapshot, state => persisted.push(state))

    expect(restored.getTask(task.id)?.title).toBe(task.title)
    expect(restored.getPendingReviewsForAgent('seth')).toHaveLength(1)
    expect(persisted).toHaveLength(0)

    restored.updateTaskStatus(task.id, 'in_progress')
    expect(persisted).toHaveLength(1)
    expect(persisted[0]?.tasks.find(t => t.id === task.id)?.status).toBe('in_progress')
  })

  test('attachPersistence without a snapshot only installs the hook', () => {
    const persisted: OrgCoordinationState[] = []
    const service = makeService()
    service.attachPersistence(undefined, state => persisted.push(state))

    makeTask(service)
    // createTask persists twice: once for the task, once for agent status
    expect(persisted.length).toBeGreaterThan(0)
    expect(persisted.at(-1)?.tasks).toHaveLength(1)
  })
})
