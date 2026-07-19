/**
 * Sensitive text redaction utilities.
 *
 * Provides functions to mask sensitive data like API keys, tokens,
 * passwords, and PEM blocks in text output before logging or display.
 *
 * Also provides secrets-aware redaction to prevent character secrets
 * from appearing in agent outputs or memories.
 *
 * @module security/redact
 */
/**
 * Mode for sensitive text redaction.
 * - "off": No redaction
 * - "tools": Redact in tool outputs
 */
export type RedactSensitiveMode = "off" | "tools";
/**
 * Whether an object key names a credential and its value must be fully masked.
 * Matches the substrings in {@link SENSITIVE_KEY_SUBSTRINGS} plus `token`
 * (excluding `tokenId`) and the `*key` forms the cloud logger recognized
 * (ssh/api/signing key). Callers redact the *value* under a matching key.
 */
export declare function isSensitiveKeyName(key: string): boolean;
/**
 * Options for redacting sensitive text.
 */
export type RedactOptions = {
    /** Redaction mode */
    mode?: RedactSensitiveMode;
    /** Custom patterns to match (in addition to or instead of defaults) */
    patterns?: string[];
};
/**
 * Options for secrets-based redaction.
 */
export type SecretsRedactOptions = {
    /** Known secrets to redact (key -> secret value) */
    secrets?: Record<string, string>;
    /** Whether to also apply pattern-based redaction */
    applyPatterns?: boolean;
};
/**
 * Redact sensitive information from text.
 *
 * @param text - The text to redact
 * @param options - Redaction options
 * @returns Text with sensitive data masked
 */
export declare function redactSensitiveText(text: string, options?: RedactOptions): string;
/**
 * Redact sensitive information from tool output detail.
 *
 * Only redacts when mode is "tools" (the default).
 *
 * @param detail - The tool detail to redact
 * @returns Redacted detail
 */
export declare function redactToolDetail(detail: string): string;
/**
 * Get the default redaction patterns.
 *
 * @returns Copy of default pattern strings
 */
export declare function getDefaultRedactPatterns(): string[];
/**
 * Redact known secrets from text.
 *
 * This performs literal string replacement of known secret values,
 * ensuring they don't appear in outputs even if they don't match
 * the pattern-based detection.
 *
 * @param text - Text to redact
 * @param secrets - Map of secret names to secret values
 * @returns Text with secrets replaced by [REDACTED:name]
 */
export declare function redactSecrets(text: string, secrets: Record<string, string>): string;
/**
 * Redact both known secrets and pattern-detected sensitive data.
 *
 * This combines literal secret replacement with pattern-based detection
 * for comprehensive redaction.
 *
 * @param text - Text to redact
 * @param options - Redaction options including known secrets
 * @returns Text with all sensitive data redacted
 */
export declare function redactWithSecrets(text: string, options?: SecretsRedactOptions): string;
/**
 * Create a redaction function bound to specific secrets.
 *
 * This is useful for creating a redactor that can be passed around
 * and reused without needing to pass secrets each time.
 *
 * @param secrets - Map of secret names to secret values
 * @param applyPatterns - Whether to also apply pattern detection (default: true)
 * @returns Redaction function
 *
 * @example
 * ```ts
 * const redact = createSecretsRedactor(runtime.character.settings.secrets);
 * const safeText = redact(userMessage);
 * ```
 */
export declare function createSecretsRedactor(secrets: Record<string, string>, applyPatterns?: boolean): (text: string) => string;
/**
 * Recursively redact secrets from an object.
 *
 * Walks through all string values in an object (including nested objects
 * and arrays) and applies secret redaction.
 *
 * @param obj - Object to redact
 * @param secrets - Map of secret names to secret values
 * @param applyPatterns - Whether to also apply pattern detection
 * @returns New object with redacted values
 */
export declare function redactObjectSecrets<T>(obj: T, secrets: Record<string, string>, applyPatterns?: boolean): T;
/**
 * Redact every argument in a `logger.error(...args)` call before it reaches the
 * transport. Consumed by log sinks so secret masking is structural, not opt-in:
 * `logger.error("msg", { apiKey })` masks the key with no `redact.context()` at
 * the call site. Value-shape and credential-named-key redaction converge here on
 * the one core module ({@link redactSensitiveText} + {@link isSensitiveKeyName}).
 */
export declare function redactLogArgs(args: readonly unknown[]): unknown[];
//# sourceMappingURL=redact.d.ts.map