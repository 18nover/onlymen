/**
 * CHANNEL_TOPICS — turn-scoped provider that surfaces the current channel's
 * topic LRU (maintained by `ChannelTopicsService`) back into Stage-1 routing.
 *
 * Renders `# Current topics in this channel: <comma-list>` when the room has
 * any recorded topics, and a no-op empty result otherwise. Opting into
 * `alwaysInResponseState` puts it into the Stage-1 response state (alongside
 * FACTS / CURRENT_TIME) so shouldRespond / the planner can weigh topic
 * relevance even on the simple direct-reply path.
 *
 * Read-only: the provider never records topics — that happens post-parse in the
 * message handler. It just reflects what the service already holds (hydrating
 * from room metadata on a cold cache after restart).
 */
import type { Provider } from "../../../types/index.js";
export declare const channelTopicsProvider: Provider;
//# sourceMappingURL=channelTopics.d.ts.map