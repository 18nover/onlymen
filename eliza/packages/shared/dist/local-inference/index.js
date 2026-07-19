/**
 * @elizaos/shared/local-inference
 *
 * Shared local-inference contract used by both the server-side service
 * (`@elizaos/app-core/src/services/local-inference`) and the UI client
 * (`@elizaos/ui/src/services/local-inference`). Type definitions live
 * here; runtime logic stays in `app-core` (server-side KV cache
 * management, llama-server lifecycle, conversation registry, metrics)
 * and `ui` (client wiring against the agent API).
 */
export { buildHuggingFaceResolveUrl, buildHuggingFaceResolveUrlCandidatesForPath, buildHuggingFaceResolveUrlForPath, DEFAULT_ELIGIBLE_MODEL_IDS, ELIZA_1_HF_REPO, ELIZA_1_HOSTED_MTP_TIER_IDS, ELIZA_1_MTP_TIER_IDS, ELIZA_1_ON_DEVICE_TIER_IDS, ELIZA_1_PLACEHOLDER_IDS, ELIZA_1_RELEASE_TIER_IDS, ELIZA_1_TIER_IDS, ELIZA_1_TIER_PUBLISH_STATUS, ELIZA_1_VISION_TIER_IDS, eliza1TierPublishStatus, FIRST_RUN_DEFAULT_MODEL_ID, findCatalogModel, isDefaultEligibleId, isOnDeviceTier, MODEL_CATALOG, } from "./catalog.js";
export { ELIZA_1_CONTEXT_TARGET, ELIZA_1_KV_QUANT, ELIZA_1_MIN_LOCAL_CONTEXT, selectBestEliza1Fit, } from "./device-fit.js";
export { GPU_PROFILE_IDS, GPU_PROFILES, matchGpuProfile, reservedHeadroomGb, } from "./gpu-profiles.js";
export { resolveHfDownloadBase, resolveHfDownloadBases, } from "./hf-proxy.js";
export { hasHuggingFaceToken, isHuggingFaceHost, resolveHubAuthHeaders, resolveHuggingFaceToken, } from "./hub-auth.js";
export { ManifestSignatureError, verifyManifestSignature, verifyManifestSignatureText, } from "./manifest-signature.js";
export { applyNetworkPolicy, classifyNetwork, DEFAULT_NETWORK_POLICY_PREFERENCES, evaluateNetworkPolicy, inQuietHours, } from "./network-policy.js";
export { DEFAULT_ROUTING_POLICY, isRoutingPolicy, ROUTING_POLICIES, } from "./routing-preferences.js";
export { classifyCatalogModelRuntimeClass, classifyInstalledModelRuntimeClass, withRuntimeClass, } from "./runtime-class.js";
export { computeGenerationThroughput, isGenerationCounters, } from "./throughput.js";
export { AGENT_MODEL_SLOTS, TEXT_GENERATION_SLOTS, } from "./types.js";
export { compareVoiceModelSemver, findVoiceModelVersion, latestVoiceModelVersion, VOICE_MODEL_VERSIONS, versionsFor, } from "./voice-models.js";
//# sourceMappingURL=index.js.map