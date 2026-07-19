import type { IAgentRuntime } from "../../../../types/index.js";
import type { UUID } from "../../../../types/primitives.js";
import { Service } from "../../../../types/service.js";
import { GLOBAL_PERSONALITY_SCOPE, type PersonalityAuditEntry, type PersonalityProfile, type PersonalityScope, type PersonalitySlot } from "../types.js";
/**
 * Structured store for personality slots (user + global) and named profiles.
 *
 * Persistence is in-memory, mirrored as agent memories so state survives a
 * runtime reload.
 */
export declare class PersonalityStore extends Service {
    static serviceType: "PERSONALITY_STORE";
    capabilityDescription: string;
    private slots;
    private profiles;
    private audit;
    private slotWriteChains;
    static start(runtime: IAgentRuntime): Promise<PersonalityStore>;
    private initialize;
    private loadProfilesFromDisk;
    private hydrateSlotsFromMemory;
    private slotFromMemory;
    private cacheSlot;
    private persistSlot;
    /**
     * Append a write to the slot's chain so read-modify-write mutations never
     * interleave. The returned promise carries the write's own outcome
     * (including rejection) to its caller; the stored tail is settled so one
     * failed write cannot poison every later write to the same slot.
     */
    private enqueueSlotWrite;
    private persistAndCache;
    /**
     * One canonical serialized mutation path: read the current slot, build the
     * next one, persist durably, cache, audit. All public mutators route here
     * so the write ordering and audit discipline cannot diverge per operation.
     */
    private mutateSlot;
    getSlot(userId: UUID | typeof GLOBAL_PERSONALITY_SCOPE, agentId?: UUID): PersonalitySlot;
    setSlot(slot: PersonalitySlot): Promise<void>;
    listProfiles(): PersonalityProfile[];
    getProfile(name: string): PersonalityProfile | null;
    saveProfile(profile: PersonalityProfile): void;
    loadProfileIntoGlobal(profile: PersonalityProfile, agentId?: UUID, actorId?: UUID): Promise<{
        before: PersonalitySlot;
        after: PersonalitySlot;
    }>;
    snapshotSlotAsProfile(slot: PersonalitySlot, name: string, description: string): PersonalityProfile;
    recordAudit(entry: PersonalityAuditEntry): void;
    getRecentAudit(limit?: number): PersonalityAuditEntry[];
    /**
     * Drop every personality slot and audit entry. Bundled profile defaults are
     * preserved (they are loaded from disk on initialize and never mutated by
     * slot operations).
     *
     * Used by the benchmark harness's `/api/benchmark/reset` route so that
     * personality state seeded by one scenario does not leak into the next
     * scenario sharing the same runtime process.
     */
    clear(): Promise<void>;
    /**
     * Apply a trait change with audit. Returns the slot before and after.
     */
    applyTrait(args: {
        scope: PersonalityScope;
        userId: UUID;
        agentId: UUID;
        actorId: UUID;
        trait: "verbosity" | "tone" | "formality";
        value: string | null;
        source?: PersonalitySlot["source"];
    }): Promise<{
        before: PersonalitySlot;
        after: PersonalitySlot;
    }>;
    applyReplyGate(args: {
        scope: PersonalityScope;
        userId: UUID;
        agentId: UUID;
        actorId: UUID;
        mode: PersonalitySlot["reply_gate"];
        source?: PersonalitySlot["source"];
    }): Promise<{
        before: PersonalitySlot;
        after: PersonalitySlot;
    }>;
    addDirective(args: {
        userId: UUID;
        agentId: UUID;
        actorId: UUID;
        directive: string;
        source?: PersonalitySlot["source"];
    }): Promise<{
        before: PersonalitySlot;
        after: PersonalitySlot;
    }>;
    clearDirectives(args: {
        scope: PersonalityScope;
        userId: UUID;
        agentId: UUID;
        actorId: UUID;
    }): Promise<{
        before: PersonalitySlot;
        after: PersonalitySlot;
    }>;
    stop(): Promise<void>;
}
export declare function getPersonalityStore(runtime: IAgentRuntime): PersonalityStore | null;
//# sourceMappingURL=personality-store.d.ts.map