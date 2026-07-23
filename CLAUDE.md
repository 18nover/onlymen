# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

OnlyMen is a decentralized social platform for gay men (18+), built on the AT Protocol (the open, federated protocol behind Bluesky). This is a monorepo with four top-level areas, each independently developed and **each carrying its own `CLAUDE.md`** — read that file before working inside the directory; this root file is only the map.

```json
app/        bsky.app — OnlyMen client, forked from the Bluesky social app (React Native + Expo, web/Android/iOS)
atproto/    atp — AT Protocol infrastructure fork (PDS, AppView, Ozone moderation, bsync, lexicons)
eliza/      elizaOS framework fork — the AI engineering organization runs on top of this (packages/org/)
custom-os/  Ubuntu 26.04 boot image for Raspberry Pi (bootloader, device trees, overlays, cloud-init)
```

`app/` and `atproto/` are forks of the Bluesky/AT Protocol open-source stack, progressively rebranded and extended for OnlyMen. `eliza/` is a fork of the upstream elizaOS agent framework; `eliza/packages/org/` is where the OnlyMen-specific AI engineering organization (characters, knowledge, coordination plugin) lives on top of that framework.

**`custom-os/` is a separate git repository** (own `.git`, own GitHub remote `jerry-lockard/custom-os`) that has been copied into this tree rather than added as a submodule — `git status` at the root shows it as a single untracked directory. Do not run repo-wide `git add`/commit operations expecting `custom-os/` changes to be tracked by the root repo; work inside `custom-os/` as its own repo, or resolve the submodule/subtree question with the user before treating it as integrated.

## Where to find commands

There is no root-level build/test runner across all four areas — each has its own toolchain:

- **`app/`** — pnpm, Expo/React Native. See `app/CLAUDE.md` (`pnpm start`, `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build-web`, etc.)
- **`atproto/`** — pnpm monorepo, `tsgo` build. See `atproto/CLAUDE.md` (`pnpm verify`, `pnpm build --force`, `pnpm codegen`, or the `Makefile` wrapper — `make build`, `make test`, `make lint`, `make run-dev-env`).
- **`eliza/`** — Bun + Turbo monorepo. See `eliza/CLAUDE.md` (`bun install`, `bun run dev`, `bun run verify`, `bun run test`, etc.)
- **`custom-os/`** — no build tooling yet; it currently ships static boot-partition files (bootloader, `*.dtb`/`*.dtbo` device trees, `config.txt`, `user-data`/`meta-data` cloud-init) that get written directly to a microSD card. There is no `custom-os/CLAUDE.md` yet — check its `README.md` for the current state before assuming tooling exists.

The root `Makefile` only wraps `docs/HANDOFF.md` and `docs/CHANGELOG.md` editing (`make handoff`, `make changelog`, `make update`, `make log`) — it is not a build entry point.

## The AI engineering organization (`eliza/packages/org/`)

OnlyMen is developed with the help of a 13-agent AI engineering organization built on elizaOS, coordinated through `eliza/plugins/plugin-org-coordinator/`. The agents are defined in `eliza/packages/org/characters/*.json`, with per-agent grounding in `eliza/packages/org/knowledge/<agent>/` and shared standards in `eliza/packages/org/shared/*.md` (coding standards, security standards, review process, escalation matrix, etc.).

The current agent roster (character files as they exist in `characters/`) is: **Atlas** (Engineering Director/PM — coordinates, never implements), **Circuit** (deployment/DevOps), **Compass** (QA/testing), **Echo**, **Forge** (implementation), **Lexi** (schema/lexicon design), **Nova** (implementation), **Pixel** (design system), **Prism**, **Pulse**, **Scribe** (docs), **Sentinel** (security), **Vision**.

> **Known inconsistency:** the root `README.md`, `custom-os/README.md`, and the user's global `~/.claude/CLAUDE.md` commit-signature table all describe a *different, older* 13-name roster (Andrew, Audrey, Desiree, Devon, Ethan, Karen, Lexi, Morgan, Nadia, Parker, Penelope, Quinn, Seth). Only "Lexi" is common to both lists. Treat `eliza/packages/org/characters/*.json` as the source of truth for agent names/roles — the docs above are stale and should be reconciled before relying on them for commit-signature agent selection.

`eliza/` itself is the upstream elizaOS framework (runtime, CLI, plugins, cloud backend) — most of `eliza/CLAUDE.md` describes generic elizaOS conventions (error-handling policy, comment style, evidence-based "definition of done") that apply repo-wide within `eliza/`, not just to `packages/org/`.

## Cross-cutting notes

- `app/` and `atproto/` are under active upstream-fork maintenance — check each package's own docs before assuming OnlyMen has diverged from Bluesky/AT Protocol upstream behavior.
- Global secret/credential conventions (`.env` gitignored, no hardcoded tokens) apply across all four directories; `eliza/` additionally runs `.gitleaks.toml`/`.gitleaksignore` secret scanning that the other three areas don't have configured.
- When committing, use the agent signature convention from the user's global `~/.claude/CLAUDE.md` — but verify the agent name against the current roster above, since that table is out of sync with `eliza/packages/org/characters/`.
