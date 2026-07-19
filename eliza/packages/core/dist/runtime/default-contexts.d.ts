/**
 * First-party context taxonomy for elizaOS v5 native tool calling.
 *
 * The taxonomy follows research/native-tool-calling/PLAN.md §4.3.
 *
 * Each definition declares:
 * - id: stable lowercase context id (matches FirstPartyAgentContext)
 * - label: human-readable label shown in prompts and UI
 * - description: short purpose statement included in the Stage 1 prompt
 * - descriptionCompressed: optional one-clause routing hint rendered in the
 *   compact Stage-1 catalogs (DM / unaddressed group-triage tiers) for ids
 *   whose bare name is ambiguous
 * - sensitivity: data sensitivity tier (public/personal/private/system)
 * - cacheScope: how long context-derived providers may be cached
 * - roleGate: minimum sender role required (PLAN §4.3 column "Gate")
 * - aliases: legacy strings that should resolve to this id
 * - parents/subcontexts: the v5 taxonomy graph
 *
 * The default registration is intended to be byte-identical across runtime
 * boots, so that the Stage 1 prompt prefix stays cache-stable.
 */
import type { ContextDefinition } from "../types/contexts.js";
export declare const DEFAULT_CONTEXT_DEFINITIONS: readonly ContextDefinition[];
/**
 * Return the canonical default context registration, frozen so callers cannot
 * mutate the shared array. The order is stable and deterministic, which is
 * required for cache-stable Stage 1 prompt prefixes.
 */
export declare function getDefaultContextDefinitions(): readonly ContextDefinition[];
//# sourceMappingURL=default-contexts.d.ts.map