/**
 * Normalizes heterogeneous character message-example inputs (loose records with
 * varying speaker/role/text keys) into the canonical `MessageExampleGroup` shape
 * the runtime expects, tolerating the many hand-authored formats found in configs.
 */
import type { MessageExampleGroup } from "@elizaos/core";
interface NormalizeCharacterMessageExamplesOptions {
    fallbackMissingSpeaker?: boolean;
}
export declare function normalizeCharacterMessageExamples(input: unknown, fallbackAgentName?: string, options?: NormalizeCharacterMessageExamplesOptions): MessageExampleGroup[];
export {};
//# sourceMappingURL=character-message-examples.d.ts.map