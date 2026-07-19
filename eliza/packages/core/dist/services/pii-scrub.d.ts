/**
 * Long-lived singleton that owns the async PII scrub job rails (#14808).
 *
 * This is the LOCAL-lane execution substrate for the corpus PII scrub. It is a
 * 1:1 structural mirror of {@link EmbeddingGenerationService}
 * (`packages/core/src/services/embedding.ts`): it listens for a trigger event
 * (`PII_SCRUB_REQUESTED`, like `EMBEDDING_GENERATION_REQUESTED`), drains a
 * priority `BatchQueue` (`packages/core/src/utils/batch-queue.ts`) on the core
 * task scheduler, and processes each item without ever blocking an agent turn.
 * No new scheduler, no new queue - the rails already exist in-repo.
 *
 * Per item it:
 *   1. Computes the content-addressed done-marker
 *      `pii:<sha256(content)>:v<rulesetVersion>` and SKIPS if already present
 *      (idempotency: a re-scrub of unchanged content is a no-op - zero model
 *      calls, zero duplicate writes). This is what makes crash-and-rerun safe
 *      with zero cursor state.
 *   2. Escalates through the merged seam
 *      (`scrubWithEscalation`, #14980/#14809): tier-0 deterministic detectors
 *      run first (free, no model call); only residue candidates hit the
 *      `PII_SCRUB` model with `priority: "background"` so the scrub never
 *      preempts an interactive turn. The seam is fail-closed - un-inspectable
 *      residue throws, which routes the item through `onExhausted` / retry and
 *      the done-marker is NOT written (the item stays quarantined, never
 *      silently passed as clean).
 *   3. Writes the done-marker ONLY after a successful scrub, then emits
 *      `PII_SCRUB_COMPLETED` for progress/observability. Failures emit
 *      `PII_SCRUB_FAILED` and are surfaced via `runtime.reportError`
 *      (RECENT_ERRORS provider + owner escalation).
 *
 * When no `PII_SCRUB` model is registered the service still starts (tier-0-only
 * content - fully-covered structured PII - completes without a model), matching
 * the embedding service's "start even when no model" behavior; content with
 * un-inspectable residue then fails-closed at the seam, as intended.
 *
 * OUT OF SCOPE for this service (sibling issues / later slices): the CLOUD lane
 * (routing/resolve/jobsRepository/Redis+cron), the scrub prompt/semantics, and
 * the model seam itself (already merged).
 */
import type { IAgentRuntime } from "../types/runtime.js";
import { Service } from "../types/service.js";
/**
 * Service responsible for running the corpus PII scrub asynchronously on the
 * core task queue. Mirrors {@link EmbeddingGenerationService}.
 */
export declare class PiiScrubService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    private batchQueue;
    private isDisabled;
    private static readonly SCRUB_DRAIN_TASK;
    static start(runtime: IAgentRuntime): Promise<Service>;
    initialize(): Promise<void>;
    private handleScrubRequest;
    /**
     * Process one item: idempotency skip -> seam escalation -> mark-done. Throws
     * on any failure so BatchQueue applies retry / `onExhausted`, and CRUCIALLY
     * does not write the done-marker on failure (the item is retried, never
     * silently marked scrubbed).
     */
    private scrubItem;
    /** Emit FAILED + report the error after retries are exhausted. */
    private emitFailure;
    stop(): Promise<void>;
    getQueueSize(): number;
    getQueueStats(): {
        high: number;
        normal: number;
        low: number;
        total: number;
    };
    clearQueue(): void;
    /** Test/audit helper: read the done-marker for a piece of content. */
    getMarker(content: string, rulesetVersion: string): Promise<import("../security/pii-scrub-markers.js").PiiScrubDoneMarker | undefined>;
}
export default PiiScrubService;
//# sourceMappingURL=pii-scrub.d.ts.map