# Handoff

OnlyMen is a private, invite-only community for adult men, with creator profiles, a live-stream hand-off, and an opt-in Nearby map. It is built with TanStack Start and React, uses Better Auth for accounts, and stores app data in Postgres (Neon). This file is a snapshot of the repo, not a place for secrets.

## Current state (Friday, 27 November 2026, America/New_York)

Working branch is still `invite-codes`. Production `main` is unchanged at `54434ef`. Do not merge to `main`, touch DNS, or change Vercel production without Jerry's yes.

This branch now has 1:1 text chat (`/messages` and `/messages/$username`, polling, blocks and a 20/min send limit), a three-item nav (Nearby, Live, Profile), Settings inside Profile at `/me/settings`, and personal invite links at `/join/<CODE>` with a branded landing page and `public/og-invite.jpg`. Nearby's Grid view shows the full member directory (people who share an area first, nearest first, when location is on). Browse is no longer a nav item. AgeChecker mentions were replaced with a note that Stripe Identity is the planned verifier; Stripe itself is not built yet. Clickthrough remains the current age verifier.

Migrations 0004–0009 were already on the shared Neon `onlymen` database. Additive migration `0010_messages.sql` (`om_message`) is in the repo but was not applied: the Neon MCP Agent role can write to existing tables but does not have CREATE on schema public, and cannot SET ROLE to `onlymen_owner`. Apply 0010 (and insert `_migrations` name `0010_messages.sql`) in the Neon SQL editor before relying on chat against the shared database. Local tests apply it through PGlite.

Ten single-use invite codes (note "beta testers Nov 2026") were hashed into `invite_codes`. Plaintext codes and test-site links (`https://onlymen.18nover.workers.dev/join/…`) live only at `/workspace/onlymen-invite-codes.txt` on the box — not in this repo. The test Worker has not been redeployed, so those landing pages are not live yet.

Previous snapshot from 25 November 2026:


`main` is still production and auto-deploys to Vercel. Its tip is `54434ef` (`fix(pwa): do not inject grok.com extensions.js unless explicitly enabled`). [onlymen.gay](https://onlymen.gay) is the "Private. Coming soon." holding page. `/nearby` is not in that build; the coming-soon gate answers every app path with the same page.

`invite-codes` is the working branch. It is about 51 commits ahead of `main` (invites, age gate, Nearby, PWA, copy cleanup, and the Copilot hardening). It is missing only that one PWA extensions-script default from `main`, which is now ported here.

Jerry merged Copilot's hardening pull request, [PR #2](https://github.com/18nover/onlymen/pull/2), into `invite-codes` at 6:14 PM. He then opened [PR #3](https://github.com/18nover/onlymen/pull/3) to merge `invite-codes` into `main`, and closed it two or three minutes later without merging. Production is untouched. After that, the `invite-codes` branch itself was deleted from GitHub. It was restored from the PR #3 head (`44b95c7`, the merge commit of PR #2).

There is no Copilot Nearby-map pull request, and no other open PRs. Nearby already lives on `invite-codes` (ONL-13): the page opens on the map, the Map/Grid toggle works in code, and Nearby is in the mobile bottom nav when `ONLYMEN_NEARBY` is on.

The test Worker at [onlymen.18nover.workers.dev](https://onlymen.18nover.workers.dev) is running an older `invite-codes` deploy. Logged-out app routes show the 18+ age gate; the draft Terms, Privacy, and Community Guidelines pages load. It has not been redeployed with PR #2 or the beta fixes below. This work did not deploy anything (no Cloudflare token on hand, and production/DNS stay off limits).

## Copilot PR #2 review

The change is safe to keep. It adds two additive migrations only (`0008_admin_audit.sql` and `0009_login_attempts.sql`), no new npm packages, no escort or paid-booking wording, and no secrets. Failed sign-in counters store hashed keys, not raw IPs or emails. Admin management endpoints check the admin/owner role on the server and write an append-only audit row. The one-time owner bootstrap stays token-gated and is also audited. Account and profile saves run in one transaction. No `/__grok/` files were deleted; the review is in `docs/CLEANUP.md`. `docs/legal-placeholders.md` lists the still-open legal fields.

0008 and 0009 are now on the shared Neon database (along with 0004–0007). Chat still needs 0010, which is not applied yet (see above).

## Beta fixes on this branch

- Tip buttons, payout and tax fields, live tip menus, and tip goals are hidden unless `ONLYMEN_PAYMENTS=on`. That flag is off by default. There is still no billing provider; Plus stays admin-granted, with no purchase UI for members.
- The PWA helper now matches production: it does not inject `grok.com/grok-app-builder/extensions.js` unless `VITE_GROK_EXTENSIONS=1`.
- Login rate-limit checks fail open if migration 0009 has not been applied.

## Free invite-only beta — what's ready, and what isn't

- Sign up with an invite code: working in code, on the Worker when `ONLYMEN_INVITES=on`. `/join` is open to signed-out visitors; invited accounts can sign in afterwards. Codes have to be created in `/admin/invites` or the CLI first.
- Age gate, 18+: working. Server interstitial plus date-of-birth check at sign-up. The current verifier is still "clickthrough," which is fine for an invite test and is not legal age verification.
- Profile: working, including onboarding and `/me`.
- Member directory: the full grid now lives in Nearby's Grid view (`ONLYMEN_DEMO_PROFILES` is still on for the Worker). Map stays the default Nearby view. The home page still has a directory section, but nav no longer has Browse.
- Nearby map with Map/Grid toggle: working in code, behind `ONLYMEN_NEARBY`. Reachable from the bottom nav. Needs a signed-in, opted-in member to show a real area; logged-out visitors on production would still see the coming-soon page until this branch is live.
- Chat: working in code once 0010 is applied. Inbox at `/messages`, thread at `/messages/$username`. Participants only; blocks honored both ways; 20 sends per minute.
- Settings: `/me/settings`, linked from Profile. No fourth nav button.
- Invite links: `/join/<CODE>` prefills the code on a branded landing page. `/join` and `/join/*` are age-exempt so link previews can unfurl, and they stay open when invites are on. Sign-up still requires an 18+ date of birth.
- Report and block: working on real member profiles, with an admin queue at `/admin/reports`.
- Legal pages: working as drafts. Terms, Privacy, and Community Guidelines load, and they still have the placeholders listed in `docs/legal-placeholders.md`. Fine for a small invite beta if you accept that; counsel should review before a wider public launch.
- Payments: hidden/disabled. No Stripe or PayPal, no Plus purchase, tip UI hidden unless the flag is turned on.

## Rules to keep in mind

Read `AGENTS.md` before changing anything. Keep migrations additive; Neon is shared with production. Do not add dependencies for routine work, and never commit secrets or `.env` files. Leave `public/__grok/` and the PWA wiring alone unless you are sure they are unused. Never push or merge to `main` unless Jerry has said yes to that exact step. Never touch DNS or Vercel production settings from this branch of work.

The required checks before a push are `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build:cf`.

## Remaining steps that need Jerry's yes

1. Apply additive migration `0010_messages.sql` on the shared Neon `onlymen` database (the Agent role cannot CREATE tables) and confirm a `_migrations` row for `0010_messages.sql`.
2. When you are ready to put testers on the test Worker, deploy `invite-codes` there (Cloudflare token required). Try a personal invite link, age-gate skip on `/join/…`, chat, Nearby Grid, Profile/Settings, report/block, and the legal pages.
3. When you are ready for onlymen.gay to become the invite-only app, open a pull request from `invite-codes` into `main`, review it, and merge. Until that merge, production stays the coming-soon page. On Vercel, set `ONLYMEN_INVITES=on`, `ONLYMEN_NEARBY=on`, and `ONLYMEN_AGE_GATE=on`, and leave `ONLYMEN_PAYMENTS` unset. Decide whether demo profiles should stay on.
4. Stripe Identity is planned, not built. Do not treat clickthrough age checks or draft legal pages as ready for an open public launch.
