/**
 * GHSA-gh63-5vpj-39qp — wire external-content defenses into the live message path.
 */
import type { Memory } from "../types/memory.js";
import type { IAgentRuntime } from "../types/runtime.js";
export type IncomingMessageSecurityMetadata = {
    promptInjectionSuspected?: boolean;
    promptInjectionPatterns?: string[];
    externalContentWrapped?: boolean;
};
/**
 * Apply injection detection + external wrapping before compose / LLM.
 * Mutates `message.content` in place (pipeline hook + optional direct callers).
 */
export declare function hardenIncomingUserMessage(message: Memory): void;
/** Redact secret-shaped substrings before persisting user text to memory. */
export declare function scrubIncomingMessageTextForStorage(text: string): string;
export declare function messageHasPromptInjectionFlag(message: Memory): boolean;
export declare function registerCoreIncomingMessageSecurityHook(runtime: IAgentRuntime): void;
//# sourceMappingURL=incoming-message-security.d.ts.map