# Changelog

Notable changes to the OnlyMen repo (`app/`, `atproto/`, `eliza/`, docs). No
version tags have been cut yet (`v0.1.0-web-launch` is planned, not shipped),
so entries are grouped by date instead of version number. Newest first.

## Unreleased

### Remove eliza/, archive the AI engineering org — 2026-08-04

- **Removed `eliza/` entirely** (the elizaOS framework fork) while other
  options for running the 13-agent AI engineering organization are
  evaluated. It carried too much weight for what it was giving back.
- Archived everything that defines the agents — `characters/*.json` (full
  system prompts, personality, topics, style), the generated per-agent docs,
  `knowledge/<agent>/` (~70 files), `shared/*.md` standards, `skills/`
  playbooks, and the elizaOS-era tooling (`bin/org`, doc generator,
  chat-ui control plane) — to `docs/agents/`, with relative links fixed for
  the new flattened layout. Deleted the redundant, incomplete hand-written
  `ONLYMEN_AI_AGENTS_BACKUP.md` (was missing Audrey) now that the full
  source data is preserved.
- Stripped the eliza/org/Bun integration out of `bin/om` (bootstrap no
  longer installs Bun or eliza's dependencies; removed `load_bun`,
  `run area eliza`, `start agents`, `internal_org_console`, the `org`/`agents`
  verify and open targets) and the `Makefile` (removed `org-install`,
  `org-build`, `org-test`, `org-lint`, `org-verify`, `org-docs`; aggregate
  `install`/`build`/`test`/`lint` now cover only `app` + `atproto`).
- Deleted `.github/workflows/engineering-office.yml` (CI for the removed
  org) and cleared eliza-specific entries from `.gitignore`,
  `.vscode/settings.json`, and `.devcontainer/devcontainer.json` (including
  the Bun devcontainer feature, unused now that nothing in the repo needs
  it).
- Updated root `CLAUDE.md`, `README.md`, `docs/WSL_DEVELOPMENT.md`, and
  `docs/HANDOFF.md`'s live-state sections (repo structure diagram, repo
  state, running-agents section) to match; rewrote
  `docs/ENGINEERING_OFFICE.md` as a short archival stub. Left dated
  historical recap sections in `HANDOFF.md` untouched — they're a journal,
  not live documentation.

### Pi backend + PDS build fix — 2026-08-03

- **WSL retired as the dev environment** (repeated crashes). New split:
  Windows (`C:\onlymen`) for all app development, the Raspberry Pi
  (`lockard-tech`) for the ATProto backend at `/home/admin/onlymen`.
- Set up Docker Desktop ↔ Pi connectivity: Tailscale, mutual TLS on 2376,
  `ufw` restricted to LAN + Tailscale ranges only.
- Added a `backend` start profile to `bin/om`/`Makefile` (`start`/`restart
  [all|stack|backend|agents]`) so the ATProto stack can run without Expo.
- Committed and pushed `docker-compose.yml`, `deploy/{pds,appview}/`,
  `docs/{PDS,APPVIEW}.md`, the PDS `tls-check` endpoint, the
  `bsky-indexer` service, and both production GitHub Actions workflows —
  all pre-existing, uncommitted work found sitting only on the WSL
  machine's working tree.
- **Fixed a `tsgo` (`@typescript/native-preview`) concurrency bug**:
  parallel `pnpm run --recursive` builds could silently produce an
  incomplete `dist/` for a package (missing declaration files) while its
  cached `.tsbuildinfo` still claimed success, breaking dependents with
  spurious "Cannot find module" errors. Broke the PDS Docker build
  locally and in CI. Bumped `7.0.0-dev.20260614.1` → `7.0.0-dev.20260707.2`
  and pinned exactly instead of the previous floating `^7.0.0-beta` range.
- Stood up a dev-only PDS on the Pi (`lockard-tech.tail43a815.ts.net`,
  invites/rate-limits off, throwaway secrets) — separate from and not a
  substitute for the still-outstanding production `pds.onlymen.gay`
  deployment.
- Removed a hardcoded, expired GitHub PAT from `.bashrc` (four env vars:
  `GITHUB_TOKEN`, `GH_TOKEN`, `GITHUB_PAT`, `GH_PAT`) that was shadowing
  `gh`'s real stored credentials; switched to `gh auth login` +
  `gh auth setup-git` for HTTPS push auth.
- Added a global rules file at `~/.claude/CLAUDE.md` (branch naming,
  commit style, agent commit signatures, PR format, naming, code style,
  dependency pinning, credential handling, dev/prod separation,
  session-handoff discipline). Branch strategy changes from
  direct-to-`main` to feature-branch → PR → merge starting after this
  entry.
- See `docs/HANDOFF.md`'s recap for the full narrative and corrected
  stale facts (old Pi IP, old SSH key path, old GitHub auth method).

### AppView + Ozone production scaffolding — 2026-08-02

- Added a production deploy path for the AppView (`bsky`), Ozone
  (moderation), and Bsync under `deploy/appview/` — compose, per-service
  `.env.example` files, a Caddyfile, `deploy.sh`/`verify.sh`, and a README —
  mirroring `deploy/pds/`'s pattern exactly. Added
  `.github/workflows/appview-production.yml` (verify/build/deploy, four
  immutable GHCR images) and `docs/APPVIEW.md` (domain plan, layout,
  identity bootstrap order, go-live checklist).
- **Found and fixed a real architecture gap discovered while doing this**:
  upstream `@atproto/bsky` ships a production entrypoint for only the
  read-API half of the AppView (`services/bsky`); the dataplane/firehose-
  indexing half (`DataPlaneServer` + `RepoSubscription` +
  `BsyncSubscription`) was previously exercised only by the `dev-env` test
  harness, with no way to run it in production. Deploying just the existing
  `bsky`/`ozone`/`bsync` images would have booted cleanly and passed health
  checks while never indexing anything — a "live" AppView that stays
  permanently empty. Added `atproto/services/bsky-indexer/` (new
  OnlyMen-specific entrypoint + Dockerfile + README) to close the gap.
- Fixed the local-dev `docker-compose.yml --profile appview` profile so it
  actually boots: added the missing `BSKY_SERVICE_SIGNING_KEY`, pointed
  `BSKY_DATAPLANE_URLS` at the new `bsky-indexer` service instead of at
  itself, added the `bsky-indexer` service, and added
  `deploy/appview/init-postgres-databases.sh` (bind-mounted into the
  Postgres container) so the `ozone` database actually gets created — the
  local Postgres service only created a `bsky` database by default, which
  would have made `ozone` fail to connect.
- Added pointer updates to `eliza/packages/org/knowledge/morgan/appview.md`
  and `eliza/packages/org/knowledge/karen/ozone.md` referencing the new
  `deploy/appview/` and `docs/APPVIEW.md` paths, and updated
  `docs/HANDOFF.md`'s recap and "Known not-yet-done" section.

### Root command surface and production PDS — 2026-07-31

- Consolidated the WSL launcher, PowerShell bridge, Windows shim, and Expo web
  helper into the universal `bin/om` CLI plus the required `bin/om.cmd`
  Windows entrypoint.
- Added root `make` targets and `om run` routing so app, AT Protocol, PDS, and
  elizaOS commands can be run from `~/onlymen` without moving the existing
  subsystem directories.
- Added `docs/PDS.md` as the PDS architecture, domains, local workflow, and
  production-readiness source of truth.
- Assigned `onlymen.gay` to the app/OAuth site, `pds.onlymen.gay` and its
  wildcard to the production PDS, `onlymen.day` to a future marketing
  redirect, and `18nover.gay` to the operator identity.
- Added production PDS Compose, Caddy, environment, account, verification,
  backup/rollback, and GitHub Actions deployment assets under `deploy/pds/`
  and `.github/workflows/`.

### Agent rename — 2026-07-22

- **Renamed all 13 agent character files** from code-style names to the
  human-name roster documented in `AGENTS.md`: Atlas→Andrew, Circuit→Devon,
  Compass→Quinn, Echo→Audrey, Forge→Morgan, Nova→Nadia, Pixel→Desiree,
  Prism→Ethan, Pulse→Parker, Scribe→Penelope, Sentinel→Seth, Vision→Karen
  (Lexi unchanged). Applied across `characters/*.json` (name, username,
  system prompt cross-references, messageExamples), `knowledge/<agent>/`
  folder names, `shared/*.md` and `skills/**/*.md` cross-references,
  `eliza/plugins/plugin-org-coordinator/src/actions/index.ts` (`ORG_AGENTS`
  list and fallback defaults), `eliza/packages/org/bin/org`, and
  `scripts/generate-agent-docs.ts` — then regenerated `docs/agents/*.md` and
  `docs/README.md` via `bun run docs` and removed the stale old-named doc
  files. Verified: all 13 character files parse as valid JSON, no broken
  `knowledge[].path` references, no residual old names outside two known
  false positives (a "### Vision" roadmap heading and "Color Vision
  Deficiencies" in the color-system doc — both pre-existing generic English
  usage, not agent references, deliberately left untouched).
- The `docs/AGENTS.md` roster proposal is now applied to the codebase —
  the "documented here but not yet applied" caveat in `HANDOFF.md` no
  longer holds.

### Docs — 2026-07-19 session (FIREWALL, CHANGELOG, AGENTS, HANDOFF, Makefile)

- **FIREWALL.md**: Created — SSH rate-limiting (`ufw limit`), Docker/UFW
  bypass warning, IPv6 rules, spec-based deletes, No RDP in core services.
- **CHANGELOG.md**: Created this file.
- **AGENTS.md**: Created with full agent roster using human names (Andrew,
  Devon, Quinn, Audrey, Morgan, Lexi, Nadia, Desiree, Ethan, Parker, Penelope,
  Seth, Karen).
- **HANDOFF.md**: Updated — added domain branding (onlymen.gay, 18nover.gay),
  Makedile reference, agent name note, session recap.
- **Makefile**: Created at project root with `make handoff`, `make changelog`,
  `make log`, `make update`, `make help`.

### Discovered

- The `claude/bluesky-agents-planning-mpzmvd` branch was merged to main
  (PR #1) — contains full NottyBoi branding sweep, agent retraining to
  ATProto/Bluesky stack, and `@nottyboi` plugin-name fix. Done. The branch
  should be deleted from remote to comply with the single-`main` convention.
- ~~Agent character files still use code-style names... a rename to human
  names is outstanding.~~ Done — see "Agent rename"
  above.

## 2026-07-19 — AI org realignment + retraining

### First pass: realign agents off camera/object-detection vision

Core task: align the 13-agent "OnlyMen AI Engineering Organization"
(`eliza/packages/org/`) to actually help build the real app + AT Protocol
backend, replacing an old, unrelated camera/object-detection/livestreaming
vision.

- Deleted two off-stack skill files (`skills/computer-vision`,
  `skills/stream-integration`), replaced with `skills/moderation-tooling`
  (Vision) and `skills/lexicon-design` (Lexi).
- Fixed `ORG_AGENTS` list in coordinator plugin (was `'stream'`, now `'lexi'`).
- Regenerated agent docs via `bun run docs`.
- Rewrote root README.md.
- Fixed broken knowledge reference in atlas.json.
- Added root `.editorconfig`.
- Fixed `.env.example` (STREAM→LEXI, VISION llava→llama3.1).
- Documented project conventions in HANDOFF.md.

### Second pass: retrain on real ATProto/Bluesky stack

Merged via PR #1 (`claude/bluesky-agents-planning-mpzmvd`):

| Tier | Agents |
| --- | --- |
| A (Tier 1) | Lexi, Forge, Nova, Pixel |
| B (Tier 2) | Sentinel, Vision, Circuit, Compass |
| C (Tier 3) | Atlas, Echo, Pulse, Prism, Scribe |

All 13 agents updated with:

- Shared `shared/atproto.md` primer
- Standard `## Project` section anchoring them to OnlyMen-on-ATProto
- Knowledge files grounded in real codebase paths
- New docs: `services.md`, `forks.md`, `pds.md`, `appview.md`, `xrpc.md`,
  `firehose.md`, `contact-ageassurance.md`, `client.md`, `icons.md`,
  `identity.md`, `oauth.md`, `reporting.md`
- Existing 66 docs deepened with real data (breakpoints, API patterns, etc.)
- Rewritten: `onlymen-roadmap.md`, `alf-design-system.md`
- Fixed `@nottyboi` → `@onlymen` in coordinator plugin name (was breaking
  `bun install`)
- Swept ~45 NottyBoi brand references to OnlyMen

### Running agents: backend changed from Ollama to claude CLI

Default backend changed from local Ollama (llama3.1:70b / codellama:34b —
unrealistic on existing hardware) to the local `claude` CLI subscription via
`plugin-cli-inference`. `.env.example` updated with `ELIZA_RUN_BACKEND=claude-sdk`
and `ELIZA_PLANNER_NATIVE_TOOLS=0`.

### Incidents

1. **Repo restructure silently reverted fixes** — when nested git repos were
   collapsed into one, an older snapshot was used, reverting fixes that showed
   as committed. Recovered via:
   - `77beaca29` — Restore ORG_AGENTS lexi fix and missing scribe doc
   - `40d57b423` — Re-apply removal of camera/object-detection leftovers
   - `42e990f74` — Re-delete reverted skills, restore replacements
2. **Plugin name mismatch** — `@nottyboi/plugin-org-coordinator` in `package.json`
   broke `bun install` for the workspace; renamed to `@onlymen/`.

## 2026-07-19 (earlier) / 2026-07-18 — Repo setup

- Collapsed `eliza/`, `atproto/`, `app/` from separate nested git repos into
  plain tracked subdirectories of one repo.
- Added `.devcontainer/`, `.vscode/` config; removed an unused Eliza chroot.
- Initial commits: `bsky cloned as app`, `atproto cloned into onlymen`,
  `eliza cloned into onlymen`, `onlymen initial commit`.
