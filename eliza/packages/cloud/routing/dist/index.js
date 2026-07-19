/**
 * Public surface for cloud-routing feature metadata and route resolution.
 */
export { DEFAULT_FEATURE_POLICY, FEATURE_IDS, FEATURE_POLICIES, FEATURES, getFeature, isFeature, isFeaturePolicy, } from "./features.js";
export { cloudServiceApisBaseUrl, getFeaturePolicy, getFeaturePolicyMap, isCloudConnected, resolveCloudRoute, resolveFeatureCloudRoute, toRuntimeSettings, } from "./resolve.js";
