/**
 * View kinds — the four-tier categorization every view-like surface is sorted
 * into so the shell can decide what to show by build and by user preference.
 *
 *  - `system`    — core views that are always present (chat, settings, …). Not
 *                  toggleable; always visible on every build.
 *  - `release`   — public, production-ready views meant for everyone. Always
 *                  visible on every build.
 *  - `developer` — developer-only tooling (logs, database, trajectory viewer)
 *                  so devs can verify the app is working. Hidden by default on
 *                  every build — dev builds included — until enabled in
 *                  Settings; there is no build-variant bypass.
 *  - `preview`   — unfinished / alpha / experimental views. Hidden by default
 *                  on every build until enabled in Settings.
 *
 * The taxonomy lives in `@elizaos/core` so the agent server (view registry,
 * built-in views) and every front-end (the dashboard shell, the view manager,
 * settings) share one definition. The *enabled* set is owned by the client —
 * which kinds are on follows the user's persisted Settings toggles, which the
 * server can't know.
 */
/** The four view kinds, in escalating "exposure" order. */
export declare const VIEW_KINDS: readonly ["system", "release", "developer", "preview"];
/** A view's category. See {@link VIEW_KINDS}. */
export type ViewKind = (typeof VIEW_KINDS)[number];
/**
 * The two user-controllable toggles. `system` and `release` are always on, so
 * they are not represented here.
 */
export interface EnabledViewKinds {
    /** Show `developer`-kind views. Default: off on every build. */
    developer: boolean;
    /** Show `preview`-kind views. Default: off on every build. */
    preview: boolean;
}
/** A declaration that can be sorted into a {@link ViewKind}. */
export interface ViewKindBearer {
    /** Explicit kind. When set, it wins over the legacy `developerOnly` flag. */
    viewKind?: ViewKind;
    /**
     * Legacy gate predating {@link viewKind}. `true` is equivalent to
     * `viewKind: "developer"`. Kept so existing declarations keep working.
     */
    developerOnly?: boolean;
}
/**
 * Resolve the effective kind of a view-like declaration. Explicit `viewKind`
 * wins; a legacy `developerOnly: true` maps to `"developer"`; everything else
 * defaults to `"release"` (public). `"system"` is always explicit — a view is
 * never silently promoted to always-on.
 */
export declare function resolveViewKind(decl: ViewKindBearer | null | undefined): ViewKind;
/**
 * Whether a given kind is visible under the current enabled set. `system` and
 * `release` are always visible; `developer` and `preview` follow their toggles.
 */
export declare function isViewKindEnabled(kind: ViewKind, enabled: EnabledViewKinds): boolean;
/**
 * Whether a view-like declaration is visible under the current enabled set.
 * Combines {@link resolveViewKind} + {@link isViewKindEnabled} — the single
 * predicate every visibility filter should call.
 */
export declare function isViewVisible(decl: ViewKindBearer | null | undefined, enabled: EnabledViewKinds): boolean;
/** Whether a kind is always on (not user-toggleable). */
export declare function isAlwaysOnViewKind(kind: ViewKind): boolean;
/** Presentation metadata for each kind — labels/descriptions for Settings. */
export declare const VIEW_KIND_META: Record<ViewKind, {
    label: string;
    description: string;
    alwaysOn: boolean;
}>;
//# sourceMappingURL=view-kind.d.ts.map