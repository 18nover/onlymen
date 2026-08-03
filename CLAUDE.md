# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

OnlyMen is a decentralized social platform for gay men (18+), built on the AT Protocol (the open, federated protocol behind Bluesky). This is a monorepo with three top-level areas, each independently developed and **each carrying its own `CLAUDE.md`** — read that file before working inside the directory; this root file is only the map.

```json
app/        bsky.app — OnlyMen client, forked from the Bluesky social app (React Native + Expo, web/Android/iOS)
atproto/    atp — AT Protocol infrastructure fork (PDS, AppView, Ozone moderation, bsync, lexicons)
eliza/      elizaOS framework fork — the AI engineering organization runs on top of this (packages/org/)
```

`app/` and `atproto/` are forks of the Bluesky/AT Protocol open-source stack, progressively rebranded and extended for OnlyMen. `eliza/` is a fork of the upstream elizaOS agent framework; `eliza/packages/org/` is where the OnlyMen-specific AI engineering organization (characters, knowledge, coordination plugin) lives on top of that framework.

## Where to find commands

Run `make help` from the repository root for the supported cross-project and
focused commands. The root launcher pins and selects the correct package
manager, so normal work should not require changing directories:

- `make start PROFILE=stack`, `make status`, `make stop` — local services.
- `make app-build`, `make atproto-build`, `make pds-test`, `make org-verify` — focused work.
- `make install`, `make build`, `make test`, `make lint` — intentionally broad aggregate checks.
- `om run app ...`, `om run atproto ...`, `om run eliza ...` — direct package-manager escape hatch.

Each area still owns its toolchain and detailed command documentation:

- **`app/`** — pnpm, Expo/React Native. See `app/CLAUDE.md` (`pnpm start`, `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build-web`, etc.)
- **`atproto/`** — pnpm monorepo, `tsgo` build. See `atproto/CLAUDE.md` (`pnpm verify`, `pnpm build --force`, `pnpm codegen`, or the `Makefile` wrapper — `make build`, `make test`, `make lint`, `make run-dev-env`).
- **`eliza/`** — Bun + Turbo monorepo. See `eliza/CLAUDE.md` (`bun install`, `bun run dev`, `bun run verify`, `bun run test`, etc.)

The production PDS is documented in `docs/PDS.md`; deployment assets live in
`deploy/pds/`. Production mutation remains an explicit operator or CI action,
not a root Makefile side effect.

## The AI engineering organization (`eliza/packages/org/`)

OnlyMen is developed with the help of a 13-agent AI engineering organization built on elizaOS, coordinated through `eliza/plugins/plugin-org-coordinator/`. The agents are defined in `eliza/packages/org/characters/*.json`, with per-agent grounding in `eliza/packages/org/knowledge/<agent>/` and shared standards in `eliza/packages/org/shared/*.md` (coding standards, security standards, review process, escalation matrix, etc.).

The current agent roster (character files as they exist in `characters/`, roles per `eliza/packages/org/docs/README.md`) is: **Andrew** (`engineering_director`), **Audrey** (`repository_auditor`), **Desiree** (`design_system_architect`), **Devon** (`devops_engineer`), **Ethan** (`accessibility_engineer`), **Karen** (`moderation_specialist`), **Lexi** (`lexicon_specialist`), **Morgan** (`backend_architect`), **Nadia** (`react_native_architect`), **Parker** (`performance_engineer`), **Penelope** (`technical_writer`), **Quinn** (`qa_engineer`), **Seth** (`security_engineer`).

This matches the user's global `~/.claude/CLAUDE.md` commit-signature table — use that table directly for commit-signature agent selection. (The root `README.md` doesn't list a roster, so there's nothing to reconcile there.)

`eliza/` itself is the upstream elizaOS framework (runtime, CLI, plugins, cloud backend) — most of `eliza/CLAUDE.md` describes generic elizaOS conventions (error-handling policy, comment style, evidence-based "definition of done") that apply repo-wide within `eliza/`, not just to `packages/org/`.

## Cross-cutting notes

- `app/` and `atproto/` are under active upstream-fork maintenance — check each package's own docs before assuming OnlyMen has diverged from Bluesky/AT Protocol upstream behavior.
- Global secret/credential conventions (`.env` gitignored, no hardcoded tokens) apply across all three directories; `eliza/` additionally runs `.gitleaks.toml`/`.gitleaksignore` secret scanning that the other two areas don't have configured.
- When committing, use the agent signature convention from the user's global `~/.claude/CLAUDE.md`; the roster there now matches `eliza/packages/org/characters/*.json`.
