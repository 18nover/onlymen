/**
 * Service-locator contract for the character-persistence service used by the
 * personality capability. Exports the service-type token, the
 * `CharacterPersistenceServiceLike` structural interface, a runtime type-guard,
 * and `getCharacterPersistenceService` so callers (notably `CharacterFileManager`)
 * can durably persist agent-driven or restored character changes without
 * importing a concrete implementation. The persistence service itself lives
 * outside core; core defines only the shape it must satisfy.
 */
import type { IAgentRuntime } from "../../../types/index.js";
export declare const CHARACTER_PERSISTENCE_SERVICE = "eliza_character_persistence";
export type CharacterPersistenceSource = "manual" | "agent" | "restore";
export interface CharacterPersistenceServiceLike {
    persistCharacter(params?: {
        character?: Record<string, unknown>;
        previousCharacter?: Record<string, unknown>;
        previousName?: string;
        source?: CharacterPersistenceSource;
    }): Promise<{
        success: boolean;
        error?: string;
    }>;
}
export declare function isCharacterPersistenceService(service: unknown): service is CharacterPersistenceServiceLike;
export declare function getCharacterPersistenceService(runtime: IAgentRuntime): CharacterPersistenceServiceLike | null;
//# sourceMappingURL=character-persistence.d.ts.map