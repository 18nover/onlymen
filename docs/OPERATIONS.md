# AI operations plan — OnlyMen

**Last updated:** 2026-11-21
**Status:** Plan only. This is a summary of the living Page; the Page is the canonical write-up.

> **Superseded in part (2026-11-22, ONL-11):** paid Featured slots, featured pricing and slot auctions are dropped. OnlyMen has no paid ranking or placement ([PRODUCT_SPEC.md](PRODUCT_SPEC.md)); "Featured" is an unpaid editorial pick. The paid-placement items below are struck through and kept only as history.

**Page:** [OnlyMen AI Operations Plan](https://cursor.com/canvas/store-2cd20948-eddd-4f70-85a3-7c25d7c2a761/b59a0ba2-2cc4-4337-9041-9314a01932ff)

The plan covers how AI can run placement, pricing, safety, and day-to-day ops across onlymen.gay, onlymen.live, and 18nover.gay on a solo budget: what to build now, what AI may decide alone, and what each piece costs per month.

---

## The short version

AI can sit in nearly every section of the three sites and decide placement, traffic, and pricing. The cheap way is ordinary app logic plus Postgres plus small, inexpensive language-model calls — not a large machine-learning stack. Most of Phase 1 can run on free tiers, so estimated cost is **$0 to about $70 a month**.

**One firm line:** AI can rank, price, write, translate, flag, and draft. It must **never** be the only decider on who is 18+, on ID checks, or on reporting child-abuse material. A certified vendor or Jerry makes those calls; AI only prepares the paperwork.

---

## Two things to fix before taking money

1. **Vercel Hobby is non-commercial.** Taking payments is commercial use. Move to Cloudflare Workers (planned; see [HOSTING.md](HOSTING.md#planned-cloudflare-move)) or pay for Vercel Pro first. See also Vercel's acceptable-use rules around adult content.
2. **Kentucky age-verification law (HB 278, 2024).** Commercial sites where more than a third of the material is harmful to minors need age checks. The cheap mitigation in the plan: keep onlymen.gay non-explicit (PG-13 main photos) and leave explicit content to the white-label or the creator's own platforms, which already run performer checks.

---

## Roadmap by phase (from the Page)

| Phase | What AI does | Est. monthly cost |
|---|---|---|
| Now (2–4 weeks) | Ranking v1 with a new-creator floor, ~~labeled Featured slots at fixed prices~~, an AI bio writer, smart search, photo safety checks and auto-crop, a one-tap approval queue, and a daily digest | $0–$70 |
| Next 3 months | ~~Demand-based featured pricing with caps~~, match suggestions, chat translation, creator coaching, stream title / tip-menu ideas, a support inbox agent, fraud watch, and X posting drafts | $20–$120 |
| Later (6+ months) | ~~Auctions for top slots~~, learning-to-rank once there are enough logged views, SEO content agent, payout reconciliation, and agents running most daily ops with human approval of exceptions | $60–$300, scaling with revenue |

---

## What the plan proposes

1. **Ranking and placement.** One scoring function for grids, the Live now row, and search, learned from clicks, views, follows, tips, and subscriptions logged in Postgres. A fairness floor reserves part of each grid for new or under-shown creators. ~~Paid Featured tiles stay capped and labeled.~~ Featured is an unpaid editorial pick. Moderation flags, unverified creators, and geo-blocks are hard exclusions AI cannot override.
2. ~~**Featured pricing.** Start with a fixed price list. Later, weekly demand-based adjustments inside a floor and ceiling, then maybe a second-price auction for top slots. The pricing agent may move prices only within those caps; bigger changes need a one-tap approval.~~ Dropped (ONL-11): no paid placement.
3. **Member and creator features.** Bio writer, in-browser photo quality / auto-crop (photos never need to reach an AI provider for crop), smart search, later match suggestions, translation, coaching, and stream-title ideas. Outputs are kept PG-13 on purpose so cheaper models stay within provider rules.
4. **Safety.** ID and age checks stay with a certified vendor (Persona, Veriff, or Yoti) or the white-label platform. CSAM handling is hash matching (Cloudflare CSAM Scanning Tool, PhotoDNA), not a general model. AI may hold a main photo or freeze an account and escalate; it does not file the legal decision alone.
5. **Agent-run operations.** Daily digest, ranking monitor, support inbox, onboarding assistant, fraud watch, payout reconciliation, marketing drafts, SEO drafts. Autonomy ranges from fully automatic (digests, cap monitors) to one-tap (approvals, bans, posts).

Preferred cheap providers in the plan include Groq (Llama), Cloudflare Workers AI, Vercel AI Gateway, OpenRouter, Mistral, and the free OpenAI moderation endpoint. The plan says to avoid Anthropic, Google Gemini, and Together AI for this product because of their usage policies, and to use OpenAI chat models only with care.

Phase 1 build list on the Page (about 8–10 build days): real accounts on Neon (done), event log + ranking v1, photo pipeline off Postgres and onto object storage with scanning, AI bio writer and smart search, admin one-tap queue + daily digest, move hosting to Cloudflare Workers (or Vercel Pro) before the first payment, and fixed-price Featured slots sold through the adult processor.

One-time costs called out separately: the Kentucky LLC, DMCA agent registration, and domains.
