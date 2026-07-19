/**
 * PII pseudonymization for the model-call boundary (#10469 / #7007).
 *
 * The secret-swap layer ({@link ./secret-swap}) masks *structured secrets*
 * (API keys, private keys, DB creds) behind opaque `__ELIZA_SECRET_…__`
 * placeholders that the model must never reason about and that are restored
 * only at the true execution boundary. That is the wrong shape for
 * *named-entity PII* — a person's name, an employer, a city, a street address.
 * For those the model genuinely needs to reason over a *coherent* value ("draft
 * an email to my manager Dana at Acme about the Rushmore contract") — but it
 * must never see the real one.
 *
 * The answer is **pseudonymization**: swap each real entity for a *realistic*
 * surrogate of the same type ("Dana Whitfield" → "Priya Okafor", "Acme" →
 * "Northwind Labs"), consistently within a session, then reverse the mapping on
 * the way back out. The provider sees a fluent, plausible prompt containing zero
 * real PII; the user sees their real contacts; the executed tool call carries the
 * real recipient.
 *
 * Guarantees this module is built to keep (exercised by the fuzz/red-team suites):
 * - **Deterministic + consistent.** The same original maps to the same surrogate
 *   everywhere in a session (a per-session random salt makes the mapping
 *   *unlinkable* across sessions so a provider cannot correlate turns).
 * - **Bijective + reversible.** Two different originals never share a surrogate,
 *   and every minted surrogate is collision-checked against the learned corpus
 *   and every other surrogate — so restore is exact. The only hard rule on the
 *   surrogate itself is that it is never the original's *own* value; a surrogate
 *   may coincidentally share a token with (or equal) some *other* real name — the
 *   mapping stays reversible and the provider still cannot attribute it.
 * - **No-leak.** After `substituteInValue`, no real value survives as a real
 *   reference: every standalone occurrence of a learned value is replaced. A real
 *   name may appear only as an incidental token *inside* a fabricated surrogate,
 *   which carries no attributable information.
 * - **Blacklist-aware.** Framework/brand identity ("elizaOS", "Eliza", provider
 *   names) and caller-supplied exempt values are never swapped.
 *
 * Detection is *not* done here — this module owns the surrogate vault and the
 * substitution/restoration. Callers feed it spans from an
 * {@link ./entity-recognizer | entity recognizer} (regex + an optional local NER
 * model) via {@link PseudonymSession.learnSpans}, or feed raw text plus a
 * recognizer via {@link PseudonymSession.learn}.
 */
import type { EntitySpan, PiiEntityRecognizer } from "./entity-recognizer.js";
/** A learned mapping between a real value and its session surrogate. */
export interface PseudonymEntry {
    /** The real, sensitive value (never sent to the provider). */
    readonly value: string;
    /** The realistic surrogate the provider sees in its place. */
    readonly surrogate: string;
    /** The entity class that produced this entry (`person`, `org`, …). */
    readonly kind: string;
}
export interface PseudonymSessionOptions {
    /**
     * Deterministic seed for surrogate selection. Omit for a cryptographically
     * random per-session salt (the production default — makes surrogates
     * unlinkable across sessions). Tests pass a fixed salt for reproducibility.
     */
    salt?: string;
    /**
     * Values that must never be swapped even when a recognizer flags them
     * (false-positive opt-out by value). Compared case-insensitively after trim.
     * The framework/brand defaults ({@link DEFAULT_PSEUDONYM_BLOCKLIST}) are always
     * merged in.
     */
    blocklist?: Iterable<string>;
    /**
     * Entity kinds to skip entirely (e.g. `["location"]` to leave places alone).
     */
    disabledKinds?: Iterable<string>;
    /** Recognizer used by {@link PseudonymSession.learn}. Optional if callers only
     * ever call {@link PseudonymSession.learnSpans} with pre-computed spans. */
    recognizer?: PiiEntityRecognizer;
    /**
     * Minimum trimmed length for a detected span to be swapped. Guards against a
     * recognizer emitting single-character or stopword spans. Default 2.
     */
    minValueLength?: number;
}
/**
 * Framework / brand / provider identity that must never be treated as PII.
 * Swapping "elizaOS" out of a system prompt would corrupt the agent's own
 * identity and instructions; swapping a provider name is pointless and confusing.
 * Compared case-insensitively.
 */
export declare const DEFAULT_PSEUDONYM_BLOCKLIST: readonly string[];
/** Opt-in gate. When falsy, the runtime never mints a PseudonymSession. */
export declare const PII_SWAP_ENABLED_SETTING = "ELIZA_PII_SWAP_ENABLED";
/** Comma-separated values to never swap (false-positive opt-out by value). */
export declare const PII_SWAP_EXEMPT_VALUES_SETTING = "ELIZA_PII_SWAP_EXEMPT_VALUES";
/** Comma-separated entity kinds to skip (e.g. `location,address`). */
export declare const PII_SWAP_DISABLED_KINDS_SETTING = "ELIZA_PII_SWAP_DISABLED_KINDS";
/** Parse a comma-separated setting value into a trimmed, non-empty list. */
export declare function parsePiiSwapList(value: unknown): string[];
/**
 * Compile a single-pass replacement regex over `keys` plus a callback map. Two
 * properties make substitution and restoration exact and mutually safe:
 *
 * 1. **Single pass, longest-first.** All keys go into one alternation ordered by
 *    length descending, so at any position the longest key wins and text a
 *    replacement *inserts* is never re-scanned. This is what lets a surrogate
 *    ("Mateo Delgado") safely contain a token that is itself another real value
 *    ("Mateo") without corrupting the round-trip.
 * 2. **Word-boundary lookarounds.** A key only matches when it is not glued to an
 *    adjacent word character, so swapping "John" never mangles "Johnson". Named
 *    entities are always word-char-edged, so this is the correct semantics and
 *    cannot drop a real occurrence.
 *
 * Returns `null` when there is nothing to replace.
 *
 * Exported for the corpus pseudonym map ({@link ./pii-pseudonym-map}), which
 * needs the exact same longest-first boundary-aware pass for its corpus-wide
 * alias substitution. Not part of the security barrel's public API.
 */
export declare function compileReplacer(pairs: {
    from: string;
    to: string;
}[]): {
    regex: RegExp;
    map: Map<string, string>;
} | null;
/**
 * Mint a candidate surrogate for `kind` at a given probe `attempt`. Pure
 * function of `(salt, kind, value, attempt)` so the mapping is deterministic and
 * reproducible; `attempt` is advanced by the caller on a collision.
 *
 * Exported for the corpus pseudonym map ({@link ./pii-pseudonym-map}), which
 * extends this per-session minting to a corpus-persistent map keyed by entity
 * cluster (#14805). Not part of the security barrel's public API.
 */
export declare function mintSurrogate(salt: string, kind: string, value: string, attempt: number): string;
/**
 * A per-session pseudonymization vault. Learns real entities (from a recognizer
 * or pre-computed spans), mints a realistic surrogate for each, and provides
 * exact, reversible substitution over strings and structured values.
 *
 * Not thread-safe; scope one to a single turn/session (carried on the
 * trajectory context, mirroring {@link SecretSwapSession}).
 */
export declare class PseudonymSession {
    private readonly salt;
    private readonly blocklist;
    private readonly disabledKinds;
    private readonly recognizer?;
    private readonly minValueLength;
    private readonly valueToEntry;
    private readonly surrogateToEntry;
    /** Lowercased surrogates in use, for O(1) collision checks when minting. */
    private readonly usedSurrogatesLower;
    /**
     * Every swappable real value ever learned, lowercased. The value namespace and
     * the surrogate namespace are kept mutually exclusive: a surrogate is never
     * minted equal to a known value, and — because `learn()` is called once per
     * model call and a *later* call can introduce a real value equal to an
     * *earlier* call's surrogate — any existing entry whose surrogate collides with
     * a newly-learned value is re-minted. Without this, two distinct people could
     * collapse onto one surrogate, breaking the round-trip and misdelivering the
     * restored value at the execution boundary.
     */
    private readonly knownValuesLower;
    /**
     * Everything the session has ever "seen" (learned text). A surrogate is
     * rejected if it already occurs here, so substitution never mints a token
     * that collides with real text and restore stays exact.
     */
    private corpusLower;
    /** Compiled single-pass replacers, rebuilt lazily after a new entry is added. */
    private substituteReplacer;
    private restoreReplacer;
    private replacersDirty;
    /**
     * Longest string in either namespace (a real value or its surrogate),
     * maintained as entries are minted/re-minted. The streaming guard
     * ({@link ./guarded-stream}) sizes its carry-over window from this so a value
     * or surrogate that spans a chunk boundary is never split across two emissions
     * (which would leak a value fragment on the safe side, or drop a restore on the
     * visible side). Surrogates can be longer than their value, so both count.
     */
    private maxToken;
    constructor(options?: PseudonymSessionOptions);
    /** All learned mappings (real → surrogate), newest last. */
    get entries(): PseudonymEntry[];
    /** Number of distinct entities learned this session. */
    get size(): number;
    /** Length of the longest value or surrogate held (0 when empty). */
    get maxTokenLength(): number;
    /**
     * Run the configured recognizer over `text` and learn every accepted span.
     * This is the single async step; call it once per model call on the assembled
     * prompt text before the (synchronous) substitution passes. Idempotent: text
     * already learned re-uses existing mappings.
     */
    learn(text: string): Promise<void>;
    /**
     * Learn a set of pre-computed spans against the `sourceText` they were found
     * in. Exposed so callers with their own recognizer (or a batch of recognizers)
     * can drive the vault without this class importing a model.
     */
    learnSpans(sourceText: string, spans: readonly EntitySpan[]): void;
    /** True when a value/kind pair is eligible for swapping. */
    private isSwappable;
    /**
     * Substitute every learned real value in `text` with its surrogate, in a
     * single boundary-aware pass (see {@link compileReplacer}).
     */
    substituteText(text: string): string;
    /** Restore every surrogate in `text` back to its real value, single-pass. */
    restoreText(text: string): string;
    private ensureReplacers;
    /** Recursively substitute across strings/arrays/plain objects. */
    substituteInValue<T>(value: T): T;
    /** Recursively restore across strings/arrays/plain objects. */
    restoreInValue<T>(value: T): T;
    private walk;
    private entryForValue;
    /** Replace an entry's surrogate with a fresh one (cross-call collision fix). */
    private remintEntry;
    /**
     * Mint a surrogate that is unique within the session and absent from the
     * learned corpus, probing deterministically on collision. A surrogate is
     * rejected when it (case-insensitively) equals an already-minted surrogate,
     * equals any known real value, or already occurs in the corpus text — any of
     * which would make restore ambiguous or collapse two entities onto one token.
     */
    private mintUniqueSurrogate;
}
//# sourceMappingURL=pii-pseudonymizer.d.ts.map