/**
 * Secrets Status Provider
 *
 * Provides context about the agent's secret configuration status
 * to help the LLM understand what capabilities are available.
 */
import type { Provider } from "../../../types/index.js";
/**
 * Secrets Status Provider
 *
 * Adds information about configured secrets to the agent's context,
 * without exposing actual secret values.
 */
export declare const secretsStatusProvider: Provider;
/**
 * Secrets Info Provider
 *
 * Provides detailed information about specific secrets when relevant
 * to the current conversation context.
 */
export declare const secretsInfoProvider: Provider;
//# sourceMappingURL=secrets-status.d.ts.map