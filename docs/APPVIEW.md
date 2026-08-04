# OnlyMen AppView + Ozone

This is the source of truth for the OnlyMen AppView (read-side indexing and
API) and Ozone (moderation): where the code lives, which domains it uses,
how to work with it from the repository root, and how it is deployed. It
assumes the production PDS (`docs/PDS.md`) is already live - the identity
bootstrap below depends on it.

## Domain plan

| Domain | Role |
| --- | --- |
| `api.onlymen.gay` | Production AppView (read API) service hostname |
| `mod.onlymen.gay` | Production Ozone (moderation) service hostname |

Unlike the PDS's wildcard `*.pds.onlymen.gay`, these are fixed, known
hostnames - no on-demand TLS or per-request TLS callback is needed.

## Two services, four processes

"The AppView" is actually two halves, and this repo runs each as its own
container:

- **`bsky`** - the public `app.bsky.*` read API. Talks to `bsky-indexer`
  over `BSKY_DATAPLANE_URLS` for data; never touches Postgres directly.
- **`bsky-indexer`** - the dataplane server plus firehose subscription that
  actually indexes a PDS's repos into Postgres. **Upstream `@atproto/bsky`
  ships a production entrypoint for only the `bsky` half** - the indexer
  half is otherwise exercised only by its `dev-env` test harness. This
  fork's `atproto/services/bsky-indexer/` is an OnlyMen-specific addition
  that wraps `DataPlaneServer` + `RepoSubscription` + `BsyncSubscription`
  from `@atproto/bsky` into a real entrypoint. Without it, `bsky` boots and
  passes health checks but never shows any content - deploying only the
  upstream-provided half looks live while doing nothing.
- **`ozone`** - moderation: actions, labels, report triage.
- **`bsync`** - cross-service sync (mutes, notifications) that `bsky`
  depends on.

For a 1-20-user pilot, `bsky-indexer` subscribes directly to the one
production PDS's firehose - there's no relay/BGS package in this fork, so
that's the entire crawl topology for now.

## Code and deployment layout

| Path | Purpose |
| --- | --- |
| `atproto/packages/{bsky,ozone,bsync}/` | Reusable service implementations and configuration |
| `atproto/services/{bsky,ozone,bsync}/` | Production entrypoints and Docker images (upstream) |
| `atproto/services/bsky-indexer/` | Dataplane/indexer production entrypoint (OnlyMen-specific) |
| `deploy/appview/` | Compose, Caddy, environment, verification, and rollback templates |
| `.github/workflows/appview-production.yml` | Test, build, publish, and SSH deployment workflow |

Keep all four AT Protocol service directories under `atproto/services/`,
matching the PDS's layout (`docs/PDS.md`). The Docker build context for
every image is `atproto/`, for the same reason as the PDS: each image copies
workspace packages as well as its own entrypoint.

## Identity bootstrap order

This is a real sequencing dependency, not just configuration busywork -
covered in full in `deploy/appview/README.md`:

1. Create Ozone's service account on the already-live production PDS via
   `deploy/pds/create-account.sh` - a real `did:plc:...`, since Ozone
   publishes moderation actions/labels as its own repo (unlike the
   AppView's static `did:web:api.onlymen.gay` identity, which needs no
   repo).
2. Wire that DID into `ozone.env`'s `OZONE_SERVER_DID`, `bsky.env`'s
   `MOD_SERVICE_DID`, and (a required follow-up edit to the already-live
   PDS) `deploy/pds/pds.env`'s `PDS_MOD_SERVICE_DID` /
   `PDS_REPORT_SERVICE_DID`.
3. Bring up `bsky` / `bsky-indexer` / `ozone` / `bsync`.
4. Only then set `PDS_CRAWLERS` on the PDS and redeploy it, so it notifies
   the AppView of new commits.

## Work from the repository root

```bash
make appview-build
make appview-docs
docker compose --profile appview up   # local dev, once BSKY_SERVICE_SIGNING_KEY
                                       # and BSKY_REPO_PROVIDER are set in a .env file
```

For a command not exposed by `make`, use the pinned AT Protocol toolchain
from the root, e.g.:

```bash
om run atproto --filter '@atproto/bsky...' build
```

## Production prerequisites

Before starting the production stack:

1. Point `A`/`AAAA` records for `api.onlymen.gay` and `mod.onlymen.gay` to
   the shared Docker host.
2. Make Caddy and the AppView/Ozone containers share the configured
   external Docker network.
3. Complete the identity bootstrap order above.
4. Generate every secret independently (Postgres password,
   `BSKY_SERVICE_SIGNING_KEY`, `OZONE_SIGNING_KEY_HEX`,
   `OZONE_ADMIN_PASSWORD`, a shared `BSYNC_API_KEYS` /
   `BSKY_BSYNC_API_KEY`) - see each `deploy/appview/*.env.example` file for
   the exact command and which other file needs the same value.

Detailed host setup, deployment, verification, and rollback instructions
live in [`../deploy/appview/README.md`](../deploy/appview/README.md).

## Go-live checklist

- `https://api.onlymen.gay/xrpc/_health` and
  `https://mod.onlymen.gay/xrpc/_health` report healthy.
- `https://api.onlymen.gay/.well-known/did.json` identifies the AppView.
- Caddy issues certificates for both fixed hostnames.
- A test record created through the PDS becomes visible through
  `https://api.onlymen.gay` (proves `bsky-indexer` is actually subscribed
  and indexing, not just running).
- A test report reaches Ozone's moderation queue at
  `https://mod.onlymen.gay`.
- Container recreation preserves Postgres and Redis data.
- Age assurance is live: every `BSKY_KWS_*` variable in
  `deploy/appview/bsky.env.example` is set (they are all-or-nothing), a test
  account completes the age-assurance flow, and an unverified account is
  actually gated. OnlyMen is 18+; without this the platform has no age
  check at all.
- An adult-content labeling policy exists in Ozone: label values chosen,
  `OZONE_ADMIN_DIDS` set to real moderator accounts, and a test label
  applied from `https://mod.onlymen.gay` is visible through the AppView.
- A restore rehearsal succeeds before onboarding a second real PDS user -
  `deploy/pds/README.md` already gates on this.
