/**
 * ToolPolicyService
 *
 * Service for managing tool/action access policies in elizaOS.
 * Provides tool filtering based on profiles, character settings,
 * channel-specific overrides, and provider configurations.
 *
 * @example
 * ```typescript
 * const policyService = runtime.getService(ServiceType.TOOL_POLICY) as ToolPolicyService;
 *
 * // Check if a tool is allowed
 * const result = policyService.isToolAllowed('exec', {
 *   profile: 'coding',
 *   channelPolicy: { deny: ['group:runtime'] }
 * });
 *
 * if (!result.allowed) {
 *   console.log(`Tool denied: ${result.reason}`);
 * }
 *
 * // Get effective policy for a context
 * const policy = policyService.getEffectivePolicy({
 *   profile: 'messaging',
 *   characterPolicy: character.settings?.tools
 * });
 * ```
 */
import type { IAgentRuntime } from "../types/index.js";
import { Service } from "../types/service.js";
import type { AllowlistResolution, PluginToolGroups, ToolPolicyConfig, ToolPolicyResult, ToolProfileId } from "../types/tools.js";
/**
 * Context for tool policy evaluation.
 */
export interface ToolPolicyContext {
    /** The character's tool profile (minimal, coding, messaging, full) */
    profile?: ToolProfileId;
    /** Character-level tool policy */
    characterPolicy?: ToolPolicyConfig;
    /** Channel-specific tool policy */
    channelPolicy?: ToolPolicyConfig;
    /** Provider-specific tool policy */
    providerPolicy?: ToolPolicyConfig;
    /** World/server-level policy */
    worldPolicy?: ToolPolicyConfig;
    /** Room-level policy */
    roomPolicy?: ToolPolicyConfig;
}
/**
 * ToolPolicyService provides tool/action access management.
 */
export declare class ToolPolicyService extends Service {
    static serviceType: string;
    capabilityDescription: string;
    /** Cached plugin tool groups */
    private pluginGroups;
    /** Set of core tool names */
    private coreTools;
    /** Cache for profile policies */
    private profilePolicyCache;
    constructor(runtime?: IAgentRuntime);
    /**
     * Initialize the set of core tools from TOOL_GROUPS.
     */
    private initializeCoreTools;
    /**
     * Start the ToolPolicyService.
     */
    static start(runtime: IAgentRuntime): Promise<Service>;
    /**
     * Stop the ToolPolicyService.
     */
    stop(): Promise<void>;
    /**
     * Update plugin tool groups from runtime actions.
     * Call this when plugins are added/removed.
     */
    updatePluginGroups(): void;
    /**
     * Expand tool groups to individual tool names.
     *
     * @param groups - List of tool names and/or group references
     * @returns Expanded list of individual tool names
     */
    expandToolGroups(groups: string[]): string[];
    /**
     * Check if a tool is allowed by the given policy context.
     *
     * @param toolName - The tool name to check
     * @param context - The policy context
     * @returns Result with allowed status and reason
     */
    isToolAllowed(toolName: string, context?: ToolPolicyContext): ToolPolicyResult;
    /**
     * Get the effective policy by merging all policy sources.
     * Order of precedence (later overrides earlier):
     * 1. Profile base policy
     * 2. Character-level policy
     * 3. World/server-level policy
     * 4. Channel policy
     * 5. Room policy
     * 6. Provider policy
     *
     * @param context - The policy context
     * @returns Merged effective policy
     */
    getEffectivePolicy(context?: ToolPolicyContext): ToolPolicyConfig;
    /**
     * Get the effective policy for a character, optionally with channel/provider overrides.
     * This is a convenience method that extracts policy from character settings.
     *
     * @param character - The character configuration
     * @param channel - Optional channel override config
     * @param provider - Optional provider override config
     * @returns Effective policy
     */
    getEffectivePolicyForCharacter(character: {
        settings?: {
            tools?: ToolPolicyConfig;
            toolProfile?: ToolProfileId;
        };
    }, channel?: {
        tools?: ToolPolicyConfig;
    }, provider?: {
        tools?: ToolPolicyConfig;
    }): ToolPolicyConfig;
    /**
     * Filter a list of actions/tools based on policy.
     *
     * @param actions - Actions to filter
     * @param context - Policy context
     * @returns Filtered actions that are allowed
     */
    filterActions<T extends {
        name: string;
    }>(actions: T[], context?: ToolPolicyContext): T[];
    /**
     * Get a list of all allowed tool names for a context.
     *
     * @param context - Policy context
     * @param availableTools - List of available tool names to check
     * @returns List of allowed tool names
     */
    getAllowedTools(context: ToolPolicyContext | undefined, availableTools: string[]): string[];
    /**
     * Get a list of denied tool names for a context.
     *
     * @param context - Policy context
     * @param availableTools - List of available tool names to check
     * @returns List of denied tool names with reasons
     */
    getDeniedTools(context: ToolPolicyContext | undefined, availableTools: string[]): Array<{
        name: string;
        reason: string;
    }>;
    /**
     * Strip plugin-only allowlist from a policy.
     * Prevents accidentally blocking core tools when policy only specifies plugin tools.
     *
     * @param policy - The policy to check
     * @returns Resolution result with diagnostic info
     */
    stripPluginOnlyAllowlist(policy: ToolPolicyConfig | undefined): AllowlistResolution;
    /**
     * Validate a policy configuration.
     * Checks for invalid tool names, unknown groups, etc.
     *
     * @param policy - The policy to validate
     * @returns Validation result
     */
    validatePolicy(policy: ToolPolicyConfig): {
        valid: boolean;
        warnings: string[];
        errors: string[];
    };
    /**
     * Get core tools set (for external use).
     */
    getCoreTools(): Set<string>;
    /**
     * Get plugin tool groups (for external use).
     */
    getPluginToolGroups(): PluginToolGroups;
}
export default ToolPolicyService;
//# sourceMappingURL=tool-policy.d.ts.map