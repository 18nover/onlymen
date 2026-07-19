/**
 * Generic in-memory rate limiter with automatic sweep.
 *
 * Consolidates the per-IP rate limiting pattern from
 * `@elizaos/plugin-wallet/lib/wallet-export-guard` and the pairing attempt
 * limiter in `server.ts`.
 */
export function createRateLimiter(opts) {
    const { windowMs } = opts;
    const sweepIntervalMs = opts.sweepIntervalMs ?? Math.ceil(windowMs * 1.5);
    const map = new Map(); // key → lastActionAt
    const sweepTimer = setInterval(() => {
        const cutoff = Date.now() - windowMs * 2;
        for (const [key, ts] of map) {
            if (ts < cutoff)
                map.delete(key);
        }
    }, sweepIntervalMs);
    // Allow the process to exit without this timer holding it
    if (typeof sweepTimer === "object" && "unref" in sweepTimer) {
        sweepTimer.unref();
    }
    function peekImpl(key) {
        const last = map.get(key);
        if (last === undefined)
            return { allowed: true, retryAfterSeconds: 0 };
        const elapsed = Date.now() - last;
        if (elapsed >= windowMs)
            return { allowed: true, retryAfterSeconds: 0 };
        return {
            allowed: false,
            retryAfterSeconds: Math.ceil((windowMs - elapsed) / 1000),
        };
    }
    return {
        check(key) {
            const result = peekImpl(key);
            if (result.allowed) {
                map.set(key, Date.now());
            }
            return result;
        },
        peek: peekImpl,
        clear() {
            map.clear();
        },
        dispose() {
            clearInterval(sweepTimer);
            map.clear();
        },
    };
}
//# sourceMappingURL=rate-limiter.js.map