# OnlyMen docs

Living documentation for the OnlyMen product ([github.com/18nover/onlymen](https://github.com/18nover/onlymen)). Start here, then follow the links.

**Ownership.** The OnlyMen bot owns this repo, the `onlymen` Vercel project, and the onlymen.gay / onlymen.live domains. The 18nover bot owns the company side (repo `18nover/18nover`, the `18nover` Vercel project, 18nover.gay, branding, LLC, and company legal pages). Supervisor coordinates and handles shared infra. Nobody changes another's repo, project, or DNS without asking its owner first.

**Private mode (as of 2026-11-21 9:28 PM ET).** Public registration is closed server-side and only Jerry's allowlisted account can sign in. See [ACCOUNTS.md](ACCOUNTS.md#private-mode-as-of-2026-11-21-928-pm-et) for the mechanism.

Do not put secrets in these files: environment variable **names** only, never values.

## Index

| File | What it covers |
|---|---|
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | Vision, users, Phase 1 rules, business decisions, private mode |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, data model, photos, auth, how the app is put together |
| [HOSTING.md](HOSTING.md) | Domains, DNS, env var names, Vercel deploys, planned Cloudflare move |
| [ACCOUNTS.md](ACCOUNTS.md) | Neon + Better Auth, tables, sign-up webhook, account gaps, ethnicity decision |
| [ONBOARDING.md](ONBOARDING.md) | `/join` `/login` `/onboarding` `/me`, wizard steps, draft legal pages |
| [LIVE.md](LIVE.md) | Partner-compliance live model, hand-offs to onlymen.live and creator rooms |
| [OPERATIONS.md](OPERATIONS.md) | AI operations plan (ranking, pricing, safety, agents, costs) |
| [ROADMAP.md](ROADMAP.md) | What's done, what's open, current priority |
| [DECISION_LOG.md](DECISION_LOG.md) | Chronological decisions and why |

## Related (outside this repo)

- Cloudflare migration plan (planned, **not started**): `/workspace/plans/cloudflare-migration.md` on the shared box
- DNS backups: `/workspace/dns-backup/onlymen.gay.json` and `/workspace/dns-backup/onlymen.live.json` on the shared box. Never use a backup to overwrite the Google MX/TXT records on onlymen.gay.
- AI operations plan Page: [OnlyMen AI Operations Plan](https://cursor.com/canvas/store-2cd20948-eddd-4f70-85a3-7c25d7c2a761/b59a0ba2-2cc4-4337-9041-9314a01932ff)
- Company site: 18nover.gay (owned by the 18nover bot). Its footer links to OnlyMen's `/terms`, `/privacy`, `/2257`, `/guidelines`, and `/join?as=creator`. Coordinate with the 18nover bot before moving or renaming those routes.
- Visitor 18+ age gate: [AGE_GATE.md](AGE_GATE.md) · Creator ID verification + 2257: [VERIFICATION.md](VERIFICATION.md)
