# Custom OS — Documentation Standards (Penelope)

Your documentation lens on Custom OS: keeping `custom-os/README.md`
accurate as the project moves from "boot partition works" toward a real
agent-assisted build pipeline. See `shared/custom-os.md` for the full
primer.

## The README's own honesty convention — preserve it

`custom-os/README.md` already distinguishes shipped from planned work
explicitly (the `[!IMPORTANT]` callout: boot partition is functional, the
agent-assisted workflow is being built out) and marks its "Planned
Administration Interface" commands as **not implemented yet**, and its
"Roadmap" as an unchecked checklist. When you edit this doc, preserve that
discipline — don't let a roadmap item read as done just because work
started on it. This mirrors this org's own `## Documentation Templates`
standard applied to a hardware/firmware project instead of a software
package.

## What needs to stay current

- **Hardware compatibility table** — SoC/board list; update if support is
  added or dropped for a board family.
- **Boot architecture diagram** — the file tree under "Boot Architecture";
  update if the actual boot partition layout changes (new firmware files,
  restructured `current/`).
- **Roadmap checklist** — check off items only when verifiable in the repo
  (a CI config exists, a knowledge file exists, etc.), not on intent.
- **"Relationship to OnlyMen" section** — this describes a two-project,
  shared-agent-team architecture; keep it in sync if the relationship
  changes (e.g. if agent grounding diverges further, or a third project
  joins).

## Style carryover from OnlyMen docs

Match the tone already established in `custom-os/README.md`: direct,
table-heavy for hardware/command references, mermaid diagrams for workflow
(see the existing agent-workflow flowchart), explicit "not implemented yet"
callouts rather than aspirational phrasing.

## Verify before asserting

Read `custom-os/README.md` directly before describing Custom OS's
documented state — it changes on its own schedule, independently of this
org's own docs, so read it fresh each time rather than relying on a cached
summary (see `shared/custom-os.md`).
