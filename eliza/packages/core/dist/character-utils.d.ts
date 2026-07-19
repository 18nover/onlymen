/**
 * Character Utilities
 *
 * Utilities for managing character secrets, plugins, and model provider detection.
 * These are immutable operations that return new character objects.
 *
 * @module character-utils
 */
import { CHANNEL_SECRETS } from "./constants/secrets.js";
import type { Character } from "./types/index.js";
/**
 * Mapping of model provider names to their corresponding API key environment variables.
 * @see {@link ./constants/secrets} for the comprehensive list
 */
export declare const MODEL_PROVIDER_SECRETS: Record<string, string>;
export { CHANNEL_SECRETS };
/**
 * Get a secret value from character.settings.secrets.
 *
 * @param character - The character to get the secret from
 * @param key - The secret key to look up
 * @returns The secret value, or null if not found
 */
export declare function getCharacterSecret(character: Character, key: string): string | null;
/**
 * Set a secret in character.settings.secrets. This is an immutable operation
 * that returns a new character object.
 *
 * @param character - The character to modify
 * @param key - The secret key to set
 * @param value - The secret value
 * @returns A new character with the secret set
 */
export declare function setCharacterSecret(character: Character, key: string, value: string): Character;
/**
 * Check if a secret exists in character.settings.secrets.
 *
 * @param character - The character to check
 * @param key - The secret key to look for
 * @returns true if the secret exists and has a non-empty value
 */
export declare function hasCharacterSecret(character: Character, key: string): boolean;
/**
 * Delete a secret from character.settings.secrets. This is an immutable operation
 * that returns a new character object.
 *
 * @param character - The character to modify
 * @param key - The secret key to delete
 * @returns A new character with the secret removed
 */
export declare function deleteCharacterSecret(character: Character, key: string): Character;
/**
 * List all secret keys (not values) from character.settings.secrets.
 *
 * @param character - The character to list secrets from
 * @returns Array of secret key names
 */
export declare function listCharacterSecretKeys(character: Character): string[];
/**
 * Merge secrets into character.settings.secrets. Existing character secrets
 * take priority and are not overwritten.
 *
 * @param character - The character to merge secrets into
 * @param secrets - The secrets to merge
 * @returns A new character with the merged secrets
 */
export declare function mergeCharacterSecrets(character: Character, secrets: Record<string, string>): Character;
/**
 * Add a plugin to character.plugins. This is an immutable operation.
 * If the plugin is already present, the original character is returned.
 *
 * @param character - The character to modify
 * @param pluginName - The plugin name to add (e.g., "@elizaos/plugin-discord")
 * @returns A new character with the plugin added, or the original if already present
 */
export declare function addCharacterPlugin(character: Character, pluginName: string): Character;
/**
 * Remove a plugin from character.plugins. This is an immutable operation.
 *
 * @param character - The character to modify
 * @param pluginName - The plugin name to remove
 * @returns A new character with the plugin removed
 */
export declare function removeCharacterPlugin(character: Character, pluginName: string): Character;
/**
 * Check if a plugin is enabled on the character.
 *
 * @param character - The character to check
 * @param pluginName - The plugin name to look for
 * @returns true if the plugin is in character.plugins
 */
export declare function hasCharacterPlugin(character: Character, pluginName: string): boolean;
/**
 * Detect which AI model provider is configured based on available API keys.
 *
 * @param character - The character to check
 * @returns The provider name (e.g., "anthropic", "openai") or null if none found
 */
export declare function getModelProvider(character: Character): string | null;
/**
 * Get all configured model providers for a character.
 *
 * @param character - The character to check
 * @returns Array of provider names that have API keys configured
 */
export declare function getConfiguredModelProviders(character: Character): string[];
//# sourceMappingURL=character-utils.d.ts.map