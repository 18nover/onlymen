/**
 * response-field-transcript — tolerant parser + detector for the plain-text
 * "keyed field transcript" shape that models occasionally emit instead of the
 * canonical JSON HANDLE_RESPONSE envelope.
 *
 * The response-handler prompts the model with a set of named fields
 * (`shouldRespond`, `replyText`, `contexts`, `topics`, `emotion`, ...). The
 * canonical path is a JSON object (native tool call or JSON-as-text). But some
 * providers — notably cli-inference / claude-sdk warm sessions in *text mode* —
 * echo the field set back as a colon-delimited transcript:
 *
 *   shouldRespond: RESPOND
 *
 *   replyText: it's live https://example/
 *
 *   built it out at /workspace, go click around.
 *
 *   contexts: simple
 *
 *   topics: website build, aurora
 *
 *   emotion: none
 *
 * Two properties make this hard and were the root cause of issue #11712:
 *   1. A field VALUE can span multiple lines and can contain embedded blank
 *      lines (see `replyText` above — a URL line, a blank line, then more
 *      prose). Naive "split on blank line" segmentation drops the tail of the
 *      value or, worse, fails to recognise the shape at all so the WHOLE raw
 *      transcript falls through as the reply and is sent verbatim to the user.
 *   2. Because the JSON parser rejects it, the tolerant plain-text fallback
 *      treated the transcript as a "simple reply" and shipped the raw
 *      `shouldRespond: RESPOND\n\nreplyText: ...` block to the channel.
 *
 * The grammar here segments on the rule: **a field's value terminates only at
 * the next line that starts with `^<knownField>:`, never at a blank line.**
 * That preserves multi-line values with embedded blank lines.
 */
/**
 * Canonical field names the response-handler emits. Kept in sync with the
 * builtin field evaluators (see ./builtin-field-evaluators.ts). Used to anchor
 * segmentation: only these names delimit a new field, so a `value:` that
 * happens to appear inside prose (e.g. "the ratio is 3:1") does not split a
 * field.
 */
export declare const RESPONSE_HANDLER_FIELD_NAMES: readonly ["shouldRespond", "contexts", "intents", "candidateActionNames", "replyText", "facts", "relationships", "addressedTo", "topics", "emotion"];
export type ResponseHandlerFieldName = (typeof RESPONSE_HANDLER_FIELD_NAMES)[number];
/**
 * Cheap skeleton detector for the fail-closed send-boundary guard. Returns true
 * when `text` IS a raw field transcript that must NOT be shipped to a user
 * channel — as opposed to a composed reply that merely QUOTES one.
 * Intentionally cheap: line scan + regex, no full parse.
 *
 * Structural rule: a genuine text-mode envelope echo IS the message — its
 * first substantive line (outside code fences) is a known field line, and a
 * hallmark field (`shouldRespond:` / `replyText:`) appears at the top level.
 * A reply that opens with prose (e.g. a diagnosis of a transcript the user
 * pasted, which legitimately quotes `replyText:` lines) or whose field lines
 * sit inside a code fence is CONTENT, not a leak — flagging it would make the
 * send boundary silently replace the whole answer with the quoted replyText
 * value, destroying the diagnosis.
 */
export declare function looksLikeRawFieldTranscript(text: unknown): boolean;
export interface ParsedFieldTranscript {
    /** Map of field name → raw multi-line value string (trimmed of edge whitespace). */
    fields: Partial<Record<ResponseHandlerFieldName, string>>;
    /** Number of distinct known fields found (used to gauge confidence). */
    fieldCount: number;
}
/**
 * Parse a keyed field transcript into a map of field name → value string.
 *
 * Segmentation rule: scan line by line. A line matching `^<knownField>:` opens
 * a new field; its value is the inline remainder plus every subsequent line up
 * to (but not including) the next `^<knownField>:` line. Blank lines inside a
 * value are preserved (then trimmed at the value edges). This is what lets a
 * multi-line `replyText` with an embedded blank line survive intact.
 *
 * Fence rule: field lines inside a fenced code block (``` / ~~~) are QUOTED
 * content, never boundaries — a replyText value that quotes an envelope inside
 * a fence (the agent diagnosing a leaked transcript) keeps the whole fenced
 * block instead of being split at the quoted `contexts:`/`replyText:` lines.
 *
 * Returns null when no known field line is found (the text is not a transcript
 * — let the caller fall through to its plain-text handling).
 */
export declare function parseFieldTranscript(raw: string | null | undefined): ParsedFieldTranscript | null;
/**
 * Extract just the `replyText` value from a raw field transcript, if present.
 * Convenience wrapper used by the fail-closed send-boundary guard: given a
 * leaked transcript, recover the intended user-facing reply. Returns null when
 * the text is not a transcript or has no non-empty replyText.
 */
export declare function extractReplyTextFromTranscript(raw: string | null | undefined): string | null;
/**
 * Comma-splitter for list-shaped field values in a transcript (`contexts`,
 * `topics`, `candidateActionNames`, `intents`, `addressedTo`, `facts`). The
 * JSON path carries real arrays; the text transcript carries a comma- or
 * newline-separated string. `none`/`n/a`/empty collapse to [].
 */
export declare function splitTranscriptList(value: string | undefined): string[];
//# sourceMappingURL=response-field-transcript.d.ts.map