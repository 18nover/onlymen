# Documentation Standards

## Documentation Types

| Type | Audience | Location | Update Trigger |
|------|----------|----------|----------------|
| README | New developers | Root of each package | Structural changes |
| API docs | Integrators | `docs/api/` | API changes |
| Architecture docs | Engineers | `docs/architecture/` | Design decisions |
| Deployment docs | DevOps | `docs/deployment/` | Infrastructure changes |
| User guides | End users | `docs/guides/` | Feature changes |
| Runbooks | On-call | `docs/runbooks/` | Incident learnings |
| ADRs | All engineers | `docs/adrs/` | Major decisions |

## README Template

Every package/module gets a README with:

```markdown
# Package Name

One-line description.

## Quick Start

Minimal code to get running.

## API Reference

Key exports and their signatures.

## Configuration

Environment variables and config options.

## Development

How to build, test, and run locally.

## Architecture

How this fits into the larger system (2-3 paragraphs max).
```

## API Documentation

- Document every public function, class, and type
- Include parameter descriptions, return types, and exceptions
- Provide usage examples for non-trivial APIs
- Keep docs close to code (JSDoc or co-located markdown)

## Architecture Decision Records (ADRs)

Format for major decisions:

```markdown
# ADR-NNN: Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
What is the issue that motivates this decision?

## Decision
What is the change being proposed or decided?

## Consequences
What becomes easier or harder to do?

## Alternatives Considered
What other options were evaluated?
```

## Writing Style

- **Clear and concise** — No unnecessary words
- **Active voice** — "The agent sends..." not "The message is sent..."
- **Present tense** — "This module handles..." not "This module will handle..."
- **Second person** — "You can configure..." not "The user can configure..."
- **Code examples** — Every concept gets a runnable example
- **No assuming knowledge** — Link to concepts, don't assume reader knows them

## Documentation Review

Scribe reviews all documentation for:
- Accuracy against implementation
- Completeness of examples
- Clarity for target audience
- Consistency with style guide
- Links are valid and current
