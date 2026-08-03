# bsky indexer service

OnlyMen-specific production entrypoint - **not part of upstream `bluesky-social/atproto`**.
Upstream ships `@atproto/bsky`'s API server (`services/bsky`) but no
production entrypoint for the dataplane/indexer half of the package
(`DataPlaneServer` + `RepoSubscription` + `BsyncSubscription`, otherwise only
exercised by the `dev-env` test harness). This service wraps that half so a
self-hosted AppView can actually index a PDS's firehose instead of only
serving reads from an empty database.

The entrypoint command should run `index.js` with node, e.g. `node index.js`.
It shares its Postgres database and most of its configuration with the
`bsky` API server (they are the same logical service, split into two
processes) - deploy them with the same `bsky.env` file. In addition to every
var documented in `../bsky/README.md`, this process reads:

- `BSKY_DB_POSTGRES_URL` - (required) Postgres connection string for the
  AppView database (the same database `ozone` and `bsync` do not share -
  bsky owns its own `bsky` database).
- `BSKY_REPO_PROVIDER` - (required) the firehose source to subscribe to,
  e.g. `https://pds.onlymen.gay` for a single-PDS pilot. Not a relay - this
  fork has no relay/BGS package, so a small deployment subscribes to its one
  PDS directly.
- `BSKY_DATAPLANE_PORT` - (recommended) the port the dataplane RPC server
  listens on internally. The `bsky` API server's `BSKY_DATAPLANE_URLS` must
  point at this service and port, e.g. `http://bsky-indexer:3000`. Defaults
  to `3000`.
- `BSKY_DB_POOL_SIZE` - (optional) Postgres pool size. Defaults to `10`.
- `BSKY_DB_MIGRATE` - (optional) set to `1` to run Postgres migrations to
  latest on boot. Only one instance should run with this set during a
  deploy.
