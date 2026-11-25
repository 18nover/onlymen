# Handoff

## What this project is

OnlyMen is a private, invite-only community for adult men, with creator profiles, live-stream hand-offs, optional tips, and an opt-in Nearby feature. It is built with TanStack Start and React, uses Better Auth for accounts, and stores app data in Postgres.

## Current state and branches

- The site is in private mode. Sign-up is limited to allowlisted or invited accounts.
- `main` is the production branch and auto-deploys.
- `invite-codes` is the working branch and the base for this work. The current task branch is `hardening/admin-login-profile-docs`; its PR must target `invite-codes`, never `main`.
- Neon is shared with production. This work adds migrations `0008_admin_audit.sql` and `0009_login_attempts.sql`; they have not been applied to the shared database. Apply them through the normal migration process before deploying code that depends on them.

## Rules to keep in mind

- Read and follow `AGENTS.md` before making changes.
- Keep database migrations additive. Do not drop, rewrite, or destructively migrate shared production data.
- Do not add dependencies for routine work, and never commit secret values or `.env` files.
- Preserve platform files and wiring, including `public/__grok/`, the PWA files and middleware, `scripts/grok-pwa-*`, and prewired `src/lib` helpers. Do not remove code that is imported or used by tests.
- Run the repository's tests, lint, typecheck, and relevant build before handing work off. For this branch the required commands are `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build:cf`.

## Changes in this branch

- Admin endpoints check the signed-in account's admin/owner role on the server and write append-only audit entries for authorized admin reads and actions. This includes invite management, reports, Plus grants, creator verification, KYC-file access, and owner bootstrap.
- Failed password sign-ins are limited to five per 15 minutes independently by IP and normalized account identifier. Stored keys are hashed.
- Account and profile saves now write account fields, consents, photo attachment/order, shows, and reminders in one transaction.
- The cleanup review found no safe app-owned code to remove. Remaining `/__grok/` paths and apparently unused helpers are required platform, runtime, route, or test infrastructure; the review is recorded in `docs/CLEANUP.md`.
- `docs/legal-placeholders.md` inventories the unresolved fields across all legal pages.

## Validation

`npm test`, `npm run lint`, `npm run typecheck`, and `npm run build:cf` passed. The Cloudflare build reports non-blocking chunk-size and sourcemap warnings.
