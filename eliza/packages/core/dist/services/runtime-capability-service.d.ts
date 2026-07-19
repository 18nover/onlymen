/**
 * RuntimeCapabilityService — the single owner of
 * {@link CAPABILITY_ROUTER_SERVICE_TYPE}.
 *
 * P0 step 6/6 of the Plugin/mode unification (see architecture-review v3).
 *
 * This file replaces the historical trio of competing capability routers:
 *
 * - `RuntimeBrokerCapabilityRouter` (a bare class in
 *   `packages/core/src/capabilities/index.ts` — see {@link
 *   RuntimeBrokerCapabilityRouter})
 * - `RemoteCapabilityRouterService` (the `Service` subclass in
 *   `packages/agent/src/services/remote-capability-router.ts`)
 * - the parallel `E2BRemoteCapabilityRouterService` from PR #7779
 *
 * Each registered against the same {@link CAPABILITY_ROUTER_SERVICE_TYPE}
 * slot, and the routing strategy (local vs. remote vs. cloud-sandbox) was
 * encoded by *which Service got registered first* — a fragile arrangement
 * that this class collapses into a single Service whose **strategy table**
 * is the explicit routing decision.
 *
 * The strategies (`LocalPluginStrategy`, `HttpEndpointStrategy`,
 * `CompositeStrategy`, `UnavailableStrategy`) materialise in subsequent
 * P0 follow-ups; P0 ships this shell with the canonical type surface so
 * downstream consumers can begin migrating to
 * `runtime.getService(CAPABILITY_ROUTER_SERVICE_TYPE)` semantics without
 * caring whether the underlying dispatch is local-RemotePlugin or remote-HTTP.
 *
 * The router classes named above remain in the tree during P0; P1 deletes
 * them and folds their dispatch logic into the strategies declared below.
 */
import { type CapabilityAvailability, type CapabilityEnvironment, type ElizaCapabilityRouter, type FileCapability, type GitCapability, type LocalModelCapability, type RemotePluginCapability, type TerminalCapability } from "../capabilities/index.js";
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
/**
 * Routing strategy interface. Each strategy decides how to dispatch a
 * capability invocation: locally (via a remote-mode plugin running in the
 * host process) or remotely (via HTTPS to a `remote-plugin-host` container,
 * an e2b sandbox, or another paired user device).
 *
 * Strategies are an internal implementation detail of
 * {@link RuntimeCapabilityService}; external callers only see the
 * {@link ElizaCapabilityRouter} surface.
 */
export interface CapabilityStrategy {
    readonly id: string;
    readonly environment: CapabilityEnvironment;
    availability(): Promise<CapabilityAvailability>;
    readonly fs?: FileCapability;
    readonly pty?: TerminalCapability;
    readonly git?: GitCapability;
    readonly model?: LocalModelCapability;
    readonly plugin?: RemotePluginCapability;
}
/**
 * Options for constructing a {@link RuntimeCapabilityService}. P0 accepts a
 * single fallback router so the service can co-exist with the existing
 * `RuntimeBrokerCapabilityRouter` and `RemoteCapabilityRouterService` while
 * P1 implements the strategy table. P1 will replace `fallback` with
 * `strategies: CapabilityStrategy[]`.
 */
export interface RuntimeCapabilityServiceOptions {
    /**
     * Strategy table keyed by capability dispatcher. The first matching
     * strategy wins per capability invocation. Empty in P0 (set in P1+).
     */
    strategies?: CapabilityStrategy[];
    /**
     * Fallback router used when no strategy matches. Defaults to
     * {@link UnavailableCapabilityRouter}. Existing
     * `RuntimeBrokerCapabilityRouter` instances may be passed here during
     * the P0→P1 transition.
     */
    fallback?: ElizaCapabilityRouter;
}
/**
 * Service that owns the {@link CAPABILITY_ROUTER_SERVICE_TYPE} slot. P0
 * ships the canonical class with a fallback-router delegate; P1+ wires up
 * the strategy table and deletes the legacy
 * `RuntimeBrokerCapabilityRouter` standalone class plus the duplicate
 * `RemoteCapabilityRouterService` Service.
 *
 * Usage:
 *
 * ```ts
 * const svc = runtime.getService(CAPABILITY_ROUTER_SERVICE_TYPE);
 * if (svc) {
 *   const availability = await svc.availability();
 *   // capability dispatch via svc.fs / .pty / .git / .model / .plugin
 * }
 * ```
 */
export declare class RuntimeCapabilityService extends Service implements ElizaCapabilityRouter {
    static serviceType: "capability-router";
    capabilityDescription: string;
    private strategies;
    private fallback;
    constructor(runtime: IAgentRuntime, options?: RuntimeCapabilityServiceOptions);
    static start(runtime: IAgentRuntime): Promise<RuntimeCapabilityService>;
    stop(): Promise<void>;
    get environment(): CapabilityEnvironment;
    availability(): Promise<CapabilityAvailability>;
    get fs(): FileCapability;
    get pty(): TerminalCapability;
    get git(): GitCapability;
    get model(): LocalModelCapability;
    get plugin(): RemotePluginCapability;
    /**
     * Replace the strategy table at runtime. Used during P1 when the
     * RemotePluginHost discovers a new capability-providing remote plugin
     * (e.g. agent-installed `eliza.fs`) and registers it as a strategy.
     */
    setStrategies(strategies: CapabilityStrategy[]): void;
    /** Replace the fallback router. */
    setFallback(fallback: ElizaCapabilityRouter): void;
    private pickStrategy;
}
//# sourceMappingURL=runtime-capability-service.d.ts.map