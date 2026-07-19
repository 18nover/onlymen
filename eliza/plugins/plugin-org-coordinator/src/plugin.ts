/**
 * NottyBoi Engineering Organization coordination plugin. Registers the
 * coordination service plus the actions and providers that let org agents
 * assign work, request reviews, escalate blockers, and report status.
 */
import { logger, type Plugin } from '@elizaos/core'
import { requestReviewAction, assignWorkAction, escalateAction, reportCompleteAction, summarizeAction } from './actions/index.ts'
import { orgStatusProvider, reviewQueueProvider, projectContextProvider } from './providers/index.ts'
import { orgRoutes } from './routes/index.ts'
import { OrgCoordinationServiceRuntime } from './services/index.ts'

export const orgCoordinatorPlugin: Plugin = {
  name: 'plugin-org-coordinator',
  description: 'NottyBoi Engineering Organization coordination plugin. Manages task assignment, reviews, blockers, and inter-agent communication.',
  actions: [
    requestReviewAction,
    assignWorkAction,
    escalateAction,
    reportCompleteAction,
    summarizeAction,
  ],
  providers: [
    orgStatusProvider,
    reviewQueueProvider,
    projectContextProvider,
  ],
  services: [OrgCoordinationServiceRuntime],
  routes: orgRoutes,
  init: async () => {
    logger.info('[OrgCoordinator] Plugin initialized')
  },
  dispose: async () => {
    logger.info('[OrgCoordinator] Plugin disposed')
  },
}

export default orgCoordinatorPlugin
