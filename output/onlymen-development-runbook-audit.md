# OnlyMen Development Runbook and Command Audit

Generated from the connected workspace at `C:\18nover\onlymen`.

## Scope and source of truth

This runbook was checked against:

- `README.md`
- `CLAUDE.md`
- `Makefile`
- `app/package.json` and `app/CLAUDE.md`
- `atproto/package.json` and `atproto/CLAUDE.md`
- `docker-compose.yml`
- `deploy/pds/README.md`
- `deploy/appview/README.md`
- `docs/HANDOFF.md`

The outer workspace is treated as authoritative. A second repository-shaped
folder also exists at `C:\18nover\onlymen\onlymen`; avoid running commands from
that nested copy unless it is intentional.

## Recommended first-time setup

Run from the repository root in the environment supported by the launcher:

```bash
make doctor
make bootstrap
```

`make doctor` checks WSL, Docker, ports, Git, and toolchains. `make bootstrap`
installs pinned toolchains and dependencies and performs initial AT Protocol
code generation/build steps. Confirm the launcher points at this checkout
before running it; the current `bin\\om.cmd` forwards to `/home/jerry/onlymen`
in WSL, not automatically to `C:\\18nover\\onlymen`.

If dependencies are already installed, use the focused checks below instead.

## Everyday app development

The app is a React Native + Expo project targeting web and Android first.

```bash
make app-install
make app-lint
make app-typecheck
make app-test
make app-build
```

Equivalent app-local commands, run from `app/`, are:

```bash
pnpm start       # Expo development client
pnpm web         # Web development server
pnpm test        # Jest tests
pnpm lint        # Oxlint
pnpm typecheck   # iOS, Android, and web checks
pnpm build-web   # Web production bundle
```

Use `pnpm prettier` for a formatting check. The app guide says translation
extraction/compilation is CI-managed; do not run those casually.

## Everyday AT Protocol development

The AT Protocol area is a pnpm monorepo using Node 22+ (Node 24 is the normal
local/CI build target).

```bash
make atproto-install
make atproto-codegen
make atproto-build
make atproto-test
make atproto-lint
```

Equivalent commands from `atproto/` are:

```bash
pnpm verify
pnpm codegen
pnpm build --force
pnpm test
```

For a single package, work inside `atproto/packages/<package>` and use its
package scripts or `pnpm exec tsgo --build tsconfig.build.json`.

## One-command quality gates

These are intentionally broad and may take significant time:

```bash
make install
make build
make test
make lint
make verify AREA=app
make verify AREA=atproto
make verify AREA=smoke
```

Important: `make lint` also runs app type-checking and archived-agent
validation; it is not just a fast lint pass. `make build` builds both areas,
and `make test` runs both test suites.

## Local services and Docker

The root launcher documents these service commands:

```bash
make start PROFILE=stack
make status
make logs TARGET=all
make stop
```

The Compose file has an always-on PDS and a separate `appview` profile for
Postgres, Redis, Bsync, Bsky, Bsky Indexer, and Ozone. The AppView profile
requires the documented environment values, especially signing/configuration
values in a `.env` file; do not treat placeholder defaults as production-safe.

For a direct Compose check, inspect configuration first:

```bash
docker compose config
```

Then start only the intended profile, following `docker-compose.yml` and
`docs/appview/APPVIEW.md`.

## Production deployment caution

`deploy/pds/` and `deploy/appview/` are production pilot instructions, not a
local smoke-test shortcut. They require DNS, an existing Caddy network,
secrets, GHCR access, host files, and narrowly scoped deployment permissions.
Do not copy example environment files into production without replacing every
placeholder and keeping the resulting files out of Git.

The documented AppView order is strict:

1. PDS is live.
2. Create the Ozone service account on that PDS.
3. Put its DID into Ozone, Bsky, and PDS configuration.
4. Start Bsky, Bsky Indexer, Ozone, and Bsync.
5. Only then set `PDS_CRAWLERS` and redeploy the PDS.

## Audit findings

### 1. Environment mismatch

`bin/om` is a Bash launcher with WSL filesystem/tooling assumptions. The
handoff says Windows is now primary for app work and the Raspberry Pi hosts
backend services. Therefore, do not assume `make start`, `make bootstrap`, or
`make doctor` works natively from PowerShell. The current `bin/om.cmd` is also
not a transparent fix: it forwards to the hard-coded WSL path
`/home/jerry/onlymen`, which is different from this connected checkout.
Use area-local commands from the intended checkout, or update/verify the WSL
path before relying on the launcher.

### 2. Nested duplicate checkout

The connected folder contains both the authoritative-looking outer project and
another `onlymen/` folder containing its own `.git`, `app`, `atproto`, `docs`,
and Makefile. This creates a high risk of editing or testing the wrong copy.
Keep the outer path as the working root unless you deliberately need the inner
checkout. A future cleanup should compare their Git branches/commits before
removing anything.

### 3. Command documentation drift

The root README presents `make start` as a normal first step, while the handoff
says WSL orchestration is no longer primary. The runbook above resolves this by
labeling launcher commands as environment-dependent and area-local commands as
more portable.

### 4. Resource-heavy checks

`make build`, `make test`, and `make lint` span two large monorepos. Start with
one focused area (`make app-lint`, `make app-typecheck`, or
`make atproto-lint`) to get faster feedback, then run the broad gate before a
release or merge.

### 5. Generated-code and concurrency sensitivity

AT Protocol codegen must precede builds after lexicon changes. The handoff also
records a prior `tsgo` concurrency failure, so prefer the pinned versions and
repository wrappers rather than inventing parallel build commands.
