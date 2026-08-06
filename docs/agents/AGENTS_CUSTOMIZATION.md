# Customizing Agents for OnlyMen Bluesky Fork

This guide shows you how to customize your 13 agents to be experts on your specific Bluesky fork, rebranding, and AT Protocol work.

## Quick Overview

Each agent has:

1. **Character file** (`characters/<name>.json`) — personality, system prompt, topics
2. **Knowledge files** (`knowledge/<name>/*.md`) — domain-specific documentation
3. **System prompt** — the primary instruction to Claude

Your goal: Make agents deeply knowledgeable about:

- Bluesky forking (what changed from upstream)
- AT Protocol customization (age verification, moderation)
- Your repo structure (app/, atproto/, eliza/)

---

## Step 1: Add Bluesky Context to Agent Prompts

Edit each agent's `characters/<name>.json` to include Bluesky fork knowledge in the `system` field.

### Example: Morgan (Backend Architect)

**Current (generic):**

```json
"system": "You are Morgan, the backend architect...\n\n## Project\nOnlyMen is a decentralized social app..."
```

**Updated (Bluesky-focused):**

```json
"system": "You are Morgan, the backend architect for OnlyMen — a privacy-first fork of Bluesky built on AT Protocol.\n\n## Project Context\n\nOnlyMen is a fork of the Bluesky stack with these customizations:\n- **Age Verification**: Custom `com.onlymen.ageassurance.*` lexicons for age-gated user creation\n- **Moderation**: Enhanced Ozone integration with LGBTQ+-specific moderation policies\n- **Content Filtering**: Custom feed algorithms prioritizing community safety\n- **PDS Customization**: Multi-tenant PDS supporting per-instance moderation policies\n\nRepo structure:\n- `app/` — Bluesky social-app fork (React Native + Expo)\n- `atproto/` — AT Protocol fork (PDS, AppView, Ozone, lexicons)\n- `eliza/` — This agent org\n\n## Your Expertise\n- Forking Bluesky safely (tracking upstream changes)\n- AT Protocol schema design\n- PDS/AppView architecture and customization\n- Integration testing with AT Protocol ecosystem\n- Database migrations for age assurance\n\n## Example: Age Assurance\nWhen users sign up, they go through:\n1. Initial age claim (self-report, not verified yet)\n2. Document verification (optional, verified stream)\n3. Third-party age service integration (optional)\n4. DID provisioning with age metadata attached\n\nYour job: Design the backend architecture for this flow."
```

### Pattern for All Agents

Edit `characters/<name>.json` and expand the `system` field:

```json
{
  ...
  "system": "You are [NAME], [ROLE] for OnlyMen — a fork of Bluesky built on AT Protocol.\n\n## Project Context\n[Fork-specific details]\n\n## Your Expertise\n- [Domain 1: How it relates to Bluesky fork]\n- [Domain 2: AT Protocol-specific skills]\n- [Domain 3: OnlyMen's unique requirements]\n\n[Previous personality + knowledge]"
}
```

---

## Step 2: Create Knowledge Documents

Each agent references knowledge files in `knowledge/<agent>/`. Create Markdown files for your fork.

### Example Knowledge Files to Create

**For Morgan (Backend Architect):**

```plain
knowledge/morgan/
├── bluesky-fork-checklist.md    # What we changed from upstream
├── age-verification-schema.md   # Database design for age assurance
├── pds-customization.md         # How our PDS differs
├── at-protocol-changes.md       # Custom lexicons
└── api-design.md                # OnlyMen API patterns
```

**For Nadia (React Native Architect):**

```plain
knowledge/nadia/
├── app-fork-checklist.md        # Changes from upstream Bluesky app
├── age-gate-flow.md             # Signup flow with verification
├── app-architecture.md          # Folder structure, state management
└── expo-setup.md                # EAS builds for Android/iOS
```

**For Lexi (Lexicon Specialist):**

```plain
knowledge/lexi/
├── lexicon-audit.md             # Which upstream lexicons we use
├── custom-lexicons.md           # com.onlymen.* schemas
├── nsid-naming.md               # Naming convention for custom NSIDs
└── schema-validation.md         # How to validate lexicons
```

### Template: Bluesky Fork Checklist

Create `knowledge/<agent>/bluesky-fork-checklist.md`:

```markdown
# Bluesky Fork Checklist for OnlyMen

## Overview
OnlyMen forks the Bluesky stack (both `atproto` and `social-app` repos) to add age verification and community-focused moderation.

## What We Keep (Upstream)
- AT Protocol core (DIDs, PDS/AppView protocol)
- Standard lexicons: `app.bsky.*`, `com.atproto.*`
- Firehose streaming
- Ozone core moderation system

## What We Change

### Backend (atproto/ fork)
- [ ] PDS: Add age verification endpoints
- [ ] PDS: Add age metadata to user profile
- [ ] AppView: Add age-restricted feed algorithms
- [ ] Ozone: Add LGBTQ+-specific moderation labels
- [ ] Custom lexicons: `com.onlymen.ageassurance.*`, `com.onlymen.moderation.*`

### Mobile App (social-app/ fork)
- [ ] Signup: Add age verification flow
- [ ] Profile: Show age status
- [ ] Settings: Age visibility controls
- [ ] Feeds: Age-restricted content handling
- [ ] Moderation: Community-specific guidelines

### CI/CD & Deployment
- [ ] Track upstream changes (git remotes)
- [ ] Test compatibility with public AT Protocol
- [ ] Docker builds for PDS + AppView
- [ ] EAS builds for Android/iOS

## Tracking Upstream
- GitHub: bluesky-social/atproto & bluesky-social/social-app
- Keep a CHANGELOG of our divergences
- Plan quarterly upstream cherry-picks
```

---

## Step 3: Reference Knowledge in Agent Configs

In `characters/<agent>.json`, the `knowledge` array tells each agent what docs to read:

```json
{
  "name": "Morgan",
  ...
  "knowledge": [
    {
      "path": "../knowledge/morgan/bluesky-fork-checklist.md",
      "title": "Bluesky Fork Overview"
    },
    {
      "path": "../knowledge/morgan/age-verification-schema.md",
      "title": "Age Verification Database Design"
    },
    {
      "path": "../knowledge/morgan/pds-customization.md",
      "title": "PDS Architecture & Changes"
    },
    {
      "path": "../shared/atproto.md",
      "title": "AT Protocol Primer"
    }
  ]
}
```

When you execute a task for Morgan, the runtime reads these files and includes them in the prompt.

---

## Step 4: Create Shared Knowledge Documents

In `shared/`, add documentation all agents can reference:

```plain
shared/
├── atproto.md                    # AT Protocol basics (exists)
├── bluesky-fork-overview.md      # High-level fork strategy
├── age-verification-strategy.md  # The big picture for age assurance
├── moderation-policy.md          # Community safety guidelines
├── api-design-patterns.md        # OnlyMen API standards
└── ...
```

### Example: shared/bluesky-fork-overview.md

```markdown
# OnlyMen: A Bluesky Fork for Age-Verified Communities

## Why We Fork

Bluesky is a powerful, decentralized social platform built on AT Protocol. OnlyMen uses the Bluesky stack to create:
- **Community-first moderation**: LGBTQ+ safety by design
- **Age-verified access**: 18+ only, with multiple verification methods
- **Customizable infrastructure**: Run your own PDS, control your data

## What We Fork

### Repository: atproto (AT Protocol)
- [GitHub: bluesky-social/atproto](https://github.com/bluesky-social/atproto)
- We use: PDS (Personal Data Server), AppView (public data indexing), Ozone (moderation)
- We add: Age assurance lexicons, custom moderation labels

### Repository: social-app (Bluesky Client)
- [GitHub: bluesky-social/social-app](https://github.com/bluesky-social/social-app)
- We use: React Native + Expo, ALF design system, TanStack Query state management
- We add: Age verification flows, community guidelines UI

## Our Divergences from Upstream

### 1. Age Verification Lexicons
Standard: `app.bsky.ageassurance.*` (exists upstream)
OnlyMen: `com.onlymen.ageassurance.*` (custom verification methods)

### 2. Moderation Labels
Standard: `com.atproto.moderation.defs`
OnlyMen: Add LGBTQ+-specific labels, hate speech detection for our community

### 3. PDS Customization
Standard: Single-instance PDS
OnlyMen: Multi-tenant mode supporting per-instance policies

### 4. Feed Algorithms
Standard: Algorithmic feeds for discovery
OnlyMen: Community safety algorithms, anti-harassment ranking

## Integration Points

- **Public AT Protocol**: OnlyMen users can interact with public Bluesky users (read-only where needed)
- **Interoperable**: Other apps using AT Protocol can integrate with our PDS
- **Open Source**: We track upstream and contribute fixes back

## Current Focus

Phase 1 (MVP):
- Age verification for signup
- Community guidelines enforcement
- PDS basic customization

Phase 2:
- Multi-tenant PDS
- Custom feed algorithms
- Advanced moderation workflows
```

---

## Step 5: Update Individual Agent Prompts

### For **Devon** (DevOps Engineer)

Add to `characters/devon.json`:

```json
"system": "You are Devon, the DevOps Engineer for OnlyMen — a fork of Bluesky.\n\n## Your Responsibilities\n- Deploy and maintain PDS (fork of bluesky-social/atproto)\n- Deploy and maintain AppView indexer\n- Manage Ozone moderation services\n- Set up Docker Compose for local dev (PDS + AppView + mock firehose)\n- CI/CD: EAS builds for Expo (Android/iOS)\n- Monitoring: Firehose lag, PDS uptime, data sync health\n\n## Key Context\n- Upstream: bluesky-social/atproto (track releases)\n- Our changes: Age verification services, custom moderation Ozone rules\n- Local dev: Docker Compose with mock PDS, AppView, firehose\n- Production: Kubernetes or self-hosted on VPS\n\n## Infrastructure Decisions\n- Use Docker for service isolation\n- Health checks on all services\n- Automated backups for user data\n- Monitoring with Prometheus + Grafana\n- Log aggregation for debugging\n\n## Example: Local Dev Setup\n```\ndocker compose up\n- PDS: localhost:3000\n- AppView: localhost:4000\n- Ozone (moderation): localhost:5000\n- Mock firehose: localhost:6000\n```\n\nYour job: Design the infrastructure for this."
```

### For **Lexi** (Lexicon Specialist)

Add to `characters/lexi.json`:

```json
"system": "You are Lexi, the Lexicon Specialist for OnlyMen.\n\n## Your Expertise\n- AT Protocol schemas and lexicons\n- NSID naming conventions\n- Lexicon validation\n- AT Protocol interoperability testing\n\n## Your Responsibilities\n- Audit upstream `app.bsky.*` and `com.atproto.*` lexicons\n- Design OnlyMen custom lexicons (e.g., `com.onlymen.ageassurance.*`)\n- Ensure backward compatibility with upstream\n- Code generation from lexicon definitions\n- Test interop with public Bluesky (schema compatibility)\n\n## OnlyMen Lexicons\n\n### com.onlymen.ageassurance.*\n- profile: Age verification status on user profile\n- token: Signed age verification tokens\n- service: Third-party age verification integrations\n\n### com.onlymen.moderation.*\n- report: Extended reporting with LGBTQ+ context\n- label: Community-specific moderation labels\n\n## Key Context\n- Track upstream: bluesky-social/atproto/packages/lexicons\n- Our NSIDs follow `com.onlymen.*` pattern\n- Validation: Use lexicon compiler to catch schema errors\n- Interop: Test that public AT Protocol apps can read our custom lexicons\n\nYour job: Keep the lexicon layer clean and backward-compatible."
```

---

## Step 6: Example: Creating Your First Task

Once agents are customized, try this task:

### Task for **Morgan**

```plain
Title: "Design the age verification schema for OnlyMen PDS"

Description:
"We need to add age verification to the PDS fork. Design the PostgreSQL schema and explain:

1. How user age data is stored (encrypted? hashed?)
2. Relationship between users and verification records
3. How the DID system incorporates age metadata
4. Compatibility with upstream Bluesky lexicons
5. Migration path from an existing Bluesky instance

Reference: app.bsky.ageassurance lexicon upstream.
Consider: Age-verified feed algorithms need to query this data efficiently.
Constraints: GDPR/CCPA compliance for age data."
```

**Morgan will respond with:**

- Schema design (CREATE TABLE statements)
- Data flow diagram
- Security considerations
- Migration strategy
- Questions for clarification

---

## Step 7: Keep Knowledge Updated

As your fork evolves, update knowledge docs:

```bash
# When upstream releases
knowledge/morgan/bluesky-fork-checklist.md  # Update divergences
shared/bluesky-fork-overview.md             # Reflect new features

# When you make changes
knowledge/lexi/custom-lexicons.md           # Document new lexicons
knowledge/devon/infrastructure.md           # Update deployment
```

---

## Customization Checklist

- [ ] Read all 13 `characters/<name>.json` files
- [ ] Update `system` prompts with Bluesky fork context
- [ ] Create `knowledge/<agent>/` folders with domain docs
- [ ] Add `shared/bluesky-fork-overview.md`
- [ ] Update agent `knowledge` arrays to reference new docs
- [ ] Test with a sample task (e.g., "Design the age verification schema")
- [ ] Refine based on agent responses
- [ ] Share the customized agents with your team

---

## Next: Bluesky Fork-Specific Tasks

Once agents are customized, you can dispatch real work:

1. **Lexi**: "Audit the upstream lexicons and design `com.onlymen.ageassurance.*`"
2. **Morgan**: "Design the PDS schema for age verification"
3. **Devon**: "Create Docker Compose for local PDS + AppView + firehose"
4. **Nadia**: "Build the age gate signup flow in React Native"
5. **Quinn**: "Create a test plan for age verification interop"
6. **Seth**: "Threat model age verification (fake docs, data leaks, etc.)"

Then have **Andrew** coordinate the plan and timeline.

---

**Ready to customize your agents?**

```bash
# 1. Edit characters/*.json with Bluesky context
# 2. Create knowledge/<agent>/*.md with domain docs
# 3. Start the runtime:
npm start
# 4. Open http://localhost:3000 and dispatch your first task!
```
