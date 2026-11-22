# Accounts (server-backed)

Real accounts live in a **free Neon Postgres** database (project `onlymen`, AWS us-east-1).
Auth is **Better Auth** (email + password, hashed server-side with scrypt), running in-process
under `/api/account/*` with httpOnly, SameSite=Lax, Secure cookies (`onlymen.*`, 30-day sessions).

## What lives in the database
| Table | Holds |
|---|---|
| `user`, `session`, `account`, `verification` | Better Auth: identity, password hash, sessions, reset tokens |
| `om_account` | username, account type, DOB, profile, privacy, permissions, onboarding progress, verification status, creator data, live settings / current session / recap |
| `om_consent` | append-only, versioned consent records (key, granted, version, source, user agent, timestamp) |
| `om_photo` | profile photos (bytea, ≤700 KB each after client downscale, ≤15 per user) |
| `om_show`, `om_reminder` | scheduled shows and fans' reminders |

Schema: `migrations/0001_auth.sql`, `migrations/0002_onlymen_accounts.sql` (applied by `npm run db:migrate`, which runs during the Vercel build).

## Code map
- `src/lib/account/auth.server.ts` — Better Auth instance (`getAuth()`), `serverAccountsEnabled`.
- `src/lib/account/repo.server.ts` — SQL for accounts, consents, photos, shows, public profiles, live directory.
- `src/lib/account/api.ts` — server functions the UI calls (sign up/in/out, save, reset, photo upload, public profile, live directory).
- `src/lib/account/notify.server.ts` — optional fire-and-forget sign-up webhook (off unless configured).
- `src/routes/api/photo/$id.ts` — serves photos (attached = public & cached; unattached = owner-only).
- `src/lib/account/store.ts` — `AccountStoreFacade` picks `ServerAccountStore` when the server reports a database, otherwise the browser-local dev fallback (`LocalAccountStore`).

Server-owned fields (cannot be changed from the browser): email, username, DOB, account type, verification status (only → `pending_review`), consent history (append-only).

## Environment
| Var | Where | Notes |
|---|---|---|
| `DATABASE_URL` | Vercel prod + preview | Neon **pooled** URL. Missing → browser-local dev fallback. |
| `BETTER_AUTH_SECRET` | Vercel prod + preview | Required in production. |
| `BETTER_AUTH_URL` | optional | Pin the auth base URL; otherwise derived from allowed hosts. |
| `OM_ACCOUNTS=server` | local dev | Server accounts on in-memory PGLite without Neon. |
| `ONLYMEN_WEBHOOK_URL`, `ONLYMEN_WEBHOOK_KEY` | optional, server-only | Sign-up webhook: `{"event":"signup","username","role","at"}` with `Authorization: Bearer`. No PII. |

## Known gaps
- **Reset emails are not sent** (no email provider on the free plan). Tokens are stored server-side and never shown in the browser; support has to deliver the link manually until an email provider is added.
- **ID documents stay on the creator's device** — needs a KYC vendor before real verification.
- No login rate limiting yet (server functions call Better Auth directly, bypassing its HTTP limiter).
- Account saves are not wrapped in a single transaction.
- Geo-blocking is not enforced.

QA: `BASE=… TOKEN_CMD=… node scripts/e2e-accounts.mjs`.

## Product decisions
- **2026-11-21 — Keep the ethnicity filter** as a self-identified, optional creator field. Decision made by the user (owner), relayed to engineering on 2026-11-21.

## Private mode (2026-11-21)
OnlyMen is closed: only allowlisted accounts can get in.
- **Sign-up is off server-side**: Better Auth `disableSignUp` + a `/sign-up*` before-hook, and `signUpFn` rejects first. `/join` shows the coming-soon page.
- **Allowlist** (server env, comma-separated; unset = nobody): `ONLYMEN_ALLOWED_USER_IDS` (preferred), `ONLYMEN_ALLOWED_USERNAMES`. Enforced when a session is created (Better Auth `databaseHooks.session.create.before`), on every session check in `api.ts`, in the root route guard, and in `/api/photo/<id>` (photos are members-only now). Code: `src/lib/private/`.
- **Gate**: `server/middleware/private-gate.ts` serves the standalone "Private — coming soon" page to logged-out visitors on every host; only `/login`, `/logout`, `/terms`, `/privacy`, `/guidelines`, `/2257`, static assets, server functions and `/api/photo` pass. Everything is `noindex` (`x-robots-tag`, meta robots, `robots.txt`).
- **Owner account**: seeded once through `POST /api/owner-seed` (Better Auth hashing + internal adapter), which is inert unless `ONLYMEN_OWNER_SEED_TOKEN` is set — remove that var after use. `om_account.role` (`migrations/0003_account_role.sql`) marks it `owner`. The reserved handle `admin` is only allowed there.
- Optional one-time owner bootstrap via sign-up: `ONLYMEN_OWNER_SIGNUP_EMAIL` (off by default).
- Local dev only: `ONLYMEN_PRIVATE_MODE=off` disables the gate (ignored in production).
- QA: `BASE=… node scripts/e2e-private.mjs` (owner login check reads `OWNER_ID`/`OWNER_PW` from env only).
