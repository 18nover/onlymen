import type { Provider, IAgentRuntime, Memory, State, ProviderResult } from '@elizaos/core'
import { OrgCoordinationService } from '../services/coordination.ts'

export const orgStatusProvider: Provider = {
  name: 'ORG_STATUS',
  description: 'Provides current organization status: tasks, blockers, agent availability',
  position: 0,
  get: async (_runtime: IAgentRuntime, _message: Memory, _state: State): Promise<ProviderResult> => {
    const service = OrgCoordinationService.getInstance()
    const summary = service.getOrgSummary()
    const agentStatuses = service.getAgentStatuses()

    const text = [
      '## Organization Status',
      `Tasks: ${summary.totalTasks} total | ${summary.agentsWorking} in progress | ${summary.agentsBlocked} blocked`,
      `Blockers: ${summary.activeBlockers} active | Reviews: ${summary.pendingReviews} pending`,
      '',
      '**Agent Status:**',
      ...agentStatuses.map(a => `- ${a.username}: ${a.status}${a.currentTask ? ` (${a.currentTask})` : ''}`),
    ].join('\n')

    return { text }
  },
}

export const reviewQueueProvider: Provider = {
  name: 'REVIEW_QUEUE',
  description: 'Shows pending reviews assigned to this agent',
  position: 1,
  get: async (runtime: IAgentRuntime, _message: Memory, _state: State): Promise<ProviderResult> => {
    const service = OrgCoordinationService.getInstance()
    const agentUsername = runtime.character?.username || 'unknown'
    const pendingReviews = service.getPendingReviewsForAgent(agentUsername)

    if (pendingReviews.length === 0) {
      return { text: 'No pending reviews.' }
    }

    const text = [
      '**Pending Reviews:**',
      ...pendingReviews.map(r => `- ${r.id}: ${r.type} for task ${r.taskId}`),
    ].join('\n')

    return { text }
  },
}

export const projectContextProvider: Provider = {
  name: 'PROJECT_CONTEXT',
  description: 'Provides NottyBoi project context and repository structure',
  position: 2,
  get: async (_runtime: IAgentRuntime, _message: Memory, _state: State): Promise<ProviderResult> => {
    const text = [
      '## NottyBoi Project Context',
      '',
      '**Repositories:**',
      '- `app/` — Bluesky Social App fork (React Native + Expo)',
      '- `atproto/` — AT Protocol implementation (TypeScript)',
      '- `eliza/` — ElizaOS runtime (agent framework)',
      '- `org/` — This AI engineering organization',
      '',
      '**Tech Stack:**',
      '- Frontend: React Native 0.81, Expo SDK 54, TypeScript',
      '- Backend: AT Protocol (PDS, AppView), PostgreSQL, Redis',
      '- DevOps: Docker, EAS, GitHub Actions',
      '- AI: ElizaOS, Ollama (local models)',
      '',
      '**Key Paths:**',
      '- `app/src/screens/` — App screens',
      '- `app/src/components/` — UI components',
      '- `atproto/packages/` — AT Protocol packages',
      '- `atproto/lexicons/` — Protocol definitions',
    ].join('\n')

    return { text }
  },
}
