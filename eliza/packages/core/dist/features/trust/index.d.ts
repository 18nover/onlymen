import { type Action, type IAgentRuntime, type Plugin } from "../../types/index.js";
import * as schema from "./schema.js";
import { ContextualPermissionSystem } from "./services/ContextualPermissionSystem.js";
import { CredentialProtector } from "./services/CredentialProtector.js";
import { SecurityModule } from "./services/SecurityModule.js";
import { TrustEngine } from "./services/TrustEngine.js";
export type { AccessDecision, AccessRequest, ElevationRequest, ElevationResult, Permission, PermissionContext, PermissionDecision, } from "./types/permissions.js";
export * from "./types/security.js";
export * from "./types/trust.js";
export { ContextualPermissionSystem, CredentialProtector, SecurityModule, TrustEngine, };
export type TrustEngineService = InstanceType<typeof TrustEngine>;
export type SecurityModuleService = InstanceType<typeof SecurityModule>;
export type ContextualPermissionSystemService = InstanceType<typeof ContextualPermissionSystem>;
export type CredentialProtectorService = InstanceType<typeof CredentialProtector>;
export * from "./actions/index.js";
export * from "./evaluators/index.js";
export * from "./providers/index.js";
export { ContextualPermissionSystemServiceWrapper, CredentialProtectorServiceWrapper, SecurityModuleServiceWrapper, TrustEngineServiceWrapper, } from "./services/wrappers.js";
/**
 * Pre-message trust hook actions (formerly the trust evaluators).
 * `securityEvaluator` runs `ALWAYS_BEFORE` to gate adversarial input.
 */
export declare const trustHookActions: Action[];
export interface TrustPluginOptions {
    /** When true, register the security pre-gate as a runtime hook action. */
    enableEvaluators?: boolean;
}
declare function ensureAdminRoleOnInit(runtime: IAgentRuntime): Promise<void>;
export declare function createTrustPlugin(options?: TrustPluginOptions): Plugin;
declare const trustPlugin: Plugin;
export { ensureAdminRoleOnInit, schema };
export default trustPlugin;
//# sourceMappingURL=index.d.ts.map