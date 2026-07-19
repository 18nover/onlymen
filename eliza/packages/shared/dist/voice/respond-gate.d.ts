/**
 * Canonical client-side shouldRespond / echo-rejection gate for always-on voice.
 *
 * In always-on ("hands-free") mode the mic is open continuously, so the
 * recognizer transcribes EVERYTHING it hears — the agent's own text-to-speech
 * bleeding back into the mic, the speaker's disfluent thinking noises ("um…"),
 * and other people in the room. Sending those as turns makes the agent reply to
 * itself, to filler, or to a bystander — the "responding when it's not
 * appropriate" problem.
 *
 * This is the SINGLE definition of that gate, shared by:
 *   - the UI shell capture loop (`@elizaos/ui` `voice/should-respond` +
 *     `voice/voice-turn-signal` re-export from here), and
 *   - the Voice Workbench headless runner (the plugin's real-decision-logic
 *     services adapter calls these so the benchmark exercises the SAME code the
 *     client runs — no drift between what we test and what we ship).
 *
 * Pure (no DOM, no I/O); the only dependency is the canonical syntactic EOT
 * heuristic in `@elizaos/shared/voice-eot`.
 */
/** How recent the agent's reply must be for the echo guard to apply. */
export declare const ECHO_WINDOW_MS = 9000;
/** Word-overlap fraction above which a turn is treated as TTS echo. */
export declare const ECHO_OVERLAP_THRESHOLD = 0.7;
export interface ShouldRespondContext {
    /** The agent's most recent spoken reply, for the echo guard. */
    recentAgentReply?: string;
    /** Age of that reply in ms; the echo guard applies while it's recent. */
    replyAgeMs?: number;
    /**
     * True while the agent is CURRENTLY speaking. Forces the echo guard on
     * regardless of `replyAgeMs`, because a long reply's TTS is actively bleeding
     * into the open mic even though its message was created many seconds ago (the
     * age-only window would have already expired mid-speech).
     */
    agentSpeaking?: boolean;
}
/**
 * Whether a transcribed voice turn should be sent to the agent (i.e. warrants a
 * response). Returns false for pure disfluency and for near-verbatim echoes of
 * the agent's recent speech.
 */
export declare function shouldRespondToVoiceTurn(transcript: string, context?: ShouldRespondContext): boolean;
/** Mirrors the server-side VoiceTurnSignalMetadata shape the gate parses. */
export interface VoiceTurnSignal {
    endOfTurnProbability: number;
    nextSpeaker: "agent" | "user" | "unknown";
    agentShouldSpeak: boolean;
    source: string;
}
/** Live speaker attribution from diarization (only where audio frames exist). */
export interface VoiceTurnSpeakerAttribution {
    /** Enrolled entity this turn was attributed to, or null when unknown. */
    entityId: string | null;
    /** Match confidence 0..1 (cosine-rescaled by the attribution pipeline). */
    confidence: number;
    /** True when attributed to the device owner / primary enrolled speaker. */
    isOwner?: boolean;
}
export interface BuildVoiceTurnSignalContext extends ShouldRespondContext {
    /** Speaker attribution for this turn (diarization; desktop/server only). */
    speaker?: VoiceTurnSpeakerAttribution;
    /** True when a wake word ("hey eliza") fired within the recent listen window. */
    wakeWordActive?: boolean;
    /** Entity ids the agent answers to without a wake word (owner + enrolled). */
    knownSpeakerEntityIds?: readonly string[];
    /**
     * Cosine similarity (0..1) of THIS turn's speaker embedding against the
     * agent's own TTS-voice imprint, when the speaker encoder is available. High =
     * the agent is hearing ITSELF (its TTS bled back into the mic). This is the
     * ACOUSTIC self-echo signal — it catches an echo the transcript word-overlap
     * guard misses (a mis-transcribed echo whose words don't match the reply).
     */
    selfVoiceSimilarity?: number;
    /**
     * Decision threshold for `selfVoiceSimilarity`. The threshold is a property
     * of the MEASUREMENT SOURCE, so it travels with the value: the MFCC-timbre
     * workbench measure clears {@link AGENT_SELF_VOICE_THRESHOLD} (the default),
     * while a WeSpeaker-embedding cosine against the agent's TTS centroid sits on
     * a much lower scale (self ~0.37 vs human ~0.15) and must be gated at
     * {@link AGENT_SELF_VOICE_IMPRINT_THRESHOLD} instead — at the 0.7 bar the
     * production imprint could never fire.
     */
    selfVoiceThreshold?: number;
}
/** Server SUPPRESS threshold for EOT — below this reads as "user still talking". */
export declare const SERVER_EOT_SUPPRESS_THRESHOLD = 0.4;
/** Only a CONFIDENT bystander attribution is allowed to silence a turn. */
export declare const BYSTANDER_SUPPRESS_CONFIDENCE = 0.7;
/**
 * Cosine at/above which an incoming turn is treated as the agent's OWN voice and
 * hard-suppressed. WeSpeaker enrolls the device owner at ~0.78; the agent's own
 * TTS imprint is a tighter, single-source match, so a slightly lower bar is
 * safe and catches echo the transcript guard cannot.
 */
export declare const AGENT_SELF_VOICE_THRESHOLD = 0.7;
/**
 * Agent-specific decision threshold for a **WeSpeaker-embedding** cosine
 * against the agent's own TTS-voice centroid (`AgentSelfVoiceImprint`).
 * Measured margins (`research/VOICE_8785_ASSESSMENT.md` §6, real on-device
 * encoder): the agent's synthesized voice embeds ~0.37 self-similar while
 * human speech lands ~0.15 (down to −0.13) — a clear but LOW-scale margin, so
 * the 0.78 human-enrollment bar (and the 0.7 MFCC bar above) can never fire on
 * it. 0.28 splits the measured margin; the documented safe range is 0.25–0.30.
 */
export declare const AGENT_SELF_VOICE_IMPRINT_THRESHOLD = 0.28;
export declare function buildVoiceTurnSignal(transcript: string, context?: BuildVoiceTurnSignalContext): VoiceTurnSignal;
//# sourceMappingURL=respond-gate.d.ts.map