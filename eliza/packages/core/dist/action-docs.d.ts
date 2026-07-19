/**
 * Merges canonical, spec-generated capability docs (`generated/action-docs.ts`)
 * into runtime `Action` / `Provider` definitions so the prompt-facing docs are
 * complete for every registered capability. The merge is additive and
 * conservative: it never overwrites an existing description, similes, or
 * parameters, and it always fills `descriptionCompressed` (and the
 * parameter-level compressed descriptions) via `compressPromptDescription` —
 * matching Python's `compress_prompt_description` — so prompt compression is on
 * even for plugins that ship no canonical spec row.
 */
import type { Action, Provider } from "./types/index.js";
/**
 * Merge canonical docs (description/similes/parameters) into an action definition.
 *
 * This is additive and intentionally conservative:
 * - does not overwrite an existing action.description
 * - does not overwrite existing action.similes
 * - does not overwrite existing action.parameters
 *
 * Always fills `descriptionCompressed` (and parameter-level compressed descriptions)
 * when absent, matching Python `compress_prompt_description` so prompt compression
 * is on for every registered action — including plugins with no canonical spec row.
 */
export declare function withCanonicalActionDocs(action: Action): Action;
export declare function withCanonicalActionDocsAll(actions: readonly Action[]): Action[];
export declare function withCanonicalProviderDocs(provider: Provider): Provider;
export declare function withCanonicalProviderDocsAll(providers: readonly Provider[]): Provider[];
//# sourceMappingURL=action-docs.d.ts.map