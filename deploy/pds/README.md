# OnlyMen PDS production deployment

This directory deploys the source-built PDS from `atproto/services/pds`. It is
for a small production pilot on a Docker host whose existing Caddy container
owns ports 80 and 443.

## 1. Supply the external prerequisites

Before starting the PDS, obtain the production URLs and DIDs for the OnlyMen
AppView and Ozone services. Decide which ingestion or relay service will crawl
the PDS; only set `PDS_CRAWLERS` if it implements
`com.atproto.sync.requestCrawl`.

Create `A`/`AAAA` records for both the PDS hostname and its wildcard, pointing
to the Docker host:

```text
pds.onlymen.gay
*.pds.onlymen.gay
```

## 2. Install the host files

Copy `compose.yaml`, `deploy.sh`, `create-account.sh`, and `verify.sh` to
`/srv/onlymen/pds`. Copy the two example templates from `docs/pds/` without
their `.example` suffixes. Do not commit the resulting `pds.env` or
`image.env`.

```bash
sudo install -d -m 700 /srv/onlymen/pds/{data,backups}
sudo install -m 600 docs/pds/pds.env.example /srv/onlymen/pds/pds.env
sudo install -m 600 docs/pds/image.env.example /srv/onlymen/pds/image.env
sudo install -m 600 deploy/pds/compose.yaml /srv/onlymen/pds/compose.yaml
sudo install -m 700 deploy/pds/{deploy,create-account,verify}.sh /srv/onlymen/pds/
sudo chown -R 1000:1000 /srv/onlymen/pds/data
```

Generate each secret independently. Keep a secure off-host copy of all four:

```bash
openssl rand -hex 32
openssl rand -hex 32
openssl rand -hex 32
openssl ecparam --name secp256k1 --genkey --noout --outform DER \
  | tail --bytes=+8 | head --bytes=32 | xxd --plain --cols 32
```

Replace every example value in `pds.env`. The current PDS does not consume
`PDS_REPO_SIGNING_KEY_K256_PRIVATE_KEY_HEX`; do not add it.

Log the host into GHCR with a read-only package token, and confirm the external
Caddy network name in `image.env`:

```bash
docker login ghcr.io
docker network inspect caddy
```

## 3. Merge the Caddy configuration

Merge `docs/pds/Caddyfile.example` into the existing Caddyfile, changing the
contact email if necessary. There must be only one global options block. Both
Caddy and `onlymen-pds` must join the configured external Docker network.
Caddy handles WebSocket upgrades automatically.

Validate and reload Caddy before deploying the PDS. Do not install a second
Caddy, Watchtower, or the standalone PDS systemd unit.

## 4. Configure GitHub deployment

Configure these GitHub Actions secrets:

- `PDS_DEPLOY_HOST`
- `PDS_DEPLOY_USER`
- `PDS_DEPLOY_SSH_KEY`
- `PDS_DEPLOY_KNOWN_HOSTS`
- `PDS_PUBLIC_URL` (`https://pds.onlymen.gay`)

The remote user should have narrowly scoped passwordless sudo permission for
`/srv/onlymen/pds/deploy.sh` only. Protect `main` with the workflow's verify job
as a required check. A push to `main` builds an immutable SHA image, also
updates the `production` tag, then asks the host script to deploy the immutable
tag.

The host script stops only the PDS, creates a consistent data archive, deploys
the candidate, and checks both container and public health. On failure it saves
logs, preserves the failed data directory, and restores the previous image and
data snapshot. Keep an additional encrypted off-host backup; local rollback
archives are not a disaster-recovery strategy.

## 5. Verify and create the first account

After the first healthy deployment:

```bash
sudo /srv/onlymen/pds/verify.sh pds.onlymen.gay
sudo /srv/onlymen/pds/create-account.sh \
  person@onlymen.gay person.pds.onlymen.gay
```

Check `/tls-check?domain=person.pds.onlymen.gay` from the Caddy container,
connect a WebSocket client to
`wss://pds.onlymen.gay/xrpc/com.atproto.sync.subscribeRepos`, and create one
test record. Do not onboard another user until the record is visible through
the OnlyMen AppView and its report flow reaches Ozone.
