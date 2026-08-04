# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

OnlyMen is a decentralized social platform for gay men (18+), built on the AT Protocol (the open, federated protocol behind Bluesky). This is a monorepo with two top-level areas, each independently developed and **each carrying its own `CLAUDE.md`** — read that file before working inside the directory; this root file is only the map.

```json
app/        bsky.app — OnlyMen client, forked from the Bluesky social app (React Native + Expo, web/Android/iOS)
atproto/    atp — AT Protocol infrastructure fork (PDS, AppView, Ozone moderation, bsync, lexicons)
```

`app/` and `atproto/` are forks of the Bluesky/AT Protocol open-source stack, progressively rebranded and extended for OnlyMen.

The repo previously carried a third area, `eliza/` — a fork of the elizaOS agent framework hosting a 13-agent AI engineering organization. It has been removed while other options for running these agents are evaluated; see [The AI engineering organization](#the-ai-engineering-organization-archived--docsagents) below.

## Where to find commands

Run `make help` from the repository root for the supported cross-project and
focused commands. The root launcher pins and selects the correct package
manager, so normal work should not require changing directories:

- `make start PROFILE=stack`, `make status`, `make stop` — local services.
- `make app-build`, `make atproto-build`, `make pds-test` — focused work.
- `make install`, `make build`, `make test`, `make lint` — intentionally broad aggregate checks.
- `om run app ...`, `om run atproto ...` — direct package-manager escape hatch.

Each area still owns its toolchain and detailed command documentation:

- **`app/`** — pnpm, Expo/React Native. See `app/CLAUDE.md` (`pnpm start`, `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build-web`, etc.)
- **`atproto/`** — pnpm monorepo, `tsgo` build. See `atproto/CLAUDE.md` (`pnpm verify`, `pnpm build --force`, `pnpm codegen`, or the `Makefile` wrapper — `make build`, `make test`, `make lint`, `make run-dev-env`).

The production PDS is documented in `docs/PDS.md`; deployment assets live in
`deploy/pds/`. Production mutation remains an explicit operator or CI action,
not a root Makefile side effect.

## The AI engineering organization (archived — `docs/agents/`)

OnlyMen was developed with the help of a 13-agent AI engineering organization built on the elizaOS framework, previously running from `eliza/packages/org/`. That framework has been removed; the agent definitions (system prompts, personality, topics, style), per-agent knowledge base, shared standards (coding standards, security standards, review process, escalation matrix, etc.), and skill playbooks are archived at [`docs/agents/`](docs/agents/README.md) for reference while other options for running these agents are evaluated.

The agent roster (raw configs at `docs/agents/characters/*.json`, human-readable profiles at `docs/agents/<name>.md`) is: **Andrew** (`engineering_director`), **Audrey** (`repository_auditor`), **Desiree** (`design_system_architect`), **Devon** (`devops_engineer`), **Ethan** (`accessibility_engineer`), **Karen** (`moderation_specialist`), **Lexi** (`lexicon_specialist`), **Morgan** (`backend_architect`), **Nadia** (`react_native_architect`), **Parker** (`performance_engineer`), **Penelope** (`technical_writer`), **Quinn** (`qa_engineer`), **Seth** (`security_engineer`).

This still matches the user's global `~/.claude/CLAUDE.md` commit-signature table — use that table directly for commit-signature agent selection; it does not depend on the elizaOS runtime being present. (The root `README.md` doesn't list a roster, so there's nothing to reconcile there.)

## Cross-cutting notes

- `app/` and `atproto/` are under active upstream-fork maintenance — check each package's own docs before assuming OnlyMen has diverged from Bluesky/AT Protocol upstream behavior.
- Global secret/credential conventions (`.env` gitignored, no hardcoded tokens) apply across both directories.
- When committing, use the agent signature convention from the user's global `~/.claude/CLAUDE.md`; the roster there now matches `docs/agents/characters/*.json`.
