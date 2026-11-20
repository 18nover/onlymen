# Architecture — OnlyMen

**Last updated:** 2026-11-20  
**Status:** Initial skeleton. Will be filled as technical decisions are made.

---

## 1. Guiding Principles

- Own the stack completely (no black-box platforms that lock us in).
- Prefer boring, proven technology that a small team can maintain.
- Ship small working pieces.
- Design for Phase 1 simplicity, but leave clean extension points for later paid features.

---

## 2. Intended Stack (to be confirmed)

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend + API | Next.js (App Router) + TypeScript | Full-stack React |
| Database | PostgreSQL | Primary source of truth |
| Auth | TBD (likely NextAuth / Auth.js or Clerk — decision pending) | |
| File / Media storage | TBD (S3-compatible or Cloudflare R2 preferred for ownership) | |
| Hosting | TBD | |
| Payments / Tips | TBD (Stripe or similar — Phase 1 optional only) | |

---

## 3. High-Level Data Model (sketch)

Core entities expected:

- **User** (auth identity)
- **Profile** (public-facing model or client profile)
- **Media** (photos / videos attached to profiles)
- **Availability** / calendar
- **Tip** / transaction (Phase 1)
- **Message** / contact (later)

Detailed schema will be written once we start the MVP foundation.

---

## 4. Open Technical Decisions

- Auth provider / approach
- Media storage + CDN
- Hosting / deployment target
- Tip processing provider
- Age verification / safety tooling approach (high-level only for now)

---

*Update this document whenever architectural decisions are made. Record the “why” in the Decision Log.*
