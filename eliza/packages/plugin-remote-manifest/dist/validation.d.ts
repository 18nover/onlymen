/**
 * Safe parser/validator for `plugin.json`: `validateRemotePluginManifest` takes
 * untrusted JSON and returns a typed `RemotePluginManifest` or a structured
 * rejection, never trusting unvalidated fields. The trust boundary between an
 * on-disk/downloaded manifest and the install store.
 */
import { type JsonValue, type RemotePluginManifest } from "./types.js";
export interface RemotePluginManifestValidationIssue {
    path: string;
    message: string;
}
export type RemotePluginManifestValidationResult = {
    ok: true;
    manifest: RemotePluginManifest;
} | {
    ok: false;
    issues: RemotePluginManifestValidationIssue[];
};
export declare function isValidRemotePluginId(value: string): boolean;
export declare function validateRemotePluginManifest(value: JsonValue): RemotePluginManifestValidationResult;
//# sourceMappingURL=validation.d.ts.map