/**
 * Deterministic REST surface over the org coordination store, consumed by the
 * `org` CLI (packages/org/bin/org). These routes bypass the LLM entirely so
 * board reads and writes are instant; the chat actions remain the
 * conversational path to the same store. Private routes — the agent server's
 * central gate authorizes local/loopback callers.
 */
import type { Route, RouteHandlerContext, RouteHandlerResult } from '@elizaos/core'
import { OrgCoordinationService } from '../services/coordination.ts'
import type { OrgReview, OrgTask } from '../types/index.ts'

const TASK_STATUSES: ReadonlyArray<OrgTask['status']> = ['pending', 'in_progress', 'review', 'blocked', 'done', 'cancelled']
const PRIORITIES: ReadonlyArray<OrgTask['priority']> = ['critical', 'high', 'medium', 'low']
const REVIEW_TYPES: ReadonlyArray<OrgReview['type']> = ['code_review', 'security_review', 'architecture_review', 'design_review', 'qa_review', 'accessibility_review']

function json(status: number, body: unknown): RouteHandlerResult {
  return { status, headers: { 'content-type': 'application/json; charset=utf-8' }, body }
}

// error-policy:J3 untrusted HTTP input — invalid bodies produce a typed 400,
// never a fake-valid default.
function invalid(message: string): RouteHandlerResult {
  return json(400, { error: { type: 'invalid_request', message } })
}

function bodyRecord(ctx: RouteHandlerContext): Record<string, unknown> | null {
  return ctx.body && typeof ctx.body === 'object' && !Array.isArray(ctx.body)
    ? (ctx.body as Record<string, unknown>)
    : null
}

function stringField(body: Record<string, unknown>, key: string): string | null {
  const value = body[key]
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

export const orgRoutes: Route[] = [
  {
    type: 'GET',
    path: '/api/org/summary',
    rawPath: true,
    routeHandler: async () => {
      const service = OrgCoordinationService.getInstance()
      return json(200, { summary: service.getOrgSummary(), agents: service.getAgentStatuses() })
    },
  },
  {
    type: 'GET',
    path: '/api/org/board',
    rawPath: true,
    routeHandler: async () => {
      return json(200, OrgCoordinationService.getInstance().snapshot())
    },
  },
  {
    type: 'POST',
    path: '/api/org/tasks',
    rawPath: true,
    routeHandler: async (ctx) => {
      const body = bodyRecord(ctx)
      if (!body) return invalid('JSON object body required')
      const title = stringField(body, 'title')
      const assignee = stringField(body, 'assignee')
      if (!title || !assignee) return invalid('title and assignee are required')
      const priority = stringField(body, 'priority') ?? 'medium'
      if (!PRIORITIES.includes(priority as OrgTask['priority'])) {
        return invalid(`priority must be one of: ${PRIORITIES.join(', ')}`)
      }
      const task = OrgCoordinationService.getInstance().createTask({
        title,
        description: stringField(body, 'description') ?? title,
        assignee,
        assigner: stringField(body, 'assigner') ?? 'org-cli',
        status: 'pending',
        priority: priority as OrgTask['priority'],
        deadline: stringField(body, 'deadline') ?? undefined,
      })
      return json(201, { task })
    },
  },
  {
    type: 'POST',
    path: '/api/org/tasks/:id/status',
    rawPath: true,
    routeHandler: async (ctx) => {
      const body = bodyRecord(ctx)
      if (!body) return invalid('JSON object body required')
      const status = stringField(body, 'status')
      if (!status || !TASK_STATUSES.includes(status as OrgTask['status'])) {
        return invalid(`status must be one of: ${TASK_STATUSES.join(', ')}`)
      }
      const task = OrgCoordinationService.getInstance().updateTaskStatus(
        ctx.params.id,
        status as OrgTask['status'],
      )
      if (!task) return json(404, { error: { type: 'not_found', message: `no task ${ctx.params.id}` } })
      return json(200, { task })
    },
  },
  {
    type: 'POST',
    path: '/api/org/reviews',
    rawPath: true,
    routeHandler: async (ctx) => {
      const body = bodyRecord(ctx)
      if (!body) return invalid('JSON object body required')
      const reviewer = stringField(body, 'reviewer')
      if (!reviewer) return invalid('reviewer is required')
      const type = stringField(body, 'type') ?? 'code_review'
      if (!REVIEW_TYPES.includes(type as OrgReview['type'])) {
        return invalid(`type must be one of: ${REVIEW_TYPES.join(', ')}`)
      }
      const review = OrgCoordinationService.getInstance().createReview({
        taskId: stringField(body, 'taskId') ?? 'TASK-000',
        requester: stringField(body, 'requester') ?? 'org-cli',
        reviewer,
        type: type as OrgReview['type'],
      })
      return json(201, { review })
    },
  },
  {
    type: 'POST',
    path: '/api/org/blockers',
    rawPath: true,
    routeHandler: async (ctx) => {
      const body = bodyRecord(ctx)
      if (!body) return invalid('JSON object body required')
      const description = stringField(body, 'description')
      if (!description) return invalid('description is required')
      const severity = stringField(body, 'severity') ?? 'medium'
      if (!PRIORITIES.includes(severity as OrgTask['priority'])) {
        return invalid(`severity must be one of: ${PRIORITIES.join(', ')}`)
      }
      const blocker = OrgCoordinationService.getInstance().createBlocker({
        taskId: stringField(body, 'taskId') ?? 'TASK-000',
        agent: stringField(body, 'agent') ?? 'org-cli',
        description,
        severity: severity as OrgTask['priority'],
      })
      return json(201, { blocker })
    },
  },
]
