/**
 * AWAIT_CHILD_AGENT_DECISION — atomic action.
 *
 * Subscribes to the named child session's universal DECISION channel and
 * resolves as soon as the child emits a decision line. The parent planner
 * uses this to gate the next step (e.g. cancel the credential scope if the
 * child decided "abort", forward the decision to the user, etc.).
 *
 * The decision line itself is surfaced verbatim — callers must sanitize it
 * before persisting if they suspect leaked secrets. The action never logs
 * the raw line.
 */
import type { Action } from "../../../types/index.js";
export declare const awaitChildAgentDecisionAction: Action;
//# sourceMappingURL=await-child-agent-decision.d.ts.map