# Moderation Actions — Vision Knowledge Base

## Overview

Ozone (`atproto/packages/ozone`) models every moderation decision as an
**event**, appended to the `moderation_event` table. A subject's current state
— `moderation_subject_status` — is a materialized derivation of its event
history, not an independently-editable row. If you want to know why an
account is taken down, you read the event log; the status row just answers
"what's true right now" quickly.

This document covers the event model, the subject-status state machine, and
the strike system that layers escalating consequences on top of it.

---

## 1. Subjects

A moderation action always targets a **subject**, which is one of:

```ts
// tools.ozone.moderation.defs#subjectStatusView / modEventView "subject" union
type Subject =
  | ComAtprotoAdminDefs.RepoRef        // an account (by DID)
  | ComAtprotoRepoStrongRef            // a specific record (by AT-URI + CID)
  | ChatBskyConvoDefs.MessageRef       // a DM message
  | ChatBskyConvoDefs.ConvoRef         // a whole DM conversation
```

`subject/index.ts` in `mod-service` normalizes these into internal
`RepoSubject`, `RecordSubject`, `MessageSubject`, `ConvoSubject` classes so the
rest of the service doesn't have to keep re-discriminating the union. The
`CHAT_CONVO_COLLECTION` constant marks the synthetic "collection" used to
store convo-subject status rows alongside record subjects.

---

## 2. Moderation Event Types

`tools.ozone.moderation.defs#modEventView.event` is a union over ~24 event
types. The ones you touch most often:

| Event | Purpose |
|---|---|
| `modEventTakedown` | Remove content/account from public view |
| `modEventReverseTakedown` | Undo a takedown |
| `modEventComment` | Internal moderator note, no state change |
| `modEventReport` | A user-submitted report lands on the subject |
| `modEventLabel` | Apply or negate one or more labels |
| `modEventAcknowledge` | Mark reviewed, no action needed |
| `modEventEscalate` | Escalate for senior/specialized review |
| `modEventMute` / `modEventUnmute` | Silence the subject's visibility to moderators (not the public) |
| `modEventMuteReporter` / `modEventUnmuteReporter` | Rate-limit a reporter who is abusing the report flow |
| `modEventEmail` | Send a moderation email to the account holder |
| `modEventResolveAppeal` | Resolve an appeal (accept or reject) |
| `modEventDivert` | Route blobs to a diversion service (CSAM-adjacent tooling) |
| `modEventTag` | Attach/remove free-form tags, including time-boxed "expiring tags" |
| `modEventPriorityScore` | Adjust a subject's queue priority |
| `ageAssuranceEvent` / `ageAssuranceOverrideEvent` / `ageAssurancePurgeEvent` | Age-assurance workflow state |
| `revokeAccountCredentialsEvent` | Force session/credential revocation |
| `scheduleTakedownEvent` / `cancelScheduledTakedownEvent` | Defer a takedown to a future time |
| `accountEvent` / `identityEvent` / `recordEvent` | Lower-level account/identity/record lifecycle signals ingested from the firehose, not moderator-initiated |

Every event row carries `id`, `subject`, `subjectBlobCids`, `createdBy` (DID of
the actor — moderator or system), `createdAt`, and optionally `modTool`
(records which tool/surface produced the action, e.g. `"bsky-app/android"`,
useful for tracing automated vs. manual actions).

---

## 3. Subject Status: the State Machine

`mod-service/status.ts` computes a **partial status patch** for each event
type via `getSubjectStatusForModerationEvent`. The current review states
(`tools.ozone.moderation.defs`) are:

```ts
REVIEWNONE       // never reported/reviewed
REVIEWOPEN       // reported, awaiting moderator action
REVIEWESCALATED  // escalated for specialized/senior review
REVIEWCLOSED     // moderator has made a final call (ack, takedown, or reverse)
```

Transition rules (excerpted, see `status.ts` for the full switch):

```ts
case 'tools.ozone.moderation.defs#modEventAcknowledge':
  return { lastReviewedBy: createdBy, reviewState: REVIEWCLOSED, lastReviewedAt: createdAt }

case 'tools.ozone.moderation.defs#modEventReport':
  return { reviewState: REVIEWOPEN, lastReportedAt: createdAt }

case 'tools.ozone.moderation.defs#modEventEscalate':
  return { lastReviewedBy: createdBy, reviewState: REVIEWESCALATED, lastReviewedAt: createdAt }

case 'tools.ozone.moderation.defs#modEventReverseTakedown':
  return {
    lastReviewedBy: createdBy,
    reviewState: REVIEWCLOSED,
    takendown: false,
    suspendUntil: null,
    lastReviewedAt: createdAt,
  }

case 'tools.ozone.moderation.defs#modEventTakedown':
  return {
    ...(currentStatus?.appealed ? { appealed: false } : {}),
    takendown: true,
    lastReviewedBy: createdBy,
    reviewState: REVIEWCLOSED,
    lastReviewedAt: createdAt,
    suspendUntil: durationInHours
      ? new Date(Date.now() + durationInHours * HOUR).toISOString()
      : null,
  }
```

Key invariants encoded here:

- **A takedown clears `appealed`.** You can't be mid-appeal on an action that
  just got re-applied; the appeal cycle restarts if the user appeals again.
- **A takedown can be time-boxed** via `durationInHours` -> `suspendUntil`.
  This is what makes temporary suspensions and permanent takedowns the same
  event type with different parameters, rather than two event types.
- **Mute/mute-reporter default to a 24-hour window** if no explicit duration
  is given (`durationInHours || 24`), and they do **not** force a specific
  `reviewState` — they preserve whatever the current state already is
  (`defaultReviewState`), because muting is orthogonal to review disposition.
- **Reverse-takedown resets `suspendUntil` to null** — a time-boxed
  suspension, once reversed, doesn't linger with a stale expiry.

---

## 4. Scheduled and Deferred Takedowns

Two event types exist purely to defer action: `scheduleTakedownEvent` and
`cancelScheduledTakedownEvent`, backed by the `scheduled-action` table and
processed by `ScheduledActionProcessor` (a daemon job, see
`ozone-service-architecture.md`). This exists for cases like "this account
violates policy but we want the takedown to land after a grace period" or
batch-scheduled enforcement waves. `assertProtectedTagAction` /
`getProtectedTags` guard against scheduling a takedown on a subject that
carries a protected tag (e.g. an account under active legal hold).

---

## 5. Strikes

`StrikeService` (`mod-service/strike.ts`) tracks escalating consequences
independently of the subject-status review state. Each moderation event can
carry a `strikeCount`; `updateSubjectStrikeCount` walks all non-zero-strike
events for a subject DID and rolls them up into `account_strike`:

```ts
async updateSubjectStrikeCount(subjectDid: string): Promise<void> {
  const events = await this.db.db
    .selectFrom('moderation_event')
    .where('subjectDid', '=', subjectDid)
    .where('strikeCount', '<>', 0)
    .select(['strikeCount', 'strikeExpiresAt', 'createdAt'])
    .orderBy('createdAt', 'asc')
    .execute()

  let activeStrikeCount = 0
  let totalStrikeCount = 0
  for (const event of events) {
    totalStrikeCount += event.strikeCount || 0
    const isActive = event.strikeExpiresAt === null || event.strikeExpiresAt > now
    if (isActive) activeStrikeCount += event.strikeCount || 0
  }
  // upsert into account_strike keyed by did
}
```

- `activeStrikeCount` — strikes still in their window, used for enforcement
  thresholds ("3 active strikes -> permanent takedown").
- `totalStrikeCount` — lifetime count, useful for reporting/analytics even
  after strikes expire.
- A background daemon job, `StrikeExpiryProcessor`, finds subjects whose
  strikes just crossed `strikeExpiresAt` and re-runs the rollup so
  `activeStrikeCount` decays over time without a manual trigger.

Strikes and review state are deliberately decoupled: a subject can have an
`activeStrikeCount` of 2 while sitting in `reviewClosed` (acknowledged, no
action) — the strike is a policy signal, not a review-state value.

---

## 6. Blob Diversion

`BlobDiverter` (`daemon/blob-diverter.ts`) handles the most safety-critical
path: diverting specific blobs (typically CSAM-adjacent detections) to an
external, restricted-access review service instead of ever letting them
resolve through normal PDS blob-serving. This is triggered by `modEventDivert`
and works over the raw blob stream (`VerifyCidTransform`, `createDecoders`)
using the account's actual PDS endpoint (`getPdsEndpoint`) — it never trusts a
locally-cached copy for this class of action.

---

## 7. Designing a New Event Type — Checklist

When Atlas or a domain agent proposes a new moderation capability, verify:

1. **Does an existing event type cover it?** Most "new" moderation needs are
   a new `reasonType` (see `report-triage-workflow.md`) or a new label (see
   `label-taxonomy.md`), not a new event type. Only add a `modEvent*` variant
   if the *state machine* needs new behavior, not just new metadata.
2. **What does it do to `reviewState`?** Write the transition rule explicitly
   — don't leave it implicit or "whatever the current value is" unless that's
   deliberate (as with mute).
3. **Is it reversible?** If it changes public-facing visibility (takedown,
   suspension), there must be a corresponding reverse action, and the reverse
   must undo every field the forward action touched (see how
   `modEventReverseTakedown` resets both `takendown` and `suspendUntil`).
4. **Does it interact with strikes?** Decide whether the event should carry a
   `strikeCount`, and whether that count should have an expiry.
5. **What does the client need to know?** If public-facing behavior changes,
   hand the exact before/after state to Nova so `ContentHider` /
   `ModerationDetailsDialog` render it correctly — see `label-taxonomy.md` §5
   for the client-decisioning path.
