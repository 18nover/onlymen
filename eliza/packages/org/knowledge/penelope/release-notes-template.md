# Release Notes Template — Penelope Knowledge Base

## Two different kinds of release notes, two different audiences

Don't write one document trying to serve both:

1. **Package-level changelogs** (`atproto/`) — dependency-consumer facing,
   mechanically generated.
2. **User-facing release notes** (`app/`) — App Store / Play Store submission
   copy, hand-written, no in-app "what's new" surface exists today (checked —
   there isn't one to draft copy for beyond the store listing itself).

---

## 1. Package-level: Changesets (atproto only)

`atproto/` uses [Changesets](https://github.com/changesets/changesets)
(`.changeset/` directory, `.changeset/config.json`) — every package's
`CHANGELOG.md` is generated, not hand-written. A real example
(`packages/pds/CHANGELOG.md`):

```markdown
## 0.5.19

### Patch Changes

- Updated dependencies [[`f8267c3`](https://github.com/.../f8267c3...)]:
  - @atproto/lex@0.3.0
  - @atproto/xrpc-server@0.11.10
```

Penelope's job here is narrow: writing the **changeset entry** for a PR (a
short markdown file under `.changeset/` describing the change and its semver
bump), not the final CHANGELOG — that's assembled automatically from
accumulated changeset entries on release. A changeset entry should:

- State the user-visible or consumer-visible effect, not the implementation.
- Pick the correct bump (patch/minor/major) — a lexicon-breaking change is
  major, an additive one is minor, a bugfix is patch (confirm with Lexi on
  anything schema-related).
- Never hand-edit a package's `CHANGELOG.md` directly — it's generated output,
  same rule as generated lexicon client code.

`eliza/` and `app/` do not use Changesets — don't propose introducing it
without checking whether either repo has its own release-versioning
convention first (verify before assuming).

## 2. User-facing: App Store / Play Store submission copy

There is no in-app "what's new" component to draft copy for (verified — none
found in `app/src`). Release notes for `app/` are purely external-facing
submission text (App Store Connect, Google Play Console). Template:

```markdown
## [Version] — [Date]

**Highlights**
- [User-facing feature or fix, in plain language — no internal jargon,
  no ticket numbers, no PR references]

**Fixes**
- [Bug fix described as the user experienced it, not the root cause]
```

Rules specific to store submission copy:
- No internal terminology (NSIDs, lexicon names, service names) — a user
  doesn't know or care what an AppView is.
- Lead with what changed for the user, not what shipped for the team.
- Every entry traceable back to a merged PR for Penelope's own fact-checking,
  even though the PR reference never appears in the published copy.
- Store review guidelines (both Apple and Google) reject notes that promise
  future features or reference beta/internal terminology — keep it to what's
  actually in this build.

## 3. Review checklist

1. Changeset entries (atproto) describe consumer-visible effect, correct
   semver bump, never touch generated `CHANGELOG.md` directly.
2. Store-facing notes (app) contain zero internal jargon and are traceable
   to real merged work.
3. If a change spans both a package release and a user-facing app update,
   write both — they're never the same document.
