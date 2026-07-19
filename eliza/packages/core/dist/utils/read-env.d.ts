/** Canonical environment-variable reader. */
export interface ReadEnvOptions {
    /** Environment object to read from. Defaults to `process.env`. */
    env?: NodeJS.ProcessEnv;
    /** Value to return when the canonical name is not set. */
    defaultValue?: string;
}
export declare function readEnv(canonicalKey: string, options?: ReadEnvOptions): string | undefined;
/** Boolean form of {@link readEnv}: truthy when the value is `1`/`true`/`yes`/`on`. */
export declare function readEnvBool(canonicalKey: string, options?: Omit<ReadEnvOptions, "defaultValue"> & {
    defaultValue?: boolean;
}): boolean;
//# sourceMappingURL=read-env.d.ts.map