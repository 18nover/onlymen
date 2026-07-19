/**
 * Trajectory context management for benchmark/training traces.
 *
 * Node.js: AsyncLocalStorage for async-safe propagation (initialized
 * synchronously to avoid race with first message processing).
 * Browser: stack-based fallback.
 */
import type { TrajectoryProviderAttribution } from "./runtime/trajectory-provider-attribution.js";
import type { PseudonymSession } from "./security/pii-pseudonymizer.js";
import type { SecretSwapSession } from "./security/secret-swap.js";
import type { RoleGateRole } from "./types/contexts.js";
export interface TrajectoryContext {
    /** Active trajectory identifier, when the logger separates trajectory and step ids. */
    trajectoryId?: string;
    trajectoryStepId?: string;
    /**
     * Root-turn correlation id (#13775). Minted at the message.ts turn boundary
     * so DB persistence and sub-agent spawns downstream can read one shared
     * `traceId` and stitch the file, DB, and orchestrator trace stores together.
     */
    traceId?: string;
    /** Current runtime run identifier associated with the active trajectory step. */
    runId?: string;
    /** Room context for pipeline/model hooks emitted during trajectory logging. */
    roomId?: string;
    /** Source message identifier associated with the active trajectory context. */
    messageId?: string;
    /** Sender role resolved for the active message, used for prompt identity and role-aware logging. */
    userRole?: RoleGateRole;
    /** Pipeline stage purpose for trajectory logging (e.g. "should_respond", "response", "action", "evaluation"). */
    purpose?: string;
    /**
     * Latest composed provider contribution snapshot for the active step. The
     * runtime stamps it onto the next model call so DB trajectories can
     * reconstruct provider order and prompt spans without storing provider text.
     */
    providerOrder?: string[];
    providerAttributions?: TrajectoryProviderAttribution[];
    /**
     * Turn-scoped secret-swap session (#10469). Minted on the first `useModel`
     * call of a turn when secret-swap is enabled, then reused by every subsequent
     * model call so all share one nonce, and read at the action-execution boundary
     * (`executePlannedToolCall`) to restore real secrets into handler args. Absent
     * when secret-swap is disabled — the egress restore is then a no-op.
     */
    secretSwapSession?: SecretSwapSession;
    /**
     * Turn-scoped PII pseudonymization session (#10469 / #7007). Minted on the
     * first `useModel` call of a turn when PII swap is enabled, then reused by
     * every subsequent model call so a real entity maps to the same surrogate all
     * turn, and read at the action-execution boundary (`executePlannedToolCall`)
     * to restore real names/orgs/addresses into handler args and reply text.
     * Absent when PII swap is disabled — the egress restore is then a no-op.
     */
    piiSwapSession?: PseudonymSession;
    /**
     * Step ID of the parent trajectory step, when the current step was
     * dispatched from inside another. Persistence layers use this to attach
     * child step IDs to the parent's `childSteps` array.
     */
    parentStepId?: string;
}
export interface ITrajectoryContextManager {
    run<T>(context: TrajectoryContext | undefined, fn: () => T | Promise<T>): T | Promise<T>;
    active(): TrajectoryContext | undefined;
}
export declare function setTrajectoryContextManager(manager: ITrajectoryContextManager): void;
export declare function getTrajectoryContextManager(): ITrajectoryContextManager;
export declare function runWithTrajectoryContext<T>(context: TrajectoryContext | undefined, fn: () => T | Promise<T>): T | Promise<T>;
export declare function getTrajectoryContext(): TrajectoryContext | undefined;
/**
 * Run `fn` with the ambient trajectory context preserved and only `purpose`
 * overridden.
 *
 * Passing a bare `{ purpose }` object to {@link runWithTrajectoryContext}
 * REPLACES the active context: `trajectoryStepId` is dropped, so the runtime
 * never records the nested `useModel` call (and the purpose tag is lost with
 * it), and the turn's secret-swap/PII sessions stop propagating. Use this
 * helper to tag a model call with a purpose while keeping the active
 * step/run/room identifiers and swap sessions intact.
 */
export declare function runWithTrajectoryPurpose<T>(purpose: string, fn: () => T | Promise<T>): T | Promise<T>;
/**
 * Set the pipeline purpose on the current trajectory context.
 * Mutates in place so nested useModel calls pick up the correct stage.
 */
export declare function setTrajectoryPurpose(purpose: string): void;
//# sourceMappingURL=trajectory-context.d.ts.map