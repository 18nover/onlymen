import type { Evaluator, Memory, RegisteredEvaluator } from "../../../types/index.js";
import { type PersonalitySlot } from "../personality/types.js";
import { type PreferenceExtractorOutput } from "./preferenceExtractor.schema.js";
export interface PreferencePrepared {
    recentMessages: Memory[];
    /** Null when the PersonalityStore service is not registered. */
    slot: PersonalitySlot | null;
    knownPreferenceFacts: Memory[];
}
export declare const preferenceEvaluator: Evaluator<PreferenceExtractorOutput, PreferencePrepared>;
export declare const preferenceItems: RegisteredEvaluator[];
//# sourceMappingURL=preference-items.d.ts.map