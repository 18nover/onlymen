import type { Room, World } from "../../types/environment.js";
import type { UUID } from "../../types/primitives.js";
import type { IAgentRuntime, MessageConnectorTarget } from "../../types/runtime.js";
type ParticipantUserState = "FOLLOWED" | "MUTED" | null;
export type EffectiveMuteState = {
    muted: false;
} | {
    muted: true;
    scope: "room";
    roomId: UUID;
} | {
    muted: true;
    scope: "server";
    worldId: UUID;
};
/** True when a timed mute carries an ISO expiry that has already passed. */
export declare function muteExpiryDue(untilIso: string | undefined, now: number): boolean;
/** Read-only: is this world under an active (non-expired) server-wide mute? */
export declare function worldMuteActive(world: World | null | undefined, now?: number): boolean;
/** Read-only: is this room under an active (non-expired) participant mute? */
export declare function roomMuteActive(participantState: ParticipantUserState, room: Room | null | undefined, now?: number): boolean;
/**
 * Resolve whether the agent is muted for an inbound message, applying the
 * timed-mute due-check as a side effect: a room or world whose
 * `agentMuteUntilIso` has passed is unmuted in place (participant state /
 * world metadata cleared) and no longer drops the turn.
 *
 * `roomIds` is the message's room first, then any ancestor rooms that should
 * inherit the mute (e.g. a Discord thread's parent channel). `worldId` may be
 * passed when the caller already knows it (connectors derive it without a DB
 * read); otherwise it is read from the first room record. Likewise
 * `primaryParticipantState` lets a caller that already fetched the first
 * room's participant state skip the refetch — the message pipeline reads it
 * for its LLM-off check just before this resolver runs.
 */
export declare function resolveEffectiveMuteState(runtime: IAgentRuntime, args: {
    roomIds: readonly UUID[];
    worldId?: UUID;
    primaryParticipantState?: ParticipantUserState;
}, now?: number): Promise<EffectiveMuteState>;
/**
 * Write or clear the server-wide mute on a world. Passing `null` unmutes.
 * Returns the updated world, or null when the world does not exist.
 */
export declare function setWorldMuteState(runtime: IAgentRuntime, worldId: UUID, mute: {
    untilIso?: string;
} | null): Promise<World | null>;
/**
 * Write or clear the timed-mute expiry on a room. Passing `null` clears any
 * stale expiry (an untimed mute must not inherit a previous timed one).
 * Throws when an expiry is requested for a room that does not exist — a
 * silently-unstored expiry would make the timed mute permanent again.
 */
export declare function setRoomMuteUntil(runtime: IAgentRuntime, roomId: UUID, untilIso: string | null): Promise<void>;
/**
 * Per-world muted flags for connector server listings (list_servers). A world
 * that already carries mute metadata is answered directly (a connector
 * returning the persisted record needs no refetch); one listed without it
 * falls back to the persisted world under the same id, so server-level mute
 * visibility does not depend on a connector's listServers fidelity. Read-only
 * — the inbound due-check owns expiry writes.
 */
export declare function resolveMutedWorldFlags(runtime: IAgentRuntime, worlds: readonly World[], now?: number): Promise<boolean[]>;
/**
 * Per-target muted flags for connector room listings (list_channels /
 * list_connections). Read-only — the inbound due-check owns expiry writes, so
 * an expired timed mute simply reports unmuted here. Targets map to rooms via
 * their explicit roomId or the canonical `createUniqueUuid(runtime, channelId)`
 * convention every connector uses for inbound messages; unknown mappings
 * report unmuted. A target that names a `parentChannelId` (a thread under a
 * channel, a channel under a category) also inherits that parent room's mute —
 * the same [room, parent] chain the inbound gate drops on — so a listing never
 * reports a thread unmuted while its messages are being dropped.
 */
export declare function resolveMutedTargetFlags(runtime: IAgentRuntime, targets: readonly MessageConnectorTarget[], now?: number): Promise<boolean[]>;
export {};
//# sourceMappingURL=mute-state.d.ts.map