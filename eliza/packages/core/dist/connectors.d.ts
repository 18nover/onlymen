/**
 * Connector source registry: canonicalizes and classifies the `source` tag
 * carried on inbound messages (discord, telegram, farcaster, ...). Owners
 * register a canonical source with aliases and metadata (`sourceKind`
 * active/passive, `isPassive`); lookups normalize a raw source to its canonical
 * form, expand a source filter across all known aliases, and report whether a
 * source is passive.
 *
 * State is process-global and owner-scoped: registrations accumulate per owner
 * and merge on read, so plugins can contribute aliases without clobbering each
 * other, and an owner's contributions can be unregistered wholesale.
 */
export type ConnectorSourceKind = "passive" | "active";
/**
 * Declares how a connector projects the flat identity fields it stamps on a
 * Memory's top-level metadata into the nested `metadata[source]` identity object
 * that role resolution consumes (`{ userId, id, name, username }`). Owning this
 * mapping on the connector's registered source metadata is what lets core stop
 * special-casing individual connectors (e.g. Discord's `fromId`/`entityName`)
 * inside `roles.ts` — the projection lives with the connector, not in a trunk
 * `source === "discord"` branch (#12090 item 22 / #12087).
 */
export interface ConnectorIdentityMetadataMapping {
    /** Flat metadata key holding the stable platform user id (maps to `userId` + `id`). */
    userIdField: string;
    /** Optional flat metadata key holding a display/handle (maps to `name` + `username`). */
    nameField?: string;
}
export interface ConnectorSourceMetadata {
    aliases?: readonly string[];
    sourceKind?: ConnectorSourceKind;
    isPassive?: boolean;
    /**
     * How this connector's flat Memory metadata fields project into the nested
     * `metadata[source]` identity object used by role resolution. When present,
     * core reads identity from the declared fields instead of a connector-specific
     * literal branch.
     */
    identityMetadataMapping?: ConnectorIdentityMetadataMapping;
    /**
     * Ordered list of flat Memory metadata keys this connector uses to derive a
     * world id (first present, non-empty string wins). Replaces connector-specific
     * literals like `discordServerId`/`discordChannelId` in core.
     */
    worldIdMetadataKeys?: readonly string[];
}
export interface ConnectorSourceDefinition extends ConnectorSourceMetadata {
    source: string;
}
export declare function registerConnectorSourceAliases(canonical: string, aliases: readonly string[]): void;
export declare function registerConnectorSourceMetadata(canonical: string, metadata: ConnectorSourceMetadata, owner?: string): void;
export declare function registerConnectorSourceDefinitions(definitions: readonly ConnectorSourceDefinition[] | null | undefined, owner?: string): void;
export declare function unregisterConnectorSourceMetadataOwner(owner: string): void;
export declare function normalizeConnectorSource(source: string | null | undefined): string;
export declare function getConnectorSourceAliases(source: string | null | undefined): string[];
export declare function getConnectorSourceMetadata(source: string | null | undefined): ConnectorSourceMetadata | null;
export declare function isPassiveConnectorSource(source: string | null | undefined): boolean;
/**
 * The declared flat-field → nested-identity projection for a connector source,
 * or `null` if the connector registered none. Lets core read a connector's
 * identity mapping from the registry instead of a `source === "..."` literal.
 */
export declare function getConnectorIdentityMetadataMapping(source: string | null | undefined): ConnectorIdentityMetadataMapping | null;
/**
 * The ordered flat metadata keys a connector uses to derive a world id, or an
 * empty array if none were declared. Replaces connector-specific world-id
 * literals in core.
 */
export declare function getConnectorWorldIdMetadataKeys(source: string | null | undefined): string[];
export declare function expandConnectorSourceFilter(sources: Iterable<string> | null | undefined): Set<string>;
/**
 * Owner key for the built-in, legacy Discord connector-source metadata registered
 * below. The Discord plugin lives outside this monorepo, so the flat-field →
 * identity / world-id projection it needs is registered here as an explicit,
 * grep-able legacy default instead of remaining as `source === "discord"`
 * literal branches inside core's `roles.ts` (#12090 item 22 / #12087). When the
 * Discord plugin registers its own `connectorSources` mapping at runtime, that
 * owner-scoped registration merges over this default (registered metadata wins in
 * {@link mergeMetadata}); this default only backstops back-compat.
 */
export declare const LEGACY_DISCORD_CONNECTOR_SOURCE_OWNER = "core:legacy-discord-metadata";
/**
 * The Discord identity/world-id field projection previously hardcoded in
 * `roles.ts`. Declared here as connector-owned registry metadata so core reads it
 * generically. `fromId`/`entityName` were the flat Memory metadata keys Discord
 * stamps; `discordServerId`/`discordChannelId` were the world-id derivation keys.
 */
export declare const LEGACY_DISCORD_CONNECTOR_SOURCE_METADATA: ConnectorSourceMetadata;
//# sourceMappingURL=connectors.d.ts.map