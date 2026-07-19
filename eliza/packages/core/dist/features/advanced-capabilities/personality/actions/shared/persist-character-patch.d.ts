import type { Character, IAgentRuntime } from "../../../../../types/index.js";
/**
 * Apply a partial replacement patch to the runtime character and persist it
 * through the same `eliza_character_persistence` service that
 * `MODIFY_CHARACTER` (CharacterFileManager.applyModification) uses.
 *
 * Unlike `applyModification`, this performs a shallow field replacement
 * (no merge/append of arrays) so callers can implement remove/edit/reorder
 * semantics on top of it. Caller is responsible for computing the next value
 * of any array fields (`style`, `messageExamples`, `postExamples`, etc.).
 *
 * Updates `runtime.character` only after persistence succeeds.
 */
export declare function persistCharacterPatch(runtime: IAgentRuntime, patch: Partial<Character>): Promise<{
    success: boolean;
    error?: string;
}>;
//# sourceMappingURL=persist-character-patch.d.ts.map