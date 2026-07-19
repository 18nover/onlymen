/**
 * Autonomy Providers for elizaOS
 *
 * Providers that supply autonomous context information.
 */
import type { Provider } from "../../types/index.js";
/**
 * Admin Chat Provider
 *
 * Provides conversation history with admin user for autonomous context.
 * Only active in autonomous room to give agent memory of admin interactions.
 */
export declare const adminChatProvider: Provider;
/**
 * Autonomy Status Provider
 *
 * Shows autonomy status in regular conversations.
 * Does NOT show in autonomous room to avoid unnecessary context.
 */
export declare const autonomyStatusProvider: Provider;
//# sourceMappingURL=providers.d.ts.map