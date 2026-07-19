/**
 * Local inference shared types.
 *
 * Shared contracts referenced by the server-side service in
 * `@elizaos/app-core` and the UI client in `@elizaos/ui`.
 *
 * Server-only logic (KV cache management, native runtime lifecycle,
 * conversation registry, metrics scraping) stays in `app-core`; only
 * the type contracts live here.
 */
export const AGENT_MODEL_SLOTS = [
    "TEXT_SMALL",
    "TEXT_LARGE",
    "TEXT_EMBEDDING",
    "TEXT_TO_SPEECH",
    "TRANSCRIPTION",
];
export const TEXT_GENERATION_SLOTS = [
    "TEXT_SMALL",
    "TEXT_LARGE",
];
//# sourceMappingURL=types.js.map