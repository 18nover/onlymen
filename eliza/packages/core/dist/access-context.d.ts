import type { AccessContext, IAgentRuntime, Memory } from "./types/index.js";
/**
 * Build the {@link AccessContext} for a message-driven read: who is asking, in
 * which world, and with what role.
 *
 * `worldId`, `role`, and `isOwner` are resolved together from the SINGLE world
 * that {@link resolveWorldForMessage} picks for the message — the room's
 * `worldId`, else the connector-metadata fallback (e.g. a Discord server/channel
 * id). Deriving all three from one resolution is load-bearing: resolving the
 * role against one world while reading `worldId` off a different path can yield
 * `role: "OWNER"` with `worldId: undefined` — an elevated role with no tenant
 * scope. Outside a world (DMs, or a message with no resolvable world) all three
 * are left undefined, which callers must treat as "no elevated access" rather
 * than "unrestricted".
 */
export declare function buildAccessContext(runtime: IAgentRuntime, message: Memory): Promise<AccessContext>;
//# sourceMappingURL=access-context.d.ts.map