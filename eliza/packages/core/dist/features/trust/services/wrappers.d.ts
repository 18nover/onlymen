/**
 * Runtime `Service` wrappers that adapt the trust capability's plain engine
 * classes — TrustEngine, SecurityModule, CredentialProtector, and
 * ContextualPermissionSystem — into services the trust plugin registers. Each
 * wrapper owns construction and startup ordering, awaiting its dependencies via
 * `getServiceLoadPromise` (SecurityModule needs the trust engine;
 * CredentialProtector needs the security module; ContextualPermissionSystem
 * needs both), then exposes thin proxy methods onto the underlying instance.
 *
 * Kept in their own module to break the circular dependency between the engines
 * and the evaluators/providers that consume them.
 */
import { type IAgentRuntime, Service, type UUID } from "../../../types/index.js";
import type { AccessDecision, AccessRequest, Permission, PermissionContext } from "../types/permissions.js";
import type { ImpersonationDetection, MultiAccountDetection, PhishingDetection, Action as SecurityAction, SecurityCheck, SecurityContext, SecurityEvent, SecurityEventType, Message as SecurityMessage, ThreatAssessment } from "../types/security.js";
import type { TrustContext, TrustDecision, TrustInteraction, TrustProfile, TrustRequirements } from "../types/trust.js";
import { ContextualPermissionSystem } from "./ContextualPermissionSystem.js";
import { CredentialProtector, type CredentialThreatDetection } from "./CredentialProtector.js";
import { SecurityModule } from "./SecurityModule.js";
import { TrustEngine } from "./TrustEngine.js";
export declare class TrustEngineServiceWrapper extends Service {
    static readonly serviceType = "trust-engine";
    readonly capabilityDescription = "Multi-dimensional trust scoring and evidence-based trust evaluation";
    trustEngine: TrustEngine;
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    calculateTrust(entityId: UUID, context: TrustContext): Promise<TrustProfile>;
    getRecentInteractions(entityId: UUID, limit?: number): Promise<TrustInteraction[]>;
    evaluateTrustDecision(entityId: UUID, requirements: TrustRequirements, context: TrustContext): Promise<TrustDecision>;
}
export declare class SecurityModuleServiceWrapper extends Service {
    static readonly serviceType = "security-module";
    readonly capabilityDescription = "Security threat detection and trust-based security analysis";
    securityModule: SecurityModule;
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    detectPromptInjection(content: string, context: SecurityContext): Promise<SecurityCheck>;
    assessThreatLevel(context: SecurityContext): Promise<ThreatAssessment>;
    logTrustImpact(entityId: UUID, event: SecurityEventType, impact: number, context?: Partial<TrustContext>): Promise<void>;
    storeMessage(message: SecurityMessage): Promise<void>;
    storeAction(action: SecurityAction): Promise<void>;
    detectMultiAccountPattern(entities: UUID[], timeWindow?: number): Promise<MultiAccountDetection | null>;
    detectImpersonation(username: string, existingUsers: string[]): Promise<ImpersonationDetection | null>;
    detectPhishing(messages: SecurityMessage[], entityId: UUID): Promise<PhishingDetection | null>;
    getRecentSecurityIncidents(roomId?: UUID, hours?: number): Promise<SecurityEvent[]>;
    analyzeMessage(message: string, entityId: UUID, context: SecurityContext): Promise<SecurityCheck>;
    getSecurityRecommendations(threatLevel: number): string[];
}
export declare class CredentialProtectorServiceWrapper extends Service {
    static readonly serviceType = "credential-protector";
    readonly capabilityDescription = "Detects and prevents credential theft attempts, protects sensitive data";
    credentialProtector: CredentialProtector;
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    scanForCredentialTheft(message: string, entityId: UUID, context: SecurityContext): Promise<CredentialThreatDetection>;
    protectSensitiveData(content: string): Promise<string>;
    alertPotentialVictims(threatActor: UUID, victims: UUID[], threatDetails: CredentialThreatDetection): Promise<void>;
}
export declare class ContextualPermissionSystemServiceWrapper extends Service {
    static readonly serviceType = "contextual-permissions";
    readonly capabilityDescription = "Context-aware permission management with trust-based access control";
    permissionSystem: ContextualPermissionSystem;
    static start(runtime: IAgentRuntime): Promise<Service>;
    stop(): Promise<void>;
    checkAccess(request: AccessRequest): Promise<AccessDecision>;
    hasPermission(entityId: UUID, permission: Permission, context: PermissionContext): Promise<boolean>;
}
//# sourceMappingURL=wrappers.d.ts.map