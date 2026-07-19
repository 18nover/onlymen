/**
 * Lightweight locale detection for the planner's `localizedExamples` wiring.
 *
 * This helper exists for one job: turn an arbitrary recent user message into
 * a best-guess locale tag when the canonical source (`OwnerFactStore.locale`)
 * isn't populated yet. It is *not* a general-purpose language identifier —
 * it favours simple character-set + common-word checks that run synchronously
 * with no LLM calls.
 *
 * Priority order applied by `resolveOwnerLocale`:
 *   1. `ownerLocale` (canonical, when the owner has set it)
 *   2. `detectLocaleFromText(recentMessage)` (heuristic on most-recent message)
 *   3. `defaultLocale` (caller-provided, defaults to `"en"`)
 */
/**
 * BCP-47-ish locale tag the catalog and registry agree on. We intentionally
 * keep the surface narrow to the locales we actually translate for; callers
 * that need more freedom can pass any string and it will pass through.
 */
export type SupportedLocale = "en" | "es" | "fr" | "ja" | "zh-Hans";
/**
 * Returns the best-guess locale for `text`, or `null` when the heuristic has
 * no signal. Empty / whitespace input → `null`.
 */
export declare function detectLocaleFromText(text: string | null | undefined): SupportedLocale | string | null;
export interface ResolveOwnerLocaleOptions {
    /** Canonical locale from `OwnerFactStore.locale`. Wins when present. */
    ownerLocale?: string | null;
    /** Most-recent user message used as the heuristic fallback. */
    recentMessage?: string | null;
    /** Caller-provided default. Defaults to `"en"` when omitted. */
    defaultLocale?: string;
}
/**
 * Apply the priority order and return a non-empty locale string.
 * Never returns `""` or `null` — the resolver always has *some* locale to
 * key the registry by; callers that need an absent-locale signal should
 * compare against `defaultLocale` themselves.
 */
export declare function resolveOwnerLocale(opts: ResolveOwnerLocaleOptions): string;
//# sourceMappingURL=locale-detection.d.ts.map