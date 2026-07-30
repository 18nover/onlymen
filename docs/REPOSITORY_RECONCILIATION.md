# Repository Reconciliation

The authoritative checkout is `/home/jerry/onlymen` in `Ubuntu-26.04`.
`C:\Users\jerry\projects\onlymen` remains an older, dirty Windows checkout and
must not be deleted or reused for development yet.

Recoverable binary patches were captured before reconciliation:

```text
C:\Users\jerry\projects\onlymen-reconciliation-backups\2026-07-30\
  windows-3628f345d-working-tree.patch

/home/jerry/onlymen-reconciliation-backups/2026-07-30/
  wsl-983f71456-working-tree.patch
```

## Reconciled into WSL

- Current human agent roster in root instructions.
- OnlyMen application identifiers and splash branding.
- OAuth client metadata for `onlymen.gay`.
- VS Code watcher/tooling intent appropriate to a WSL-root workspace.
- The `org` package CLI declaration.
- The WSL-first launcher and engineering-office implementation.

## Preserved for a later product review

The Windows patch also contains dependency-version churn, generated build
artifacts, Markdown-only formatting, and a root `docker-compose.yml` for a
partial self-hosted production stack. The Compose draft deliberately omits a
self-hosted AppView and contains `CHANGE_ME` credential defaults, so it was not
made part of the trusted daily workflow without a dedicated infrastructure and
security review.

Do not archive the Windows checkout until the backup patch has been reviewed
for any further product work. When that review is complete, close editors and
shells rooted in the Windows checkout, rename it to an archive outside
`projects`, and keep `/home/jerry/onlymen` as the only active clone.
