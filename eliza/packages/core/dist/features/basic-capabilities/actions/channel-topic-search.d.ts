/**
 * SEARCH_CHANNEL_TOPICS — cross-channel topic search (#8927).
 *
 * Surfaces the per-channel topic LRUs (#8925/#8926) as a query: "which channels
 * have been talking about X?". Ranks rooms whose recent topics match the query
 * tokens via `ChannelTopicsService.searchTopics`. Pairs with the
 * `/api/channel-topics/search` route registered by the basic-capabilities plugin.
 */
import type { Action } from "../../../types/index.js";
export declare const channelTopicSearchAction: Action;
//# sourceMappingURL=channel-topic-search.d.ts.map