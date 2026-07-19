/**
 * Streaming carry-over guard for the secret-swap / PII-pseudonymization layer
 * (#15256). When either guard is active, {@link ../runtime | AgentRuntime.useModel}
 * used to buffer the whole model stream and run the substitution pipeline once at
 * the end, emitting the entire reply as a single chunk — so a guarded turn had
 * TTFT equal to full generation time. This scanner restores incremental delivery:
 * each raw model chunk is appended to a small carry-over tail, an emit-safe prefix
 * is chosen, that prefix is run through the exact same pipeline the end-of-stream
 * flush used, and only the still-in-progress tail is held back.
 *
 * The safety contract the cut must uphold: a prefix may be emitted only when no
 * sensitive token and no in-progress detector match straddles the cut. A cut that
 * split a known secret value, a PII value/surrogate, a spaced credit card, a
 * BIP-39 mnemonic, a `KEY=`/JSON-field/`Bearer` assignment, or an open PEM/PGP
 * block would emit a raw fragment the buffered path would have masked. {@link
 * GuardedStreamScanner.findSafeCut} therefore holds back (a) a base window sized to
 * the longest known value/surrogate so a partial known value at the tail is never
 * emitted, and (b) any trailing region that matches an in-progress multi-token
 * secret/PII shape. Held text is released as soon as a following token proves the
 * shape complete, or at {@link GuardedStreamScanner.flush} (end of stream), whose
 * held-tail-drop-on-abort behaviour matches the old buffer exactly.
 *
 * Accepted semantic delta vs whole-buffer substitution: streaming cannot
 * retro-redact. A secret whose ONLY detectable form appears late in the reply
 * (e.g. a bare value that becomes detectable only once a later `API_KEY=` names
 * it) no longer cleans an earlier bare occurrence the way whole-buffer split/join
 * did, and a surrogate emitted before a parallel turn-call first learns it stays
 * unrestored on the visible side. This is inherent to any streaming guard; the
 * realistic paths are unaffected because known secrets (character settings) and
 * ingress-detected PII are always in the session before the stream starts.
 *
 * Pathological whitespace-free streams (multi-KB JWTs/URLs) and multi-KB known
 * secrets degrade to holding until a whitespace boundary or flush — i.e. to the
 * old full-buffer behaviour. Correctness over latency; there is no regression.
 */
import type { PseudonymSession } from "./pii-pseudonymizer.js";
import type { SecretSwapSession } from "./secret-swap.js";
/** One increment of guarded output: provider-safe text and its user-visible form. */
export interface GuardedStreamOutput {
    /** Text safe to persist / send onward: secrets → placeholders, PII → surrogates. */
    safe: string;
    /** Text safe to show the user: PII surrogates restored to their real values. */
    visible: string;
}
export interface GuardedStreamScannerOptions {
    secretSession?: SecretSwapSession | null;
    piiSession?: PseudonymSession | null;
}
/**
 * Chunked, order-preserving replacement for the runtime's end-of-stream
 * `flushGuardedStream`. Constructed once per guarded turn; the same secret/PII
 * sessions are shared with the rest of the turn and may grow mid-stream (the
 * secret session learns new values as it substitutes each emitted prefix), so the
 * hold window is recomputed from live session state on every {@link push}.
 */
export declare class GuardedStreamScanner {
    private pending;
    private readonly secretSession;
    private readonly piiSession;
    constructor(options: GuardedStreamScannerOptions);
    /** Append a raw model chunk; return the text newly cleared for delivery (may be empty). */
    push(chunk: string): GuardedStreamOutput;
    /** End of stream: process and return the entire held tail, then reset. */
    flush(): GuardedStreamOutput;
    /**
     * The exact pipeline the buffered path ran: secret placeholders first, then PII
     * surrogates for the safe side, with the PII surrogates restored for the
     * user-visible side. Kept byte-identical so streamed and buffered turns produce
     * the same reply text.
     */
    private transform;
    private maxTokenLength;
    /**
     * Every string that must not be split across the cut: known secret values and
     * their placeholders, PII values and their surrogates. Read live because the
     * secret session learns new values while substituting emitted prefixes.
     */
    private tokenKeys;
    /**
     * Largest index up to which `pending` may be emitted. Starts at a window sized
     * to the longest known token, then moves left (only ever left) past any trailing
     * in-progress sensitive shape, to a fixpoint. Returns 0 when nothing is safe yet.
     */
    private findSafeCut;
    /**
     * Move the cut left until the character before it is whitespace (or 0). This
     * makes the cut land exactly between tokens, so no whitespace-free token is
     * split and the PII replacer's `(?<![A-Za-z0-9_])…(?![A-Za-z0-9_])` word
     * boundaries stay exact at the emit edge.
     */
    private snapToWhitespace;
    /**
     * Hold the trailing run of grouped tokens that could be a space/dash-separated
     * card, SSN, or IBAN whose remaining groups are still in the tail. A group joins
     * the run only if it carries a digit or is an uppercase 4-char IBAN body group
     * ("NWBK") — so lowercase prose (even 4-letter-word prose) ends the run — and the
     * run is held only when it contains at least one digit-bearing group. A lone
     * in-progress leading group ("DE89 ", "4111 ") is enough to hold, since the rest
     * of the number is still arriving. Walks to the true run start (never mid-token).
     */
    private groupedNumberRunStart;
    /**
     * Hold a trailing in-progress NANP phone number whose area code is
     * parenthesised — the one whitespace-spanning phone shape
     * {@link groupedNumberRunStart} misses, because the `)`/`(` around the area
     * code are non-alnum and break its left-walk (leaking e.g. `"(555) "` before the
     * local number `"123-4567"` arrives). Only a SPACE/TAB separator can fall on a
     * chunk boundary (dash/dot never split a token, so `snapToWhitespace` already
     * holds `123-4567`); this walks the space-separated `(\d{2,4})` area-code group
     * plus any following digit groups, and — when a parenthesised group is present —
     * pulls the hold left over an optional `+?1` / `+` dialing prefix so the whole
     * number matches the buffered detector in one emitted piece. Runs with no
     * parenthesised group are left to `groupedNumberRunStart` (no double-holding).
     */
    private phoneRunStart;
    /**
     * If the words immediately before `cut` are all BIP-39 words, they could be the
     * start of a mnemonic whose remaining words are still in the tail; hold from the
     * run's start. Ordinary prose exits at the first non-wordlist word, so it is not
     * wedged. Walks to the true run start (never mid-word).
     */
    private bip39RunStart;
    /**
     * If the prefix ending at `cut` ends with an in-progress secret opener (`KEY=`,
     * JSON field, `Bearer`/`Basic`, CLI flag), hold from the opener start. The fast
     * path scans the bounded suffix; the long-token fallback extends left from the
     * current value token so a 512+ byte value cannot orphan its anchor before the
     * detector sees the complete assignment/header/flag.
     */
    private openerTailStart;
    /**
     * Hold a PEM/PGP armor block whole — a streamed private key must never partially
     * emit. The whole `-----BEGIN … -----END …-----` span is an unsplittable region:
     * the buffer detector only matches the complete block, so a cut inside it would
     * emit body bytes the buffered path masked. Treated like a straddled known token:
     * if the tentative `cut` falls inside the block owning it, pull back to that
     * block's `-----BEGIN`. The span end is the char after the END marker's closing
     * dashes, or the whole tail while the block is still unclosed (so the growing
     * body is held). Also holds a partial `-----BEGIN` marker forming at the tail so
     * a later chunk cannot orphan it. `cut === beginIdx` needs no pull — the marker
     * is already in the held tail.
     */
    private openArmorStart;
    /**
     * Move the cut left off any known token (secret value/placeholder, PII
     * value/surrogate) that straddles it — the one case snapToWhitespace and the
     * shape rules miss, because these keys can contain whitespace ("Dana Whitfield",
     * a seed phrase, a PEM value). Iterates to a local fixpoint since moving the cut
     * can expose another straddling key.
     */
    private knownTokenCrossingStart;
}
//# sourceMappingURL=guarded-stream.d.ts.map