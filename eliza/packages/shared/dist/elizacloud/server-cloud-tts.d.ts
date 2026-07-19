export declare function __resetCloudBaseUrlCache(): void;
export declare function resolveElevenLabsApiKeyForCloudMode(env?: NodeJS.ProcessEnv): string | null;
export declare function ensureCloudTtsApiKeyAlias(env?: NodeJS.ProcessEnv): boolean;
export declare function resolveCloudTtsBaseUrl(env?: NodeJS.ProcessEnv): string;
export declare function resolveCloudTtsCandidateUrls(env?: NodeJS.ProcessEnv): string[];
/**
 * Upstream cloud STT endpoint (`POST /voice/stt`) candidates, derived from the
 * same base URL as TTS. Interactive web capture posts a WAV here through the
 * agent proxy (`/api/asr/cloud`) so `eliza-cloud` ASR is the real transcriber
 * instead of the engine-dependent browser SpeechRecognition. The `www`/apex
 * pairing mirrors the TTS resolver (both use `resolveWwwApexBaseSiblings`) so a
 * base URL written either way still resolves; there is no ElevenLabs-shaped
 * legacy STT compat route (unlike TTS), so only the canonical `/voice/stt` path
 * is queued.
 */
export declare function resolveCloudSttCandidateUrls(env?: NodeJS.ProcessEnv): string[];
/**
 * After a non-OK upstream response, only try the next URL for likely-transient /
 * wrong-route issues. Avoid retrying 401/402/429 etc. so we do not double-charge TTS.
 */
export declare function shouldRetryCloudTtsUpstream(status: number): boolean;
/** Matches `MAX_TEXT_LENGTH` in eliza-cloud-v2 `app/api/v1/voice/tts/route.ts`. */
export declare const ELIZA_CLOUD_TTS_MAX_TEXT_CHARS = 5000;
export declare function resolveElizaCloudTtsVoiceId(bodyVoiceId: unknown, env?: NodeJS.ProcessEnv): string;
export declare function normalizeElizaCloudTtsModelId(raw: string): string;
export declare function resolveCloudProxyTtsModel(bodyModel: unknown, env?: NodeJS.ProcessEnv): string;
export declare function mirrorCompatHeaders(req: {
    headers: Record<string, string | string[] | undefined>;
}): void;
/** Internal: expose the resolved cloud API key for the route handler that lives in plugin-elizacloud. */
export declare function _internalResolveCloudApiKey(env?: NodeJS.ProcessEnv): string | null;
//# sourceMappingURL=server-cloud-tts.d.ts.map