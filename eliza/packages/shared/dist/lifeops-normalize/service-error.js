/**
 * Canonical LifeOps service error (runtime-level primitive).
 *
 * A status-carrying Error thrown by the LifeOps normalize/validation
 * primitives. Self-contained; no DB, no plugin imports. Consumed by
 * `@elizaos/plugin-personal-assistant`, which keeps a re-export at
 * `lifeops/service-types.ts` for historical import paths.
 */
export class LifeOpsServiceError extends Error {
    status;
    code;
    constructor(status, message, code) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = "LifeOpsServiceError";
    }
}
//# sourceMappingURL=service-error.js.map