/**
 * Sub-agent credentials — atomic action slice.
 *
 * Re-exports the four atomic actions, the plugin scaffold, and the runtime
 * contract types (`SubAgentCredentialBridge`, `SubAgentChildDecisionBus`,
 * `SubAgentChildResultsClient`, scope/decision/result shapes, service name
 * constants).
 */
export { awaitChildAgentDecisionAction } from "./actions/await-child-agent-decision.js";
export { declareSubAgentCredentialScopeAction } from "./actions/declare-sub-agent-credential-scope.js";
export { retrieveChildAgentResultsAction } from "./actions/retrieve-child-agent-results.js";
export { tunnelCredentialToChildSessionAction } from "./actions/tunnel-credential-to-child-session.js";
export { subAgentCredentialsPlugin, subAgentCredentialsPlugin as default, } from "./plugin.js";
export type { ChildAgentDecision, ChildAgentResultBundle, SubAgentChildDecisionBus, SubAgentChildResultsClient, SubAgentCredentialBridge, SubAgentCredentialRequestOrigin, SubAgentCredentialScope, } from "./types.js";
export { SUB_AGENT_CHILD_DECISION_BUS_SERVICE, SUB_AGENT_CHILD_RESULTS_CLIENT_SERVICE, SUB_AGENT_CREDENTIAL_BRIDGE_ADAPTER_SERVICE, SUB_AGENT_CREDENTIAL_BRIDGE_SERVICE, SUB_AGENT_CREDENTIAL_PARENT_CAPABILITY_SERVICE, } from "./types.js";
//# sourceMappingURL=index.d.ts.map