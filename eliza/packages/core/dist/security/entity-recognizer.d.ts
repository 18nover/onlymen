/** A detected named-entity span. Offsets are best-effort (see module note). */
export interface EntitySpan {
    /** Entity class — one of {@link PseudonymKind} (`person`, `org`, …) or an
     * upstream label the composite recognizer maps. */
    readonly kind: string;
    /** The surface string of the entity, as it appears in the source text. */
    readonly value: string;
    /** Character start offset in the source text, when known. */
    readonly start?: number;
    /** Character end offset in the source text, when known. */
    readonly end?: number;
    /** Detector confidence in `[0,1]`, when the recognizer reports one. */
    readonly score?: number;
}
/** Recognizes named-entity PII spans in free text. */
export interface PiiEntityRecognizer {
    /** Stable identifier, for logging/telemetry (`regex`, `distilbert-ner`, …). */
    readonly name: string;
    /** Return every detected span in `text`. Must not throw for empty input. */
    recognize(text: string): Promise<EntitySpan[]>;
}
/**
 * Service type a plugin registers to supply the local NER model recognizer to
 * the runtime's PII swap layer. `@elizaos/core` never hard-depends on an ONNX
 * runtime; it looks up this service when PII swap is enabled and composes the
 * returned recognizer with its built-in regex recognizer. When absent, the layer
 * runs regex-only (addresses; opt-in email/phone) — degraded but still safe.
 */
export declare const PII_ENTITY_RECOGNIZER_SERVICE = "pii_entity_recognizer";
/** Shape a {@link PII_ENTITY_RECOGNIZER_SERVICE} service must expose. */
export interface PiiEntityRecognizerService {
    /** The recognizer, or `null` while the model is still loading / unavailable. */
    getRecognizer(): PiiEntityRecognizer | null;
}
/**
 * Options for {@link RegexEntityRecognizer}. Emails and phones are OFF by default:
 * when the secret-swap layer is also enabled it already masks them (as opaque
 * placeholders), and double-owning them across both layers causes a surrogate to
 * be re-masked. Turn them on here only when the pseudonym layer should own them.
 */
export interface RegexEntityRecognizerOptions {
    /** Detect US-style street addresses. Default `true`. */
    address?: boolean;
    /** Detect emails as `email` spans (see note above). Default `false`. */
    email?: boolean;
    /** Detect phone numbers as `phone` spans (see note above). Default `false`. */
    phone?: boolean;
}
/** Dependency-free recognizer for structured named PII (addresses, opt-in email/phone). */
export declare class RegexEntityRecognizer implements PiiEntityRecognizer {
    readonly name = "regex";
    private readonly detectors;
    private readonly detectEmail;
    constructor(options?: RegexEntityRecognizerOptions);
    recognize(text: string): Promise<EntitySpan[]>;
}
/**
 * Dictionary-driven recognizer. Matches supplied terms (whole-word, case
 * sensitivity configurable) and tags them with a fixed kind. Two uses:
 * deterministic tests of the full pipeline without an ML model, and forcing a
 * known contact roster to always be protected regardless of what the model finds.
 */
export declare class GazetteerEntityRecognizer implements PiiEntityRecognizer {
    readonly name: string;
    private readonly terms;
    private readonly caseSensitive;
    constructor(entries: Iterable<{
        kind: string;
        value: string;
    }>, options?: {
        name?: string;
        caseSensitive?: boolean;
    });
    recognize(text: string): Promise<EntitySpan[]>;
}
/**
 * Merges several recognizers, resolves overlapping spans (longest wins, ties
 * broken by recognizer order), maps upstream labels to canonical pseudonym kinds,
 * and drops blocklisted values. This is what the runtime wires to the session.
 */
export declare class CompositeEntityRecognizer implements PiiEntityRecognizer {
    readonly name = "composite";
    private readonly recognizers;
    private readonly blocklistLower;
    constructor(recognizers: readonly PiiEntityRecognizer[], options?: {
        blocklist?: Iterable<string>;
    });
    recognize(text: string): Promise<EntitySpan[]>;
}
/**
 * Map an upstream recognizer label to a canonical pseudonym kind. Handles the
 * distilbert-NER CoNLL labels (`PER`/`ORG`/`LOC`/`MISC`, with or without `B-`/`I-`
 * prefixes) and common synonyms; unknown labels pass through unchanged so the
 * pseudonymizer's default surrogate still applies.
 */
export declare function canonicalKind(raw: string): string;
//# sourceMappingURL=entity-recognizer.d.ts.map