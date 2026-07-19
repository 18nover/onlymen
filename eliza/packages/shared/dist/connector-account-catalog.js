/**
 * Shared catalog of per-connector account defaults
 * (`defaultRole` / `defaultPurpose` / `supportsOAuth`) for the plugin-managed
 * account inventory (#12087 Item 10, arch-audit roles-permissions).
 *
 * The audit's sanctioned pattern is "owner-declared, runtime-enforced": the
 * metadata that governs a connector account's default role / purpose / OAuth
 * capability belongs to the connector's declaration, not duplicated as literals
 * in the UI. This module is that single declaration site.
 *
 * It lives in `@elizaos/shared` — the package both the agent server and the UI
 * already depend on — so it can be the one catalog both consult. Today the
 * connector setup UI (`packages/ui/src/components/connectors/
 * connector-account-options.ts`) reads role / purpose / OAuth from here when
 * rendering plugin-managed account options. The server connector-account layer
 * (`@elizaos/core` connectors, `packages/agent/src/api/connector-*-routes.ts`)
 * is the intended next consumer so these defaults project from one place rather
 * than being re-declared; it does not import this catalog yet.
 *
 * The UI previously hardcoded these three fields per connector in its own map
 * (the `@deprecated CONNECTOR_PLUGIN_MANAGED_ACCOUNT_OPTIONS` literal). That
 * copy is now removed: the UI reads role / purpose / OAuth from this catalog and
 * only owns its presentation strings (label / title / description). A grep guard
 * test (`connector-account-catalog.test.ts`) asserts the authorization-relevant
 * defaults exist only here.
 *
 * IMPORTANT: this module is dependency-free (pure data + pure functions) so it
 * imports safely into the browser UI bundle without pulling `@elizaos/core`.
 * The role/purpose string unions are declared structurally here and are kept
 * in lockstep with `@elizaos/core`'s `ConnectorAccountRole` /
 * `ConnectorAccountPurpose` (see `packages/core/src/types/
 * connector-account-policy.ts`).
 */
/**
 * The plugin-managed connector account catalog: the single source of truth for
 * `defaultRole` / `defaultPurpose` / `supportsOAuth`.
 *
 * Values here MUST match the historical UI literals exactly — this is a
 * refactor of where the truth lives, not a behavior change. See the
 * per-connector default table in the PR for the before/after proof.
 */
export const CONNECTOR_ACCOUNT_CATALOG = [
    {
        connectorId: "telegram",
        provider: "telegram",
        defaultRole: "AGENT",
        defaultPurpose: ["messaging"],
        supportsOAuth: false,
    },
    {
        connectorId: "signal",
        provider: "signal",
        defaultRole: "OWNER",
        defaultPurpose: ["messaging"],
        supportsOAuth: false,
    },
    {
        connectorId: "google",
        provider: "google",
        defaultRole: "OWNER",
        defaultPurpose: ["messaging", "calendar", "drive", "meet"],
        supportsOAuth: true,
        aliases: ["gmail", "google-workspace"],
    },
    {
        connectorId: "x",
        provider: "x",
        defaultRole: "OWNER",
        defaultPurpose: ["posting", "reading", "messaging"],
        supportsOAuth: true,
        aliases: ["twitter"],
    },
    {
        connectorId: "slack",
        provider: "slack",
        defaultRole: "OWNER",
        defaultPurpose: ["messaging", "posting", "reading"],
        supportsOAuth: true,
    },
    {
        connectorId: "whatsapp",
        provider: "whatsapp",
        defaultRole: "AGENT",
        defaultPurpose: ["messaging"],
        supportsOAuth: false,
    },
];
const CONNECTOR_ACCOUNT_CATALOG_BY_ID = new Map(CONNECTOR_ACCOUNT_CATALOG.flatMap((entry) => [
    [entry.connectorId, entry],
    [entry.provider, entry],
    ...(entry.aliases ?? []).map((alias) => [alias, entry]),
]));
/**
 * Normalizes a raw connector id to its catalog key: lowercases, strips the
 * `@elizaos/plugin-` / `plugin-` prefixes, and folds the "twitter" alias onto
 * the canonical "x" id. Kept in lockstep with the UI's
 * `normalizeConnectorCatalogId` (the UI re-exports this).
 */
export function normalizeConnectorCatalogId(connectorId) {
    const normalized = connectorId
        .trim()
        .toLowerCase()
        .replace(/^@elizaos\/plugin-/, "")
        .replace(/^plugin-/, "");
    return normalized === "twitter" ? "x" : normalized;
}
/**
 * Resolves a connector id (canonical, provider, or alias form) to its catalog
 * entry, or `null` when the connector is not plugin-managed.
 */
export function getConnectorAccountCatalogEntry(connectorId) {
    if (!connectorId)
        return null;
    return (CONNECTOR_ACCOUNT_CATALOG_BY_ID.get(normalizeConnectorCatalogId(connectorId)) ?? null);
}
/** Whether the given connector id has a plugin-managed account catalog entry. */
export function hasConnectorAccountCatalogEntry(connectorId) {
    return getConnectorAccountCatalogEntry(connectorId) !== null;
}
//# sourceMappingURL=connector-account-catalog.js.map