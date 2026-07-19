/**
 * Feature registry for cloud-routing policy decisions.
 *
 * Each entry maps a routable capability to its per-agent setting key. Resolver
 * helpers derive the public feature union and policy map from this table.
 */
export const FEATURE_POLICIES = ["local", "cloud", "auto"];
export const DEFAULT_FEATURE_POLICY = "auto";
export const FEATURES = [
    {
        id: "llm",
        settingKey: "ELIZAOS_CLOUD_ROUTING_LLM",
        description: "Text and multimodal language model calls.",
    },
    {
        id: "rpc",
        settingKey: "ELIZAOS_CLOUD_ROUTING_RPC",
        description: "Blockchain RPC reads and writes.",
    },
    {
        id: "tool_use",
        settingKey: "ELIZAOS_CLOUD_ROUTING_TOOL_USE",
        description: "Tool/function execution (search, browser, code, etc.).",
    },
    {
        id: "embeddings",
        settingKey: "ELIZAOS_CLOUD_ROUTING_EMBEDDINGS",
        description: "Vector embeddings for memory and retrieval.",
    },
    {
        id: "media",
        settingKey: "ELIZAOS_CLOUD_ROUTING_MEDIA",
        description: "Image, audio, and video generation/processing.",
    },
    {
        id: "tts",
        settingKey: "ELIZAOS_CLOUD_ROUTING_TTS",
        description: "Text-to-speech synthesis.",
    },
    {
        id: "stt",
        settingKey: "ELIZAOS_CLOUD_ROUTING_STT",
        description: "Speech-to-text transcription.",
    },
];
export const FEATURE_IDS = FEATURES.map((f) => f.id);
const FEATURE_BY_ID = new Map(FEATURES.map((f) => [f.id, f]));
export function getFeature(id) {
    return FEATURE_BY_ID.get(id) ?? null;
}
export function isFeature(value) {
    return typeof value === "string" && FEATURE_BY_ID.has(value);
}
const FEATURE_POLICY_SET = new Set(FEATURE_POLICIES);
export function isFeaturePolicy(value) {
    return typeof value === "string" && FEATURE_POLICY_SET.has(value);
}
