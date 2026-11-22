# OnlyMen Nearby (Phase 1, ONL-10)

Behind `ONLYMEN_NEARBY=on` (set in `wrangler.jsonc` for the onlymen Worker only;
unset, so off, on Vercel/onlymen.gay). Off = `/nearby` says "Not found", the nav
link is hidden and every Nearby server function refuses.

## Privacy model (what is and isn't stored)

* **No raw coordinates anywhere, ever.** The browser sends lat/lng once per
  update in a POST body. The server-function *input validator*
  (`snapInput`, `src/lib/nearby/geo.ts`) converts them to a geohash cell
  (precision 6, ≈ 1.2 km × 0.6 km) and returns only `{ cell }`; the handler,
  the database and logs never see the coordinates. Nothing location-related is
  ever in a URL (all Nearby calls are POST).
* **No history.** `om_location` has one row per member holding the *current*
  cell, updated in place, plus `updated_at` and a move-rate counter. No
  lat/lng columns exist; the `cell` column only accepts a 6-char geohash.
* **Distances are buckets** (`< 1 km`, `1–2 km`, `2–5 km`, `5–10 km`,
  `10–25 km`, `25–50 km`, `50+ km`), computed between cell centres, and the
  order inside a bucket is shuffled (seed per viewer per day). Responses never
  contain a cell id, a raw distance or a coordinate.
* **Map pins are opt-in** (off by default) and are a random point in the cell
  grown by 50 % on each side, deterministic per member per UTC day (HMAC of a
  random per-member seed + the day, keyed from `BETTER_AUTH_SECRET`). Every
  viewer sees the same pin all day, so repeated requests give nothing to
  average; averaging across days converges to the *cell centre*, not the
  person. No pin while in the 3×3-cell "home zone", in incognito, appear
  offline or hide-distance mode.
* **Spoofing / trilateration.** Origins are always the viewer's own stored cell
  (or, if he hasn't shared, Cloudflare's per-request city-level IP location,
  snapped and never stored). Location updates are limited to one per 20 s,
  12 cell changes per hour, and no jumps faster than 900 km/h. The tests prove
  two different true points in one cell produce *identical* observations for an
  attacker who moves across a grid of cells, so at best an attacker learns the
  ~1.2 km cell, never the exact spot.
* **Blocks hide both ways** (grid and map) and delete taps/saves both ways.
* **Delete my location** removes the row; stopping sharing is one tap.
* Logs: Nearby code logs only an error code, never inputs.

## Pieces

| What | Where |
| --- | --- |
| Migration | `migrations/0007_nearby.sql` (additive: `om_location`, `om_presence`, `om_plus`, `om_block`, `om_tap`, `om_save`, `om_report`, `om_report_audit` (append-only)) |
| Pure logic | `src/lib/nearby/geo.ts` (geohash, buckets, plan limits, pins, move limits, presence) |
| Data access | `src/lib/nearby/repo.server.ts` |
| Server fns | `src/lib/nearby/api.ts` |
| Pages | `/nearby` (grid, opt-in map, privacy panel), `/admin/reports` (owner/admin: report queue, resolve/dismiss with audit, Plus grant) |
| Map | MapLibre GL JS (BSD-3, npm) + OpenFreeMap "liberty" style. Free, no key. Loaded only in the browser when the map is opened. |
| Tests | `src/lib/nearby/geo.test.ts`, `src/lib/nearby/nearby-db.test.ts` (PGLite with the real migrations) |

## Plans

`PLAN_LIMITS` in `geo.ts`: Free 10 km / 30 profiles, Plus 50 km / 150
profiles. Plus is an admin-set row in `om_plus` (granted on `/admin/reports`).
There is **no billing**.

## Presence

Polling: the page sends a heartbeat every 60 s while visible and refreshes the
grid. Online = seen in the last 5 min, recently active = last 60 min.
"Appear offline" hides both.

## Who appears

Only members allowed in private mode (invited, admin/owner, or on the env
allowlist), who have shared a location in the last 30 days and aren't
incognito. Demo profiles (when `ONLYMEN_DEMO_PROFILES=on`) are shown in a
separate, clearly labelled "Demo profiles · not real people" strip; they are
never mixed into the real grid.

## Draft privacy-policy section (needs lawyer review before publishing)

> **Location (OnlyMen Nearby).** Nearby is optional. If you turn it on, your
> device sends its location to us; our server immediately rounds it to an
> area about 1.2 km across and discards the exact position. We store only that
> one area (replaced each time it changes, no history), when it was last
> updated, and your Nearby settings. Other members see an approximate distance
> range, never your exact distance or position. Map pins are off unless you
> turn them on and are placed randomly within your area, moving daily. If you
> haven't shared a location we may use the approximate city from your IP
> address for that request only, without storing it. You can stop sharing and
> delete your stored area at any time on the Nearby page. We use location only
> to show members near each other, never for advertising, and we don't sell or
> share it.

None of this is legal advice.
