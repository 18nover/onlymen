# Changelog

Notable changes to the OnlyMen repo (`app/`, `atproto/`, `eliza/`, docs). No
version tags have been cut yet (`v0.1.0-web-launch` is planned, not shipped),
so entries are grouped by date instead of version number. Newest first.

## Unreleased

### Agent rename + Custom OS grounding — 2026-07-22
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
- **Added Custom OS grounding** for Devon, Morgan, Seth, Parker, Audrey,
  Quinn, and Penelope per `custom-os/README.md`'s roadmap ("Agent
  grounding" item): new `shared/custom-os.md` primer plus one knowledge
  file per agent (`knowledge/<agent>/custom-os-*.md`) covering boot/
  provisioning, system config, boot security, performance, repo/dependency
  auditing, hardware compatibility testing, and documentation standards
  respectively. Each of the 7 agents' character JSON gained a `## Custom
  OS` section in its system prompt and the two new knowledge entries. The
  other 6 agents (Andrew, Nadia, Desiree, Ethan, Karen, Lexi) remain scoped
  to OnlyMen/Bluesky only, per direction.
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
  names is outstanding.~~ Done — see "Agent rename + Custom OS grounding"
  above.
- ~~`custom-os/` is a nested git repository (own `.git`, own GitHub remote)
  checked into the OnlyMen tree as an untracked directory, not a submodule.
  Root-level tooling/CI that assumes all four top-level directories are
  plain tracked subdirectories needs to account for this exception.~~
  **Corrected 2026-07-22 (later):** false — `custom-os/.git` does not exist;
  it's tracked as plain blobs, added whole in commit `053149171`. All doc/
  knowledge references to a separate repo were fixed — see the entry below.

### Custom OS repo-reconciliation — 2026-07-22

- **Corrected the false "separate repo" premise.** Investigation confirmed
  `custom-os/` has no `.git/` of its own — `git ls-files -s custom-os` shows
  417 plain blobs (no gitlinks), all added in commit `053149171` ("custom os
  was added"). Fixed every doc/knowledge file written on the earlier false
  premise: `eliza/packages/org/shared/custom-os.md`, root `README.md`,
  `docs/HANDOFF.md`, the `## Custom OS` paragraph in
  `characters/{devon,morgan,seth,parker,quinn,penelope,audrey}.json`, and
  `knowledge/audrey/custom-os-audit.md` + `knowledge/penelope/custom-os-docs.md`.
- **Fixed two `.gitignore` bugs, one of which was an active data-loss risk**:
  `*.img` was shadowing the required boot file `custom-os/current/initrd.img`
  — and this wasn't just a future risk, it had **already prevented the file
  from ever being tracked** (a naive `&&`-chained `git ls-files` check
  initially misreported it as tracked; `git ls-files -s` and `git show
  HEAD:...` confirmed it was actually missing from every commit, including
  the "custom os was added" commit). Added a `!custom-os/current/initrd.img`
  exception and `git add`ed the 43MB file for real — a re-clone of this repo
  before this fix would have produced an unbootable image silently missing
  its initrd. Line 171 was a mangled `*.rar`/chroot-path concatenation
  (split back into a correct `*.rar` line — the chroot path was already
  correctly present at lines 5 and 153). Also added a `System Volume
  Information/` ignore rule.
- **Removed leftover standalone-repo cruft** from `custom-os/`: the
  `System Volume Information/` directory (Windows filesystem junk from
  mounting an SD card/disk image), `custom-os/.vscode/extensions.json`
  (an unrelated `openai.chatgpt` recommendation), and
  `custom-os/custom-os.code-workspace` (redundant now that `custom-os/` is
  part of the single-root `onlymen.code-workspace`).
- **Extended light Custom OS awareness to the other 6 agents** (Andrew,
  Nadia, Desiree, Ethan, Karen, Lexi) — one sentence appended to each of
  their `## Project` system-prompt paragraphs noting Custom OS exists as a
  sibling project and which 7 agents specialize in it, plus a matching
  bullet in `shared/atproto.md`'s "OnlyMen instantiation" section (the one
  shared knowledge file all 13 agents reference). No new knowledge files or
  full grounding for these 6, per direction.
- **Updated `.remember/` files** with the corrected facts so a future
  session doesn't re-derive or repeat the false premise.

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
|---|---|
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
