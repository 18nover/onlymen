/**
 * Owner-side read routes for the realtime trajectory viewer
 * (`GET /api/trajectories`, `/api/trajectories/:id`, `/api/trajectories/stats`).
 *
 * These live next to the data owner (`TrajectoriesService`, this package) so the
 * viewer wire shapes stay co-located with the service that produces the data,
 * instead of being hand-mirrored in the API host.
 *
 * The realtime trajectory viewer (`@elizaos/plugin-trajectory-logger`) polls
 * these. On desktop the richer routes from `@elizaos/plugin-training` own the
 * path (registered as runtime plugin routes) and handle the request first; this
 * handler is only reached when no plugin owns the path (mobile, or training
 * disabled). The core `TrajectoriesService` runs on every platform, so the
 * viewer works without `@elizaos/plugin-training` bundled.
 *
 * The API host mounts this AFTER runtime plugin routes, so when plugin-training
 * IS loaded its richer route wins and this handler is never reached — no
 * shadowing, no regression.
 */
import type { ServerResponse } from "node:http";
import type { IAgentRuntime } from "../../types/index.js";
/**
 * Handle the trajectory viewer READ routes from the core `TrajectoriesService`.
 * Returns `true` when the request was handled (even on error), `false` when the
 * path/method does not belong to these read routes.
 */
export declare function tryHandleTrajectoryReadRoutes(options: {
    pathname: string;
    method: string;
    url: URL;
    runtime: IAgentRuntime | null | undefined;
    res: ServerResponse;
}): Promise<boolean>;
//# sourceMappingURL=read-routes.d.ts.map