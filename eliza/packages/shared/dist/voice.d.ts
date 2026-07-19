/**
 * Shared voice-related types and data used by VoiceConfigView, CharacterView,
 * and any other app that provides ElevenLabs / Edge voice selection.
 */
export interface VoicePreset {
    id: string;
    name: string;
    nameKey?: string;
    voiceId: string;
    gender: "female" | "male" | "character";
    hint: string;
    hintKey?: string;
    previewUrl: string;
}
/**
 * Sanitize API keys: mask strings that look like real keys, pass through
 * empty/redacted values.
 */
export declare function sanitizeApiKey(apiKey: string | undefined): string | undefined;
/**
 * Treat only non-redacted, non-masked values as usable API keys. Persisted
 * redacted or masked values like "[REDACTED]" or "abcd...wxyz" are display-only.
 */
export declare function hasConfiguredApiKey(apiKey: string | null | undefined): boolean;
export declare const PREMADE_VOICES: VoicePreset[];
export declare const VOICE_PROVIDERS: Array<{
    id: "eliza-cloud" | "elevenlabs" | "edge" | "local-inference";
    label: string;
    labelKey: string;
    hint: string;
    hintKey: string;
    needsKey: boolean;
    requiresCloud?: boolean;
}>;
/**
 * ASR (automatic speech recognition) provider catalogue. Mirrors
 * `VOICE_PROVIDERS` so the settings UI can render a provider picker for
 * speech-to-text. The legacy whisper.cpp pipeline has been retired —
 * on-device transcription now runs through the local-inference ASR bundle.
 * Release catalog checks gate the bundle lineage before it can be selected.
 */
export declare const ASR_PROVIDERS: Array<{
    id: "local-inference" | "eliza-cloud" | "openai";
    label: string;
    labelKey: string;
    hint: string;
    hintKey: string;
    needsKey: boolean;
}>;
/**
 * Minimal backup voices for non-ElevenLabs providers (Edge TTS / OpenAI).
 * Only a male and female option — keeps the UI uncluttered when premium
 * voices aren't available.
 */
export declare const EDGE_BACKUP_VOICES: VoicePreset[];
//# sourceMappingURL=voice.d.ts.map