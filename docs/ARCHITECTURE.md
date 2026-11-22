# Architecture — OnlyMen

**Last updated:** 2026-11-21
**Status:** Living. Matches the code in this repo and the production Neon / Vercel setup.

---

## 1. Guiding principles

- Own the stack completely (no black-box platforms that lock us in).
- Prefer boring, proven technology that a small team can maintain.
- Ship small working pieces.
- Prefer the free or cheapest option first.
- Design for Phase 1 simplicity, but leave clean extension points for later paid features.

---

## 2. Current stack

The November 20 Next.js sketch is obsolete. Production is a TanStack Start app.

| Layer | Technology | Notes |
|---|---|---|
| App framework | **TanStack Start** (`@tanstack/react-start`) + **TanStack Router** + **React 19** | File routes in `src/routes/`. Account APIs are TanStack server functions. |
| Bundler | **Vite 8** | `vite.config.ts` |
| CSS | **Tailwind CSS 4** via `@tailwindcss/vite` | Plus `src/styles.css` for OnlyMen-specific styles (live rings, and so on). |
| Server output | **Nitro** with `preset: "vercel"` | Current production path. The planned Cloudflare move replaces Nitro with the official Cloudflare Vite plugin; see [HOSTING.md](HOSTING.md#planned-cloudflare-move). |
| Database | **Neon Postgres 17**, project `long-math-62389085`, database `onlymen`, region AWS us-east-1, plan `free_v3` | Default branch `main` (`br-bitter-field-bc6sgdmc`). The app uses the **pooled** connection string in `DATABASE_URL` via a `pg` Pool (`src/lib/db.ts`). |
| Local / preview fallback | **PGLite** (`@electric-sql/pglite`) | In-memory Postgres when `DATABASE_URL` is unset. `OM_ACCOUNTS=server` forces the server account adapter on PGLite. |
| Auth (product) | **Better Auth** (email + password, scrypt) | Own instance in `src/lib/account/auth.server.ts`, called in-process under `/api/account/*`. Separate from the template Grok-broker auth in `src/lib/auth/`, which stays off. |
| Hosting | **Vercel** project `onlymen` on team `18nover` | See [HOSTING.md](HOSTING.md). |
| Photos | `bytea` in Neon, served at `/api/photo/<id>` | No object storage yet. |
| Payments | Not implemented | When they are: adult processors (Segpay / CCBill), not Stripe or PayPal. |

Schema lives in `migrations/*.sql` and is applied by `npm run db:migrate` (also run from the Vercel `build` script).

---

## 3. Data model

Better Auth tables (from `migrations/0001_auth.sql`; camelCase, quoted identifiers):

| Table | Holds |
|---|---|
| `user` | Auth identity (id, name, email, emailVerified, image, timestamps) |
| `session` | Sessions (token, expiry, ip, user agent) |
| `account` | Provider accounts and the password hash |
| `verification` | One-time tokens, including password-reset tokens |

OnlyMen tables (from `migrations/0002_onlymen_accounts.sql`):

| Table | Holds |
|---|---|
| `om_account` | username, account type (`member` / `creator`), `role` (`user` / `admin` / `owner`, from `migrations/0003_account_role.sql`), DOB, profile / privacy / permissions / onboarding JSON, verification status, creator data, viewer live prefs, live settings / current session / recap |
| `om_consent` | append-only, versioned consent records (key, granted, version, source, user agent, timestamp) |
| `om_photo` | profile photos (`bytea`, metadata, attached flag) |
| `om_show` | scheduled shows |
| `om_reminder` | fans' "Remind me" rows |

Code map and environment names: [ACCOUNTS.md](ACCOUNTS.md).

Demo directory profiles (not real accounts) still live in `src/lib/models.ts`. They include fields such as ethnicity used by the browse filter. Real `Profile` records do not yet have an ethnicity field; see the decision in [ACCOUNTS.md](ACCOUNTS.md).

---

## 4. Photos

- The browser downscales uploads to ≤1280px JPEG (quality 0.84; retries at 1080px / 0.78 if still large) in `src/lib/account/media.ts`.
- The server rejects uploads over **700 KB** (`MAX_PHOTO_BYTES` in `src/lib/account/repo.server.ts`).
- The onboarding UI allows **up to 9** photos (`MAX_PHOTOS` in `src/lib/account/constants.ts`). The server adapter has a hard cap of **15**.
- Bytes are stored in `om_photo.data`. In private mode, `/api/photo/<id>` requires an allowlisted session (unattached uploads remain owner-only). When the site is public again, attached photos can be served more openly; see the photo route.
- Route: `GET /api/photo/<id>` (`src/routes/api/photo/$id.ts`). IDs match `ph_` plus hex.
- Neon `free_v3` branch logical size limit, verified 2026-11-21 via the Neon connector, is **1 GB**. Photos count against that until object storage is added. The default `main` branch was about 32 MB at that check.
- ID documents are **not** stored in Neon; they stay on the creator's device until a KYC vendor is wired.

---

## 5. Product auth flow

- The UI talks only to the `AccountStore` interface. Production uses `ServerAccountStore` when the server reports a database; otherwise `LocalAccountStore` (browser-local dev fallback).
- Better Auth cookies: prefix `onlymen`, httpOnly, SameSite=Lax, Secure in production, 30-day sessions (rolling once a day).
- Allowed hosts in committed code (`src/lib/account/auth.server.ts`): `onlymen.gay`, `www.onlymen.gay`, `onlymen.live`, `www.onlymen.live`, `onlymen.vercel.app`, `onlymen-18nover.vercel.app`, `*.vercel.app`, `localhost`, `127.0.0.1`. The live hosts were added in the private-mode commit (`8311918`).
- Password-reset tokens expire in one hour and are stored in `verification`. No email provider is connected, so production does not send or display the link.

---

## 6. Related docs

- Hosting, domains, env var names, deploys, and the planned Cloudflare move: [HOSTING.md](HOSTING.md)
- Accounts, webhook, ethnicity decision: [ACCOUNTS.md](ACCOUNTS.md)
- Open engineering work: [ROADMAP.md](ROADMAP.md)
