/**
 * Helper that promotes the actions of an umbrella `Action` to virtual
 * top-level Actions. Each virtual action is named `<UMBRELLA>_<SUBACTION>`
 * and delegates to the parent's handler with the discriminator value injected
 * into the parameters before dispatch.
 *
 * The parent umbrella stays registered alongside its virtuals so the planner
 * can still pick the umbrella directly with custom params. The helper also
 * records the virtuals on `parent.subActions`, so retrieval can index their
 * names/examples under the parent instead of ranking every virtual as an
 * unrelated top-level action.
 */
import type { Action, ActionExample, ActionParameter } from "../types/index.js";
export interface SubactionPromotionOverrides {
    /** Override the virtual action's description. */
    description?: string;
    /**
     * Set the virtual action's compressed description — the short one-line
     * blurb the planner sees in tier-A / tier-B summaries. When unset, the
     * virtual has none and consumers fall back to its composed per-subaction
     * `description`; the parent's keyword-stuffed `descriptionCompressed` is
     * never inherited (duplicating it across every virtual floods the
     * planner's tool payload).
     */
    descriptionCompressed?: string;
    /** Add similes specific to this virtual subaction. */
    similes?: readonly string[];
    /** Filter / replace examples used for the virtual. */
    examples?: ActionExample[][];
}
export interface PromoteSubactionsOptions {
    /**
     * Per-subaction overrides keyed by the subaction value (lowercased
     * canonical form, e.g. `list`, `create`).
     */
    overrides?: Record<string, SubactionPromotionOverrides>;
    /**
     * Optional name prefix override. Defaults to `parent.name`. Use this if
     * the virtual `<PARENT>_<SUB>` would collide with an existing top-level
     * action — e.g. pass `"LIFEOPS_MESSAGE"` if `MESSAGE_SEND` already exists
     * elsewhere.
     */
    namePrefix?: string;
    /**
     * When true, the parent's `examples` are passed straight through to each
     * virtual instead of being filtered. Useful for umbrellas whose examples
     * already exercise multiple subactions.
     */
    shareParentExamples?: boolean;
}
/**
 * Returns the list of subaction string values declared by an umbrella's
 * `action` parameter (or one of the legacy aliases). The lookup is purely
 * structural: it inspects the JSON Schema enum on the parameter named
 * `action` / `subaction` / `op` / `operation` / `verb`. Returns an empty array
 * if no enum is found.
 */
export declare function listSubactionsFromParameters(parameters: readonly ActionParameter[] | undefined): readonly string[];
/**
 * Promote each subaction of an umbrella action to a virtual top-level Action.
 *
 * Returns `[parent, ...virtuals]`. The parent stays at index 0 so callers can
 * safely spread the result into a plugin's `actions: [...]` array. The parent
 * is annotated with the virtual names as `subActions`; virtual actions inject
 * the parent's structural discriminator into `options.parameters` before
 * delegating to the parent's handler.
 *
 * Calling this function twice on the same parent is idempotent: the second
 * call returns a freshly-built but structurally identical set of virtuals.
 */
export declare function promoteSubactionsToActions(parent: Action, options?: PromoteSubactionsOptions): readonly Action[];
/**
 * Returns true if the given action was produced by
 * {@link promoteSubactionsToActions}. Used by tests and tooling.
 */
export declare function isPromotedSubactionVirtual(action: Action): boolean;
//# sourceMappingURL=promote-subactions.d.ts.map