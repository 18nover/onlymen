/**
 * Sub-agent credential bridge — action slice.
 *
 * Registers four atomic actions for the parent runtime to orchestrate a
 * spawned coding sub-agent's credential lifecycle:
 *   - DECLARE_SUB_AGENT_CREDENTIAL_SCOPE
 *   - TUNNEL_CREDENTIAL_TO_CHILD_SESSION
 *   - AWAIT_CHILD_AGENT_DECISION
 *   - RETRIEVE_CHILD_AGENT_RESULTS
 *
 * The plugin is intentionally NOT auto-enabled. Wave F's wiring follow-up
 * registers `subAgentCredentialsPlugin` via the export point and the
 * orchestrator's runtime adapter resolves the bridge / decision-bus /
 * results-client services.
 */
import type { Plugin } from "../../types/index.js";
export declare const subAgentCredentialsPlugin: Plugin;
export default subAgentCredentialsPlugin;
//# sourceMappingURL=plugin.d.ts.map