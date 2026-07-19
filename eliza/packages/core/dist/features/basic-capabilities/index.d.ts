/**
 * Basic Capabilities
 *
 * Core functionality included by default as basic capabilities.
 * These provide essential agent behavior:
 * - Core providers (actions, character, entities, messages, etc.)
 * - Basic actions (reply, ignore, none)
 * - Essential services (task management, embeddings, trajectory logging)
 * - Event handlers for runtime events
 * - Plugin creation utilities
 */
import type { IAgentRuntime, Media, Memory, MentionContext, Plugin, RegisteredEvaluator, Room } from "../../types/index.js";
import type { ServiceClass } from "../../types/plugin.js";
import { type JsonValue } from "../../types/primitives.js";
export * from "./actions/index.js";
export * from "./evaluators/index.js";
export * from "./providers/index.js";
export * from "../advanced-capabilities/actions/index.js";
export { advancedActions, advancedCapabilities, advancedEvaluators, advancedProviders, advancedServices, } from "../advanced-capabilities/index.js";
export * from "../advanced-capabilities/providers/index.js";
export * from "../autonomy/index.js";
export { coreCapabilities, pluginManagerCapability, secretsCapability, trustCapability, } from "../index.js";
export { createPluginAction, hasAdminAccess, hasOwnerAccess, pluginAction, type SecurityDeps, } from "../plugin-manager/index.js";
type MediaData = {
    data: Buffer;
    mediaType: string;
};
export declare function fetchMediaData(attachments: Media[]): Promise<MediaData[]>;
/**
 * Processes attachments by generating descriptions for supported media types.
 * Currently supports image description generation.
 *
 * @param {Media[]} attachments - Array of attachments to process
 * @param {IAgentRuntime} runtime - The agent runtime for accessing AI models
 * @returns {Promise<Media[]>} - Returns a new array of processed attachments with added description, title, and text properties
 */
export declare function processAttachments(attachments: Media[] | null | undefined, runtime: IAgentRuntime): Promise<Media[]>;
export declare function shouldRespond(runtime: IAgentRuntime, message: Memory, room?: Room, mentionContext?: MentionContext): {
    shouldRespond: boolean;
    skipEvaluation: boolean;
    reason: string;
};
/**
 * Syncs a single user into an entity
 */
/**
 * World metadata for a DM channel. The DM sender is granted OWNER of their DM
 * world ONLY when they are a configured canonical owner (#12087 Item 2). Writing
 * `roles[entityId] = OWNER` for EVERY DM sender (the prior behavior) made anyone
 * who could DM the agent the OWNER of their own DM world — and with no canonical
 * owner configured (the default), that grant is honored by `resolveOwnershipRole`,
 * clearing every `minRole: OWNER` gate (SECRETS, SHELL, …) for that sender. The
 * grant now goes through the auditable `recordOwnerGrant` API behind an explicit
 * owner match; a non-owner DM sender gets an empty (non-owner) world.
 */
export declare function buildDmWorldMetadata(runtime: IAgentRuntime, entityId: string): Record<string, JsonValue>;
/**
 * Basic providers - core functionality for agent operation
 */
export declare const basicProviders: import("../../index.node.js").Provider[];
/**
 * Basic actions - fundamental response actions
 */
export declare const basicActions: import("../../index.node.js").Action[];
/**
 * Basic evaluators - inbound auto-capture side-effects.
 *
 * - `linkExtractionEvaluator` runs when the inbound message text contains an
 *   http(s) URL; it extracts each URL, optionally fetches a title + body
 *   summary via TEXT_SMALL, and writes the result into the `links` memory
 *   table.
 *
 * (Inbound image attachments are described during message processing via the
 * shared image-description cache — `MessageService.processAttachments` — so no
 * separate evaluator re-runs the vision model post-response.)
 *
 * Transparent — never modifies the response or consumes a planner slot. Wraps
 * its own model calls in try/catch and logs on failure.
 */
export declare const basicEvaluators: RegisteredEvaluator[];
/**
 * Basic services - essential infrastructure services
 */
export declare const basicServices: ServiceClass[];
/**
 * Combined basic capabilities object
 */
export declare const basicCapabilities: {
    providers: import("../../index.node.js").Provider[];
    actions: import("../../index.node.js").Action[];
    evaluators: RegisteredEvaluator[];
    services: ServiceClass[];
};
/**
 * Configuration for basic capabilities.
 * - Basic: Core functionality (reply, ignore, none actions; core providers; task/embedding services)
 * - Advanced/Extended: Additional features (choice, mute/follow room, roles, settings)
 * - Autonomy: Autonomous operation (autonomy service, admin communication, status providers)
 *
 * @see basic-capabilities for basic capability definitions
 * @see advanced-capabilities for advanced capability definitions
 */
export interface CapabilityConfig {
    /** Disable basic capabilities (default: false) */
    disableBasic?: boolean;
    /** Enable extended/advanced capabilities (default: false) */
    enableExtended?: boolean;
    /** Alias for enableExtended - Enable advanced capabilities (default: false) */
    advancedCapabilities?: boolean;
    /** Skip the character provider (used for anonymous agents without a character file) */
    skipCharacterProvider?: boolean;
    /** Enable autonomy capabilities (default: false) */
    enableAutonomy?: boolean;
    /** Enable trust engine, security, and permissions (default: false) */
    enableTrust?: boolean;
    /** Enable encrypted secrets management and dynamic plugin activation (default: false) */
    enableSecretsManager?: boolean;
    /** Enable plugin introspection, install/eject/sync (default: false) */
    enablePluginManager?: boolean;
}
/**
 * Explicit (constructor-level) capability toggles a runtime already knows,
 * before the character-settings fallback is applied. Every field is a resolved
 * boolean or `undefined` ("not specified") — `undefined` defers to the matching
 * character setting; a concrete boolean overrides it.
 */
export interface ExplicitCapabilityOptions {
    disableBasic?: boolean;
    enableExtended?: boolean;
    advancedCapabilities?: boolean;
    skipCharacterProvider?: boolean;
    enableAutonomy?: boolean;
    enableTrust?: boolean;
    enableSecretsManager?: boolean;
    enablePluginManager?: boolean;
}
/**
 * The subset of character settings that toggle capabilities. Each is the
 * character-file fallback for the matching explicit option; string `"true"` and
 * boolean `true` both count as on, everything else off. Kept structural (no
 * import of the full `CharacterSettings`) so this feature module stays free of a
 * back-edge to the agent-type surface.
 */
export interface CapabilitySettingFlags {
    DISABLE_BASIC_CAPABILITIES?: boolean | string;
    ENABLE_EXTENDED_CAPABILITIES?: boolean | string;
    ADVANCED_CAPABILITIES?: boolean | string;
    ENABLE_AUTONOMY?: boolean | string;
    ENABLE_TRUST?: boolean | string;
    ENABLE_SECRETS_MANAGER?: boolean | string;
    ENABLE_PLUGIN_MANAGER?: boolean | string;
}
/**
 * Resolve the complete capability configuration a runtime should build its
 * basic-capabilities plugin from. Explicit constructor options win; where an
 * option is unspecified the matching character setting decides.
 *
 * This is the single source of truth for capability resolution: the runtime
 * calls it once at construction and hands the resulting config to
 * {@link createBasicCapabilitiesPlugin}. Registration then carries no knowledge
 * of capability flags — the declaring plugin already reflects them — which is
 * why `registerPlugin` needs no name-keyed special case.
 */
export declare function resolveCapabilityConfig(options: ExplicitCapabilityOptions, settings: CapabilitySettingFlags | undefined): CapabilityConfig;
declare const autonomyCapabilities: {
    providers: import("../../index.node.js").Provider[];
    actions: import("../../index.node.js").Action[];
    services: ServiceClass[];
    routes: import("../../index.node.js").Route[];
};
export { autonomyCapabilities };
/**
 * Creates the basic-capabilities plugin with the specified capability configuration.
 * This is the main entry point for plugin creation.
 */
export declare function createBasicCapabilitiesPlugin(config?: CapabilityConfig): Plugin;
export default basicCapabilities;
//# sourceMappingURL=index.d.ts.map