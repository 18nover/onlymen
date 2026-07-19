/**
 * Helper functions to lookup action/provider specs by name.
 * These allow language-specific implementations to import their text content
 * (description, similes, examples) from the centralized specs.
 *
 * DO NOT EDIT the spec data - update packages/prompts/specs/** and regenerate.
 */
import { type ActionDoc, type ProviderDoc } from "./action-docs.js";
/**
 * Get an action spec by name from the core specs.
 * @param name - The action name (e.g., "REPLY", "IGNORE")
 * @returns The action spec or undefined if not found
 */
export declare function getActionSpec(name: string): ActionDoc | undefined;
/**
 * Get an action spec by name, throwing if not found.
 * @param name - The action name
 * @returns The action spec
 * @throws Error if the action is not found
 */
export declare function requireActionSpec(name: string): ActionDoc;
/**
 * Get a provider spec by name from the core specs.
 * @param name - The provider name (e.g., "CHARACTER", "TIME")
 * @returns The provider spec or undefined if not found
 */
export declare function getProviderSpec(name: string): ProviderDoc | undefined;
/**
 * Get a provider spec by name, throwing if not found.
 * @param name - The provider name
 * @returns The provider spec
 * @throws Error if the provider is not found
 */
export declare function requireProviderSpec(name: string): ProviderDoc;
export type { ActionDoc, ProviderDoc };
//# sourceMappingURL=spec-helpers.d.ts.map