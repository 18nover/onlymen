# Handoff

OnlyMen is a private, invite-only community for adult men, with creator profiles, a live-stream hand-off, and an opt-in Nearby map. It is built with TanStack Start and React, uses Better Auth for accounts, and stores app data in Postgres (Neon). This file is a snapshot of the repo, not a place for secrets.

## Current state (Friday, 27 November 2026, America/New_York)

Working branch is still `invite-codes`. Production `main` is unchanged at `54434ef`. Do not merge to `main`, touch DNS, or change Vercel production without Jerry's yes.

The test Worker at [onlymen.18nover.workers.dev](https://onlymen.18nover.workers.dev) is the invite-codes preview (no custom domain, no DNS change). Current Version ID: `3ba1b52d-dc2e-4ffc-9b63-3bfb62b416a7` (Worker var `ONLYMEN_DEMO_PROFILES=off`; Stripe Identity age check on LIVE keys). Worker vars: `ONLYMEN_INVITES=on`, `ONLYMEN_NEARBY=on`, `ONLYMEN_AGE_GATE=on`, `ONLYMEN_PAYMENTS` unset. A later paragraph in this file may still describe the pre-deploy state; the live preview is this branch.

Personal invite links `/join/<CODE>` are age-exempt so Open Graph can unfurl. The branded landing uses `public/og-invite.jpg`. Route files for `/join/$code`, `/me/settings`, and `/messages/$username` use the `me_.verify` flattening pattern so they are not wrapped by the parent page. Logged-out `/`, `/nearby`, `/me/settings`, and `/messages` still show the 18+ age gate, then the private coming-soon page — testers sign in from `/join` or `/login`.

Beta terms (short): this beta is free, no payments, every feature is free for now; testers must give real feedback to help grow the app, or they'll be removed from the beta. Those terms are on the invite cards, the ready-to-send DM text, and the `/join` pages, with an "I agree to give feedback" checkbox required at signup. Members can send notes from `/me/feedback` (buttons on Profile and Settings). Jerry can review them, and see who hasn't sent any, at `/admin/feedback`.

This branch now has 1:1 text chat (`/messages` and `/messages/$username`, polling, blocks and a 20/min send limit), a three-item nav (Nearby, Live, Profile), Settings inside Profile at `/me/settings`, and personal invite links at `/join/<CODE>` with a branded landing page and `public/og-invite.jpg`. Nearby's Grid view shows the full member directory (people who share an area first, nearest first, when location is on). Browse is no longer a nav item. AgeChecker mentions were replaced with a note that Stripe Identity is the planned verifier; Stripe Identity is now built on this branch as the `stripe` AgeVerifier (age check only, no payments). The test Worker runs `ONLYMEN_AGE_VERIFIER=stripe` with Stripe LIVE-mode keys (Jerry approved; real people can verify, first 50 free then $1.50 each). The TEST MODE banner shows only when `STRIPE_SECRET_KEY` starts with `sk_test_`. Production and `main` are untouched. A Stripe test-mode webhook endpoint also still exists.
Flow: the age gate shows "Verify with ID", which creates a Stripe VerificationSession (document, matching selfie, live capture) and redirects to Stripe's hosted page. Stripe returns to `/age/callback`, the server re-fetches the session, computes 18+ from `verified_outputs.dob` in memory, asks Stripe to redact the session, and sets the signed age cookie. Nothing is stored: no DOB, name, images, or DB rows, so no migration. A failed or canceled check shows a retry. Manual admin review (`ONLYMEN_KYC_PROVIDER=manual`) is unchanged for creators.
Webhook: `POST /api/stripe/identity-webhook` verifies `Stripe-Signature` (HMAC-SHA256, 5 min tolerance) and acknowledges `identity.verification_session.*` events. Access is granted by the callback, not the webhook. Secrets (names only, set with `wrangler secret put` on the test Worker): `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_IDENTITY_WEBHOOK_SECRET`. Code: `src/lib/age-gate/stripe-identity.ts`, `verifiers.ts`, `server/middleware/age-gate.ts`.
Still to do: Jerry's own live-ID test, and confirm Stripe's adult-business policy before any public launch.

Migrations 0004–0009 were already on the shared Neon `onlymen` database. 0010 and 0011 still need to be applied (see above). Local tests apply numbered migrations through PGlite.

Fifteen single-use invite codes (note "beta testers Nov 2026") are hashed into `invite_codes`. Plaintext codes and test-site links live only at `/workspace/onlymen-invite-codes.txt` on the box — not in this repo. The send kit (cards + a local index page) is at `/workspace/onlymen-invite-kit/` and must stay off git.

Additive migrations `0010_messages.sql` (`om_message`) and `0011_feedback.sql` (`om_feedback`) are in the repo but were not applied: the Neon MCP Agent role cannot CREATE on schema public. Jerry can run both files in the Neon SQL editor, then insert `_migrations` names `0010_messages.sql` and `0011_feedback.sql`. A copy of 0011 is also at `/workspace/onlymen-0011-feedback.sql`. Chat and in-app feedback need those tables on the shared database.

Previous snapshot from 25 November 2026:


`main` is still production and auto-deploys to Vercel. Its tip is `54434ef` (`fix(pwa): do not inject grok.com extensions.js unless explicitly enabled`). [onlymen.gay](https://onlymen.gay) is the "Private. Coming soon." holding page. `/nearby` is not in that build; the coming-soon gate answers every app path with the same page.

`invite-codes` is the working branch. It is about 51 commits ahead of `main` (invites, age gate, Nearby, PWA, copy cleanup, and the Copilot hardening). It is missing only that one PWA extensions-script default from `main`, which is now ported here.

Jerry merged Copilot's hardening pull request, [PR #2](https://github.com/18nover/onlymen/pull/2), into `invite-codes` at 6:14 PM. He then opened [PR #3](https://github.com/18nover/onlymen/pull/3) to merge `invite-codes` into `main`, and closed it two or three minutes later without merging. Production is untouched. After that, the `invite-codes` branch itself was deleted from GitHub. It was restored from the PR #3 head (`44b95c7`, the merge commit of PR #2).

There is no Copilot Nearby-map pull request, and no other open PRs. Nearby already lives on `invite-codes` (ONL-13): the page opens on the map, the Map/Grid toggle works in code, and Nearby is in the mobile bottom nav when `ONLYMEN_NEARBY` is on.

Earlier on 25 November the test Worker was still on an older deploy. It has since been updated from this branch; production and DNS were not touched.

## Copilot PR #2 review

The change is safe to keep. It adds two additive migrations only (`0008_admin_audit.sql` and `0009_login_attempts.sql`), no new npm packages, no escort or paid-booking wording, and no secrets. Failed sign-in counters store hashed keys, not raw IPs or emails. Admin management endpoints check the admin/owner role on the server and write an append-only audit row. The one-time owner bootstrap stays token-gated and is also audited. Account and profile saves run in one transaction. No `/__grok/` files were deleted; the review is in `docs/CLEANUP.md`. `docs/legal-placeholders.md` lists the still-open legal fields.

0008 and 0009 are now on the shared Neon database (along with 0004–0007). Chat still needs 0010, and feedback needs 0011 (see above).

## Beta fixes on this branch

- Tip buttons, payout and tax fields, live tip menus, and tip goals are hidden unless `ONLYMEN_PAYMENTS=on`. That flag is off by default. There is still no billing provider; Plus stays admin-granted, with no purchase UI for members.
- The PWA helper now matches production: it does not inject `grok.com/grok-app-builder/extensions.js` unless `VITE_GROK_EXTENSIONS=1`.
- Login rate-limit checks fail open if migration 0009 has not been applied.

## Free invite-only beta — what's ready, and what isn't

- Sign up with an invite code: working in code, on the Worker when `ONLYMEN_INVITES=on`. `/join` is open to signed-out visitors; invited accounts can sign in afterwards. Codes have to be created in `/admin/invites` or the CLI first.
- Age gate, 18+: working. Server interstitial plus date-of-birth check at sign-up. The test Worker now uses Stripe Identity (test mode); "clickthrough" remains the default elsewhere and is not legal age verification.
- Profile: working, including onboarding and `/me`.
- Member directory: the full grid now lives in Nearby's Grid view (`ONLYMEN_DEMO_PROFILES` is still on for the Worker). Map stays the default Nearby view. The home page still has a directory section, but nav no longer has Browse.
- Nearby map with Map/Grid toggle: working in code, behind `ONLYMEN_NEARBY`. Reachable from the bottom nav. Needs a signed-in, opted-in member to show a real area; logged-out visitors on production would still see the coming-soon page until this branch is live.
- Chat: working in code once 0010 is applied. Inbox at `/messages`, thread at `/messages/$username`. Participants only; blocks honored both ways; 20 sends per minute.
- Settings: `/me/settings`, linked from Profile. No fourth nav button.
- Feedback: `/me/feedback` from Profile and Settings; admin list at `/admin/feedback`. Needs 0011 on Neon.
- Invite links: `/join/<CODE>` prefills the code on a branded landing page, with short beta terms and a required feedback-agreement checkbox. `/join` and `/join/*` are age-exempt so link previews can unfurl, and they stay open when invites are on. Sign-up still requires an 18+ date of birth.
- Report and block: working on real member profiles, with an admin queue at `/admin/reports`.
- Legal pages: working as drafts. Terms, Privacy, and Community Guidelines load, and they still have the placeholders listed in `docs/legal-placeholders.md`. Fine for a small invite beta if you accept that; counsel should review before a wider public launch.
- Payments: hidden/disabled. No Stripe or PayPal, no Plus purchase, tip UI hidden unless the flag is turned on.

## Rules to keep in mind

Read `AGENTS.md` before changing anything. Keep migrations additive; Neon is shared with production. Do not add dependencies for routine work, and never commit secrets or `.env` files. Leave `public/__grok/` and the PWA wiring alone unless you are sure they are unused. Never push or merge to `main` unless Jerry has said yes to that exact step. Never touch DNS or Vercel production settings from this branch of work.

The required checks before a push are `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build:cf`.

## Remaining steps that need Jerry's yes

1. Apply additive migrations `0010_messages.sql` and `0011_feedback.sql` on the shared Neon `onlymen` database (the Agent role cannot CREATE tables) and confirm `_migrations` rows for both names.
2. The test Worker is already on this branch. After 0010/0011, try chat and `/me/feedback`. Invite links, Nearby, Profile/Settings, and legal pages can be tried now.
3. When you are ready for onlymen.gay to become the invite-only app, open a pull request from `invite-codes` into `main`, review it, and merge. Until that merge, production stays the coming-soon page. On Vercel, set `ONLYMEN_INVITES=on`, `ONLYMEN_NEARBY=on`, and `ONLYMEN_AGE_GATE=on`, and leave `ONLYMEN_PAYMENTS` unset. Decide whether demo profiles should stay on.
4. Stripe Identity is built in test mode only; a live-mode test and Stripe's adult-business review are pending. Do not treat clickthrough age checks or draft legal pages as ready for an open public launch.


## Nearby placeholders and mobile layout (latest)
Demo profiles now fill Nearby only up to 12 tiles in total (`DEMO_TARGET` in `src/routes/nearby.tsx`). Each real member (grid or directory) removes one placeholder; at 12 real members none show. Real members always come first. No migration. The Live grid is 1 column under 640px (2 at sm, 3 at md) with clamped text, and Live and Nearby pad the bottom by the tab-bar height plus the safe area. Not verified end to end past the age gate: the box can't pass a live Stripe ID check, so sign-up, location, chat and feedback were checked by code, unit tests (364 pass) and DB state only.

## No placeholder people on the test site
The test Worker sets `ONLYMEN_DEMO_PROFILES=off` (it was `on`). Hidden now: demo members in Nearby (grid and map pins), the directory, Live cards, the Coming up schedule, `/m/<demo handle>` and `/watch/<demo handle>` (404 or not found), and the city counts. Invented stats are gone too: Live viewer counts, tip-goal progress bars, and the made-up stream recap numbers (the recap shows only the real duration). Empty states: Nearby "No one nearby yet. Invite friends.", Live "No one's live right now.", Schedule "No shows scheduled yet." Production (`main`) keeps its current default (demo on) until this branch is merged. Before the directory loads, the client now assumes demo off.

## Nearby: "You" pin
The Nearby map now always shows a pulsing gold "You" dot (`.om-you` in `src/styles.css`, drawn in `src/components/nearby-map.tsx`) and centers on it. Position comes from browser geolocation, drawn client-side only: it is never sent to the server or stored by this code, so no one else can see it. If location is denied or unsupported, the dot sits at the saved rounded area (om_location cell center) with a gentle "turn on location" note and a Try again button; with neither, the map shows the share-area prompt. It works with zero other members and with demo off. Other members still only see the existing rounded and jittered pins. The map also shows a button to share an approximate area when the user hasn't yet.

## Install flow, account-level 18+ pass, one Stripe check, admin links (latest)
- **Privacy:** default avatar is the OnlyMen crest (`/icon-512.png`); explicit photos are never used as a tile or avatar (`src/lib/directory.ts`, Nearby repo already filtered them). Jerry's own photo row was flagged explicit in the DB. No account's media falls back to another user's.
- **Install flow (Android Chrome):** `/join/CODE` saves the code in `localStorage` (`om-invite`) and a first-party cookie (`om_invite`, Path=/, SameSite=Lax, 30 days). The manifest `start_url` is `/login?source=pwa`; the installed app sends a signed-out visitor with a saved invite straight back to `/join/CODE`, and signed-in users to `/me`. The install prompt (`beforeinstallprompt` is captured and deferred) only shows once signed in, never on `/join` or the age gate. `/login`, `/logout`, `/forgot-password`, `/reset-password` are exempt from the age gate so the installed app can log in.
- **Account-level 18+ pass:** migration `0012_age_verified.sql` adds `om_account.age_verified_at` and `age_verified_session` (nothing else stored). The age gate middleware (`server/middleware/age-gate.ts`, `src/lib/age-gate/account-flag.server.ts`) stores the pass on the signed-in account after the Stripe check and grants it on any device, so logging in skips the ID check. Until 0012 is run, the code fails safe (no account pass; the browser cookie still works).
- **One Stripe check:** a Stripe pass auto-approves the account's `verification_status` (and closes any open manual verification as `provider=stripe`), unlocking going live and explicit photos. An admin-rejected account is not overridden. The manual document upload is hidden at `/me/verify` behind "Stripe didn't work for me" and stays as an admin-review fallback.
- **Admin:** Jerry's `admin` account (role owner) sees an Admin card in Profile with Verifications, Feedback, Invites and Reports. Server checks are unchanged. Approve a pending creator at `/admin/verifications`.
- **.gay and .live:** both domains point at the same production Vercel app and database, but cookies are per host, so a .gay session doesn't carry to .live. A one-time token hand-off is designed in `docs/LIVE.md` ("SSO to onlymen.live") and not built. The test Worker has no custom domain, so it can't be tested there. Not done: needs a production change.
