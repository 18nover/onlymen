# Accounts (server-backed)

Real accounts live in a **free Neon Postgres** database (project `long-math-62389085`, database `onlymen`, AWS us-east-1, plan `free_v3`).
Auth is **Better Auth** (email + password, hashed server-side with scrypt), running in-process
under `/api/account/*` with httpOnly, SameSite=Lax, Secure cookies (`onlymen.*`, 30-day sessions).

## Private mode (as of 2026-11-21 9:28 PM ET)

Public registration is closed server-side and only Jerry's allowlisted account can sign in. Landed in commit `8311918`.

- **Sign-up is off server-side:** Better Auth `disableSignUp` plus a `/sign-up*` before-hook, and `signUpFn` rejects first. `/join` shows the coming-soon page.
- **Allowlist** (server env, comma-separated; **unset = nobody**): `ONLYMEN_ALLOWED_USER_IDS` (preferred) and `ONLYMEN_ALLOWED_USERNAMES`. Enforced when a session is created (Better Auth `databaseHooks.session.create.before`), on every session check in `api.ts`, in the root route guard, and in `/api/photo/<id>` (photos are members-only in private mode). Code: `src/lib/private/`.
- **Gate:** `server/middleware/private-gate.ts` serves the standalone "Private — coming soon" page to logged-out visitors on every host. Only `/login`, `/logout`, `/terms`, `/privacy`, `/guidelines`, `/2257`, static assets, server functions, and `/api/photo` pass. Everything is `noindex` (`x-robots-tag`, meta robots, `robots.txt`).
- **Owner account:** seeded once through `POST /api/owner-seed` (Better Auth hashing + internal adapter), which is inert unless `ONLYMEN_OWNER_SEED_TOKEN` is set — remove that var after use. `om_account.role` (`migrations/0003_account_role.sql`) marks it `owner` (`user` / `admin` / `owner`; default `user`). The reserved handle `admin` is only allowed there.
- Optional one-time owner bootstrap via sign-up: `ONLYMEN_OWNER_SIGNUP_EMAIL` (off by default).
- Local dev only: `ONLYMEN_PRIVATE_MODE=off` disables the gate (ignored in production).
- QA: `BASE=… node scripts/e2e-private.mjs` (the owner login check reads `OWNER_ID` / `OWNER_PW` from the environment only; do not put those values in docs).

**Invite codes:** with `ONLYMEN_INVITES=on` (the Cloudflare Worker only, for now) `/join` accepts sign-ups that carry a valid invite code. See [INVITES.md](./INVITES.md).

## What lives in the database

| Table | Holds |
|---|---|
| `user`, `session`, `account`, `verification` | Better Auth: identity, password hash, sessions, reset tokens |
| `om_account` | username, account type, `role` (`user` / `admin` / `owner`), DOB, profile, privacy, permissions, onboarding progress, verification status, creator data, live settings / current session / recap |
| `om_consent` | append-only, versioned consent records (key, granted, version, source, user agent, timestamp) |
| `om_photo` | profile photos (`bytea`, ≤700 KB each after client downscale; UI allows 9, server cap is 15) |
| `om_banner` | one banner image per account (`migrations/0005_profile_banner.sql`). Not in `om_photo`, so production gallery queries are unchanged. |
| `om_show`, `om_reminder` | scheduled shows and fans' reminders |

Schema: `migrations/0001_auth.sql`, `migrations/0002_onlymen_accounts.sql`, `migrations/0003_account_role.sql`, `migrations/0004_invite_codes.sql`, `migrations/0005_profile_banner.sql` (applied by `npm run db:migrate`, which runs during the Vercel build). Photos count against Neon's free-plan storage (1 GB branch logical size, verified 2026-11-21). See [ARCHITECTURE.md](ARCHITECTURE.md) and [HOSTING.md](HOSTING.md).

## Code map

- `src/lib/account/auth.server.ts` — Better Auth instance (`getAuth()`), `serverAccountsEnabled`, sign-up disabled in private mode.
- `src/lib/account/repo.server.ts` — SQL for accounts, consents, photos, shows, public profiles, live directory.
- `src/lib/account/api.ts` — server functions the UI calls (sign up/in/out, save, reset, photo upload, public profile, live directory); session checks go through the allowlist.
- `src/lib/account/notify.server.ts` — optional fire-and-forget sign-up webhook (off unless configured).
- `src/lib/private/` — allowlist and public-path policy (`policy.ts`, `allowlist.server.ts`, `access.ts`, `gate-html.ts`).
- `server/middleware/private-gate.ts` — coming-soon page for logged-out visitors.
- `src/routes/api/owner-seed.ts` — token-gated one-off owner seed.
- `src/routes/api/photo/$id.ts` — serves photos to an allowlisted session (unattached still owner-only).
- `src/lib/account/store.ts` — `AccountStoreFacade` picks `ServerAccountStore` when the server reports a database, otherwise the browser-local dev fallback (`LocalAccountStore`).

Server-owned fields (cannot be changed from the browser): email, username, DOB, account type, role, verification status (the client may only move it to `pending_review`), consent history (append-only).

## Environment (names only)

| Var | Where | Notes |
|---|---|---|
| `DATABASE_URL` | Vercel Production + Preview | Neon **pooled** URL. Missing → browser-local / PGLite dev fallback. |
| `BETTER_AUTH_SECRET` | Vercel Production + Preview | Required in production. |
| `BETTER_AUTH_URL` | optional | Pin the auth base URL; otherwise derived from allowed hosts. Not currently set on Vercel. |
| `OM_ACCOUNTS=server` | local dev | Server accounts on in-memory PGLite without Neon. |
| `ONLYMEN_WEBHOOK_URL`, `ONLYMEN_WEBHOOK_KEY` | optional, server-only | Sign-up webhook. Off unless **both** are set. See typo below. |
| `ONLYMEN_ALLOWED_USER_IDS` | private mode | Comma-separated user ids allowed to sign in. Unset = nobody. Preferred allowlist. |
| `ONLYMEN_ALLOWED_USERNAMES` | private mode | Comma-separated usernames allowed to sign in. Unset = nobody. |
| `ONLYMEN_OWNER_SIGNUP_EMAIL` | optional, one-time | If set, only that email may use the otherwise-closed sign-up path. Off by default. |
| `ONLYMEN_OWNER_SEED_TOKEN` | optional, one-time | Required for `POST /api/owner-seed`. Remove the var after the owner account is seeded. |
| `ONLYMEN_PRIVATE_MODE` | local dev only | Set to `off` to disable the gate in non-production. Ignored in production. |
| `ONLYMEN_DEMO_PROFILES` | Worker var (default `on`) | Set to `off` to hide invented placeholder profiles. Real directory rows are role-gated (today: `owner` with a photo). See [ARCHITECTURE.md](ARCHITECTURE.md). |

Full list and the live-domain vars: [HOSTING.md](HOSTING.md). Never put the values of these variables in the repo or in chat.

## Sign-up webhook

`notifySignup` in `src/lib/account/notify.server.ts` POSTs `{"event":"signup","username","role","at"}` with `Authorization: Bearer <key>` to the user's notification webhook, which Supervisor monitors. `role` is `"creator"` or `"fan"`. No email or other PII. Fire-and-forget, 1.5s timeout, never breaks sign-up.

It stays **off** until both env vars are set correctly. On Vercel Production the URL variable was saved as `ONLYMEN_WEBHOOKS_URL` (plural) and must be renamed to `ONLYMEN_WEBHOOK_URL`, then the project redeployed.

## Product decisions

- **2026-11-21 — Keep the ethnicity filter** as a self-identified, optional creator field. Decision made by the user (owner). Today the browse filter (`src/components/filter-drawer.tsx`) and demo profiles (`src/lib/models.ts`, options: Black, East Asian, Latino, Mediterranean, Middle Eastern, South Asian, White) already use ethnicity. The real account `Profile` type in `src/lib/account/types.ts` does **not** yet include the field — implement it as optional and self-identified, never assigned by the platform.

## Known gaps

- **Reset emails are not sent** (no email provider on the free plan). Tokens are stored server-side and never shown in the browser in server mode; support has to deliver the link manually until an email provider is added. The browser-local adapter still shows a demo link, for local QA only.
- **ID documents stay on the creator's device** — needs a KYC vendor (Veriff, Yoti, or Persona) before real verification.
- No login rate limiting yet (server functions call Better Auth directly, bypassing its HTTP limiter).
- Account saves are not wrapped in a single transaction.
- Geo-blocking is not enforced (blocked regions can be stored on a creator's live settings; enforcement needs a server-side IP lookup).
- Photo storage is capped by Neon's free-plan size (see above).

QA: `BASE=… TOKEN_CMD=… node scripts/e2e-accounts.mjs`. Private-mode QA: `scripts/e2e-private.mjs`.
