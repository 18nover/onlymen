# E2E Mock-PDS Testing

Client e2e tests (app/) should not hit production `bsky.social`. Use a local
PDS + AppView stack so tests are fast, deterministic, and don't pollute real
data or burn rate limits.

## Local dev stack

`atproto/packages/dev-infra/docker-compose.yaml` brings up Postgres + Redis;
each service has its own Dockerfile (PDS, bsky/AppView, ozone, bsync). Default
local ports: PLC directory 2582, PDS 2583, AppView 2584, Ozone 2587.

```bash
cd atproto
make deps        # or pnpm install (non-frozen while the biome lockfile drift exists)
docker compose -f packages/dev-infra/docker-compose.yaml up -d
```

Seed fixture accounts/posts via `@atproto/dev-env` (`packages/dev-env`) rather
than hand-crafting XRPC calls — it wires PDS + AppView + a test PLC server
together with known DIDs/handles so test fixtures are stable across runs.

## Maestro flows against the mock stack

`app/`'s Maestro e2e flows should point `EXPO_PUBLIC_BSKY_SERVICE` (or the
equivalent local config) at the local PDS/AppView instead of production. Every
flow that creates state (post, follow, like, block) must run against the
mock stack — never against production, even read-only, since production data
changes out from under a fixed test script.

## What to cover

- Fresh account creation through the full PDS onboarding flow
  (`com.atproto.server.createAccount` → session → first post).
- Session refresh/expiry: force a token expiry mid-flow, confirm the client's
  401 handling re-authenticates silently rather than logging the user out.
- Firehose-dependent UI: post from one seeded account, confirm it appears in
  a second seeded account's timeline within the AppView's indexing window —
  don't assert immediately after the write; poll with a bounded timeout.
- Moderation-affected flows: label an account/post via the mock Ozone
  instance, confirm the client renders the correct blur/warning state.

## Failure modes specific to mock-PDS testing

- **Stale fixtures**: dev-env fixtures created once and reused across test
  runs drift from what the current schema expects after a lexicon change —
  regenerate fixtures when `atproto/lexicons/*` changes land.
- **Port collisions**: parallel test lanes on the same machine must not share
  the 2582–2587 port range — use the shared dev-server registry pattern
  documented in the root `CLAUDE.md` (`dev-server-registry.json`) rather than
  hardcoding ports in test config.
- **Docker state leaking between runs**: a stopped-not-removed container can
  serve stale Postgres data to the next test run — `docker compose down -v`
  between suites that assert on absolute record counts.

## Escalation

Stack won't boot / native dep build failures (`better-sqlite3`, `sharp`) on
the test runner's architecture → Devon. Lexicon-shape mismatches surfacing
as fixture failures → Lexi.
