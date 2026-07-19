import type { Character, CharacterSettings, DocumentSourceItem, MessageExample, MessageExampleGroup, TemplateType } from "./types/index.js";
type CharacterDocumentItem = string | {
    path: string;
    shared?: boolean;
} | {
    directory: string;
    shared?: boolean;
} | DocumentSourceItem;
type MessageExamplesInput = MessageExampleGroup[] | MessageExample[][];
export interface CharacterInput {
    id?: string;
    name?: string;
    username?: string;
    system?: string;
    templates?: Record<string, TemplateType>;
    bio?: string | string[];
    messageExamples?: MessageExamplesInput;
    postExamples?: string[];
    topics?: string[];
    adjectives?: string[];
    documents?: CharacterDocumentItem[];
    knowledge?: CharacterDocumentItem[];
    plugins?: string[];
    settings?: CharacterSettings;
    secrets?: Record<string, string>;
    style?: {
        all?: string[];
        chat?: string[];
        post?: string[];
    };
    advancedPlanning?: boolean;
    advancedMemory?: boolean;
}
interface NormalizedCharacterInput {
    id?: string;
    name?: string;
    username?: string;
    system?: string;
    templates: Record<string, TemplateType>;
    bio: string[];
    messageExamples: MessageExampleGroup[];
    postExamples: string[];
    topics: string[];
    adjectives: string[];
    documents: DocumentSourceItem[];
    plugins: string[];
    settings?: CharacterSettings;
    secrets: Record<string, string>;
    style?: {
        all?: string[];
        chat?: string[];
        post?: string[];
    };
    advancedPlanning?: boolean;
    advancedMemory?: boolean;
}
export declare function normalizeCharacterInput(input: CharacterInput): NormalizedCharacterInput;
export declare function createCharacter(input: CharacterInput & {
    name: string;
}): Character;
export declare function parseCharacter(input: string | object | Character | CharacterInput): Character;
export declare function validateCharacterConfig(character: Character): {
    isValid: boolean;
    errors: string[];
};
export declare function mergeCharacterDefaults(char: CharacterInput): Character;
export {};
//# sourceMappingURL=character.d.ts.map