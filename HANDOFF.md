# OnlyMen — Handoff

Read this first. It is the single source of truth for where the project stands. If something here is wrong, fix it in the same commit as the change. Last rewritten Friday 27 November 2026 (America/New_York).

## What OnlyMen is

A private, invite-only community for adult gay men: creator profiles, a Nearby map (opt-in, approximate by default), 1:1 text chat, a Live hand-off to onlymen.live, and a closed beta that is free with no payments. Owner and operator: Jerry Lockard (designer, solo founder). Stack: TanStack Start (React) + Better Auth + Neon Postgres + MapLibre, shipped as a PWA. Two hosts: the app on a Vercel project (production) and a Cloudflare Worker (test).

## Branches and sites

| Branch | Where it runs | Rule |
| --- | --- | --- |
| `main` | **Production** onlymen.gay / onlymen.live on Vercel (today the "Private. Coming soon." page). | **A push auto-deploys production. Never push or merge to `main` unless Jerry says yes to that exact step.** |
| `invite-codes` | **Test Worker** https://onlymen.18nover.workers.dev (Cloudflare, no custom domain). | All current work lands here. |

Production and the test Worker share one Neon database. Treat every migration as if it touches production.

## Build, test, deploy

```
npm test            # node:test, PGLite applies the real migrations (must pass before any deploy)
npm run typecheck   # tsc --noEmit, must be clean
npm run lint        # eslint, 0 errors expected
npm run deploy:cf   # vite build for Cloudflare + wrangler deploy  -> test Worker only
```

Deploy needs `CLOUDFLARE_API_TOKEN` in the environment (and the account id in wrangler/env). Never print it. Don't deploy with a failing test. Git commits are authored as `Jerry Lockard <jerry@lockard.me>`.

## Flags and secrets (names only)

Plain vars live in `wrangler.jsonc` (test Worker) and Vercel env (production). Unset on Vercel means "no change from today".

| Var | Test Worker | Meaning |
| --- | --- | --- |
| `ONLYMEN_INVITES` | on | Invite-code sign-up. Unset = owner-only private mode. |
| `ONLYMEN_NEARBY` | on | Nearby map/grid and nav item. |
| `ONLYMEN_AGE_GATE` | on | Every app page needs a signed 18+ cookie (`om_age18`), or a signed-in verified account. |
| `ONLYMEN_AGE_VERIFIER` | stripe | `stripe` (Stripe Identity) or `clickthrough` (**dev/test only, not legal age verification**). |
| `ONLYMEN_AGE_GATE_GEOBLOCK` | off | `on` = HTTP 451 for states with adult-site AV laws. Off because Jerry is in Kentucky. |
| `ONLYMEN_ID_VERIFICATION` | on | Only approved creators can go live or mark photos explicit. |
| `ONLYMEN_KYC_PROVIDER` | manual | Creator ID review by an admin at `/admin/verifications`. |
| `ONLYMEN_KYC_SELF_REVIEW` | (see wrangler.jsonc) | Lets the solo owner approve their own verification; audited as "self-review". |
| `ONLYMEN_DEMO_PROFILES` | off | Invented placeholder people. Off on test; **production default is on** until merge. |
| `ONLYMEN_PAYMENTS` | unset | Tips, payouts, tax fields are hidden unless `on`. No billing provider exists. |

Secrets (set only with `wrangler secret put`, never in git, docs, logs or chat): `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_IDENTITY_WEBHOOK_SECRET`, `BETTER_AUTH_SECRET`, `ONLYMEN_KYC_ENC_KEY`. Database goes through the Hyperdrive binding `HYPERDRIVE`.

## Age check: Stripe Identity (age only, no payments)

1. The age gate shows "Verify with ID". `POST /age/callback` creates a Stripe VerificationSession (document + matching selfie + live capture) and sets an HttpOnly `om_age_vs` cookie bound by HMAC, then redirects to Stripe.
2. Stripe returns to `/age/callback`. The server re-fetches the session with `verified_outputs`, computes 18+ from the date of birth **in memory**, asks Stripe to redact the session, and sets the signed `om_age18` cookie.
3. If the visitor is signed in, the pass is saved on the account: `om_account.age_verified_at` + `age_verified_session`. Next device or the installed PWA gets the cookie back automatically (no second ID check).
4. A Stripe pass also auto-approves `verification_status` (only from `not_started` / `pending_review`; admin rejections are never overridden) and closes the open `om_verification` row as provider `stripe`.
5. Webhook `POST /api/stripe/identity-webhook` checks the signature (HMAC-SHA256, 5 min tolerance) and only acknowledges events. Access is granted by the callback, not the webhook.
6. Owner/admin and admin-approved accounts skip the gate when signed in. Login, logout, forgot/reset password and `/join/*` are age-exempt (so links unfurl and the PWA can reach sign-in).

**No-identifying-data rule:** after access is granted we keep only the 18+ flag, the Stripe session id and a timestamp. Never store DOB, name, ID images or the Stripe payload. A privacy test also forbids tables with "history/trail/track" in the name. Stripe cost: first 50 checks free, then $1.50 each.

Code: `src/lib/age-gate/` (`stripe-identity.ts`, `verifiers.ts`, `account-flag.server.ts`, `policy.ts`, `html.ts`), `server/middleware/age-gate.ts`. Detail: `docs/AGE_GATE.md`.

## Migrations

Files are in `migrations/`, additive only (new tables or nullable columns; no drops, no renames). **Jerry runs the SQL himself in the Neon SQL editor**, then inserts the filename into `_migrations`. Agents write the SQL (copy it to `/workspace`) and stop. Tests apply all numbered files to an in-memory PGLite.

`0001_auth` · `0002_onlymen_accounts` · `0003_account_role` · `0004_invite_codes` · `0005_profile_banner` · `0006_creator_verification` · `0007_nearby` · `0008_admin_audit` · `0009_login_attempts` · `0010_messages` · `0011_feedback` · `0012_age_verified` · `0013_username_changes`

All 0001–0013 are applied on the shared Neon database. Harmless oddity: `_migrations` also holds a stray row `0013_username_history.sql` from an earlier filename; ignore it.

## Accounts and roles

- `admin` = Jerry, role **owner**. Sees an Admin card in Profile: Verifications, Feedback, Invites, Reports. Server checks the role on every admin call; admin writes are audited.
- `puppika92` = first beta friend (invited member, creator, ID approved).
- Every invited sign-up is forced to `account_type = creator` on the server (no application step; going live and explicit photos still need an ID pass).
- Roles: `member`, `admin`, `owner`. Username changes: 2 per rolling 12 months (admin/owner exempt), old names reserved 30 days (`om_username_log`).
- 15 single-use invite codes are stored hashed in `invite_codes`. Plaintext codes and the send kit live only on the box in `/workspace`, never in git.

## Features worth knowing

- **Invite flow:** people tap `/join/<CODE>` from X. The code is kept in `localStorage` (`om-invite`) and a cookie (`om_invite`) so the installed PWA doesn't lose it. The install prompt only appears after sign-in. Manifest `start_url` is `/login?source=pwa`. Testers use Android Chrome.
- **Online counter:** "N online right now" counts `om_presence.last_seen` within 5 minutes, excluding incognito/appear-offline. A 60 s heartbeat runs while signed in and visible.
- **Nearby:** opt-in; shows your own "You" pin; approximate location by default. Empty states instead of placeholder people when demo profiles are off.
- **Chat:** `/messages`, polling, blocks honored both ways, 20 sends/min. **Feedback:** `/me/feedback`, admin list at `/admin/feedback`. Beta terms: free, no payments, give real feedback or leave the beta.
- **Privacy:** a user without a photo gets the crest, never someone else's media. Explicit photos are never used as tiles or avatars.
- **Docs:** `docs/` has depth (ARCHITECTURE, ACCOUNTS, INVITES, NEARBY, VERIFICATION, LIVE, ROADMAP, DECISION_LOG, legal-placeholders).

## Standing rules (Jerry's)

1. Never touch or push `main`. A push auto-deploys production. Only Jerry's own words approve a production ship.
2. Never print, log or commit secrets. Docs and commits use env var names only; keys go in via `wrangler secret put`.
3. No new npm dependencies for routine work.
4. No DNS change, payment, LLC step, public launch, vendor signup or billing change without Jerry's explicit OK. Do not email AgeChecker (replaced by Stripe Identity).
5. Migrations are additive only; Jerry runs them.
6. Do not keep identifying data after access is granted (see above).
7. X DMs, posts, emails and messages sent as Jerry are drafts until he presses Send.
8. Don't deploy with a failing test. Keep `tsc` clean.
9. Be lean: Jerry's AI usage credit is limited. Small diffs, no refactors nobody asked for.

## Done (test Worker)

Invite sign-up and `/join/<CODE>` landing; Stripe Identity age check on LIVE keys (tested with Jerry's own ID); account-level 18+ pass; Stripe auto-approves ID status; Nearby map/grid with your own pin; online counter; chat; feedback; admin links; change username; demo/placeholder people off; PWA install flow fixes; privacy fix for avatars; cleanup of the vendor stub, disabled social-login buttons and unused code.

## Open

- **/me desktop layout (just changed, NOT visually verified or deployed):** `src/components/my-profile.tsx` now uses a CSS-columns masonry (`md:columns-2`, every block `break-inside-avoid`) instead of the old gallery/side grid plus a separate bottom grid, to fix big gaps and uneven cards on desktop. tsc passes. Still to do: check it in a browser at ~1440px and ~390px (signed in; a static harness is at `/workspace/shots` on the box), adjust, then `npm run deploy:cf`. Latest deployed Worker version (c851874b) does not include this change.

- **Android PWA test** of the full path: tap `/join/CODE` → install → sign in → Nearby/chat, on a real Android Chrome.
- **One account across onlymen.gay and onlymen.live:** cookies are per host, so a .gay session does not carry to .live. A one-time-token hand-off is designed in `docs/LIVE.md` ("SSO to onlymen.live") and not built. Needs a production change; can't be tested on the workers.dev Worker.
- **Stripe adult-business policy check** before any public launch (Identity is age check only, but confirm).
- **Legal pages:** `/custodian` (2257 custodian) still shows `TODO` blanks for name, address, producer and hours; see `docs/legal-placeholders.md`. Needs Jerry and counsel.
- **Merge `invite-codes` → `main`** only with Jerry's yes. At merge time set the flags above on Vercel, leave `ONLYMEN_PAYMENTS` unset, and decide on demo profiles.
- Signed-in pages can't be smoke-tested over plain HTTP by an agent (the age gate needs a real Stripe pass). Test those by hand on a phone.
