/**
 * PII / sensitive-token detectors for the secret-swap layer (#10469).
 *
 * The secret-swap layer needs to find "easy-to-match" PII and well-known secret
 * token shapes in free text so it can substitute deterministic placeholders
 * before the model ever sees the raw value. This module is the detection half:
 * a registry of named detectors, each a global `RegExp` plus an optional
 * structural `validate()` that rejects false positives (e.g. a 16-digit number
 * that fails the Luhn checksum is not a credit card; `999-…` is not a valid SSN;
 * `300.1.2.3` is not an IPv4 address).
 *
 * Design constraints:
 * - **Low false positives.** Every numeric/structured class is checksum- or
 *   range-validated (Luhn for cards, mod-97 for IBAN, octet range for IPv4,
 *   SSA allocation rules for SSN). A detector that would over-match is gated by
 *   its validator, not loosened.
 * - **Pure + side-effect-free.** Detectors never mutate; `detectPii()` returns
 *   the matched spans so the caller (the swap session) owns substitution.
 * - **Overlap resolution.** When two detectors match overlapping spans, the
 *   longer (more specific) span wins, so a credit card inside a longer digit run
 *   is not also half-matched as a phone number.
 *
 * The exported helpers (`luhnValid`, `ibanValid`, `ssnValid`, `ipv4Valid`,
 * `wifValid`) are the validation primitives, exposed so the fuzz / red-team /
 * unit suites can exercise them directly.
 */
/** A single PII / token class detector. */
export interface PiiDetector {
    /** Stable, lower-kebab class name surfaced on the swap entry (e.g. "credit-card"). */
    readonly kind: string;
    /** Global regex. Must carry the `g` flag (enforced at registry build time). */
    readonly pattern: RegExp;
    /**
     * Structural acceptance check. Receives the full match and its capture groups;
     * return `false` to reject the candidate (e.g. failed checksum). When omitted,
     * any regex match is accepted.
     */
    readonly validate?: (match: string, groups: readonly (string | undefined)[]) => boolean;
    /**
     * Extract the sensitive token from the match (default: the last non-empty
     * capture group, else the whole match). Lets a detector match surrounding
     * context (`password=...`) but swap only the value.
     */
    readonly extract?: (match: RegExpMatchArray) => string;
    /**
     * Custom span finder that fully replaces the regex loop for this detector.
     * Used when a single regex match can contain several independent secrets
     * (e.g. two adjacent BIP-39 mnemonics in one word run), so every one is
     * emitted rather than just the first. When present, `pattern`/`validate`/
     * `extract` are ignored for this detector.
     */
    readonly findSpans?: (text: string) => ReadonlyArray<{
        value: string;
        start: number;
        end: number;
    }>;
}
/** A detected span: the sensitive value, its class, and its position in the text. */
export interface PiiMatch {
    readonly kind: string;
    readonly value: string;
    readonly start: number;
    readonly end: number;
}
/** Luhn (mod-10) checksum over a pure-digit string. */
export declare function luhnValid(digits: string): boolean;
/** Major card brand for a pure-digit PAN, or `null` if it matches none. */
export declare function cardBrand(digits: string): string | null;
/** US SSA allocation rules: reject the ranges the SSA never issues. */
export declare function ssnValid(value: string): boolean;
/** Every dotted-quad octet is 0–255 (rejects `300.1.2.3`, version strings, etc.). */
export declare function ipv4Valid(value: string): boolean;
/** ISO 13616 IBAN mod-97 check (rearrange, letters→digits, remainder === 1). */
export declare function ibanValid(value: string): boolean;
/**
 * Bitcoin WIF private key: base58check with version byte 0x80 (mainnet) / 0xEF
 * (testnet), a 32-byte payload (optionally + 0x01 compression flag), and a
 * trailing 4-byte double-SHA256 checksum. The checksum makes the base58 shape
 * unambiguous (an IPFS CID or other base58 blob is rejected).
 */
export declare function wifValid(value: string): boolean;
/**
 * Ordered detector registry. Order matters only for tie-breaking when two
 * detectors produce the exact same span; otherwise `detectPii` resolves by
 * span length. Higher-specificity classes are listed first.
 */
export declare const PII_DETECTORS: readonly PiiDetector[];
/** Detectors keyed by `kind` (for opt-out / configuration). */
export declare const PII_DETECTOR_BY_KIND: ReadonlyMap<string, PiiDetector>;
/**
 * Detect all PII / token spans in `text`. Returns one {@link PiiMatch} per
 * accepted, non-overlapping span (longest span wins on overlap), in order of
 * appearance. `disabledKinds` skips specific classes (false-positive opt-out).
 */
export declare function detectPii(text: string, options?: {
    disabledKinds?: ReadonlySet<string>;
}): PiiMatch[];
//# sourceMappingURL=pii-detectors.d.ts.map