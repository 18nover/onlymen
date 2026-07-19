/**
 * Org coordination actions: assign work, request reviews, escalate blockers,
 * report completions, and summarize the board. Each action declares typed
 * parameters so the planner extracts structured values from the conversation;
 * keyword extraction from the raw message text remains as the fallback when a
 * parameter was not extracted (e.g. under a planner that skips extraction).
 */
import type { Action, ActionParameters, IAgentRuntime, Memory, State, HandlerCallback, HandlerOptions } from '@elizaos/core'
import { OrgCoordinationService } from '../services/coordination.ts'
import type { OrgReview, OrgTask } from '../types/index.ts'

/** Short names the planner may use for org agents (usernames also accepted). */
const ORG_AGENTS = [
  'atlas', 'circuit', 'compass', 'echo', 'forge', 'lexi', 'nova', 'pixel',
  'prism', 'pulse', 'scribe', 'sentinel', 'vision',
] as const

const REVIEW_TYPES = [
  'code_review', 'security_review', 'architecture_review',
  'design_review', 'qa_review', 'accessibility_review',
] as const

const PRIORITIES = ['critical', 'high', 'medium', 'low'] as const

function paramString(params: ActionParameters | undefined, key: string): string | null {
  const value = params?.[key]
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null
}

export const requestReviewAction: Action = {
  name: 'REQUEST_REVIEW',
  description: 'Request a code, security, architecture, design, QA, or accessibility review from another org agent',
  similes: ['ask for review', 'request code review', 'need review on'],
  parameters: [
    {
      name: 'reviewer',
      description: 'The org agent who should perform the review',
      required: true,
      schema: { type: 'string', enum: [...ORG_AGENTS] },
      examples: ['sentinel', 'prism'],
    },
    {
      name: 'type',
      description: 'The kind of review being requested',
      required: false,
      schema: { type: 'string', enum: [...REVIEW_TYPES], default: 'code_review' },
      examples: ['security_review'],
    },
    {
      name: 'taskId',
      description: 'The org task the review belongs to, when known (e.g. TASK-001)',
      required: false,
      schema: { type: 'string', pattern: '^TASK-\\d+$' },
      examples: ['TASK-001'],
    },
  ],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text = message.content?.text || ''
    return text.toLowerCase().includes('review')
  },
  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State | undefined,
    options: HandlerOptions | undefined,
    callback: HandlerCallback | undefined
  ) => {
    const service = OrgCoordinationService.getInstance()
    const text = message.content?.text || ''
    const params = options?.parameters

    const review = service.createReview({
      taskId: paramString(params, 'taskId') ?? extractTaskId(text),
      requester: message.agentId || 'unknown',
      reviewer: paramString(params, 'reviewer') ?? extractReviewer(text),
      type: (paramString(params, 'type') as OrgReview['type'] | null) ?? extractReviewType(text),
    })

    const response = `Review requested: ${review.id}\nReviewer: ${review.reviewer}\nType: ${review.type}\nStatus: Pending`

    if (callback) {
      await callback({ text: response })
    }
    return { success: true, text: response }
  },
  examples: [[
    { name: 'User', content: { text: 'Nova, please review the auth flow implementation.' } },
    { name: 'Atlas', content: { text: 'REQUEST_REVIEW for the auth flow. Assigning to Sentinel for security review.' } },
  ]],
}

export const assignWorkAction: Action = {
  name: 'ASSIGN_WORK',
  description: 'Assign a task to an org agent with a title and priority',
  similes: ['assign task', 'give work to', 'delegate to'],
  parameters: [
    {
      name: 'assignee',
      description: 'The org agent who should own the task',
      required: true,
      schema: { type: 'string', enum: [...ORG_AGENTS] },
      examples: ['nova'],
    },
    {
      name: 'title',
      description: 'Short imperative title for the task',
      required: true,
      schema: { type: 'string', maxLength: 120 },
      examples: ['Implement the notifications settings screen'],
    },
    {
      name: 'description',
      description: 'Longer task description with acceptance criteria, when given',
      required: false,
      schema: { type: 'string' },
    },
    {
      name: 'priority',
      description: 'Task priority',
      required: false,
      schema: { type: 'string', enum: [...PRIORITIES], default: 'medium' },
      examples: ['high'],
    },
    {
      name: 'deadline',
      description: 'Deadline as an ISO date, when the requester named one',
      required: false,
      schema: { type: 'string' },
      examples: ['2026-07-24'],
    },
  ],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text = message.content?.text || ''
    return text.toLowerCase().includes('assign') || text.toLowerCase().includes('task')
  },
  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State | undefined,
    options: HandlerOptions | undefined,
    callback: HandlerCallback | undefined
  ) => {
    const service = OrgCoordinationService.getInstance()
    const text = message.content?.text || ''
    const params = options?.parameters

    const task = service.createTask({
      title: paramString(params, 'title') ?? extractTaskTitle(text),
      description: paramString(params, 'description') ?? text,
      assignee: paramString(params, 'assignee') ?? extractAssignee(text),
      assigner: message.agentId || 'atlas-pm',
      status: 'pending',
      priority: (paramString(params, 'priority') as OrgTask['priority'] | null) ?? extractPriority(text),
      deadline: paramString(params, 'deadline') ?? undefined,
    })

    const response = `Task assigned: ${task.id}\nAssignee: ${task.assignee}\nPriority: ${task.priority}\nTitle: ${task.title}${task.deadline ? `\nDeadline: ${task.deadline}` : ''}`

    if (callback) {
      await callback({ text: response })
    }
    return { success: true, text: response }
  },
  examples: [[
    { name: 'Atlas', content: { text: 'ASSIGN_WORK to Nova: Implement the new settings screen. Priority: high.' } },
  ]],
}

export const escalateAction: Action = {
  name: 'ESCALATE',
  description: 'Escalate a blocker or issue to Atlas',
  similes: ['escalate', 'raise blocker', 'need help'],
  parameters: [
    {
      name: 'description',
      description: 'What is blocked and why',
      required: true,
      schema: { type: 'string' },
      examples: ['Blocked on the Expo SDK upgrade; build fails on CI'],
    },
    {
      name: 'severity',
      description: 'Blocker severity',
      required: false,
      schema: { type: 'string', enum: [...PRIORITIES], default: 'medium' },
      examples: ['critical'],
    },
    {
      name: 'taskId',
      description: 'The blocked org task, when known (e.g. TASK-001)',
      required: false,
      schema: { type: 'string', pattern: '^TASK-\\d+$' },
    },
  ],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text = message.content?.text || ''
    return text.toLowerCase().includes('escalat') || text.toLowerCase().includes('blocker')
  },
  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State | undefined,
    options: HandlerOptions | undefined,
    callback: HandlerCallback | undefined
  ) => {
    const service = OrgCoordinationService.getInstance()
    const text = message.content?.text || ''
    const params = options?.parameters

    const blocker = service.createBlocker({
      taskId: paramString(params, 'taskId') ?? extractTaskId(text),
      agent: message.agentId || 'unknown',
      description: paramString(params, 'description') ?? text,
      severity: (paramString(params, 'severity') as OrgTask['priority'] | null) ?? extractSeverity(text),
    })

    const response = `Blocker escalated: ${blocker.id}\nSeverity: ${blocker.severity}\nAgent: ${blocker.agent}\nAtlas has been notified.`

    if (callback) {
      await callback({ text: response })
    }
    return { success: true, text: response }
  },
  examples: [[
    { name: 'Nova', content: { text: "ESCALATE: I'm blocked on the Expo SDK upgrade. Need Atlas to prioritize." } },
  ]],
}

export const reportCompleteAction: Action = {
  name: 'REPORT_COMPLETE',
  description: 'Report that an org task is complete',
  similes: ['task done', 'finished', 'completed'],
  parameters: [
    {
      name: 'taskId',
      description: 'The completed org task (e.g. TASK-001)',
      required: true,
      schema: { type: 'string', pattern: '^TASK-\\d+$' },
      examples: ['TASK-001'],
    },
    {
      name: 'summary',
      description: 'Short summary of what was delivered',
      required: false,
      schema: { type: 'string' },
    },
  ],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text = message.content?.text || ''
    return text.toLowerCase().includes('done') || text.toLowerCase().includes('complete') || text.toLowerCase().includes('finish')
  },
  handler: async (
    _runtime: IAgentRuntime,
    message: Memory,
    _state: State | undefined,
    options: HandlerOptions | undefined,
    callback: HandlerCallback | undefined
  ) => {
    const service = OrgCoordinationService.getInstance()
    const text = message.content?.text || ''
    const params = options?.parameters

    const taskId = paramString(params, 'taskId') ?? extractTaskId(text)
    const task = service.updateTaskStatus(taskId, 'done')

    const summary = paramString(params, 'summary')
    const response = task
      ? `Task ${task.id} marked as done by ${message.agentId || 'unknown'}.\nTitle: ${task.title}${summary ? `\nSummary: ${summary}` : ''}`
      : `Task ${taskId} not found. Please provide a valid task ID.`

    if (callback) {
      await callback({ text: response })
    }
    return { success: Boolean(task), text: response }
  },
  examples: [[
    { name: 'Forge', content: { text: 'TASK-001 is done. Auth flow implemented and tested.' } },
  ]],
}

export const summarizeAction: Action = {
  name: 'SUMMARIZE',
  description: 'Summarize the current organization status',
  similes: ['status update', 'org summary', 'team status'],
  validate: async (_runtime: IAgentRuntime, message: Memory) => {
    const text = message.content?.text || ''
    return text.toLowerCase().includes('summary') || text.toLowerCase().includes('status')
  },
  handler: async (
    _runtime: IAgentRuntime,
    _message: Memory,
    _state: State | undefined,
    _options: HandlerOptions | undefined,
    callback: HandlerCallback | undefined
  ) => {
    const service = OrgCoordinationService.getInstance()
    const summary = service.getOrgSummary()

    const response = [
      '## Organization Status',
      '',
      `**Total Tasks:** ${summary.totalTasks}`,
      `**Active Blockers:** ${summary.activeBlockers}`,
      `**Pending Reviews:** ${summary.pendingReviews}`,
      `**Agents Working:** ${summary.agentsWorking}`,
      `**Agents Blocked:** ${summary.agentsBlocked}`,
      '',
      '**Tasks by Status:**',
      ...Object.entries(summary.tasksByStatus).map(([status, count]) => `- ${status}: ${count}`),
    ].join('\n')

    if (callback) {
      await callback({ text: response })
    }
    return { success: true, text: response }
  },
  examples: [[
    { name: 'Atlas', content: { text: 'Give me a summary of the org status.' } },
  ]],
}

// Keyword-extraction fallbacks for planners that route without extracting
// structured parameters. Never the primary path.
function extractTaskId(text: string): string {
  const match = text.match(/TASK-\d+/i)
  return match ? match[0].toUpperCase() : 'TASK-000'
}

function extractReviewer(text: string): string {
  for (const agent of ORG_AGENTS) {
    if (agent !== 'atlas' && text.toLowerCase().includes(agent)) return agent
  }
  return 'unknown'
}

function extractReviewType(text: string): OrgReview['type'] {
  if (text.toLowerCase().includes('security')) return 'security_review'
  if (text.toLowerCase().includes('architecture')) return 'architecture_review'
  if (text.toLowerCase().includes('design')) return 'design_review'
  if (text.toLowerCase().includes('accessib') || text.toLowerCase().includes('a11y')) return 'accessibility_review'
  if (text.toLowerCase().includes('qa') || text.toLowerCase().includes('test')) return 'qa_review'
  return 'code_review'
}

function extractAssignee(text: string): string {
  for (const agent of ORG_AGENTS) {
    if (agent !== 'atlas' && text.toLowerCase().includes(agent)) return agent
  }
  return 'unknown'
}

function extractTaskTitle(text: string): string {
  const titleMatch = text.match(/(?:title|task|about)[:\s]+(.+?)(?:\.|$)/i)
  return titleMatch ? titleMatch[1].trim() : text.slice(0, 100)
}

function extractPriority(text: string): OrgTask['priority'] {
  if (text.toLowerCase().includes('critical') || text.toLowerCase().includes('urgent')) return 'critical'
  if (text.toLowerCase().includes('high')) return 'high'
  if (text.toLowerCase().includes('low')) return 'low'
  return 'medium'
}

function extractSeverity(text: string): OrgTask['priority'] {
  if (text.toLowerCase().includes('critical') || text.toLowerCase().includes('urgent')) return 'critical'
  if (text.toLowerCase().includes('high')) return 'high'
  if (text.toLowerCase().includes('low')) return 'low'
  return 'medium'
}
