/**
 * System-prompt assembly for a model call: builds the canonical prompt from a
 * character's `system` + `bio` (name-token expanded) plus the caller's role, and
 * resolves the effective system prompt from explicit params, a leading `system`
 * chat message, or a fallback — de-duplicating that leading system message when it
 * already matches the resolved prompt.
 */
import type { Character } from "../types/agent.js";
import type { RoleGateRole } from "../types/contexts.js";
import type { ChatMessage } from "../types/model.js";
type MessageLike = {
    role?: unknown;
    content?: unknown;
};
export declare function renderSystemPromptBio(value: unknown): string;
export declare function normalizeSystemPromptRole(role: RoleGateRole | string | null | undefined): string | undefined;
export declare function buildCanonicalSystemPrompt(args: {
    character?: Pick<Character, "name" | "system" | "bio"> | null;
    userRole?: RoleGateRole | string | null;
}): string;
export declare function textFromChatMessageContent(content: unknown): string;
export declare function extractLeadingSystemPrompt(messages: unknown): string | undefined;
export declare function resolveEffectiveSystemPrompt(args: {
    params?: unknown;
    fallback?: string | null;
}): string | undefined;
export declare function dropDuplicateLeadingSystemMessage<T extends MessageLike>(messages: readonly T[] | undefined, systemPrompt: string | undefined): T[] | undefined;
export declare function renderChatMessagesForPrompt(messages: readonly ChatMessage[] | undefined, options?: {
    omitDuplicateSystem?: string;
}): string | undefined;
export {};
//# sourceMappingURL=system-prompt.d.ts.map