/**
 * Extracts the user-facing reply from a response-handler payload that leaked as
 * plain text. Local models can emit tool arguments as text when function-call
 * transport is unavailable, for example:
 *
 *   "RESPOND", "contexts": ["simple"], "replyText": "Hello"
 *
 * That string is valid object content once the first value is named
 * `shouldRespond`, so parse that shape without touching ordinary chat text.
 */
export declare function extractAssistantReplyText(input: string): string | null;
export declare function stripAssistantStageDirections(input: string): string;
//# sourceMappingURL=assistant-text.d.ts.map