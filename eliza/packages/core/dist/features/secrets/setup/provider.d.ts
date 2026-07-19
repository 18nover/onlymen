/**
 * Setup Provider
 *
 * Provides setup status and context to the LLM during secret collection.
 * Injects prompts about required settings into the agent's context.
 */
import type { Provider } from "../../../types/index.js";
/**
 * Setup settings provider - injects setup context into LLM prompts.
 */
export declare const setupSettingsProvider: Provider;
/**
 * Provider that shows what secrets are still needed.
 */
export declare const missingSecretsProvider: Provider;
//# sourceMappingURL=provider.d.ts.map