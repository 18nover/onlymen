# Ozone Service Architecture

Ozone (`atproto/packages/ozone`, deployed via `atproto/services/ozone`) is a
standalone service that sits beside the PDS and AppView — it does not embed
in either. It owns the moderation event log and derives subject status from
it; it does not own repo storage or feed generation.

## Where it sits

```
PDS (repo storage) --sync--> AppView (bsky, indexing/feeds)
                                  ^
                                  | appviewUrl / appviewDid
                              Ozone (moderation)
                                  |
                          pdsUrl / pdsDid (admin actions: takedown)
```

Ozone reads AppView state to give moderators context (post/profile content,
report history) and calls back into the PDS for account-level admin actions
(takedown enforcement happens at the PDS, since that's where the repo lives).

## Key components

- **`OzoneService` / `OzoneDaemon`** (`services/ozone/api.ts` +
  `daemon.ts`) — the HTTP API surface (moderator-facing XRPC endpoints under
  `tools.ozone.*`) and background daemon jobs.
- **Event-pusher / event-reverser daemons** — background jobs that propagate
  moderation events to downstream consumers (label subscribers, the PDS for
  takedown enforcement) and handle scheduled reversals (`suspendUntil`
  expiry auto-reversing a time-boxed takedown).
- **`BlobDiverter`** — routes flagged media (CSAM-adjacent safety tooling)
  to a diversion path instead of normal serving; this is the most
  security-sensitive component in the service and changes here always go
  through Sentinel.
- **`StrikeService`** — tracks `account_strike` records and
  `activeStrikeCount`, feeding escalating-consequence policy.
- **`tools.ozone.safelink.*`** — URL safety rules, checked independently of
  the label/report pipeline.

## Configuration surface

- `appviewUrl` / `appviewDid` — where Ozone reads content/context from.
- `pdsUrl` / `pdsDid` — where Ozone sends admin/takedown actions.
- Labeler DID + signing key — every label Ozone emits is signed under this
  identity; key rotation here is a Sentinel-reviewed operation, not routine
  config.

## Deployment

Standalone Docker service (`atproto/services/ozone/Dockerfile`), independent
of PDS/AppView deploys. In local dev, part of the `dev-infra` compose stack
on port 2587. Circuit owns the container/deploy pipeline; this doc covers
what the service does, not how it ships.

## Data model boundary

Ozone's database holds moderation events and derived subject status — it
does NOT hold a copy of user content. Every moderation decision references
content by URI/CID and re-fetches from the AppView for display; this keeps
Ozone from becoming a second, potentially-stale copy of user data.
