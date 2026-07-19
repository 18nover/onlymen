/**
 * Single source of truth for connector ↔ workflow credential type mappings, the
 * inverse map from workflow credential type back to a canonical provider id, and
 * user-facing display labels.
 *
 * Used by:
 *   - `connector-routes.ts` POST `/api/connectors` disconnect path → maps a
 *     connector name to the credential types that need cache-purging.
 *   - `app-core` AutomationsView's missing-credentials banner →
 *     `prettyCredName(credType)` for the connect-button label.
 *   - `app-core` connector deep-link → `providerFromCredType(credType)` for
 *     the canonical provider id used as the `data-connector` attribute.
 *
 * Keep these aligned: each entry in CONNECTOR_CRED_TYPES should round-trip
 * through `providerFromCredType` (cred type → provider) and a
 * provider-friendly label (`PROVIDER_LABELS`).
 */
/**
 * Connector name (as stored in `eliza.json` connectors block) →
 * the workflow credential type ids it owns. Disconnecting this connector should
 * purge the credential cache for every credType in this list.
 */
export declare const CONNECTOR_CRED_TYPES: Readonly<Record<string, readonly string[]>>;
export declare function credTypesForConnector(connectorName: string): readonly string[];
export declare function providerFromCredType(credType: string): string;
export declare function prettyCredName(credType: string): string;
//# sourceMappingURL=connector-cred-types.d.ts.map