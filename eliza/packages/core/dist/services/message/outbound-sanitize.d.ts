/**
 * Strip machine syntax from outbound agent text. Paired tags are removed with
 * their contents; an unclosed tag is removed to end-of-text (the live-observed
 * drift shape); `<final>` wrappers are unwrapped keeping their contents;
 * fenced ``` blocks and inline `code` spans pass through untouched so
 * documentation examples of the syntax survive. Idempotent — sanitizing
 * already-sanitized text is a no-op.
 */
export declare function sanitizeOutboundText(text: string): string;
//# sourceMappingURL=outbound-sanitize.d.ts.map