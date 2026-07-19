/**
 * Data module for the personality capability: the built-in named profiles that
 * `PersonalityStore` registers on startup and that admins can load into the
 * global slot via the PERSONALITY action.
 */
import type { PersonalityProfile } from "../types.js";
/**
 * Bundled named global personality profiles. Admins can `load_profile` any
 * of these via the PERSONALITY action to replace the active global slot.
 *
 * `default` is intentionally all-nulls so loading it restores the agent's
 * character.json baseline behavior (no global overrides).
 */
export declare const defaultProfiles: PersonalityProfile[];
//# sourceMappingURL=index.d.ts.map