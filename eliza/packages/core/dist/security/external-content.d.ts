/**
 * Security utilities for handling untrusted external content.
 *
 * Provides functions to safely wrap and process content from
 * external sources (emails, webhooks, web tools, etc.) before passing to LLM agents.
 *
 * SECURITY: External content should NEVER be directly interpolated into
 * system prompts or treated as trusted instructions.
 *
 * @module security/external-content
 */
/**
 * Check if content contains suspicious patterns that may indicate injection.
 *
 * Draws entirely from the shared injection-primitives bank (issue #9949): the
 * prompt-injection phrasing in `INJECTION_PATTERNS`, the external-content
 * dangerous-command / forged-delimiter indicators in
 * `EXTERNAL_CONTENT_RISK_PATTERNS`, and obfuscation-aware keyword matching over
 * `INJECTION_KEYWORDS`. There is no second pattern set here. Matches are logged
 * for monitoring but content is still processed (wrapped safely).
 *
 * @param content - The content to check
 * @returns Array of matched pattern sources / keywords (empty if none)
 */
export declare function detectSuspiciousPatterns(content: string): string[];
/**
 * Source types for external content.
 */
export type ExternalContentSource = "email" | "webhook" | "api" | "channel_metadata" | "web_search" | "web_fetch" | "unknown";
/**
 * Options for wrapping external content.
 */
export type WrapExternalContentOptions = {
    /** Source of the external content */
    source: ExternalContentSource;
    /** Original sender information (e.g., email address) */
    sender?: string;
    /** Subject line (for emails) */
    subject?: string;
    /** Whether to include detailed security warning */
    includeWarning?: boolean;
};
/**
 * Wraps external untrusted content with security boundaries and warnings.
 *
 * This function should be used whenever processing content from external sources
 * (emails, webhooks, API calls from untrusted clients) before passing to LLM.
 *
 * @example
 * ```ts
 * const safeContent = wrapExternalContent(emailBody, {
 *   source: "email",
 *   sender: "user@example.com",
 *   subject: "Help request"
 * });
 * // Pass safeContent to LLM instead of raw emailBody
 * ```
 *
 * @param content - The external content to wrap
 * @param options - Wrapping options
 * @returns Wrapped content with security markers
 */
export declare function wrapExternalContent(content: string, options: WrapExternalContentOptions): string;
/**
 * Returns the original payload from a string produced by
 * {@link wrapExternalContent}, or null when the text is not wrapped.
 */
export declare function extractWrappedExternalContent(content: string): string | null;
/**
 * Builds a safe prompt for handling external content.
 * Combines the security-wrapped content with contextual information.
 *
 * @param params - Parameters for building the prompt
 * @returns Safe prompt string
 */
export declare function buildSafeExternalPrompt(params: {
    content: string;
    source: ExternalContentSource;
    sender?: string;
    subject?: string;
    jobName?: string;
    jobId?: string;
    timestamp?: string;
}): string;
/**
 * Checks if a session key indicates an external hook source.
 *
 * @param sessionKey - The session key to check
 * @returns True if from an external hook
 */
export declare function isExternalHookSession(sessionKey: string): boolean;
/**
 * Extracts the hook type from a session key.
 *
 * @param sessionKey - The session key to parse
 * @returns The external content source type
 */
export declare function getHookType(sessionKey: string): ExternalContentSource;
/**
 * Wraps web search/fetch content with security markers.
 * This is a simpler wrapper for web tools that just need content wrapped.
 *
 * @param content - The web content to wrap
 * @param source - The source type (web_search or web_fetch)
 * @returns Wrapped content
 */
export declare function wrapWebContent(content: string, source?: "web_search" | "web_fetch"): string;
//# sourceMappingURL=external-content.d.ts.map