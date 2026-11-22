# Roadmap — OnlyMen

**Last updated:** 2026-11-21
**Status:** Living. Re-order and mark items complete as we progress. Keep this file the single source of current priority.

---

## Completed

- [x] **2026-11-20** — Project identity locked (OnlyMen / 18nover / onlymen.gay)
- [x] **2026-11-20** — Phase 1 rules defined (free + optional tips only)
- [x] **2026-11-20** — Documentation skeleton created and seeded
- [x] **2026-11-20** — Clean GitHub start (fresh private repo https://github.com/18nover/onlymen)
- [x] **2026-11-20** — Live streaming + tips direction captured in the Product Spec
- [x] **2026-11-21** — Public site: photo-first homepage, directory, profiles, filters
- [x] **2026-11-21** — Sign-up, log-in, onboarding, draft legal pages
- [x] **2026-11-21** — Live surfaces (`/live`, hand-off, go-live, schedule, reminders, live rules) under the partner-compliance model
- [x] **2026-11-21** — Real accounts on Neon Postgres + Better Auth; photos at `/api/photo/<id>`
- [x] **2026-11-21** — onlymen.gay and onlymen.live on the `onlymen` Vercel project; `VITE_LIVE_DOMAIN_READY` set on Production
- [x] **2026-11-21** — Decision: keep the ethnicity filter as a self-identified, optional creator field
- [x] **2026-11-21 9:28 PM ET** — Private mode: sign-up closed, owner-only allowlist, coming-soon gate, owner seed (`8311918`)

---

## Current priority

1. **Turn private mode on in Production** — set `ONLYMEN_ALLOWED_USER_IDS` (and related names in [HOSTING.md](HOSTING.md); never paste values into chat), then file-upload redeploy from `8311918` or later. Remove `ONLYMEN_OWNER_SEED_TOKEN` after a successful owner seed.
2. **Webhook env typo** — rename Production `ONLYMEN_WEBHOOKS_URL` to `ONLYMEN_WEBHOOK_URL`, then redeploy so sign-up alerts turn on. Jerry does this in the Vercel UI.
3. **www 308 redirects** — in the Vercel UI, restore `www.onlymen.gay` → `onlymen.gay` and `www.onlymen.live` → `onlymen.live` (cleared around 4:49 PM ET on 2026-11-21). The connector cannot edit project-domain redirects.
4. **Password-reset email** — pick a free (or cheapest adult-allowed) provider and actually send the one-hour reset link.
5. **Hardening** — login rate limiting; wrap account saves in a single transaction.
6. **Jerry's cam room links** — plus tap-friendly Tip/Message buttons on phone tiles, and the Live-now name alignment fix (Marco's two-line tagline).
7. **Implement the ethnicity field** on real creator profiles (optional, self-identified), not only on demo models / the filter drawer.
8. **Lawyer review** of `/terms`, `/privacy`, `/guidelines`, `/2257`, and `/live-rules`. Coordinate with the 18nover bot before renaming those routes (the company footer links here).
9. **White-label live partner** — choose one; do not treat onlymen.live as a finished live product until a partner is serving rooms.
10. **KYC vendor** (Veriff, Yoti, or Persona) so ID documents leave the device.
11. **Commercial-ready hosting** — Cloudflare Workers port is on branch `cloudflare-workers` (workers.dev preview only, PR not merged; see [HOSTING.md §7](HOSTING.md#7-cloudflare-workers-port-workersdev-preview)). Remaining: decide free vs **Workers Paid $5/mo** (scrypt sign-in ≈ 50 ms CPU vs the 10 ms free limit), turn off Hyperdrive query caching, `public/_headers`, GitHub Actions deploy (`db:migrate` → `build:cf` → `wrangler deploy`), then nameserver cutover with custom domains. Vercel stays live until then.

---

## Open engineering items (known gaps)

- Geo-blocking is stored but not enforced.
- Photo storage is `bytea` in Neon, capped by the free-plan branch size (1 GB verified 2026-11-21). On Workers every photo view is a Worker request (100k/day free) plus a Hyperdrive query; move to R2 when volume or Neon size gets tight.
- Re-counted 2026-11-21 on `cloudflare-workers`: **1 pre-existing lint error** (`client.server.ts` empty block), **8 failing template share-card tests** and **1 failing migration-plan test**; all pre-existing on main.
- AI operations plan (ranking, featured pricing, safety, agent-run ops) is a plan, not a build: [OPERATIONS.md](OPERATIONS.md).

---

## Later / backlog

- Tip implementation, 10–15% commission, payouts through Segpay / CCBill
- Memberships, affiliates (no paid ranking or placement)
- Messaging / contact flow
- Event log and ranking v1 (see the AI operations plan)
- Photo pipeline off Postgres (R2 + CSAM scanning)
- Admin / moderation tools and a one-tap approval queue
- Real reminder / go-live notifications (email or push)
- SSO and shared wallet with the white-label partner
- Open sign-ups + X / PR launch, after the owner is live and private mode is lifted

---

*When a step is finished, move it to Completed with the date and update Current priority so this file always reflects reality.*
