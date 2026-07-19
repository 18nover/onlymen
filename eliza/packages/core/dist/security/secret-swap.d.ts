export declare const SECRET_SWAP_ENABLED_SETTING = "ELIZA_SECRET_SWAP_ENABLED";
export declare const SECRET_SWAP_EXEMPT_VALUES_SETTING = "ELIZA_SECRET_SWAP_EXEMPT_VALUES";
export declare class SecretSwapUnresolvedPlaceholderError extends Error {
    readonly placeholders: string[];
    constructor(placeholders: string[]);
}
export type SecretSwapEntry = {
    placeholder: string;
    value: string;
    kind: string;
};
export type SecretSwapSessionOptions = {
    knownSecrets?: Record<string, string | undefined>;
    exemptValues?: Iterable<string>;
    /**
     * PII/token detector classes to disable (false-positive opt-out by class,
     * e.g. `["phone", "ipv4"]`). Complements `exemptValues` (opt-out by value).
     */
    disabledKinds?: Iterable<string>;
};
export declare class SecretSwapSession {
    private readonly valueToEntry;
    private readonly placeholderToEntry;
    private readonly exemptValues;
    private readonly disabledKinds;
    /**
     * Longest token (secret value or minted placeholder) the session holds,
     * maintained incrementally as entries are added. The streaming guard
     * ({@link ./guarded-stream}) reads this to size its carry-over window: a known
     * secret that arrives split across two chunks must be held whole, so the guard
     * never emits a chunk shorter than the longest value it might straddle.
     */
    private maxToken;
    /** Per-session nonce woven into every placeholder so it is unforgeable. */
    private readonly nonce;
    /**
     * Restore/assert match only THIS session's nonce'd placeholders. A
     * placeholder-shaped string with a different/legacy nonce is benign text the
     * layer never minted — it cannot reference a real secret, so it is left as-is
     * (no leak) rather than triggering a false "unresolved" failure. Fail-loud is
     * reserved for a this-session placeholder that should resolve but does not
     * (e.g. a model that fabricated `…_999__`).
     */
    private readonly placeholderPattern;
    constructor(options?: SecretSwapSessionOptions);
    get entries(): SecretSwapEntry[];
    /** Length of the longest value/placeholder held (0 when empty). */
    get maxTokenLength(): number;
    substituteText(text: string): string;
    substituteInValue<T>(value: T): T;
    restoreText(text: string, options?: {
        failOnUnresolved?: boolean;
    }): string;
    restoreInValue<T>(value: T, options?: {
        failOnUnresolved?: boolean;
    }): T;
    assertNoUnresolvedPlaceholders(value: unknown): void;
    private entryForValue;
}
export declare function parseSecretSwapExemptValues(value: unknown): string[];
//# sourceMappingURL=secret-swap.d.ts.map