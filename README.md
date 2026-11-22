# OnlyMen

A private, invite-only community of verified adult creators for gay men: creator profiles, linked live cam rooms, optional tips and an opt-in Nearby grid. Fully owned. No escorting or paid in-person services, ever.

- **Domains:** onlymen.gay (product) and onlymen.live (live hand-offs)
- **Company:** 18nover (18nover.gay)
- **Phase 1:** free for everyone. Optional tips only, no subscriptions, no paid ranking or placement.
- **Private mode:** public sign-up is closed on the server. Only allowlisted or invited accounts get in.

## What's in the app

| Area | Routes | Flag (Worker) |
|---|---|---|
| Home / directory (with labeled AI demo profiles) | `/`, `/m/:handle` | `ONLYMEN_DEMO_PROFILES` |
| Invites | `/join`, `/admin/invites` | `ONLYMEN_INVITES` |
| 18+ age gate | `/age` | `ONLYMEN_AGE_GATE`, `ONLYMEN_AGE_VERIFIER`, `ONLYMEN_AGE_GATE_GEOBLOCK` |
| Creator ID verification + 2257 | `/me/verify`, `/admin/verifications`, `/2257`, `/custodian` | `ONLYMEN_ID_VERIFICATION`, `ONLYMEN_KYC_PROVIDER`, `ONLYMEN_KYC_SELF_REVIEW` |
| Accounts, onboarding, banners | `/login`, `/onboarding`, `/me` | — |
| Live / cam rooms | `/live`, `/watch/:handle`, `/live-rules` | — |
| Nearby | `/nearby`, `/admin/reports` | `ONLYMEN_NEARBY` |
| Legal | `/terms`, `/privacy`, `/guidelines` | — |

Flag values live in `wrangler.jsonc` (`vars`). Secrets are set with `wrangler secret`, and their names are listed in [docs/HOSTING.md](docs/HOSTING.md).

## Stack

TanStack Start (React, Vite, Tailwind), Better Auth, Neon Postgres (Hyperdrive on the Worker), Cloudflare Workers (`src/worker.ts`). The `main` branch still deploys to Vercel through Nitro (`server/`, `vercel.json`). All on free tiers.

## Layout

```
src/routes/       pages and API routes (file-based; routeTree.gen.ts is generated)
src/components/   UI (onboarding/, live, nearby, profile, home)
src/lib/          domain logic: account/, age-gate/, invites/, verification/, live/, nearby/, private/, platform/
server/           Nitro middlewares (age gate, private gate, PWA); the Worker reuses them
migrations/       additive SQL migrations (the DB is shared with production)
scripts/          build plugins, migration runner, invite-code tool, e2e scripts
docs/             living docs (start at docs/README.md)
```

## Commands

```
npm test              # script tests + src unit tests
npm run lint          # eslint
npm run typecheck     # tsc --noEmit
npm run build:cf      # Worker build
npm run deploy:cf     # Worker build + wrangler deploy (onlymen Worker only)
```

## Documentation

Start at **[docs/README.md](docs/README.md)** for the full index. ONL-11 cleanup notes are in [docs/CLEANUP.md](docs/CLEANUP.md).

## Working style

- Ship small working pieces. Update the Decision Log and the relevant docs after major decisions.
- Never put secrets in the repo or docs. Use env var names only.
- Migrations are additive only.
