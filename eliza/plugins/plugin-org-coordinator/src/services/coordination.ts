import type { OrgTask, OrgReview, OrgDecision, OrgBlocker, OrgSprint, OrgAgentStatus, OrgCoordinationState } from '../types/index.ts'

export class OrgCoordinationService {
  private tasks: Map<string, OrgTask> = new Map()
  private reviews: Map<string, OrgReview> = new Map()
  private decisions: Map<string, OrgDecision> = new Map()
  private blockers: Map<string, OrgBlocker> = new Map()
  private sprints: Map<string, OrgSprint> = new Map()
  private agentStatus: Map<string, OrgAgentStatus> = new Map()
  // Write-through persistence hook installed by the runtime service at boot.
  // Mutations are synchronous; the hook owns making the write durable (and
  // surfacing its own failures) so board state survives restarts.
  private onPersist: ((state: OrgCoordinationState) => void) | null = null
  private static instance: OrgCoordinationService

  static getInstance(): OrgCoordinationService {
    if (!OrgCoordinationService.instance) {
      OrgCoordinationService.instance = new OrgCoordinationService()
    }
    return OrgCoordinationService.instance
  }

  /** Hydrate from a persisted snapshot and install the write-through hook. */
  attachPersistence(
    persisted: OrgCoordinationState | undefined,
    onPersist: (state: OrgCoordinationState) => void,
  ): void {
    if (persisted) {
      this.tasks = new Map(persisted.tasks.map(t => [t.id, t]))
      this.reviews = new Map(persisted.reviews.map(r => [r.id, r]))
      this.decisions = new Map(persisted.decisions.map(d => [d.id, d]))
      this.blockers = new Map(persisted.blockers.map(b => [b.id, b]))
      this.sprints = new Map(persisted.sprints.map(s => [s.id, s]))
      this.agentStatus = new Map(persisted.agentStatus.map(a => [a.username, a]))
    }
    this.onPersist = onPersist
  }

  snapshot(): OrgCoordinationState {
    return {
      tasks: Array.from(this.tasks.values()),
      reviews: Array.from(this.reviews.values()),
      decisions: Array.from(this.decisions.values()),
      blockers: Array.from(this.blockers.values()),
      sprints: Array.from(this.sprints.values()),
      agentStatus: Array.from(this.agentStatus.values()),
    }
  }

  private persist(): void {
    this.onPersist?.(this.snapshot())
  }

  createTask(task: Omit<OrgTask, 'id' | 'createdAt' | 'updatedAt' | 'blockers' | 'artifacts'>): OrgTask {
    const id = `TASK-${String(this.tasks.size + 1).padStart(3, '0')}`
    const now = new Date().toISOString()
    const newTask: OrgTask = {
      ...task,
      id,
      createdAt: now,
      updatedAt: now,
      blockers: [],
      artifacts: [],
    }
    this.tasks.set(id, newTask)
    this.updateAgentStatus(task.assignee, 'working', id)
    this.persist()
    return newTask
  }

  getTask(id: string): OrgTask | undefined {
    return this.tasks.get(id)
  }

  updateTaskStatus(id: string, status: OrgTask['status']): OrgTask | undefined {
    const task = this.tasks.get(id)
    if (!task) return undefined
    task.status = status
    task.updatedAt = new Date().toISOString()
    if (status === 'done') {
      this.updateAgentStatus(task.assignee, 'idle')
    }
    this.persist()
    return task
  }

  getTasksByAssignee(assignee: string): OrgTask[] {
    return Array.from(this.tasks.values()).filter(t => t.assignee === assignee)
  }

  getTasksByStatus(status: OrgTask['status']): OrgTask[] {
    return Array.from(this.tasks.values()).filter(t => t.status === status)
  }

  createReview(review: Omit<OrgReview, 'id' | 'createdAt' | 'status' | 'findings'>): OrgReview {
    const id = `REVIEW-${String(this.reviews.size + 1).padStart(3, '0')}`
    const newReview: OrgReview = {
      ...review,
      id,
      status: 'pending',
      findings: [],
      createdAt: new Date().toISOString(),
    }
    this.reviews.set(id, newReview)
    this.updateAgentStatus(review.reviewer, 'reviewing')
    this.persist()
    return newReview
  }

  completeReview(id: string, verdict: OrgReview['verdict'], findings: OrgReview['findings']): OrgReview | undefined {
    const review = this.reviews.get(id)
    if (!review) return undefined
    review.status = 'completed'
    review.verdict = verdict
    review.findings = findings
    review.completedAt = new Date().toISOString()
    this.updateAgentStatus(review.reviewer, 'idle')
    this.persist()
    return review
  }

  getPendingReviewsForAgent(agent: string): OrgReview[] {
    return Array.from(this.reviews.values()).filter(
      r => r.reviewer === agent && r.status === 'pending'
    )
  }

  createDecision(decision: Omit<OrgDecision, 'id' | 'createdAt' | 'status'>): OrgDecision {
    const id = `DECISION-${String(this.decisions.size + 1).padStart(3, '0')}`
    const newDecision: OrgDecision = {
      ...decision,
      id,
      status: 'proposed',
      createdAt: new Date().toISOString(),
    }
    this.decisions.set(id, newDecision)
    this.persist()
    return newDecision
  }

  createBlocker(blocker: Omit<OrgBlocker, 'id' | 'createdAt'>): OrgBlocker {
    const id = `BLOCKER-${String(this.blockers.size + 1).padStart(3, '0')}`
    const newBlocker: OrgBlocker = {
      ...blocker,
      id,
      createdAt: new Date().toISOString(),
    }
    this.blockers.set(id, newBlocker)
    const task = this.tasks.get(blocker.taskId)
    if (task) {
      task.blockers.push(id)
      task.status = 'blocked'
      task.updatedAt = new Date().toISOString()
    }
    this.updateAgentStatus(blocker.agent, 'blocked')
    this.persist()
    return newBlocker
  }

  resolveBlocker(id: string, resolution: string): OrgBlocker | undefined {
    const blocker = this.blockers.get(id)
    if (!blocker) return undefined
    blocker.resolvedAt = new Date().toISOString()
    blocker.resolution = resolution
    const task = this.tasks.get(blocker.taskId)
    if (task) {
      task.blockers = task.blockers.filter(b => b !== id)
      if (task.blockers.length === 0) {
        task.status = 'in_progress'
        task.updatedAt = new Date().toISOString()
      }
    }
    this.updateAgentStatus(blocker.agent, 'working')
    this.persist()
    return blocker
  }

  getActiveBlockers(): OrgBlocker[] {
    return Array.from(this.blockers.values()).filter(b => !b.resolvedAt)
  }

  createSprint(sprint: Omit<OrgSprint, 'id' | 'tasks'>): OrgSprint {
    const id = `SPRINT-${String(this.sprints.size + 1).padStart(3, '0')}`
    const newSprint: OrgSprint = {
      ...sprint,
      id,
      tasks: [],
    }
    this.sprints.set(id, newSprint)
    this.persist()
    return newSprint
  }

  updateAgentStatus(username: string, status: OrgAgentStatus['status'], currentTask?: string): void {
    const existing = this.agentStatus.get(username)
    this.agentStatus.set(username, {
      username,
      name: existing?.name || username,
      role: existing?.role || 'unknown',
      status,
      currentTask,
      lastActive: new Date().toISOString(),
    })
    this.persist()
  }

  getAgentStatuses(): OrgAgentStatus[] {
    return Array.from(this.agentStatus.values())
  }

  getOrgSummary(): {
    totalTasks: number
    tasksByStatus: Record<string, number>
    activeBlockers: number
    pendingReviews: number
    agentsWorking: number
    agentsBlocked: number
  } {
    const tasks = Array.from(this.tasks.values())
    const tasksByStatus: Record<string, number> = {}
    for (const task of tasks) {
      tasksByStatus[task.status] = (tasksByStatus[task.status] || 0) + 1
    }
    const agents = Array.from(this.agentStatus.values())
    return {
      totalTasks: tasks.length,
      tasksByStatus,
      activeBlockers: this.getActiveBlockers().length,
      pendingReviews: Array.from(this.reviews.values()).filter(r => r.status === 'pending').length,
      agentsWorking: agents.filter(a => a.status === 'working' || a.status === 'reviewing').length,
      agentsBlocked: agents.filter(a => a.status === 'blocked').length,
    }
  }
}
