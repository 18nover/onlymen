/**
 * Boot-time Eliza Cloud reachability probe.
 *
 * A single fast HEAD request to the resolved cloud API base URL, memoized for
 * the lifetime of the process so concurrent boot-time consumers (cloud-auth
 * key validation, plugin-registry network fetch) share one probe instead of
 * each waiting out their own multi-second timeout against an unreachable host.
 *
 * Memoization is on the in-flight promise, not on a persisted boolean: a
 * transient failure resolves to `false` for the rest of this boot but is never
 * written anywhere durable, so a later process start re-probes from scratch.
 */
/**
 * Resolves `true` when the Eliza Cloud API base URL answered a cheap probe
 * within ~1s, `false` when it did not. The probe runs at most once per process;
 * all callers await the same promise.
 */
export declare function isCloudReachable(): Promise<boolean>;
//# sourceMappingURL=is-cloud-reachable.d.ts.map