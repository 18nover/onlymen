# Report Triage Workflow

Every report is an intake event that must land in exactly one queue and
produce exactly one auditable resolution — never a silent drop, never a
double-handle.

## Intake

`com.atproto.moderation.createReport` accepts a `reasonType` (from
`com.atproto.moderation.defs`: `misleading`, `spam`, `sexual`, `violation`,
`rude`, `other`, plus safety-critical reasons) and a subject reference
(record, account, or repo). `tools.ozone.report.defs` extends this with the
Ozone-side reason taxonomy used for routing.

**Rule:** never let a report fall into `reasonRuleOther` if a specific reason
exists — `other` is a routing dead-end that loses the signal needed for
queue assignment and trend analysis.

## Queue routing

`tools.ozone.queue.routeReports` matches on `reportTypes` + `subjectTypes`.
Design queues around **response-time requirements**, not organizational
convenience:

- Child-safety / imminent-harm reasons → dedicated queue, tightest SLA,
  routes to trained moderators only.
- Ban-evasion / account-level abuse → queue scoped to `subjectTypes:
  ["account"]` so the moderator sees full account history, not one record.
- Spam / low-severity → higher-volume queue, automatable pre-filtering
  acceptable (but automation decisions still emit a `modEvent`, never a
  silent auto-resolve with no event trail).

## Triage → action → event

Every triage decision maps to a `tools.ozone.moderation.defs` event:

| Decision | Event | Status effect |
|---|---|---|
| Confirmed, act now | `modEventTakedown` | `reviewClosed`, `takendown: true` |
| Confirmed, warn only | `modEventLabel` | labels applied, review state unchanged unless separately closed |
| Needs more eyes | `modEventEscalate` | `reviewEscalated` |
| Not a violation | `modEventAcknowledge` | `reviewClosed`, no other state change |
| False report | `modEventMuteReporter` | time-boxed, doesn't change subject's review state |

## Appeals

`modEventResolveAppeal` is the only correct way to close an `appealed` state.
An appeal is a moderation event, not a support ticket — routing it outside
the event log breaks the audit trail and the reverse-path guarantee (every
takedown must have a working, logged reverse).

## SLA and metrics that matter

- Track `unmatched`/`other`-routed report volume — trending up means the
  taxonomy is missing a reason type, not that users are confused.
- Time-in-`reviewEscalated` by queue — a queue that's chronically escalating
  is either understaffed or missing a decision the triager needs.
- Reverse-takedown rate — spikes indicate an over-aggressive automated rule,
  not a healthy moderation program.

## Escalation

Legal/compliance-sensitive reason types (child-safety, imminent harm) never
wait on cross-agent discussion — act within the existing playbook and loop in
Atlas for visibility, not for a go/no-go decision.
