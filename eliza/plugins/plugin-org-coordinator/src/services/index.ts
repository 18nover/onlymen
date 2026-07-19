/**
 * elizaOS Service wrapper for the org coordination store. Boot hydrates the
 * singleton from the runtime's DB-backed cache and installs a write-through
 * persistence hook, so the task/review/blocker board survives restarts.
 */
import { Service, type IAgentRuntime } from '@elizaos/core'
import type { OrgCoordinationState } from '../types/index.ts'
import { OrgCoordinationService } from './coordination.ts'

const STATE_CACHE_KEY = 'org-coordination:state:v1'

export class OrgCoordinationServiceRuntime extends Service {
  static serviceType = 'org_coordination'
  static allowsMultiple = false
  capabilityDescription = 'Manages agent coordination, task assignment, reviews, and blockers for the NottyBoi engineering organization'
  private coordinationService: OrgCoordinationService

  constructor(runtime?: IAgentRuntime) {
    super(runtime)
    this.coordinationService = OrgCoordinationService.getInstance()
  }

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new OrgCoordinationServiceRuntime(runtime)
    const persisted = await runtime.getCache<OrgCoordinationState>(STATE_CACHE_KEY)
    service.coordinationService.attachPersistence(persisted, (state) => {
      runtime.setCache(STATE_CACHE_KEY, state).catch((error: unknown) => {
        // error-policy:J7 board writes are diagnostics-adjacent background
        // persistence; a failed write must not kill the message loop, but it
        // must surface to the agent/owner instead of silently dropping state.
        runtime.reportError('OrgCoordinationService.persist', error, {
          cacheKey: STATE_CACHE_KEY,
        })
      })
    })
    return service
  }

  async stop(): Promise<void> {
    // State is write-through persisted; nothing to flush on shutdown.
  }

  getCoordinationService(): OrgCoordinationService {
    return this.coordinationService
  }
}
