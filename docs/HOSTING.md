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
- Plan: Vercel **Hobby**. Hobby is **non-commercial**. Paid hosting (for example Vercel Pro) or a move off Vercel is required before taking payments or selling featured placements. The planned path is Cloudflare Workers; see [§7](#planned-cloudflare-move).

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

## 7. Planned Cloudflare move

**Status: planned, not started.** Do not begin this migration from these docs. The full plan is `/workspace/plans/cloudflare-migration.md` on the shared box (Supervisor, 2026-11-21).

Why: Vercel Hobby is non-commercial, and the cheapest path off it is Cloudflare Workers (commercial use allowed on the free plan). Porkbun stays the registrar. Neon stays the database.

Intended OnlyMen shape (when work is approved):

- Uninstall Nitro; install the official **Cloudflare Vite plugin** (`@cloudflare/vite-plugin`) and **Wrangler**. Add `wrangler.jsonc` with `name: "onlymen"` and `main: "@tanstack/react-start/server-entry"`.
- Follow Cloudflare's TanStack Start / Vercel-to-Workers guides. Do **not** use Nitro's `cloudflare-module` preset.
- Talk to Neon through a free **Hyperdrive** config (preferred) or `@neondatabase/serverless`. Do not keep a process-wide `pg` Pool on Workers. Keep `scripts/migrate.mjs` as a Node CI step, not inside the Worker.
- Read production secrets via `cloudflare:workers` `env`. Keep `VITE_LIVE_*` as build-time vars.
- Extend Better Auth allowed hosts with `onlymen.live`, `www.onlymen.live`, and the `*.workers.dev` preview host.
- Cloudflare account / team name should be **18nover**. Do not use Cloudflare Stream or Images for explicit video (rent-compliance model stays).
- Nameserver cutover to Cloudflare's free plan is required for custom domains on the cheap path; copy every email record first, and do not cut over until a `workers.dev` preview has been tested (sign-up, sign-in, photos). Rollback is switching Porkbun nameservers back.
- Realistic start cost is $0, or $5/mo (Workers Paid) if scrypt / SSR consistently exceeds the free plan's 10 ms CPU limit.

---

## 8. Private mode and deploys

As of **2026-11-21 9:28 PM ET**, OnlyMen is in private mode (public registration closed server-side; only Jerry's allowlisted account can sign in). When the gate commit lands, a Production redeploy (file upload, same as usual) is required for it to go live. Mechanism details: see [ROADMAP.md](ROADMAP.md) (TODO if not yet in the tree).
