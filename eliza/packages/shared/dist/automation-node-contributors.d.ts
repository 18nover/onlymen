/**
 * Registry and builder for automation-catalog node contributors. Plugins
 * register contributors here so the app-core automation-catalog route can
 * collect plugin-owned `AutomationNodeDescriptor`s without those plugins
 * depending on app-core. `buildRuntimeCapabilityNodes` turns declarative
 * runtime capability specs into descriptors gated by the loaded actions/plugins.
 */
import type { AgentRuntime, UUID } from "@elizaos/core";
import type { ElizaConfig } from "./config/types.js";
import type { AutomationNodeDescriptor } from "./contracts/automation-nodes.js";
export interface AutomationNodeContributorContext {
    runtime: AgentRuntime;
    config: ElizaConfig;
    agentName: string;
    adminEntityId: UUID;
}
export type AutomationNodeContributor = (context: AutomationNodeContributorContext) => Promise<AutomationNodeDescriptor[]> | AutomationNodeDescriptor[];
/**
 * Declarative spec for an automation node whose availability is gated by a
 * loaded runtime action or plugin. Owning plugins declare their specs and turn
 * them into descriptors via {@link buildRuntimeCapabilityNodes} inside a
 * registered contributor, so a plugin owns its own catalog entries.
 */
export interface RuntimeCapabilityNodeSpec {
    id: string;
    label: string;
    description: string;
    class: AutomationNodeDescriptor["class"];
    backingCapability: string;
    actionNames: string[];
    pluginNames: string[];
    ownerScoped: boolean;
    enabledWithoutRuntimeCapability: boolean;
    disabledReason: string;
}
/**
 * Build catalog descriptors for a set of runtime-capability specs, gating each
 * node's availability on the runtime's loaded actions/plugins.
 */
export declare function buildRuntimeCapabilityNodes(specs: RuntimeCapabilityNodeSpec[], runtime: AgentRuntime): AutomationNodeDescriptor[];
export declare function registerAutomationNodeContributor(id: string, contributor: AutomationNodeContributor): void;
export declare function listAutomationNodeContributors(): AutomationNodeContributor[];
export declare function clearAutomationNodeContributorsForTests(): void;
//# sourceMappingURL=automation-node-contributors.d.ts.map