# OnlyMen docs

Living documentation for OnlyMen ([github.com/18nover/onlymen](https://github.com/18nover/onlymen)). Start here and follow the links.

**Ownership.** The OnlyMen bot owns this repo, the `onlymen` Vercel project, the `onlymen` Cloudflare Worker and the onlymen.gay / onlymen.live domains. The 18nover bot owns the company side (repo `18nover/18nover`, the `18nover` Vercel project, 18nover.gay, branding, LLC and company legal pages). Supervisor coordinates and handles shared infra. Nobody changes another's repo, project or DNS without asking its owner first.

**Private mode (as of 2026-11-21 9:28 PM ET).** Public registration is closed on the server and only allowlisted accounts can sign in. See [ACCOUNTS.md](ACCOUNTS.md#private-mode-as-of-2026-11-21-928-pm-et).

Never put secrets in these files. Use environment variable **names** only, never values.

## Index

### Product
| File | What it covers |
|---|---|
| [PRODUCT_SPEC.md](PRODUCT_SPEC.md) | Vision, users, Phase 1 rules, business decisions, private mode |
| [ROADMAP.md](ROADMAP.md) | What's done, what's open, current priority |
| [DECISION_LOG.md](DECISION_LOG.md) | Decisions in date order, and why |
| [OPERATIONS.md](OPERATIONS.md) | AI operations plan (ranking, safety, agents, costs); partly superseded |

### Features
| File | What it covers |
|---|---|
| [ONBOARDING.md](ONBOARDING.md) | `/join` `/login` `/onboarding` `/me`, wizard steps, draft legal pages |
| [INVITES.md](INVITES.md) | Invite codes, `/admin/invites`, `ONLYMEN_INVITES` |
| [AGE_GATE.md](AGE_GATE.md) | Visitor 18+ age gate, verifier and geoblock flags |
| [VERIFICATION.md](VERIFICATION.md) | Creator ID verification, 2257 records, `/admin/verifications` |
| [LIVE.md](LIVE.md) | Partner-compliance live model, hand-offs to onlymen.live, creator rooms |
| [NEARBY.md](NEARBY.md) | Opt-in Nearby grid, location privacy, reports |
| [legal-placeholders.md](legal-placeholders.md) | Current unresolved placeholders in all legal pages |

### Engineering
| File | What it covers |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, data model, photos, banners, auth |
| [ACCOUNTS.md](ACCOUNTS.md) | Neon + Better Auth, tables, sign-up webhook, ethnicity decision |
| [HOSTING.md](HOSTING.md) | Domains, DNS, env var names, Vercel and the Cloudflare Worker |
| [CLEANUP.md](CLEANUP.md) | ONL-11: what was removed, retired DB fields and drop candidates, what was kept and why |

## Related (outside this repo)

- Cloudflare migration plan: `/workspace/plans/cloudflare-migration.md` on the shared box.
- DNS backups: `/workspace/dns-backup/onlymen.gay.json` and `/workspace/dns-backup/onlymen.live.json` on the shared box. Never use a backup to overwrite the Google MX/TXT records on onlymen.gay.
- AI operations plan Page: [OnlyMen AI Operations Plan](https://cursor.com/canvas/store-2cd20948-eddd-4f70-85a3-7c25d7c2a761/b59a0ba2-2cc4-4337-9041-9314a01932ff)
- Company site: 18nover.gay (owned by the 18nover bot). Its footer links to OnlyMen's `/terms`, `/privacy`, `/2257`, `/guidelines` and `/join?as=creator`. Check with the 18nover bot before moving or renaming those routes.
