# Lexicon Validation

`atproto/packages/lexicon` provides the `Lexicons` class — the runtime
validator that checks records and XRPC payloads against their schema. This is
where "does this data match the contract" gets enforced, distinct from
TypeScript's compile-time types (which only check what the generated client
believes the shape to be).

## Why both matter

Generated TypeScript types (from codegen) give compile-time confidence for
code written against the schema. `Lexicons` runtime validation catches
everything TypeScript can't: data arriving from the network (another PDS,
a third-party client, the firehose) that claims to match a schema but might
not — malformed records, a client on an older schema version, or a hostile
input.

## Where validation must happen

- **PDS write path** — every record written to a repo is validated against
  its lexicon before being accepted. This is Morgan's implementation surface,
  but the validation rules themselves come from your schema's constraints
  (`required`, `maxLength`, `format`, `enum`).
- **AppView ingestion** — firehose events from any PDS (including third-party
  ones) are validated before indexing; a malformed or unexpected record
  should be rejected/logged, never silently indexed in a way that assumes a
  shape it doesn't have.
- **XRPC boundary** — `query`/`procedure` input and output are validated
  against their schema's `parameters`/`input`/`output` defs.

## Designing schemas for good validation errors

- Use `format` constraints (`datetime`, `did`, `handle`, `at-uri`, `cid`,
  `uri`) instead of a bare `string` type whenever the field has a known
  shape — this gives validators (and generated clients) a precise check
  instead of accepting any string.
- Enumerate explicit `errors` on `query`/`procedure` defs rather than letting
  every failure fall through to a generic error — a consumer handling
  `RecordNotFound` differently from `InvalidRequest` needs that distinction
  in the schema, not just in prose documentation.
- `required` fields should be the true minimum for the record to be
  meaningful — an overly long required list makes every future additive
  change harder (you can never demote a required field to optional without
  breaking anyone who never set it).

## Common validation failure modes to design against

- **Union type drift** — a client encounters a union member it doesn't
  recognize (added by a newer schema version). Validation/consumption code
  must degrade (skip/ignore unknown variant) rather than throw, or every
  additive union change becomes a breaking change in practice.
- **String length vs. grapheme count** — validating only byte length lets
  through content that violates the user-facing character limit; validate
  both where the schema defines both.
- **Cross-record reference integrity** — a `strongRef` (uri + cid) pointing
  to a deleted or nonexistent record is a valid *shape* but an invalid
  *reference*; decide explicitly whether this is a validation-layer concern
  or a business-logic concern, and document which, so Morgan doesn't
  duplicate or skip the check.
