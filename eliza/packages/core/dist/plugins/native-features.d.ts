import { __setDocumentUrlFetchImplForTests, DocumentService, type FetchDocumentFromUrlOptions, type FetchedDocumentUrl, type FetchedDocumentUrlKind, fetchDocumentFromUrl, isYouTubeUrl } from "../features/documents/index.js";
import { trajectoriesPlugin } from "../features/trajectories/index.js";
import { FollowUpService } from "../services/followUp.js";
import { RelationshipsService } from "../services/relationships.js";
import type { Plugin } from "../types/plugin.js";
import type { ServiceTypeName } from "../types/service.js";
export type NativeRuntimeFeature = "documents" | "relationships" | "trajectories" | "advancedPlanning" | "advancedMemory";
export declare const relationshipsPlugin: Plugin;
export declare const nativeRuntimeFeaturePlugins: Record<NativeRuntimeFeature, Plugin>;
export declare function getNativeRuntimeFeaturePlugin(feature: NativeRuntimeFeature): Plugin;
export declare const nativeRuntimeFeaturePluginNames: Record<NativeRuntimeFeature, string>;
export declare const nativeRuntimeFeatureDefaults: Record<NativeRuntimeFeature, boolean>;
export declare const nativeRuntimeFeatureServiceTypes: Record<NativeRuntimeFeature, ServiceTypeName[]>;
export declare function resolveNativeRuntimeFeatureFromServiceType(serviceType: ServiceTypeName | string): NativeRuntimeFeature | null;
export declare function resolveNativeRuntimeFeatureFromPluginName(pluginName: string | null | undefined): NativeRuntimeFeature | null;
export { createDocumentsPlugin, documentsPlugin, documentsPluginCore, documentsPluginHeadless, } from "../features/documents/index.js";
export type { FetchDocumentFromUrlOptions, FetchedDocumentUrl, FetchedDocumentUrlKind, };
export { __setDocumentUrlFetchImplForTests, DocumentService, FollowUpService, fetchDocumentFromUrl, isYouTubeUrl, RelationshipsService, trajectoriesPlugin, };
//# sourceMappingURL=native-features.d.ts.map