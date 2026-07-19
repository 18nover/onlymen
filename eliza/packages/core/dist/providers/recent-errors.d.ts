/**
 * Surfaces recent runtime failures reported via `runtime.reportError` into the
 * agent's prompt (#12263 / parent #12182).
 *
 * Failures outside the action path (providers, services, background jobs, event
 * handlers) do not otherwise reach the model. This provider reads the runtime's
 * in-memory reported-error ring, dedupes by `code`, ages out stale entries, caps
 * the list, and appends a short instruction so the agent can attempt a fix or
 * tell the owner. It renders nothing (and costs no prompt tokens) when there are
 * no recent errors — no prompt bloat on the healthy path.
 */
import type { Provider } from "../types/index.js";
/**
 * RECENT_ERRORS — injects deduped, aged-out recent runtime failures into the
 * agent context so the agent can react to problems outside the action path.
 */
export declare const recentErrorsProvider: Provider;
//# sourceMappingURL=recent-errors.d.ts.map