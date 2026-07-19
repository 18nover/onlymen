/**
 * Secrets Manager — Core Capability
 *
 * Multi-level secret management for elizaOS with:
 * - Conversational setup (Discord, Telegram)
 * - Web form-based secret collection
 * - Encryption at rest (AES-256-GCM)
 * - Dynamic plugin activation
 */
export { maskSecretValue, secretsAction } from "./actions/index.js";
export { ALGORITHM_GCM, createKeyDerivationParams, DEFAULT_PBKDF2_ITERATIONS, DEFAULT_SALT_LENGTH, decrypt, decryptGcm, deriveKeyPbkdf2, deriveKeyScrypt, encrypt, encryptGcm, generateKey, generateSalt, generateSecureToken, hashValue, IV_LENGTH, isEncryptedSecret, KEY_LENGTH, KeyManager, secureCompare, } from "./crypto/encryption.js";
export type { SecretsManagerPluginConfig } from "./plugin.js";
export { secretsManagerPlugin, secretsManagerPlugin as default, } from "./plugin.js";
export { secretsInfoProvider, secretsStatusProvider, } from "./providers/secrets-status.js";
export type { PluginWithSecrets } from "./services/index.js";
export { PLUGIN_ACTIVATOR_SERVICE_TYPE, PluginActivatorService, SECRETS_SERVICE_TYPE, SecretsService, } from "./services/index.js";
export { updateSettingsAction } from "./setup/action.js";
export { COMMON_API_KEY_SETTINGS, createSetupConfig, DEFAULT_SETUP_MESSAGES, generateSettingPrompt, getNextSetting, getUnconfiguredOptional, getUnconfiguredRequired, isSetupComplete, type SetupConfig, type SetupSetting, } from "./setup/config.js";
export { missingSecretsProvider, setupSettingsProvider, } from "./setup/provider.js";
export { SETUP_SERVICE_TYPE, SetupService } from "./setup/service.js";
export type { ISecretStorage } from "./storage/index.js";
export { BaseSecretStorage, CharacterSettingsStorage, ComponentSecretStorage, CompositeSecretStorage, MemorySecretStorage, WorldMetadataStorage, } from "./storage/index.js";
export * from "./types.js";
export { inferValidationStrategy, registerValidator, unregisterValidator, ValidationStrategies, validateSecret, } from "./validation.js";
//# sourceMappingURL=index.d.ts.map