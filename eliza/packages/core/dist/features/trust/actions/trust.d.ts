/**
 * @module features/trust/actions/trust
 *
 * Unified TRUST umbrella action. The discriminator parameter `action` selects
 * one of:
 *   - `evaluate` — read a trust profile for an entity
 *   - `record_interaction` — log a trust-affecting interaction
 *   - `request_elevation` — request temporary permission elevation
 *   - `update_role` — change an entity's role in the world (admin/owner/none)
 *
 * Legacy discriminator aliases (`subaction`, `op`, `operation`) are also
 * accepted as input. Each subaction's behavior lives in a sibling handler
 * file as a plain function; this file is pure dispatch.
 *
 * The umbrella is registered alongside its virtual top-level subactions via
 * `promoteSubactionsToActions(trustAction)`.
 */
import type { Action } from "../../../types/components.js";
export type TrustSubaction = "evaluate" | "record_interaction" | "request_elevation" | "update_role";
export declare const trustAction: Action;
//# sourceMappingURL=trust.d.ts.map