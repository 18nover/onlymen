/**
 * PTY sub-agent session recording (SOC2 O-8).
 *
 * Persists a redacted transcript of every spawned session to
 * `~/.eliza/sub-agent-sessions/<session-id>/transcript.log` and emits an
 * `agent.session_record` audit event carrying the content hash + size
 * so the audit pipeline can correlate without storing prompt text.
 *
 * Retention: a background sweep deletes session directories older than
 * `RETENTION_DAYS` (default 30) on `prune()` invocation.
 */
import type { AuditDispatcher } from "@elizaos/security";
declare const SESSIONS_ROOT: string;
declare const RETENTION_DAYS: number;
export declare function redactTranscriptLine(line: string): string;
export interface SessionRecorderOptions {
    sessionId: string;
    auditDispatcher?: AuditDispatcher;
    actorId?: string;
    sessionsRoot?: string;
}
/**
 * Per-session transcript writer. Append lines via `record()`; call
 * `finalize()` on session terminate to emit the audit event.
 */
export declare class SessionRecorder {
    private readonly opts;
    private readonly dir;
    private readonly path;
    private readonly hash;
    private bytes;
    private finalized;
    /**
     * Set on the first disk-write failure. Once set, the on-disk transcript is
     * known to be incomplete, so the digest/byte-count we later hand to the audit
     * pipeline no longer describe a complete artifact. `finalize()` emits a
     * failure audit event in that case instead of a success-shaped one — a
     * partial transcript reported as a healthy record is exactly the
     * swallowed-failure shape #12182 bans.
     */
    private writeFailure;
    constructor(opts: SessionRecorderOptions);
    record(line: string): void;
    finalize(): Promise<void>;
}
/**
 * Delete session directories older than `RETENTION_DAYS`. Safe to call
 * fire-and-forget at service start.
 */
export declare function pruneOldSessions(now?: number, sessionsRoot?: string): number;
export { RETENTION_DAYS, SESSIONS_ROOT };
//# sourceMappingURL=session-recorder.d.ts.map