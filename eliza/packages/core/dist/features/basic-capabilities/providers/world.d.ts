/**
 * WORLD provider — injects world/environment context for the current room: the
 * world name, the current channel, participant count, and a per-type channel
 * breakdown (text/voice/dm/feed/thread/other) across every room in the world.
 * Degrades to an explanatory message when the room, its world id, or the world
 * record cannot be resolved. Part of the basic-capabilities bundle.
 */
import type { Provider } from "../../../types/index.js";
export declare const worldProvider: Provider;
export default worldProvider;
//# sourceMappingURL=world.d.ts.map