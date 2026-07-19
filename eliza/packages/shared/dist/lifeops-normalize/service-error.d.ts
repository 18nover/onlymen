/**
 * Canonical LifeOps service error (runtime-level primitive).
 *
 * A status-carrying Error thrown by the LifeOps normalize/validation
 * primitives. Self-contained; no DB, no plugin imports. Consumed by
 * `@elizaos/plugin-personal-assistant`, which keeps a re-export at
 * `lifeops/service-types.ts` for historical import paths.
 */
export declare class LifeOpsServiceError extends Error {
    readonly status: number;
    readonly code?: string | undefined;
    constructor(status: number, message: string, code?: string | undefined);
}
//# sourceMappingURL=service-error.d.ts.map