/**
 * Setup configuration types and utilities.
 *
 * Provides the structure for defining secret requirements per agent/plugin,
 * supporting both conversational and form-based collection flows.
 */
import type { SecretType } from "../types.js";
/**
 * Setting definition for setup.
 * Compatible with the-org SetupConfig format.
 */
export interface SetupSetting {
    /** Display name */
    name: string;
    /** Description for LLM context */
    description: string;
    /** Prompt shown when asking user for this setting */
    usageDescription?: string;
    /** Whether this is a secret (should be encrypted) */
    secret: boolean;
    /** Whether this should be visible in non-setup contexts */
    public: boolean;
    /** Whether this setting is required */
    required: boolean;
    /** Settings that must be configured first */
    dependsOn: string[];
    /** Validation function */
    validation?: (value: string) => boolean;
    /** Validation method name (openai, anthropic, url, etc.) */
    validationMethod?: string;
    /** Secret type */
    type?: SecretType;
    /** Environment variable to sync to */
    envVar?: string;
    /** Default value if not set */
    defaultValue?: string;
    /** Current value (set during setup) */
    value?: string | null;
    /** Conditional visibility based on other settings */
    visibleIf?: (settings: Record<string, SetupSetting>) => boolean;
    /** Callback when value is set */
    onSetAction?: (value: string | boolean) => string | undefined;
}
/**
 * Setup configuration for an agent or plugin.
 */
export interface SetupConfig {
    /** Setting definitions */
    settings: Record<string, SetupSetting>;
    /** Optional platform-specific messages */
    messages?: {
        welcome?: string[];
        askSetting?: string;
        settingUpdated?: string;
        allComplete?: string;
        error?: string;
    };
    /** Setup flow mode */
    mode?: "conversational" | "form" | "hybrid";
}
/**
 * Default setup messages.
 */
export declare const DEFAULT_SETUP_MESSAGES: {
    welcome: string[];
    askSetting: string;
    settingUpdated: string;
    allComplete: string;
    error: string;
};
/**
 * Common API key settings for quick setup.
 */
export declare const COMMON_API_KEY_SETTINGS: Record<string, Partial<SetupSetting>>;
/**
 * Create an setup config from a list of required secret keys.
 */
export declare function createSetupConfig(requiredKeys: string[], optionalKeys?: string[], customSettings?: Record<string, Partial<SetupSetting>>): SetupConfig;
/**
 * Get unconfigured required settings from an setup config.
 */
export declare function getUnconfiguredRequired(config: SetupConfig): Array<[string, SetupSetting]>;
/**
 * Get unconfigured optional settings from an setup config.
 */
export declare function getUnconfiguredOptional(config: SetupConfig): Array<[string, SetupSetting]>;
/**
 * Check if all required settings are configured.
 */
export declare function isSetupComplete(config: SetupConfig): boolean;
/**
 * Get the next setting to configure (respects dependencies).
 */
export declare function getNextSetting(config: SetupConfig): [string, SetupSetting] | null;
/**
 * Generate a prompt for the LLM to ask for a specific setting.
 */
export declare function generateSettingPrompt(_key: string, setting: SetupSetting, agentName: string): string;
//# sourceMappingURL=config.d.ts.map