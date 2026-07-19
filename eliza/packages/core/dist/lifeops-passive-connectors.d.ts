/**
 * Resolves whether LifeOps passive connectors are enabled, reading the
 * `ELIZA_LIFEOPS_PASSIVE_CONNECTORS` / `LIFEOPS_PASSIVE_CONNECTORS` setting from
 * a runtime (`getSetting`) first, then the process env. Defaults to enabled;
 * only an explicit falsey value (`0`/`false`/`off`/`no`/`disabled`) disables it.
 */
type SettingsReader = {
    getSetting?: (key: string) => unknown;
};
type EnvLike = Record<string, string | undefined>;
export declare function lifeOpsPassiveConnectorsEnabled(runtime?: SettingsReader | null, env?: EnvLike): boolean;
export {};
//# sourceMappingURL=lifeops-passive-connectors.d.ts.map