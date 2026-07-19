/**
 * Runs the `CredentialProtector` service of the trust capability: scans inbound
 * messages for credential-theft attempts using regex plus obfuscation-aware
 * keyword matching over sensitive-data mentions, exfiltration-request phrasing,
 * phishing cues, and prompt-injection markers, while suppressing known
 * legitimate contexts (password-reset help and the like) to limit false
 * positives.
 *
 * Beyond detection it redacts sensitive data (`protectSensitiveData`), warns
 * likely victims (`alertPotentialVictims`), and scores whole conversations.
 * Confirmed threats are logged through the {@link SecurityModule} injected at
 * `initialize`, which persists them as security incidents and trust evidence.
 * The runtime-facing wrapper is `CredentialProtectorServiceWrapper`.
 */
import { type IAgentRuntime, Service, type UUID } from "../../../types/index.js";
import { type SecurityContext } from "../types/security.js";
import type { SecurityModule } from "./SecurityModule.js";
export interface CredentialThreatDetection {
    detected: boolean;
    confidence: number;
    threatType: "credential_request" | "phishing" | "social_engineering" | "prompt_injection" | "none";
    sensitiveData: string[];
    recommendation: string;
}
export declare class CredentialProtector extends Service {
    static serviceType: "credential-protector:core";
    capabilityDescription: string;
    private securityModule;
    private readonly keywordPatternCache;
    private static normalizeForScan;
    private static reverseString;
    private readonly SENSITIVE_PATTERNS;
    private readonly SENSITIVE_KEYWORDS;
    private readonly THEFT_REQUEST_PATTERNS;
    private readonly PROMPT_INJECTION_PATTERNS;
    private readonly LEGITIMATE_CONTEXTS;
    initialize(_runtime: IAgentRuntime, securityModule: SecurityModule): Promise<void>;
    stop(): Promise<void>;
    static start(runtime: IAgentRuntime): Promise<Service>;
    /**
     * Scan message for credential theft attempts
     */
    scanForCredentialTheft(message: string, entityId: UUID, context: SecurityContext): Promise<CredentialThreatDetection>;
    /**
     * Protect sensitive data by redacting it
     */
    protectSensitiveData(content: string): Promise<string>;
    /**
     * Alert potential victims of credential theft
     */
    alertPotentialVictims(threatActor: UUID, victims: UUID[], threatDetails: CredentialThreatDetection): Promise<void>;
    /**
     * Analyze a conversation for credential theft patterns
     */
    analyzeConversation(messages: Array<{
        entityId: UUID;
        content: string;
        timestamp: number;
    }>, context: SecurityContext): Promise<{
        overallThreat: number;
        suspiciousEntities: UUID[];
        recommendations: string[];
    }>;
    /**
     * Private helper methods
     */
    private detectSensitiveData;
    private hasTheftRequest;
    private hasPromptInjectionPattern;
    private isLegitimateContext;
    private hasPhishingIndicators;
    private getKeywordPattern;
    private containsKeywordVariant;
    private logThreatEvent;
}
//# sourceMappingURL=CredentialProtector.d.ts.map