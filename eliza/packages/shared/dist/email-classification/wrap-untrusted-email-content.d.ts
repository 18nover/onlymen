/**
 * Fence untrusted email content before it reaches a planning/classification
 * prompt.
 *
 * Without this fence, a crafted email body that contains `Ignore previous
 * instructions and …` can reach the planning prompt verbatim. The plain-text
 * delimiter + a one-line guard helps the model recognise the boundary, and
 * gives downstream tooling something to grep when auditing prompts.
 *
 * The wrapper is intentionally simple — no model can be guaranteed safe
 * against prompt injection, so this is defense-in-depth, not a guarantee.
 * Pair it with downstream output validation.
 */
export declare function wrapUntrustedEmailContent(content: string): string;
//# sourceMappingURL=wrap-untrusted-email-content.d.ts.map