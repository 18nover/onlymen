# AT Protocol Interop Testing

Federation means the app's PDS is not the only PDS. QA must verify behavior
across PDS boundaries, not just against `bsky.social`.

## What "interop" means here

- A profile/post/follow created on one PDS resolves correctly when viewed
  through the AppView (`atproto/packages/bsky`) regardless of which PDS hosts
  the underlying repo.
- DID resolution works for both `did:plc` (resolved via the PLC directory,
  port 2582 in local dev) and `did:web` (resolved via `.well-known`).
- Firehose/sync (`com.atproto.sync.subscribeRepos`) events from a foreign PDS
  are correctly indexed by the AppView.
- Blocks, mutes, and moderation labels apply consistently regardless of which
  PDS the blocked/labeled account lives on.

## Local multi-PDS test setup

`atproto/packages/dev-infra` can boot more than one PDS instance against the
same AppView. Test matrix:

1. **Two local PDS instances** (different `PDS_HOSTNAME`/ports), one shared
   AppView. Create an account on each; follow across the boundary; confirm
   the follow shows up in both directions' timelines.
2. **DID method mix** — one `did:plc` account, one `did:web` account. Confirm
   both resolve and both post successfully to the same thread.
3. **Firehose lag** — kill/restart a PDS mid-write and confirm the AppView's
   `subscribeRepos` cursor resumes without dropping or duplicating events.

## Test cases specific to Bluesky federation

- Cross-PDS reply threads render correctly (author info resolves for the
  non-local participant).
- Cross-PDS blocks are enforced at read time in the AppView, not just
  client-side.
- Migrating a repo from one PDS to another (`com.atproto.repo.exportRepo` /
  import) preserves post history and doesn't break existing permalinks.
- Rate limiting and backpressure on `subscribeRepos` don't silently drop
  events under load — verify via the AppView's ingestion metrics, not just
  "the timeline still looks right."

## Severity guidance

Federation bugs default to **High**, not Medium — a broken cross-PDS
interaction looks fine on the happy path (same-PDS testing) and only shows up
in production once real third-party PDSes are involved, where it's much
harder to reproduce and fix.

## Escalation

Ambiguous protocol-conformance questions (is this the client's bug or a
protocol violation?) go to Lexi (owns lexicon/schema correctness); AppView
and PDS implementation questions go to Forge.
