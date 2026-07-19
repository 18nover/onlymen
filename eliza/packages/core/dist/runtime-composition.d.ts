/**
 * Runtime composition: building blocks for creating elizaOS runtimes.
 *
 * This module provides a small, composable API so hosts (daemon, cloud, serverless,
 * eliza, etc.) can set up runtimes without duplicating adapter creation, plugin
 * resolution, or settings merge logic.
 *
 * **WHY a composition layer:** Different hosts need different flows (e.g. cloud may
 * use its own adapter pool and skip createRuntimes), but they share the need to
 * load characters, resolve plugins, create adapters before the runtime, and merge
 * DB-backed settings. This module composes existing helpers so each host can use
 * the pieces it needs.
 *
 * **Exports:**
 * - loadCharacters(sources, options?) – JSON file paths (strings) and/or inline CharacterInput; optional `cwd` for relative paths.
 * - getBasicCapabilitiesSettings(character) – flatten character + env for adapter factories (basic-capabilities only).
 * - mergeSettingsInto(character, agentRecord) – pure merge of DB agent into character (for custom pipelines).
 * - createRuntimes(characters, options?) – full pipeline; options carry adapter override, provision, logLevel, etc.
 *
 * **Settings divide:** Adapter factories receive only *basic-capabilities* settings (character + env).
 * Runtime settings from the DB are merged *after* the adapter is created and used when
 * constructing the runtime. WHY: You cannot load settings from the DB until the adapter
 * is connected; basic-capabilities settings (e.g. POSTGRES_URL, PGLITE_DATA_DIR) are what you
 * need to create the adapter in the first place.
 */
import type { CharacterInput } from "./character.js";
import { type PluginResolver } from "./plugin.js";
import type { Character, IAgentRuntime, IDatabaseAdapter } from "./types/index.js";
import type { Plugin } from "./types/plugin.js";
/**
 * Flatten character.settings, character.secrets, and env into a single Record<string, string>.
 * Used when calling adapter factories (Plugin.adapter(agentId, settings)).
 *
 * **WHY basic-capabilities-only:** Adapter factories run *before* the database is connected. They
 * cannot read runtime settings from the DB. Only settings available from character config
 * and process.env (e.g. POSTGRES_URL, PGLITE_DATA_DIR, MONGODB_URI) are valid here. Runtime
 * settings (API keys, model prefs, etc.) are merged later from the DB via mergeSettingsInto.
 *
 * **Merge order:** env first, then character.settings (excluding nested secrets object),
 * then character.settings.secrets, then character.secrets. Later sources override earlier
 * (character overrides env). WHY: Allows env defaults while letting character config override.
 *
 * @param character - Character to read settings and secrets from
 * @param env - Environment record (defaults to process.env)
 * @returns String-only record suitable for adapter factories
 */
export declare function getBasicCapabilitiesSettings(character: Character, env?: NodeJS.ProcessEnv): Record<string, string>;
/**
 * Minimal shape of an agent record as returned from the database (e.g. getAgentsByIds).
 * Used by mergeSettingsInto so callers can pass either a full Agent or a subset with
 * settings/secrets. WHY loose type: Custom hosts (e.g. cloud) may have their own
 * agent-like structures; this keeps the merge logic reusable.
 */
export interface AgentRecordForMerge {
    settings?: Record<string, unknown>;
    secrets?: Record<string, unknown>;
}
/**
 * Merge DB-backed agent settings and secrets into a character (pure, no DB call).
 * Same merge order as mergeDbSettings in provisioning.ts: DB base, character overrides.
 *
 * **WHY exported:** Custom hosts (e.g. cloud with its own adapter pool and caching) may
 * load agent records themselves and need to apply the same merge semantics without
 * calling mergeDbSettings (which takes an adapter and does the DB fetch). This function
 * is the pure merge step only.
 *
 * @param character - Character to merge into (not mutated)
 * @param agentRecord - Agent record from DB (e.g. getAgentsByIds result item), or null
 * @returns New character with merged settings and secrets
 */
export declare function mergeSettingsInto(character: Character, agentRecord: AgentRecordForMerge | null): Character;
/** Options for {@link loadCharacters}. */
export interface LoadCharactersOptions {
    /**
     * Base directory for resolving relative file paths in `sources`.
     * Defaults to `process.cwd()`.
     */
    cwd?: string;
}
/**
 * Load characters from file paths and/or inline character objects.
 * String entries are UTF-8 JSON files (`.json`). Uses `parseCharacter`.
 *
 * **WHY accept mixed sources:** Daemons often load from files; programmatic hosts (e.g. cloud,
 * serverless) may build character config in code. One API supports both.
 *
 * @param sources - Relative or absolute JSON file paths, or CharacterInput objects
 * @param options - Optional `cwd` for relative paths
 * @returns Validated Character[] (empty array if sources is empty)
 * @throws If a file path fails to load or an object fails validation (message includes path/details)
 */
export declare function loadCharacters(sources: Array<CharacterInput | string>, options?: LoadCharactersOptions): Promise<Character[]>;
/** Options for {@link createRuntimes} (second argument). */
export interface CreateRuntimesOptions {
    /** Override: use this adapter for all characters (skip adapter discovery). WHY: Cloud/custom hosts may manage their own adapter pool. */
    adapter?: IDatabaseAdapter;
    /** Extra plugins to include for all characters (merged with character.plugins). WHY: Hosts like eliza add their own plugin without putting it in every character file. */
    sharedPlugins?: Plugin[];
    /** Run provisioning after init: migrations once per unique adapter, then ensureAgentInfrastructure + ensureEmbeddingDimension per runtime. Default false. WHY: Daemons need it once at boot; serverless/ephemeral usually skip. */
    provision?: boolean;
    /** Log level for created runtimes. */
    logLevel?: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
    /** Extra settings applied to each runtime (e.g. MODEL_PROVIDER override). */
    settings?: Record<string, string | boolean | number>;
    /** When false, the runtime always responds (e.g. direct chat / harness). Passed to AgentRuntime. */
    checkShouldRespond?: boolean;
    /**
     * Resolves string plugin references (from character config) to Plugin
     * objects. Core never imports plugins by name or installs packages; hosts
     * inject this. When omitted, string plugin references are skipped.
     */
    pluginResolver?: PluginResolver;
}
/**
 * Create runtimes from characters: resolve plugins once (batch), create adapters from
 * plugin adapter factory, init adapters (deduped), batch merge DB settings per unique
 * adapter, create AgentRuntime instances, initialize them, optionally provision.
 *
 * **WHY batch where possible:** Resolving plugins once for all characters avoids duplicate
 * work and keeps dependency order consistent. getAgentsByIds is called once per unique
 * adapter with all agent IDs for that adapter (not once per character). WHY: Fewer DB
 * round-trips when multiple characters share the same DB.
 *
 * **Adapter discovery:** The first resolved plugin that defines an adapter factory
 * (Plugin.adapter) is used. If options.adapter is set, that overrides and is used for
 * all characters. WHY: One adapter per character is the common case; shared override
 * supports custom pooling. Plugins that only attach the DB in `init` (some `@elizaos/plugin-sql`
 * builds) expose no `adapter` factory — pass `options.adapter` from `createDatabaseAdapter`
 * (or equivalent) instead.
 *
 * @param characters - Validated characters (e.g. from loadCharacters)
 * @param options - Optional adapter override, sharedPlugins, provision, logLevel, settings
 * @returns Initialized IAgentRuntime[] (empty if characters is empty)
 */
export declare function createRuntimes(characters: Character[], options?: CreateRuntimesOptions): Promise<IAgentRuntime[]>;
//# sourceMappingURL=runtime-composition.d.ts.map