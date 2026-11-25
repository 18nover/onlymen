# ONL-11 cleanup (2026-11-22)

Branch: `invite-codes` (Cloudflare Worker `onlymen`). Nothing here touches `main`, Vercel, DNS, R2 or payments.

OnlyMen is a creator and community product. It never offers escorting or any paid in-person service ([Terms](../src/routes/terms.tsx)). This pass removed wording and features that could read as the opposite.

## Removed from the product

| Area | Removed | Why |
|---|---|---|
| Directory and profiles | Reviews and star ratings, rating-based sorts, paid-looking tier badges, the "available" badge and filter, availability grids, travel flags, "Into" lists, profile view counts, private-album access requests, distance on profile cards, an inflated online count | Read like a booking directory, or faked activity |
| Account and onboarding | Rate cards (including the per-hour unit), the services/content menu, the position field, the private show rate in go-live | Read as selling in-person services |
| Tags | "Dinner dates", "Events & travel", "Right now", "Dates", "Discreet" | Coded or easy to misread. Hidden in code (see below) |
| Copy | Reference-site positioning, escort wording in the docs, "not Stripe" lines, paid placement and "boosted" copy | Not our product |
| Code | Legacy Desk app (`desk-app.legacy.tsx`, `desk.functions.ts`, `styles.legacy.css`), unused `src/lib/multiplayer/` | Dead, nothing imported it |
| Assets | `screenshots/*.png`/`*.json`, `artifacts/` | Stale captures, including reference-site captures |

"Featured" stays on the home page as an **unpaid editorial pick** for the labeled AI demo profiles. There is no paid ranking or placement.

## Retired data in the shared database

The Neon database is shared with production (onlymen.gay), so **nothing was dropped or rewritten**. Branch code just stops using these fields:

- `src/lib/account/retired.ts` removes retired keys and tags when an account loads, and **carries them back unchanged** when it saves. Old values are never shown and never lost.
- No migration was needed.

### Candidates for a later drop (after `main` stops using them)

| Where | What |
|---|---|
| `om_account.profile` (jsonb) | keys `rates`, `services`, `position` |
| `om_account.live_settings` (jsonb) | key `privateRate` |
| `om_account.profile.lookingFor` / `interests` / `tribes` | stored values `Dinner dates`, `Events & travel`, `Right now`, `Dates`, `Discreet` |

No tables or columns went unused because of ONL-11.

## Kept on purpose (worth a look later)

- `vercel.json`, `server/middleware/*` (Nitro on Vercel; `src/worker.ts` also imports the same middlewares) and `scripts/migrate.mjs` (Vercel build step). Still needed while `main` deploys to Vercel.
- `.grok/`, `AGENTS*.md`, `startup.sh`, `src/lib/app-data/`, `src/lib/preview-host-bridge.ts` and the template auth files in `src/lib/auth/`: these are the Grok builder scaffold and preview bridge, which tests and `check:auth` cover.
- `src/routes/api/owner-seed.ts`: a one-off owner seed. It does nothing unless `ONLYMEN_OWNER_SEED_TOKEN` is set, and that is never set on the Worker.
- Unused npm dependencies (shadcn/radix UI kit, recharts, zustand and others) stay installed so the lockfile doesn't change. They could be pruned in a separate commit.
- The tip menu and cam-platform "private shows" in the live rules stay, because cam rooms stay.
- "Fine dining" and "Cocktail bars" stay as ordinary interests. Ethnicity stays optional self-ID.

## Follow-up audit (2026-11-25)

The `/__grok/` assets and routes are still used by the install tutorial, PWA middleware, private-path policy, and builder preview. They are platform infrastructure and remain in place. A source-reference review found no other safely removable app-owned modules; the remaining unreferenced-looking helpers are retained for the builder integrations and runtime wiring described above.
