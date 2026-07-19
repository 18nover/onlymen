/**
 * Data access layer for runtime trust schema tables.
 * Thin wrappers around Drizzle queries for security incidents,
 * trust evidence, behavioral profiles, identity links, and whistleblower reports.
 */
import type { UUID } from "../../../types/index.js";
import type { DrizzleDB } from "./db.js";
export interface InsertSecurityIncident {
    entityId: UUID;
    type: string;
    severity: string;
    context?: Record<string, unknown>;
    details?: Record<string, unknown>;
}
export declare function insertSecurityIncident(db: DrizzleDB, incident: InsertSecurityIncident): Promise<void>;
export declare function getRecentIncidents(db: DrizzleDB, roomId?: UUID, hours?: number): Promise<Array<Record<string, unknown>>>;
export interface InsertTrustEvidence {
    targetEntityId: UUID;
    sourceEntityId: UUID;
    evaluatorId: UUID;
    type: string;
    impact: number;
    weight?: number;
    description?: string;
    verified?: boolean;
    context?: Record<string, unknown>;
}
export declare function insertTrustEvidence(db: DrizzleDB, evidence: InsertTrustEvidence): Promise<void>;
export declare function getTrustEvidence(db: DrizzleDB, entityId: UUID, evaluatorId?: UUID): Promise<Array<Record<string, unknown>>>;
export interface UpsertBehavioralProfile {
    entityId: UUID;
    typingSpeed?: number;
    vocabularyComplexity?: number;
    messageLengthMean?: number;
    messageLengthStdDev?: number;
    activeHours?: number[];
    commonPhrases?: string[];
    interactionPatterns?: Record<string, number>;
}
export declare function upsertBehavioralProfile(db: DrizzleDB, profile: UpsertBehavioralProfile): Promise<void>;
export declare function getBehavioralProfile(db: DrizzleDB, entityId: UUID): Promise<Record<string, unknown> | null>;
export declare function insertIdentityLink(db: DrizzleDB, link: {
    entityIdA: UUID;
    entityIdB: UUID;
    confidence: number;
    evidence?: string[];
}): Promise<void>;
export declare function getIdentityLinks(db: DrizzleDB, entityId: UUID): Promise<Array<Record<string, unknown>>>;
export declare function insertWhistleblowerReport(db: DrizzleDB, report: {
    reportedEntityId: UUID;
    evidence: Record<string, unknown>;
}): Promise<void>;
//# sourceMappingURL=SecurityStore.d.ts.map