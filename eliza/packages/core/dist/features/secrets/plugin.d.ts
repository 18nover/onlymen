/**
 * Secrets capability
 *
 * Comprehensive secret management for ElizaOS with:
 * - Multi-level storage (global, world, user)
 * - Encryption at rest
 * - Dynamic plugin activation when secrets become available
 * - Natural language secret management
 * - Conversational setup flow (Discord, Telegram)
 */
import type { Plugin } from "../../types/index.js";
/**
 * Plugin configuration
 */
export interface SecretsManagerPluginConfig {
    /** Enable encryption for stored secrets (default: true) */
    enableEncryption?: boolean;
    /** Custom salt for encryption key derivation */
    encryptionSalt?: string;
    /** Enable access logging (default: true) */
    enableAccessLogging?: boolean;
    /** Enable automatic plugin activation when secrets are available (default: true) */
    enableAutoActivation?: boolean;
    /** Polling interval for checking plugin requirements (ms, default: 5000) */
    activationPollingMs?: number;
}
/**
 * Secrets capability
 *
 * Provides comprehensive secret management capabilities:
 *
 * **Storage Levels:**
 * - Global: Agent-wide secrets (API keys, tokens) stored in character settings
 * - World: Server/channel-specific secrets stored in world metadata
 * - User: Per-user secrets stored as components
 *
 * **Features:**
 * - Automatic encryption using AES-256-GCM
 * - Natural language secret management via actions
 * - Plugin activation when required secrets become available
 * - Access logging and auditing
 *
 * **Usage:**
 * ```typescript
 * import { secretsManagerPlugin } from '@elizaos/core';
 *
 * const runtime = createAgentRuntime({
 *   plugins: [secretsManagerPlugin],
 * });
 *
 * // Get the secrets service
 * const secrets = runtime.getService<SecretsService>('SECRETS');
 *
 * // Set a global secret
 * await secrets.setGlobal('OPENAI_API_KEY', 'sk-...');
 *
 * // Get a global secret
 * const apiKey = await secrets.getGlobal('OPENAI_API_KEY');
 * ```
 */
export declare const secretsManagerPlugin: Plugin;
export default secretsManagerPlugin;
export * from "./crypto/encryption.js";
export * from "./services/index.js";
export * from "./setup/action.js";
export * from "./setup/config.js";
export * from "./setup/provider.js";
export * from "./setup/service.js";
export * from "./storage/index.js";
export * from "./types.js";
export { inferValidationStrategy, registerValidator, ValidationStrategies, validateSecret, } from "./validation.js";
//# sourceMappingURL=plugin.d.ts.map