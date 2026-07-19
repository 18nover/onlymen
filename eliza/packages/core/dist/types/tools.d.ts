/**
 * Tool Policy Types
 *
 * Types and definitions for tool/action filtering and permissions in elizaOS.
 *
 * @module tools
 */
export type { ToolPolicyConfig, ToolProfileId } from "./channel-config.js";
import type { ToolPolicyConfig, ToolProfileId } from "./channel-config.js";
/**
 * Predefined tool groups for easier policy configuration.
 * Use "group:<name>" syntax in policy configs (e.g., "group:fs").
 */
export type ToolRiskTag = "read_only" | "memory_access" | "network_access" | "workspace_write" | "host_execution" | "session_control" | "ui_control" | "scheduled_execution" | "external_side_effect" | "messaging_side_effect" | "device_control" | "aggregate";
export interface ToolGroupDefinition {
    /** Tool names included by this group. */
    tools: string[];
    /** Explicit risk tags for policy/audit decisions. */
    riskTags: ToolRiskTag[];
    /** Short operator-facing reason this group exists. */
    description: string;
}
export declare const TOOL_GROUP_DEFINITIONS: Record<string, ToolGroupDefinition>;
export declare const TOOL_GROUPS: Record<string, string[]>;
export declare function getToolGroupDefinition(groupName: string): ToolGroupDefinition | undefined;
export declare function getToolGroupRiskTags(groupName: string): ToolRiskTag[];
/**
 * Predefined tool profiles with default allow/deny policies.
 */
export declare const TOOL_PROFILES: Record<ToolProfileId, ToolPolicyConfig>;
/**
 * Plugin tool groups for dynamic tool resolution.
 */
export interface PluginToolGroups {
    /** All tool names from plugins */
    all: string[];
    /** Tool names organized by plugin ID */
    byPlugin: Map<string, string[]>;
}
/**
 * Result of allowlist resolution with diagnostics.
 */
export interface AllowlistResolution {
    /** The resolved policy after processing */
    policy: ToolPolicyConfig | undefined;
    /** Entries in the allowlist that weren't recognized */
    unknownAllowlist: string[];
    /** Whether the allowlist was stripped (contained only plugin tools) */
    strippedAllowlist: boolean;
}
/**
 * Tool policy evaluation options.
 */
export interface ToolPolicyEvaluationOptions {
    /** The character's tool profile */
    profile?: ToolProfileId;
    /** Character-level tool policy overrides */
    characterPolicy?: ToolPolicyConfig;
    /** Channel-specific tool policy overrides */
    channelPolicy?: ToolPolicyConfig;
    /** Provider-specific tool policy overrides */
    providerPolicy?: ToolPolicyConfig;
    /** Plugin tool groups for resolution */
    pluginGroups?: PluginToolGroups;
    /** Set of core tool names for validation */
    coreTools?: Set<string>;
}
/**
 * Tool policy evaluation result.
 */
export interface ToolPolicyResult {
    /** Whether the tool is allowed */
    allowed: boolean;
    /** Reason for the decision */
    reason: string;
    /** The effective policy after merging */
    effectivePolicy: ToolPolicyConfig;
}
/**
 * Normalize a plugin-tool name for case-insensitive policy matching.
 *
 * IMPORTANT: this only normalizes plugin-tool names (e.g. `web_search`,
 * `read_file`) used by the tool-policy engine. Action names (e.g.
 * `MESSAGE`) are matched verbatim by the planner — the action name
 * shown in the system prompt's available-actions list is the exact string
 * the LLM must pass back as `actionName` in `call_action`. There is no
 * alias mapping for actions; the displayed name IS the invocation key.
 */
export declare function normalizeToolName(name: string): string;
/**
 * Normalize a list of tool names.
 *
 * @param list - The list of tool names to normalize
 * @returns Normalized list with empty entries filtered out
 */
export declare function normalizeToolList(list?: string[]): string[];
/**
 * Expand tool groups in a list to their constituent tools.
 * Handles both group references (e.g., "group:fs") and individual tools.
 *
 * @param list - The list containing tool names and/or group references
 * @returns Expanded list with all groups resolved to individual tools
 */
export declare function expandToolGroups(list?: string[]): string[];
/**
 * Resolve a tool profile to its policy configuration.
 *
 * @param profile - The profile ID to resolve
 * @returns The policy configuration, or undefined if profile is invalid
 */
export declare function resolveToolProfilePolicy(profile?: string): ToolPolicyConfig | undefined;
/**
 * Collect all explicit allow entries from multiple policies.
 *
 * @param policies - Array of policies to collect from
 * @returns Combined allowlist entries
 */
export declare function collectExplicitAllowlist(policies: Array<ToolPolicyConfig | undefined>): string[];
/**
 * Build plugin tool groups from a list of tools with metadata.
 *
 * @param params - Tools and metadata accessor
 * @returns Plugin tool groups organized by plugin ID
 */
export declare function buildPluginToolGroups<T extends {
    name: string;
}>(params: {
    tools: T[];
    toolMeta: (tool: T) => {
        pluginId: string;
    } | undefined;
}): PluginToolGroups;
/**
 * Expand plugin group references in a list.
 *
 * @param list - The list containing potential plugin group references
 * @param groups - Plugin tool groups for resolution
 * @returns Expanded list with plugin groups resolved
 */
export declare function expandPluginGroups(list: string[] | undefined, groups: PluginToolGroups): string[] | undefined;
/**
 * Expand a policy with plugin group resolution.
 *
 * @param policy - The policy to expand
 * @param groups - Plugin tool groups for resolution
 * @returns Policy with plugin groups expanded
 */
export declare function expandPolicyWithPluginGroups(policy: ToolPolicyConfig | undefined, groups: PluginToolGroups): ToolPolicyConfig | undefined;
/**
 * Strip plugin-only allowlist to prevent accidentally disabling core tools.
 * When an allowlist contains only plugin tools, we remove it to avoid
 * inadvertently blocking core functionality.
 *
 * @param policy - The policy to check
 * @param groups - Plugin tool groups
 * @param coreTools - Set of core tool names
 * @returns Resolution result with diagnostic information
 */
export declare function stripPluginOnlyAllowlist(policy: ToolPolicyConfig | undefined, groups: PluginToolGroups, coreTools: Set<string>): AllowlistResolution;
/**
 * Merge multiple tool policies into a single effective policy.
 * Later policies take precedence for conflicts.
 *
 * @param policies - Policies to merge in order of precedence
 * @returns Merged policy
 */
export declare function mergeToolPolicies(...policies: Array<ToolPolicyConfig | undefined>): ToolPolicyConfig;
/**
 * Check if a tool is allowed by a policy.
 *
 * @param toolName - The tool name to check
 * @param policy - The policy to evaluate against
 * @returns Whether the tool is allowed
 */
export declare function isToolAllowedByPolicy(toolName: string, policy: ToolPolicyConfig | undefined): boolean;
//# sourceMappingURL=tools.d.ts.map