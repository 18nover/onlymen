/**
 * Sub-action dispatch for umbrella (parent) actions. Reads a discriminator
 * parameter — the canonical `action` key or a legacy alias — normalizes it, and
 * routes to the matching handler in a sub-action map, returning an
 * `UNKNOWN_SUBACTION` `ActionResult` when the operation is missing or unknown.
 * Lets one planner-visible parent action fan out to many second-level operations.
 */
import type { ActionResult } from "../types/index.js";
export type SubactionParameters = Record<string, unknown> | undefined;
export type SubactionHandler<TContext = void> = (context: TContext) => ActionResult | Promise<ActionResult>;
export type SubactionHandlerMap<TSubaction extends string, TContext = void> = {
    [key in TSubaction]: SubactionHandler<TContext>;
};
/**
 * Canonical project-wide discriminator field name for umbrella actions.
 *
 * The canonical discriminator name is `action`. The legacy names `subaction`,
 * `op`, `operation`, and `verb` remain accepted as input aliases so cached
 * planner outputs do not break.
 *
 * Some existing parents already use `action` for a second-level choice
 * (`TASKS` uses `subaction=control` and `action=pause`, for example). Those
 * parents should keep their legacy discriminator until the nested field can be
 * renamed; promotion helpers avoid overwriting a declared nested `action`
 * parameter for this reason.
 */
export declare const CANONICAL_SUBACTION_KEY: "action";
export declare const LEGACY_SUBACTION_KEYS: readonly string[];
/**
 * Default ordered list of parameter keys that {@link readSubaction} consults
 * when an umbrella's handler resolves the requested operation. The canonical
 * key is consulted first; legacy aliases follow.
 */
export declare const DEFAULT_SUBACTION_KEYS: readonly string[];
export declare function normalizeSubaction(value: unknown): string | undefined;
export declare function readSubaction<TSubaction extends string>(parameters: SubactionParameters, options: {
    allowed: readonly TSubaction[];
    keys?: readonly string[];
    aliases?: Partial<Record<string, TSubaction>>;
    defaultValue?: TSubaction;
}): TSubaction | undefined;
export declare function dispatchSubaction<TSubaction extends string, TContext>(subaction: TSubaction | undefined, handlers: SubactionHandlerMap<TSubaction, TContext>, context: TContext): Promise<ActionResult>;
//# sourceMappingURL=subaction-dispatch.d.ts.map