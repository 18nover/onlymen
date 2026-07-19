/**
 * Setup Progress Provider
 *
 * Injects setup state into LLM context. Shows current step,
 * what's configured, and what's missing.
 */
import type { Provider } from "../types/index.js";
/**
 * Setup Progress Provider
 *
 * Provides the current setup state to the LLM context.
 * Only active when setup is in progress.
 */
export declare const setupProgressProvider: Provider;
/**
 * Provider that shows what's missing in the setup.
 */
export declare const setupMissingProvider: Provider;
//# sourceMappingURL=setup-progress.d.ts.map