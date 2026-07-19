/**
 * Per-model-type user override: "for TEXT_LARGE, prefer this provider".
 *
 * Persisted to `$STATE_DIR/local-inference/routing.json` and read by the
 * router-handler (see `router-handler.ts`) to pick a provider at dispatch
 * time. When a slot has no override, the runtime's native priority order
 * wins — i.e. this is layered over the existing registration priority
 * rather than replacing it.
 */
import type { AgentModelSlot } from "./types.js";
export type RoutingPolicy = "manual" | "auto" | "local-only" | "cloud-only" | "cheapest" | "fastest" | "prefer-local" | "round-robin";
/**
 * The full set of selectable policies, in display order. Kept as a runtime
 * value (not just a type) so route-layer validation and the settings UI share
 * one source of truth for "which policies are accepted".
 *
 * `local-only` / `cloud-only` are the canonical per-slot replacements for the
 * global `ELIZA_LOCAL_ONLY` env hack: `local-only` is a hard guarantee (never
 * falls through to cloud), `cloud-only` never dispatches on-device.
 */
export declare const ROUTING_POLICIES: readonly RoutingPolicy[];
export declare function isRoutingPolicy(value: unknown): value is RoutingPolicy;
export declare const DEFAULT_ROUTING_POLICY: RoutingPolicy;
export interface RoutingPreferences {
    /**
     * Explicit provider override per agent slot. Empty record = no overrides,
     * runtime picks the highest-priority registered handler.
     */
    preferredProvider: Partial<Record<AgentModelSlot, string>>;
    /**
     * Per-slot policy. "manual" honours `preferredProvider` verbatim;
     * everything else lets the router-handler compute a winner from the
     * policy rule set. Absent = "prefer-local" so local models and
     * subscriptions are tried before direct paid APIs and managed cloud.
     */
    policy: Partial<Record<AgentModelSlot, RoutingPolicy>>;
}
export declare function readRoutingPreferences(): Promise<RoutingPreferences>;
export declare function writeRoutingPreferences(prefs: RoutingPreferences): Promise<void>;
export declare function setPreferredProvider(slot: AgentModelSlot, provider: string | null): Promise<RoutingPreferences>;
export declare function setPolicy(slot: AgentModelSlot, policy: RoutingPolicy | null): Promise<RoutingPreferences>;
//# sourceMappingURL=routing-preferences.d.ts.map