/**
 * Auto-generated canonical action/provider docs for the Experience advanced capability.
 * DO NOT EDIT - Generated from prompts/specs/**.
 */
export type ActionDoc = {
    name: string;
    description: string;
    similes?: readonly string[];
    parameters?: readonly unknown[];
    examples?: readonly (readonly unknown[])[];
};
export type ProviderDoc = {
    name: string;
    description: string;
    position?: number;
    dynamic?: boolean;
};
export declare const coreActionsSpec: {
    readonly version: "1.0.0";
    readonly actions: readonly [{
        readonly name: "RECORD_EXPERIENCE";
        readonly description: "Record a learning or experience for future reference. Use this when the user explicitly asks you to remember something or when you've learned something important.";
        readonly similes: readonly ["REMEMBER", "LEARN", "STORE_EXPERIENCE", "SAVE_EXPERIENCE", "RECORD_LEARNING"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Remember that installing dependencies is required for Python scripts";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll record that experience. Learning: Need to install dependencies before running Python scripts.";
                readonly actions: readonly ["RECORD_EXPERIENCE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Remember that users prefer shorter responses";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll remember that preference.";
                readonly actions: readonly ["RECORD_EXPERIENCE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "What's 2+2?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "2+2 equals 4.";
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Can you help me with math?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Of course! What math problem do you need help with?";
            };
        }]];
    }];
};
export declare const allActionsSpec: {
    readonly version: "1.0.0";
    readonly actions: readonly [{
        readonly name: "RECORD_EXPERIENCE";
        readonly description: "Record a learning or experience for future reference. Use this when the user explicitly asks you to remember something or when you've learned something important.";
        readonly similes: readonly ["REMEMBER", "LEARN", "STORE_EXPERIENCE", "SAVE_EXPERIENCE", "RECORD_LEARNING"];
        readonly parameters: readonly [];
        readonly examples: readonly [readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Remember that installing dependencies is required for Python scripts";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll record that experience. Learning: Need to install dependencies before running Python scripts.";
                readonly actions: readonly ["RECORD_EXPERIENCE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Remember that users prefer shorter responses";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "I'll remember that preference.";
                readonly actions: readonly ["RECORD_EXPERIENCE"];
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "What's 2+2?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "2+2 equals 4.";
            };
        }], readonly [{
            readonly name: "{{name1}}";
            readonly content: {
                readonly text: "Can you help me with math?";
            };
        }, {
            readonly name: "{{name2}}";
            readonly content: {
                readonly text: "Of course! What math problem do you need help with?";
            };
        }]];
    }];
};
export declare const coreProvidersSpec: {
    readonly version: "1.0.0";
    readonly providers: readonly [{
        readonly name: "experienceProvider";
        readonly description: "Provides relevant past experiences and learnings for the current context";
        readonly dynamic: true;
    }];
};
export declare const allProvidersSpec: {
    readonly version: "1.0.0";
    readonly providers: readonly [{
        readonly name: "experienceProvider";
        readonly description: "Provides relevant past experiences and learnings for the current context";
        readonly dynamic: true;
    }];
};
export declare const coreActionDocs: readonly ActionDoc[];
export declare const allActionDocs: readonly ActionDoc[];
export declare const coreProviderDocs: readonly ProviderDoc[];
export declare const allProviderDocs: readonly ProviderDoc[];
//# sourceMappingURL=specs.d.ts.map