/**
 * Secret Key Constants and Aliases
 *
 * This module provides canonical secret key names, aliases for backward compatibility,
 * and mappings for model providers. All secret key naming should reference this module
 * to ensure consistency across the codebase.
 *
 * @module constants/secrets
 */
/**
 * List of all canonical secret key names.
 * These are the "official" key names that should be used throughout the codebase.
 */
export declare const CANONICAL_SECRET_KEYS: readonly ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GOOGLE_API_KEY", "GROQ_API_KEY", "XAI_API_KEY", "OPENROUTER_API_KEY", "MISTRAL_API_KEY", "COHERE_API_KEY", "TOGETHER_API_KEY", "FIREWORKS_API_KEY", "PERPLEXITY_API_KEY", "DEEPSEEK_API_KEY", "ZAI_API_KEY", "MOONSHOT_API_KEY", "NEARAI_API_KEY", "CEREBRAS_API_KEY", "DISCORD_BOT_TOKEN", "DISCORD_APPLICATION_ID", "TELEGRAM_BOT_TOKEN", "SLACK_BOT_TOKEN", "SLACK_APP_TOKEN", "WHATSAPP_TOKEN", "SIGNAL_CLI_PATH", "TWITTER_USERNAME", "TWITTER_PASSWORD", "TWITTER_EMAIL", "TWITTER_2FA_SECRET", "ELEVENLABS_API_KEY", "ELEVENLABS_VOICE_ID", "ENCRYPTION_SALT", "DATABASE_URL", "OLLAMA_BASE_URL"];
/**
 * Type for canonical secret keys
 */
export type CanonicalSecretKey = (typeof CANONICAL_SECRET_KEYS)[number];
/**
 * Maps legacy/alternative secret key names to their canonical names.
 * Key: legacy/alternative name. Value: canonical name.
 */
export declare const SECRET_KEY_ALIASES: Record<string, string>;
/**
 * Comprehensive mapping of model provider names to their API key environment variables.
 * Used for detecting which AI provider is configured and for auto-enabling provider plugins.
 */
export declare const MODEL_PROVIDER_SECRETS: Record<string, string>;
/**
 * Model providers that don't require API keys (local inference).
 * These are validated differently (check for URL availability).
 */
export declare const LOCAL_MODEL_PROVIDERS: readonly ["ollama"];
/**
 * Required secrets for each communication channel.
 * Used to determine if a channel can be enabled.
 */
export declare const CHANNEL_SECRETS: Record<string, string[]>;
/**
 * Optional secrets for channels (enhance functionality but not required).
 */
export declare const CHANNEL_OPTIONAL_SECRETS: Record<string, string[]>;
/**
 * Resolve a secret key alias to its canonical name.
 * If the key is not an alias, returns the original key.
 */
export declare function resolveSecretKeyAlias(key: string): string;
/** Check whether a key is a known alias. */
export declare function isSecretKeyAlias(key: string): boolean;
/** Get all aliases that map to a canonical key. */
export declare function getAliasesForKey(canonicalKey: string): string[];
/**
 * Check if a key is a canonical secret key.
 *
 * @param key - The key to check
 * @returns true if the key is in the canonical keys list
 */
export declare function isCanonicalSecretKey(key: string): key is CanonicalSecretKey;
export declare function isSecretKey(key: string): boolean;
export declare function deriveKnownSecrets(sources: Record<string, string | undefined>): Record<string, string>;
/**
 * Get the model provider name for a given API key.
 *
 * @param apiKey - The API key environment variable name
 * @returns The provider name, or null if not found
 */
export declare function getProviderForApiKey(apiKey: string): string | null;
/**
 * Get required secrets for a channel.
 *
 * @param channel - The channel name
 * @returns Array of required secret key names
 */
export declare function getRequiredSecretsForChannel(channel: string): string[];
/**
 * Get all secrets (required + optional) for a channel.
 *
 * @param channel - The channel name
 * @returns Object with required and optional secret arrays
 */
export declare function getAllSecretsForChannel(channel: string): {
    required: string[];
    optional: string[];
};
//# sourceMappingURL=secrets.d.ts.map