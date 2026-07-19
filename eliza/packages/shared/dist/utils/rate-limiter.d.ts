/**
 * Generic in-memory rate limiter with automatic sweep.
 *
 * Consolidates the per-IP rate limiting pattern from
 * `@elizaos/plugin-wallet/lib/wallet-export-guard` and the pairing attempt
 * limiter in `server.ts`.
 */
export interface RateLimiterOptions {
    /** Time window in milliseconds. An action is blocked if the last allowed
     *  action for the same key happened less than `windowMs` ago. */
    windowMs: number;
    /** How often (ms) to sweep stale entries. Defaults to `windowMs * 1.5`. */
    sweepIntervalMs?: number;
}
export interface RateLimitCheck {
    /** `true` if the action is allowed. */
    allowed: boolean;
    /** Seconds until the action would be allowed again (0 when allowed). */
    retryAfterSeconds: number;
}
export interface RateLimiter {
    /** Check *and* record an action for `key`. */
    check(key: string): RateLimitCheck;
    /** Peek without recording — returns the same shape but doesn't consume. */
    peek(key: string): RateLimitCheck;
    /** Remove all tracked keys. */
    clear(): void;
    /** Stop the background sweep timer (for clean shutdown / tests). */
    dispose(): void;
}
export declare function createRateLimiter(opts: RateLimiterOptions): RateLimiter;
//# sourceMappingURL=rate-limiter.d.ts.map