import type { Action } from "../../../../types/index.js";
declare const CHARACTER_OPS: readonly ["modify", "persist", "update_identity"];
type CharacterOp = (typeof CHARACTER_OPS)[number];
/**
 * Per-operation minimum role for CHARACTER (#12087 Item 17). The action's
 * declared `roleGate: { minRole: "ADMIN" }` is the coarse floor enforced by
 * canActionRun before the handler runs; this map is the single, visible source
 * of truth for the finer per-op requirement the handler enforces (renaming the
 * agent / replacing its system prompt via `update_identity` requires OWNER, not
 * just ADMIN), instead of scattering inline `hasRoleAccess` checks that leave
 * the OWNER requirement invisible in the action metadata.
 */
export declare const CHARACTER_OP_ACCESS: Record<CharacterOp, {
    minRole: "ADMIN" | "OWNER";
    denyMessage: string;
}>;
export declare const characterAction: Action;
export {};
//# sourceMappingURL=character.d.ts.map