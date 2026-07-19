/**
 * Self-edit gate + path denylist — browser-safe.
 *
 * "Self-edit" is the dev-mode capability whereby the running agent edits its
 * own source (UI, agent code, plugins, even `node_modules` and the `eliza/`
 * submodule) and then triggers a restart so the new code is picked up on the
 * next boot. It is strictly a developer affordance — never enabled in a
 * packaged production build.
 *
 * This module exposes two pure helpers:
 *   - {@link isSelfEditEnabled} — env-gate that consumers call before running
 *     any self-edit code path. Returns `true` only when the operator has
 *     opted in *and* the process is not a production build.
 *   - {@link isSelfEditPathDenied} — refuses to let the self-edit flow modify
 *     the gate itself, the restart machinery, or anything inside `.git/`.
 *     Defense in depth so a buggy or adversarial sub-agent cannot remove its
 *     own safety rails and ship a build that self-edits in production.
 *
 * Both functions are pure (env / string in → boolean out) and use no
 * node-only APIs, so this module can be imported anywhere `@elizaos/shared`
 * is consumed (browser, agent runtime, CLI).
 *
 * @module self-edit
 */
/**
 * Env var the operator sets to opt in to self-edit. Defaults off.
 */
export declare const SELF_EDIT_ENABLE_ENV = "ELIZA_ENABLE_SELF_EDIT";
/**
 * Env var that, when truthy, marks the process as a developer-mode runtime
 * (in addition to / as an alternative to `NODE_ENV !== "production"`).
 */
export declare const DEV_MODE_ENV = "ELIZA_DEV_MODE";
/**
 * Predicate: is self-edit enabled for the current process?
 *
 * Returns `true` only when **all** of the following hold:
 *   1. `ELIZA_ENABLE_SELF_EDIT` is truthy (explicit operator opt-in).
 *   2. The process is not a production build, i.e. `NODE_ENV !== "production"`
 *      OR `ELIZA_DEV_MODE` is truthy. Either signal flips the gate on.
 *
 * The function is pure: pass an env snapshot for tests, default reads
 * `process.env`.
 */
export declare function isSelfEditEnabled(env?: NodeJS.ProcessEnv | Record<string, string | undefined>): boolean;
/**
 * Predicate: is `absolutePath` denied for self-edit modification?
 *
 * Refuses any path that:
 *   - contains a `.git` directory segment (any operation under any git
 *     metadata directory), or
 *   - ends with one of the {@link DENIED_RELATIVE_SUFFIXES} (the self-edit
 *     gate, restart machinery, or runner script).
 *
 * Returns `false` for empty / non-string input rather than throwing — callers
 * decide how to handle malformed input.
 */
export declare function isSelfEditPathDenied(absolutePath: string): boolean;
/**
 * The denied repo-relative suffixes, exposed for tests and tooling that
 * want to surface the denylist (e.g. UI banners, audit logs).
 */
export declare function getSelfEditDeniedSuffixes(): readonly string[];
//# sourceMappingURL=self-edit.d.ts.map