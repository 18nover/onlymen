/**
 * RETRIEVE_CHILD_AGENT_RESULTS — atomic action.
 *
 * Pulls the final result bundle (transcript, artifact list, structured
 * result payload) for a completed child coding-agent session. The
 * orchestrator persists these results in the parent's memory after the
 * action returns; this slice only fetches them.
 */
import type { Action } from "../../../types/index.js";
export declare const retrieveChildAgentResultsAction: Action;
//# sourceMappingURL=retrieve-child-agent-results.d.ts.map