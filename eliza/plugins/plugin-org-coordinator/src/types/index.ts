export interface OrgTask {
  id: string
  title: string
  description: string
  assignee: string
  assigner: string
  status: 'pending' | 'in_progress' | 'review' | 'blocked' | 'done' | 'cancelled'
  priority: 'critical' | 'high' | 'medium' | 'low'
  createdAt: string
  updatedAt: string
  deadline?: string
  blockers: string[]
  artifacts: string[]
  sprint?: string
}

export interface OrgReview {
  id: string
  taskId: string
  requester: string
  reviewer: string
  type: 'code_review' | 'security_review' | 'architecture_review' | 'design_review' | 'qa_review' | 'accessibility_review'
  status: 'pending' | 'in_progress' | 'completed'
  verdict?: 'approved' | 'changes_requested' | 'blocked'
  findings: OrgFinding[]
  createdAt: string
  completedAt?: string
}

export interface OrgFinding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  description: string
  file?: string
  line?: number
  recommendation: string
}

export interface OrgDecision {
  id: string
  title: string
  rationale: string
  alternatives: string[]
  author: string
  createdAt: string
  status: 'proposed' | 'accepted' | 'deprecated'
}

export interface OrgBlocker {
  id: string
  taskId: string
  agent: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  createdAt: string
  resolvedAt?: string
  resolution?: string
}

export interface OrgSprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: 'planning' | 'active' | 'review' | 'retrospective'
  tasks: string[]
}

/**
 * Serializable snapshot of the whole coordination store, persisted through
 * the runtime's DB-backed cache so the board survives restarts.
 */
export interface OrgCoordinationState {
  tasks: OrgTask[]
  reviews: OrgReview[]
  decisions: OrgDecision[]
  blockers: OrgBlocker[]
  sprints: OrgSprint[]
  agentStatus: OrgAgentStatus[]
}

export interface OrgAgentStatus {
  username: string
  name: string
  role: string
  status: 'idle' | 'working' | 'blocked' | 'reviewing'
  currentTask?: string
  lastActive: string
}
