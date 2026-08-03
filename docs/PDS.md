# OnlyMen PDS

This is the source of truth for the OnlyMen Personal Data Server (PDS): where
its code lives, which domains it uses, how to work with it from the repository
root, and how it is deployed. The production deployment is a new 1–20-user
pilot; it does not migrate data from the old standalone PDS repository.

## Domain plan

| Domain | Role |
| --- | --- |
| `onlymen.gay` | Canonical OnlyMen app and OAuth website |
| `pds.onlymen.gay` | Production PDS service hostname |
| `*.pds.onlymen.gay` | Hosted pilot handles and on-demand TLS |
| `onlymen.day` | Public/marketing redirect to `onlymen.gay` for now |
| `18nover.gay` | Operator/personal domain; not an AT Protocol service identity |

An account created as `alice.pds.onlymen.gay` is hosted by
`https://pds.onlymen.gay`. Do not advertise `alice.onlymen.gay` while the PDS
is configured with `PDS_SERVICE_HANDLE_DOMAINS=.pds.onlymen.gay`; that separate
wildcard may later be needed for application services.

The PDS hostname becomes part of account and service identity. Treat changing
it after account creation as a migration, not a cosmetic rename. No DNS or
registrar changes are made by repository commands.

## Code and deployment layout

| Path | Purpose |
| --- | --- |
| `atproto/packages/pds/` | Reusable PDS implementation and configuration |
| `atproto/services/pds/` | Production entrypoint, `/tls-check`, and Docker image |
| `deploy/pds/` | Compose, Caddy, environment, verification, and rollback templates |
| `.github/workflows/pds-production.yml` | Test, build, publish, and SSH deployment workflow |

Keep both AT Protocol PDS directories. The Docker build context is
`atproto/`, because the service image copies workspace packages as well as the
entrypoint. Do not copy the old `bluesky-social/pds` standalone distribution
into this repository.

## Work from the repository root

Run these commands from `~/onlymen`:

```bash
make help
make pds-test
make pds-build
make start PROFILE=stack
make status
make logs TARGET=atproto-stack
make stop
```

The local seeded development PDS is disposable and listens on
`http://localhost:2583`. It is not the production PDS and does not use the
production domains, secrets, or data directory.

For a command not exposed by `make`, use the pinned AT Protocol toolchain from
the root:

```bash
om run atproto --filter pds-service test
om run atproto --filter '@atproto/pds...' build
```

## Production prerequisites

Before starting the production container:

1. Point `A`/`AAAA` records for `pds.onlymen.gay` and
   `*.pds.onlymen.gay` to the shared Docker host.
2. Make Caddy and the PDS share the configured external Docker network.
3. Supply working OnlyMen AppView and Ozone URLs and DIDs. The names
   `api.onlymen.gay` and `mod.onlymen.gay` in the environment template are
   intended service names, not proof that those services are live.
4. Set a crawler only if the endpoint implements
   `com.atproto.sync.requestCrawl`.
5. Configure SMTP before onboarding real users.
6. Verify public PLC access and establish encrypted off-host backups.

The PDS needs four independently generated and securely backed-up secrets:
the JWT secret, DPoP secret, admin password, and PLC rotation key. Do not add
`PDS_REPO_SIGNING_KEY_K256_PRIVATE_KEY_HEX`; the current configuration does not
read it.

Detailed host setup, deployment, account creation, health checks, and rollback
instructions live in [`../deploy/pds/README.md`](../deploy/pds/README.md).

## Go-live checklist

- `https://pds.onlymen.gay/xrpc/_health` reports healthy.
- `com.atproto.server.describeServer` reports the intended hostname, handle
  domain, service DID, and invite-only policy.
- `https://pds.onlymen.gay/.well-known/did.json` identifies the PDS.
- Caddy issues certificates for the PDS and an existing account handle, while
  rejecting nonexistent and unrelated domains.
- A WebSocket client connects to
  `wss://pds.onlymen.gay/xrpc/com.atproto.sync.subscribeRepos`.
- A one-use invite succeeds once and account creation without an invite fails.
- The account DID document points to `https://pds.onlymen.gay`.
- A test record reaches ingestion, the OnlyMen AppView, and Ozone reporting.
- Container recreation preserves accounts, repositories, sequences, and blobs.
- A restore rehearsal succeeds before a larger beta.
