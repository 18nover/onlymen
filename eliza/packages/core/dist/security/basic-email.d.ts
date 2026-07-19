/**
 * Linear structural email helpers for security/redaction paths.
 *
 * This intentionally preserves the common lightweight shape used in the old
 * regexes: one non-empty local part, one `@`, and a domain with an interior dot.
 * It is not an RFC validator.
 */
export declare function basicEmailValid(value: string): boolean;
export declare function findBasicEmailSpans(text: string): ReadonlyArray<{
    value: string;
    start: number;
    end: number;
}>;
export declare function redactBasicEmails(text: string, replacement?: string | ((value: string) => string)): string;
//# sourceMappingURL=basic-email.d.ts.map