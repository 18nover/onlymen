# Custom OS — Repository & Dependency Auditing (Audrey)

Your auditor's lens on Custom OS: repository integration, upstream firmware
drift, and roadmap accuracy. See `shared/custom-os.md` for the full primer.

## Structural fact: Custom OS is a plain tracked subdirectory

`custom-os/` has no `.git/` of its own — it was added whole in commit
`053149171` ("custom os was added", 2026-07-22) and is tracked identically
to `app/`, `atproto/`, and `eliza/` (417 plain blobs, no gitlinks). A
repo-wide `git add -A` or automated commit at the OnlyMen root **does** pick
up Custom OS changes — there is no special-case exception for root-level
automation (CI, pre-commit hooks, monorepo tooling) to account for.
(Earlier drafts of this file asserted the opposite — that `custom-os/` was a
separate nested repo with its own remote. That was investigated and found
false; don't repeat it.)

## Standing audit class: ignore patterns that shadow required files

Root `.gitignore` had a blanket `*.img` rule that matched the required boot
file `custom-os/current/initrd.img` — and this was not hypothetical: the
43MB file had **never actually been committed** (confirmed via `git ls-files
-s` and `git show HEAD:custom-os/current/initrd.img` both coming back empty,
even though it was present on disk and in the working tree). A naive `git
ls-files <path> && echo tracked` check gives a false positive here, since
`git ls-files` exits 0 whether or not it finds a match — always verify
tracked status with `git ls-files -s <path>` (checks stage output) or `git
show HEAD:<path>` (checks the actual commit), not exit-code chaining. Fixed
with a `!custom-os/current/initrd.img` exception plus `git add`. Treat this
as a standing audit class: a generated-artifact ignore pattern written for
one part of the repo (disk images elsewhere) can silently and permanently
drop a real, required file from history — re-check `.gitignore` against
`custom-os/`'s actual file list whenever either changes, and don't trust a
"file exists in my working tree" observation as proof it's actually tracked.

## Upstream firmware and device-tree drift

The boot partition (`bootcode.bin`, `start*.elf`/`fixup*.dat`,
`current/bcm27*.dtb`, `current/overlays/*.dtbo`) is vendored from upstream
Raspberry Pi firmware — it is not developed in this repo. Periodically diff
`current/overlays/` (367+ files) and the top-level firmware files against
the upstream `raspberrypi/firmware` (or Ubuntu's equivalent packaging)
release used, and record how stale the vendored copy is. Treat this the
same way `forks.md` treats the app/atproto forks: a dated divergence
inventory, not a one-time check.

## Roadmap accuracy

`custom-os/README.md` → "Roadmap" is a checklist; as of this grounding, only
"Foundation" reads as effectively done and "Agent grounding" is in progress
via this knowledge-file addition. Audit this checklist against actual repo
state before citing it — an unchecked box means not done, and a checked box
should be verified against real files (e.g. don't take "Image build
pipeline" as shipped without finding actual CI config).

## Naming/convention check

Custom OS's own files (`fixup_cd.dat`, `fixup_db.dat`, `fixup_x.dat`,
`start_cd.elf`, etc.) use underscores — this looks like a naming-convention
violation against this org's usual "no underscores" standard, but these are
vendored upstream Raspberry Pi firmware filenames that must keep their exact
names to function as boot files. Don't flag these; do flag underscore/
naming violations in anything actually authored for this project (docs,
scripts, cloud-init customizations).

## Verify before asserting

Repo history for Custom OS: `git log -- custom-os/` from the OnlyMen root.
Roadmap state: `custom-os/README.md`. Overlay count:
`custom-os/current/overlays/` — recount, don't cite a stale number.
