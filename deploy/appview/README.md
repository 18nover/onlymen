# OnlyMen AppView + Ozone production deployment

This directory deploys the self-hosted AppView (`bsky` + `bsky-indexer`),
moderation service (`ozone`), and cross-service sync (`bsync`) from
`atproto/services/`, plus their shared Postgres and Redis. It targets the
same small production pilot as `deploy/pds/` - a Docker host whose existing
Caddy container owns ports 80 and 443 - and assumes the production PDS
(`deploy/pds/`) is already live, since the identity bootstrap below depends
on it.

`bsky-indexer` is an OnlyMen-specific addition: upstream `@atproto/bsky`
ships a production entrypoint for only the read-API half of the AppView; the
dataplane/firehose-indexing half is otherwise exercised only by its
`dev-env` test harness. See `atproto/services/bsky-indexer/README.md`.

## 1. Identity bootstrap order

This is a real sequencing dependency, not just configuration busywork:

1. **Create the Ozone service account on the already-live production PDS**,
   using the existing PDS tooling:
   ```bash
   sudo /srv/onlymen/pds/create-account.sh moderator@onlymen.gay mod.pds.onlymen.gay
   ```
   This is a real did:plc account - Ozone publishes moderation actions and
   labels as its own repo, unlike the AppView's static did:web identity.
2. **Use that DID everywhere it's referenced**: `OZONE_SERVER_DID` in
   `ozone.env`, `MOD_SERVICE_DID` in `bsky.env`, and both
   `PDS_MOD_SERVICE_DID` and `PDS_REPORT_SERVICE_DID` in the already-live
   `/srv/onlymen/pds/pds.env` (currently `did:plc:replace-with-ozone-did`
   placeholders - this is a required follow-up edit to the PDS's own
   config, easy to miss since the PDS is already deployed and running).
3. **Bring up `bsky` / `bsky-indexer` / `ozone` / `bsync`** (this
   directory's stack).
4. **Only then set `PDS_CRAWLERS`** on the PDS (`deploy/pds/pds.env`) to
   `https://api.onlymen.gay`, and redeploy the PDS, so it notifies the
   AppView of new commits.

## 2. Supply the external prerequisites

Create `A`/`AAAA` records for both fixed hostnames, pointing to the Docker
host:

```text
api.onlymen.gay
mod.onlymen.gay
```

Unlike the PDS's wildcard `*.pds.onlymen.gay`, these are fixed and don't
need on-demand TLS.

## 3. Install the host files

Copy `compose.yaml`, `init-postgres-databases.sh`, `deploy.sh`, and
`verify.sh` to `/srv/onlymen/appview`. Copy the five example templates from
`docs/appview/` without their `.example` suffixes. Do not commit the
resulting `bsky.env`, `ozone.env`, `bsync.env`, `postgres.env`, or
`image.env`.

```bash
sudo install -d -m 700 /srv/onlymen/appview/{data/postgres,data/redis,backups}
sudo install -m 600 docs/appview/{bsky,ozone,bsync,postgres,image}.env.example \
  /srv/onlymen/appview/  # then drop the .example suffix from each copy
sudo install -m 644 deploy/appview/compose.yaml /srv/onlymen/appview/
sudo install -m 755 deploy/appview/init-postgres-databases.sh /srv/onlymen/appview/
sudo install -m 700 deploy/appview/{deploy,verify}.sh /srv/onlymen/appview/
sudo chown -R 1000:1000 /srv/onlymen/appview/data
```

Generate every secret independently, same as `deploy/pds/`: a Postgres
password, a `BSKY_SERVICE_SIGNING_KEY`, an `OZONE_SIGNING_KEY_HEX`, an
`OZONE_ADMIN_PASSWORD`, and a shared `BSYNC_API_KEYS` / `BSKY_BSYNC_API_KEY`
secret. Each `docs/appview/*.env.example` file documents the exact
generation command and which other file needs the same value. Keep a
secure off-host copy of all of them.

Log the host into GHCR with a read-only package token if it isn't already
(shared with the PDS deployment):

```bash
docker login ghcr.io
docker network inspect caddy
```

## 4. Merge the Caddy configuration

Merge `docs/appview/Caddyfile.example` into the existing Caddyfile alongside
`docs/pds/Caddyfile.example` - there must be only one global options block
across the whole file. Both Caddy and the `bsky`/`ozone` containers must
join the configured external Docker network. Validate and reload Caddy
before deploying.

## 5. Configure GitHub deployment

Configure these GitHub Actions secrets (`APPVIEW_DEPLOY_*` are separate from
the PDS's `PDS_DEPLOY_*` secrets so the two workflows can target different
hosts if that's ever useful, even though a pilot this size will usually run
them on the same host):

- `APPVIEW_DEPLOY_HOST`
- `APPVIEW_DEPLOY_USER`
- `APPVIEW_DEPLOY_SSH_KEY`
- `APPVIEW_DEPLOY_KNOWN_HOSTS`
- `APPVIEW_PUBLIC_URL` (`https://api.onlymen.gay`)
- `OZONE_PUBLIC_URL` (`https://mod.onlymen.gay`)

The remote user should have narrowly scoped passwordless sudo permission for
`/srv/onlymen/appview/deploy.sh` only. A push to `main` builds four
immutable SHA images, also updates their `production` tags, then asks the
host script to deploy all four together.

The host script stops the whole stack for a consistent Postgres/Redis
backup, deploys the four candidates, and checks both container health and
public health for the AppView and Ozone. On failure it saves logs, preserves
the failed data directory, and restores the previous images and data
snapshot. Keep an additional encrypted off-host backup; local rollback
archives are not a disaster-recovery strategy.

## 6. Verify

After the first healthy deployment:

```bash
sudo /srv/onlymen/appview/verify.sh api.onlymen.gay mod.onlymen.gay
```

Then, manually: create a test record through the PDS, confirm it becomes
visible through `https://api.onlymen.gay`, file a test report, and confirm
it reaches the moderation queue at `https://mod.onlymen.gay`. Do not invite
a second real user to the PDS pilot until both of those succeed - see
`docs/appview/APPVIEW.md`'s go-live checklist.
