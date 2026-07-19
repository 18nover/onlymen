/**
 * DECLARE_SUB_AGENT_CREDENTIAL_SCOPE — atomic action.
 *
 * Asks the parent-runtime credential bridge to mint a short-lived scope plus
 * a single-use bearer token for the named child session. The token is
 * returned to the planner that called this action so it can hand it to the
 * orchestrator that injects it into the child's sealed environment.
 *
 * The bearer token is NEVER logged. The action's `data` payload includes
 * the token because the caller needs it; that payload is treated as
 * sensitive downstream and must not be persisted into trajectories or
 * action-result clipboards (see `suppressActionResultClipboard`).
 */
import type { Action } from "../../../types/index.js";
export declare const declareSubAgentCredentialScopeAction: Action;
//# sourceMappingURL=declare-sub-agent-credential-scope.d.ts.map