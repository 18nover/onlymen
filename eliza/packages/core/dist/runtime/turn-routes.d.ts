/**
 * HTTP routes for turn control.
 *
 * Exposes the turn-scoped AbortController registry over a small HTTP surface
 * so UI stop buttons, connector cancel-on-typing, and external orchestrators
 * can abort the agent's in-flight work for a given room.
 *
 * Routes:
 *   POST /api/turns/:roomId/abort
 *     body: { reason?: string }
 *     200 { aborted: true }   — the active turn was aborted
 *     200 { aborted: false }  — no active turn (idempotent)
 *
 *   GET /api/turns/:roomId
 *     200 { active: boolean, hasSignal: boolean }
 *
 * Registered by the basic-capabilities plugin so every runtime gets them.
 */
import type { Route } from "../types/plugin.js";
export declare const TURN_CONTROL_ROUTES: ReadonlyArray<Route>;
//# sourceMappingURL=turn-routes.d.ts.map