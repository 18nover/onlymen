/**
 * Canonical names of the environment variables that drive end-to-end test
 * phases (ACME client creds, phase2/phase3 knobs, …). Centralized so tests and
 * their harnesses reference one authoritative set of env var names.
 */
export type TestEnvRecord = Record<string, string | undefined>;
export declare const TEST_ENV_NAMES: {
    readonly acmeClient: {
        readonly clientId: "ELIZA_ACME_CLIENT_ID";
        readonly clientSecret: "ELIZA_ACME_CLIENT_SECRET";
    };
    readonly phase2: {
        readonly sendTestMessage: "ELIZA_PHASE2_SEND_TEST_MESSAGE";
        readonly stopAfter: "ELIZA_PHASE2_STOP_AFTER";
    };
    readonly phase3: {
        readonly sendStreamMessage: "ELIZA_PHASE3_SEND_STREAM_MESSAGE";
        readonly cancelAfterMs: "ELIZA_PHASE3_CANCEL_AFTER_MS";
        readonly stopAfter: "ELIZA_PHASE3_STOP_AFTER";
    };
    readonly voiceE2e: {
        readonly bundle: "ELIZA_VOICE_E2E_BUNDLE";
        readonly dylib: "ELIZA_VOICE_E2E_DYLIB";
        readonly backend: "ELIZA_VOICE_E2E_BACKEND";
        readonly cases: "ELIZA_VOICE_E2E_CASES";
        readonly phrase: "ELIZA_VOICE_E2E_PHRASE";
        readonly report: "ELIZA_VOICE_E2E_REPORT";
        readonly audioDir: "ELIZA_VOICE_E2E_AUDIO_DIR";
        readonly maxWer: "ELIZA_VOICE_E2E_MAX_WER";
        readonly maxBargeMs: "ELIZA_VOICE_E2E_MAX_BARGE_MS";
        readonly maxFirstAudioMs: "ELIZA_VOICE_E2E_MAX_FIRST_AUDIO_MS";
        readonly eventsJson: "ELIZA_VOICE_E2E_EVENTS_JSON";
        readonly latencyBase: "ELIZA_VOICE_E2E_LATENCY_BASE";
        readonly allowTtsOnlyBargeIn: "ELIZA_VOICE_E2E_ALLOW_TTS_ONLY_BARGE_IN";
    };
};
export declare const TEST_ENV_FAMILIES: {
    readonly acmeClient: readonly ["ELIZA_ACME_CLIENT_ID", "ELIZA_ACME_CLIENT_SECRET"];
    readonly phase2: readonly ["ELIZA_PHASE2_SEND_TEST_MESSAGE", "ELIZA_PHASE2_STOP_AFTER"];
    readonly phase3: readonly ["ELIZA_PHASE3_SEND_STREAM_MESSAGE", "ELIZA_PHASE3_CANCEL_AFTER_MS", "ELIZA_PHASE3_STOP_AFTER"];
    readonly voiceE2e: readonly ["ELIZA_VOICE_E2E_BUNDLE", "ELIZA_VOICE_E2E_DYLIB", "ELIZA_VOICE_E2E_BACKEND", "ELIZA_VOICE_E2E_CASES", "ELIZA_VOICE_E2E_PHRASE", "ELIZA_VOICE_E2E_REPORT", "ELIZA_VOICE_E2E_AUDIO_DIR", "ELIZA_VOICE_E2E_MAX_WER", "ELIZA_VOICE_E2E_MAX_BARGE_MS", "ELIZA_VOICE_E2E_MAX_FIRST_AUDIO_MS", "ELIZA_VOICE_E2E_EVENTS_JSON", "ELIZA_VOICE_E2E_LATENCY_BASE", "ELIZA_VOICE_E2E_ALLOW_TTS_ONLY_BARGE_IN"];
};
export type TestEnvFamily = keyof typeof TEST_ENV_FAMILIES;
export interface AcmeClientTestEnv {
    clientId: string;
    clientSecret: string;
}
export interface Phase2SmokeTestEnv {
    sendTestMessage: boolean;
    stopAfter: boolean;
}
export interface Phase3SmokeTestEnv {
    sendStreamMessage: boolean;
    cancelAfterMs: number | null;
    stopAfter: boolean;
}
export interface VoiceE2eTestEnvDefaults {
    backend: string;
    cases: string;
    phrase: string;
    maxWer: number;
    maxBargeMs: number;
    maxFirstAudioMs: number;
}
export interface VoiceE2eTestEnv {
    bundle: string;
    dylib: string;
    backend: string;
    cases: string;
    phrase: string;
    report: string;
    audioDir: string;
    maxWer: number;
    maxBargeMs: number;
    maxFirstAudioMs: number;
    eventsJson: string;
    latencyBase: string;
    allowTtsOnlyBargeIn: boolean;
}
export declare function listTestEnvFamilyNames(family: TestEnvFamily): readonly string[];
export declare function setAcmeClientTestEnv(env: TestEnvRecord, values?: AcmeClientTestEnv): void;
export declare function readAcmeClientTestEnv(env: TestEnvRecord): AcmeClientTestEnv;
export declare function readPhase2SmokeTestEnv(env: TestEnvRecord): Phase2SmokeTestEnv;
export declare function readPhase3SmokeTestEnv(env: TestEnvRecord): Phase3SmokeTestEnv;
export declare function readVoiceE2eTestEnv(env: TestEnvRecord, defaults: VoiceE2eTestEnvDefaults): VoiceE2eTestEnv;
//# sourceMappingURL=test-env-config.d.ts.map