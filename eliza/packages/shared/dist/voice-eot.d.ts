/**
 * Heuristic end-of-turn (EOT) scoring — the single source of truth (#8786).
 *
 * The semantic "is the speaker done?" syntactic heuristic used to be implemented
 * twice with drifted behavior: the UI shell capture path
 * (`packages/ui/src/voice/end-of-turn.ts:scoreEndOfTurn`) and the plugin's
 * Tier-3 classifier (`plugin-local-inference .../voice/eot-classifier.ts:
 * HeuristicEotClassifier`). The two had diverged — different rule ORDERING
 * (the plugin scored a 2-word trail-off like "and so" as a complete short
 * command; the UI correctly held it), a missing ellipsis rule on the plugin
 * side, and a different question-tag set. This module is the one canonical
 * implementation both surfaces consume.
 *
 * It lives in `@elizaos/shared` (which both already depend on), is pure +
 * browser-safe (no Node deps), and ships via the `@elizaos/shared/voice-eot`
 * subpath without pulling the whole barrel — mirroring `voice-wer`.
 *
 * The fused composite EOT (ABI v11, `CompositeEotClassifier`) is preferred when
 * the loaded native build wires the semantic model; it blends THIS heuristic as
 * its high-precision syntactic co-signal, so consolidating here also feeds the
 * model path one definition.
 */
/**
 * Probability in [0,1] that `transcript` is a COMPLETE turn (the speaker is
 * done). High → commit; low → the utterance trails off, keep listening.
 *
 * Rules fire in priority order; the first match wins:
 *
 *   1  Trailing ellipsis ("…" / "..")                       0.20  (trail-off)
 *   2  Sentence-final punctuation (. ! ?)                   0.95
 *   3  Question-tag suffix ("right?", "yeah", "correct")    0.85
 *   4  Trailing conjunction (and / but / because / …)       0.15  (mid-clause)
 *   5  Trailing filler / hedge (um / uh / maybe / …)        0.20  (holding floor)
 *   6  Trailing preposition / article (to / the / with …)   0.20  (incomplete NP)
 *   7  Dangling modal/auxiliary (could / would / is / …)    0.20  (incomplete clause)
 *   8  Short utterance (< 3 words, no trail-off)            0.70  (command/ack)
 *   9  No signal                                            0.50
 *
 * Note the continuation checks precede the short-utterance rule so a 2-word
 * trail-off ("and so", "going to", "we could") is NOT misread as a complete
 * short command.
 */
export declare function scoreEndOfTurnHeuristic(transcript: string): number;
//# sourceMappingURL=voice-eot.d.ts.map