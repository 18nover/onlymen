/**
 * Cross-channel topic search HTTP endpoint (#8927).
 *
 * GET /api/channel-topics/search?q=<query>&limit=<n> → ranks rooms whose recent
 * per-channel topic LRUs match the query, via `ChannelTopicsService.searchTopics`.
 * The in-chat counterpart is the SEARCH_CHANNEL_TOPICS action.
 */
import type { Route } from "../../types/plugin.js";
export declare const CHANNEL_TOPICS_SEARCH_ROUTE: Route;
export declare const CHANNEL_TOPICS_ROUTES: Route[];
//# sourceMappingURL=channel-topics-routes.d.ts.map