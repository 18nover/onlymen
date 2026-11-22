# Hosting, domains, and deploys — OnlyMen

**Last updated:** 2026-11-21
**Status:** Living. No secrets in this file: environment variable **names** only, never values.

---

## 1. Ownership

| What | Owner | Notes |
|---|---|---|
| Repo `18nover/onlymen`, Vercel project `onlymen`, domains onlymen.gay and onlymen.live | OnlyMen bot | This document's scope. |
| Repo `18nover/18nover`, Vercel project `18nover`, domain 18nover.gay, company branding, LLC, company legal pages | 18nover bot | Coordinate before changing footer links that point at OnlyMen routes. |
| Shared infra, credentials, review | Supervisor | Coordinates; does not silently edit another bot's repo, project, or DNS. |

Nobody changes another's repo, project, or DNS without asking its owner first.

---

## 2. Vercel project

- Team: **18nover**
- Project name: **onlymen**
- Project id: `prj_8EH4cRiR7O0MdeGI3bVRre3Fv7Cx`
- Framework (Vercel): `tanstack-start`; Node `26.x`
- **Not Git-linked.** Production deploys are **file uploads** through the Vercel connector, not pushes from GitHub.
- Preview deployments are behind **Vercel Authentication** (SSO protection, preview only). Password protection is off.
- Plan: Vercel **Hobby**. Hobby is **non-commercial**. Paid hosting (for example Vercel Pro) or a move off Vercel is required before taking payments or selling featured placements. The planned path is Cloudflare Workers; see [§7](#7-cloudflare-workers-port-workersdev-preview).

### Current production (verified 2026-11-21)

- Deployment: `dpl_7Kh2hs6SbZon8TZPeDES1zLRenZE`
- Created: **2026-11-21 4:56 PM ET**
- State: READY, production
- Aliased to: `onlymen.gay`, `www.onlymen.gay`, `onlymen.live`, `www.onlymen.live`, `onlymen.vercel.app`, and `onlymen-18nover.vercel.app`
- Inspector: https://vercel.com/18nover/onlymen/7Kh2hs6SbZon8TZPeDES1zLRenZE
- The upload was built from commit `eeb2736` (real accounts on Neon). Later git commit `356b664` (ethnicity decision docs) was not itself a new production deploy. `VITE_LIVE_DOMAIN_READY` was then set on Production and the project was redeployed so Go live / Watch hand-offs use onlymen.live.

---

## 3. Domains and DNS

Registrar and authoritative DNS: **Porkbun**. Nameservers on both zones are Porkbun's (`curitiba`, `fortaleza`, `maceio`, `salvador.porkbun.com`).

| Hostname | Role | Vercel project domain (verified 2026-11-21) |
|---|---|---|
| `onlymen.gay` | Primary product domain | Attached, verified, no redirect |
| `www.onlymen.gay` | www | Attached, verified; **redirect currently `null`** (should be a 308 to `onlymen.gay`) |
| `onlymen.live` | Live / cam hand-off domain (bought 2026-11-21; HTTPS on this project since that afternoon) | Attached, verified, no redirect |
| `www.onlymen.live` | www | Attached, verified; **redirect currently `null`** (should be a 308 to `onlymen.live`) |
| `onlymen.vercel.app` | Vercel default alias | Attached, verified |
| `onlymen-18nover.vercel.app` | Team alias; also listed in Better Auth trusted origins | Present on the project |

**www 308 redirects (open item).** Around **2026-11-21 4:49 PM ET**, the 308 redirects on both `www.onlymen.gay` and `www.onlymen.live` were cleared in the Vercel UI (`redirect` is `null`, so www serves the site directly). They still need to be reset: `www.onlymen.gay` → `onlymen.gay` (308) and `www.onlymen.live` → `onlymen.live` (308). The Vercel connector has no tool to edit project-domain redirects; this has to be done in the Vercel UI (Settings → Domains).

**DNS backups** live on the shared box at `/workspace/dns-backup/onlymen.gay.json` and `/workspace/dns-backup/onlymen.live.json`. **Never touch or overwrite the Google MX and TXT records on onlymen.gay** (Google Workspace mail: MX, SPF, DKIM, and Google site verification). Those records are present in the onlymen.gay backup.

---

## 4. Environment variables (names only)

Never commit or paste values. The site reads these:

| Name | Where used | Purpose |
|---|---|---|
| `DATABASE_URL` | `src/lib/db.ts`, `src/lib/account/auth.server.ts`, `scripts/migrate.mjs` | Neon **pooled** URL. Missing → PGLite fallback. Set on Production and Preview. |
| `BETTER_AUTH_SECRET` | `src/lib/account/auth.server.ts` | Required in production when `DATABASE_URL` is set. Set on Production and Preview. |
| `BETTER_AUTH_URL` | `src/lib/account/auth.server.ts` | Optional. Pins the auth base URL; otherwise derived from allowed hosts. **Not currently set** on the Vercel project. |
| `OM_ACCOUNTS` | `src/lib/account/auth.server.ts` | Local dev only. Set to `server` to use the server adapter on PGLite without Neon. |
| `ONLYMEN_WEBHOOK_URL` | `src/lib/account/notify.server.ts` | Sign-up webhook URL. Must be `https://…`. Off unless this **and** the key are set. |
| `ONLYMEN_WEBHOOK_KEY` | `src/lib/account/notify.server.ts` | Bearer key for that webhook. Set on Production. |
| `VITE_LIVE_BASE_URL` | `src/lib/live/config.ts` (build-time) | White-label live site base. Defaults to `https://onlymen.live` if unset. Set on Production. |
| `VITE_LIVE_DOMAIN_READY` | `src/lib/live/config.ts` (build-time) | Hand-offs to the live domain are enabled only when this equals the string `true`. Set on Production. |
| `VITE_AUTH_ENABLED` | template auth in `src/lib/auth/client.ts` | Template Grok-broker auth. Leave off / unset for product accounts. |
| `NODE_ENV` | various | Standard Node flag; Better Auth uses it to require the secret and to set Secure cookies. |
| `ONLYMEN_ALLOWED_USER_IDS` | `src/lib/private/` | Private-mode allowlist of user ids (comma-separated). Unset = nobody. Preferred. |
| `ONLYMEN_ALLOWED_USERNAMES` | `src/lib/private/` | Private-mode allowlist of usernames. Unset = nobody. |
| `ONLYMEN_OWNER_SIGNUP_EMAIL` | optional, one-time | If set, only that email may use the otherwise-closed sign-up path. Off by default. |
| `ONLYMEN_OWNER_SEED_TOKEN` | optional, one-time | Required for `POST /api/owner-seed`. Remove after the owner account is seeded. |
| `ONLYMEN_PRIVATE_MODE` | local dev only | Set to `off` to disable the coming-soon gate in non-production. Ignored in production. |

Other names appear in leftover template / preview scripts (`GROK_PROJECT_ID`, `GROK_GATE_ORIGIN`, `GROK_CONNECTORS_URL`, `GROK_CONNECTOR_ACCESS_TOKEN`, `VITE_PUBLIC_HOSTNAME`, `VITE_GROK_EXTENSIONS`, `VITE_STUN_URLS`, `XAI_API_KEY`, and various `*_TIMEOUT_MS` / e2e `BASE` / `TOKEN_CMD` vars). They are not part of the OnlyMen product account path.

### Pending fix: webhook URL name typo

The app looks for `ONLYMEN_WEBHOOK_URL` (no S). On Vercel Production the URL variable was saved as `ONLYMEN_WEBHOOKS_URL` (plural). Rename it in the Vercel UI, then **redeploy** Production (no code change needed) so sign-up alerts turn on. `ONLYMEN_WEBHOOK_KEY` is already present under the correct name. Do not put the URL or key through chat or the connector.

---

## 5. Notifications (sign-up webhook)

`src/lib/account/notify.server.ts` POSTs `{event, username, role, at}` (`event` is `"signup"`, `role` is `"creator"` or `"fan"`) with `Authorization: Bearer <key>` to the notification webhook that Supervisor monitors. It is fire-and-forget (1.5s timeout), never awaited, and sends no email or other PII.

It stays **off** until both `ONLYMEN_WEBHOOK_URL` and `ONLYMEN_WEBHOOK_KEY` are set correctly (see the typo above).

---

## 6. Database hosting (Neon)

- Project name: `onlymen`
- Project id / slug: `long-math-62389085`
- Database name: `onlymen` (role name `onlymen_owner`)
- Region: AWS us-east-1
- Postgres 17, plan `free_v3`
- Default branch: `main`
- Branch logical size limit on this plan, verified 2026-11-21: **1 GB** (photos in `bytea` count against this)

---

## 7. Cloudflare Workers port (workers.dev preview)

**Status:** code on branch `cloudflare-workers` (PR "Cloudflare Workers port (workers.dev preview, do not merge)"). Preview Worker only, at **https://onlymen.18nover.workers.dev**. **No routes, no custom domains, no DNS changes.** onlymen.gay / onlymen.live stay on Vercel until a cutover is approved. Full plan: `/workspace/plans/cloudflare-migration.md` on the shared box.

### How the dual-target build works

| | Vercel (default, unchanged) | Cloudflare Workers |
|---|---|---|
| Build | `npm run build` (vite build + Nitro `preset: "vercel"`, then `db:migrate`) | `npm run build:cf` (`DEPLOY_TARGET=cloudflare`, Cloudflare Vite plugin, **no** migrate) |
| Server entry | Nitro; auto-registers `server/middleware/*` | `src/worker.ts` (wraps TanStack Start with the same `grok-pwa` → `private-gate` middlewares, same order) |
| Env / secrets | `process.env` | `import { env } from "cloudflare:workers"` (falls back to `process.env`) |
| Database | `pg` Pool on `DATABASE_URL` | Hyperdrive binding `HYPERDRIVE` → **per-request** `pg` Client(s), closed with `ctx.waitUntil` when the response body ends. No module-level pool. |
| PGLite | dev fallback | stubbed out of the bundle |

The switch is `src/lib/platform/runtime.ts` (Node) vs `src/lib/platform/cloudflare.ts` (Workers), swapped at bundle time by `platformRuntimePlugin` in `vite.config.ts`. `@cloudflare/vite-plugin` and `wrangler` are devDependencies and are only imported when `DEPLOY_TARGET=cloudflare`, so Vercel's `npm install --omit=dev` build is unaffected. Nitro stays installed for the Vercel target.

Config: `wrangler.jsonc` — `name: "onlymen"`, `main: "src/worker.ts"`, `compatibility_date: "2026-11-21"`, `nodejs_compat`, `workers_dev: true`, `preview_urls: false`, observability + traces on, Hyperdrive `HYPERDRIVE` = `2e620b8e625e454fb58fc8120df9e02f` (config `onlymen-neon`: Neon direct host, db `onlymen`, user `onlymen_owner`).

Private mode is fully enforced on the Worker: the coming-soon gate, `disableSignUp` plus the sign-up before-hook, the allowlist session hook, members-only `/api/photo/<id>`, `x-robots-tag: noindex` on every app response, and `/api/owner-seed` returns 404 unless `ONLYMEN_OWNER_SEED_TOKEN` is set (never set it on the Worker). `privateModeOff()` compiles to `false` in the Worker bundle.

### Worker variables (names only)

| Name | Kind | Needed? |
|---|---|---|
| `HYPERDRIVE` | binding (wrangler.jsonc) | Required. Replaces `DATABASE_URL` on the Worker. |
| `BETTER_AUTH_SECRET` | secret | Required (`wrangler secret put`). |
| `ONLYMEN_ALLOWED_USER_IDS` | secret | Required, or nobody can sign in (fails closed). |
| `ONLYMEN_ALLOWED_USERNAMES` | secret | Optional alternative allowlist. |
| `ONLYMEN_WEBHOOK_URL`, `ONLYMEN_WEBHOOK_KEY` | secrets | Optional; sign-up alerts (sent with `waitUntil`). |
| `BETTER_AUTH_URL` | secret/var | Optional. Leave **unset** on the preview (base URL comes from the allowed-hosts list, which includes `onlymen.18nover.workers.dev`). Pin to `https://onlymen.gay` only at cutover. |
| `NODE_ENV` | var (wrangler.jsonc) | `production`. |
| `ONLYMEN_INVITES` | var (wrangler.jsonc) | `on` on the Worker preview (invite-code sign-up). Leave unset on Vercel. |
| `ONLYMEN_DEMO_PROFILES` | var (wrangler.jsonc) | Default `on`. Set to `off` to hide invented placeholder profiles. |
| `VITE_LIVE_BASE_URL`, `VITE_LIVE_DOMAIN_READY`, `VITE_AUTH_ENABLED` | **build-time** (shell/CI env when running `build:cf`; `VITE_AUTH_ENABLED=false` comes from `.grok/app-env.json`) | Same values as Vercel Production. |
| `ONLYMEN_OWNER_SIGNUP_EMAIL`, `ONLYMEN_OWNER_SEED_TOKEN`, `ONLYMEN_PRIVATE_MODE` | — | **Do not set** on the Worker. |
| `DATABASE_URL` | — | **Not** on the Worker. Only for `npm run db:migrate` (Node, CI or laptop). |

### Deploy steps

Needs a `CLOUDFLARE_API_TOKEN` for account 18nover (`CLOUDFLARE_ACCOUNT_ID` too) with **Account → Workers Scripts: Edit**, **Account → Hyperdrive: Read** (binding check), and **Account → Account Settings: Read**; **User → User Details: Read** and **Memberships: Read** keep `wrangler whoami` working. No zone/DNS permissions are needed for workers.dev. Keep the token out of chat and the repo.

```sh
npm ci
npm run db:migrate              # Node only, DATABASE_URL in the shell env; skip if no new migrations
npm run deploy:cf:dry-run       # build:cf + wrangler deploy --dry-run
npx wrangler secret put BETTER_AUTH_SECRET          # value via stdin, never argv
npx wrangler secret put ONLYMEN_ALLOWED_USER_IDS
npm run deploy:cf               # build:cf + wrangler deploy  → https://onlymen.18nover.workers.dev
npx wrangler tail onlymen --format pretty           # live logs incl. CPU time
```

Local: `npm run preview:cf` (build + `wrangler dev` on :8787). Hyperdrive needs `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE` pointing at a **local or Neon-branch** Postgres (never production); local secrets go in `.dev.vars` (gitignored).

### CPU time (free plan = 10 ms per request)

- Better Auth hashes with **scrypt** (N=16384, r=16). In workerd it uses native `node:crypto` scrypt: measured **~50 ms CPU per verify** locally (hash ~50–80 ms). Every sign-in, password change and reset is ~5× over the free limit, so **Error 1102 on login is expected on the free plan**. Do not weaken the hash; use **Workers Paid ($5/mo)**.
- Warm SSR of the gate, /login and legal pages measured ~6–8 ms wall locally: near the limit. Session checks are a cookie HMAC + one or two Hyperdrive queries (cheap).
- Measured on the real workers.dev deploy (2026-11-21, `wrangler tail`): sign-in POST **87–172 ms CPU**, cold `/login` SSR up to ~190 ms, warm SSR of login/legal pages 7–18 ms, gate pages 0–5 ms, session server-function GETs 1–12 ms, `/api/photo` 52–60 ms. No Error 1102 in ~15 sign-ins (all outcomes `ok`), but sign-in is 9–17× the documented free limit; budget for Workers Paid before real traffic.
- Hyperdrive config `onlymen-neon` currently has **query caching enabled**. For auth/session reads, turn caching **off** (stale session/allowlist reads for up to 60 s after sign-out otherwise). Supervisor owns that config.

### Still open before any cutover

Nameserver move to Cloudflare free plan (copy Google MX/TXT first), Custom Domains on the apex + Redirect Rule for www, `public/_headers` long-cache for `/assets/*`, GitHub Actions deploy workflow, pin `BETTER_AUTH_URL`, and a photo-storage decision (R2 later — see §5 of the plan).

---

## 8. Private mode and deploys

As of **2026-11-21 9:28 PM ET**, OnlyMen is in private mode (public registration closed server-side; only Jerry's allowlisted account can sign in). The mechanism landed in commit `8311918` (see [ACCOUNTS.md](ACCOUNTS.md)).

For it to go live on onlymen.gay / onlymen.live: set the allowlist (and, if needed, owner-seed) environment variable **names** listed above in the Vercel UI, then do a Production file-upload redeploy that includes `8311918` or later. Do not put the values through chat or the connector. After a successful owner seed, remove `ONLYMEN_OWNER_SEED_TOKEN`.
