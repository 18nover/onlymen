# Testing Standards

## Test Pyramid

```
        ╱╲
       ╱ E2E ╲          Few, high-value, real paths
      ╱────────╲
     ╱Integration╲      Moderate, real services
    ╱──────────────╲
   ╱    Unit Tests   ╲   Many, fast, isolated
  ╱────────────────────╲
```

## Unit Tests (Vitest)

- **Co-located** with source: `__tests__/` or `*.test.ts`
- **Fast** — No network, no filesystem, no databases
- **Deterministic** — Same input always produces same output
- **Isolated** — No shared state between tests
- **Edge cases** — Test null, empty, boundary values, errors, concurrent access

```typescript
describe('formatPost', () => {
  it('handles empty text', () => { ... })
  it('truncates at 300 characters', () => { ... })
  it('preserves RichText facets', () => { ... })
  it('throws on invalid facets', () => { ... })
})
```

## Integration Tests

- **Real services** — Use actual databases, APIs, local LLMs
- **Test containers** — Docker for PostgreSQL, Redis
- **AT Protocol dev-env** — Use `@atproto/dev-env` for protocol tests
- **Timeout-aware** — Set appropriate timeouts for real operations

## E2E Tests (Maestro)

- **Critical paths only** — Login, post, follow, DM, notifications
- **Multi-platform** — iOS simulator, Android emulator, web
- **Visual regression** — Screenshot comparison for UI changes
- **Accessibility** — Screen reader navigation paths

## Performance Tests

- **Bundle size** — Monitor per-platform bundle size in CI
- **Startup time** — Measure cold start on real devices
- **Memory** — Profile memory usage during critical flows
- **Network** — Test under poor connectivity (2G, offline, slow 3G)

## Test Naming Convention

```
describe('ComponentOrModule', () => {
  describe('methodName or scenario', () => {
    it('should expected behavior when condition', () => { ... })
  })
})
```

## Coverage Targets

| Category | Minimum |
|----------|---------|
| Unit tests | 80% line coverage |
| Integration | All API endpoints |
| E2E | All critical user paths |
| Security | All auth/authz flows |
| Accessibility | All interactive components |

## What We Don't Test

- Third-party library internals
- Type-level guarantees (TypeScript handles this)
- Trivial getters/setters
- Framework boilerplate

## Evidence Standards

Every test run produces:
- Test results with pass/fail counts
- Coverage reports
- Performance metrics (where applicable)
- Screenshots for visual tests
- Logs for failed tests
