# Technical Debt Patterns — Echo Knowledge Base

## Overview

Technical debt accumulates through shortcuts, deferred maintenance, and evolving requirements. This document catalogs common patterns in React Native/Expo projects and provides detection and remediation guidance.

---

## 1. Outdated Dependencies

### Pattern
Dependencies fall behind current versions, creating security vulnerabilities, missing features, and increasing migration cost over time.

### Detection
```bash
npm outdated
npm audit
npx depcheck  # find unused dependencies too
```

### Indicators
- `npm outdated` shows packages multiple major versions behind
- `npm audit` reports known vulnerabilities
- Peer dependency warnings during install
- Using deprecated APIs that newer versions have replaced
- Expo SDK version is 2+ versions behind current

### Common Examples
- Stuck on Expo SDK 50 when SDK 54 is current
- React Native version with known memory leaks
- React Navigation 5 when 7 is available
- Old TypeScript version missing useful type features

### Remediation
- Schedule regular dependency update sprints (monthly)
- Use Dependabot or Renovate for automated update PRs
- Create migration tickets for major version updates
- Test thoroughly after updates, especially on both platforms
- Track update progress in a spreadsheet or project board

### Prevention
- Set up automated dependency monitoring
- Include dependency updates in sprint planning
- Establish update policy: patch monthly, minor quarterly, major planned
- Review dependencies during code review

---

## 2. Unused Code

### Pattern
Code that is no longer referenced but remains in the codebase, increasing bundle size, confusing developers, and complicating maintenance.

### Detection
```bash
# Find unused exports
npx depcheck

# Find unused variables/functions (ESLint)
# Config: "no-unused-vars": "error"

# Search for commented-out code
grep -rn "//.*\bif\b\|//.*\breturn\b\|//.*\bfunction\b" src/

# Find dead imports
npx ts-prune  # TypeScript unused exports
```

### Indicators
- Files that are never imported anywhere
- Exported functions/components with zero imports
- Large blocks of commented-out code
- Feature flags that are permanently enabled (code below is dead)
- Old screens/pages that are no longer in navigation
- Utility functions that were replaced but never deleted
- Type definitions for removed features

### Common Examples
- Old chat screen replaced by new implementation but never deleted
- Utility functions from removed features
- Type definitions for deleted API responses
- Constants for feature flags that shipped months ago
- Commented-out debugging code

### Remediation
- Delete dead code — version control preserves history
- Remove unused exports and their corresponding tests
- Clean up feature flags that are permanently on
- Remove commented-out code (rely on git history)
- Remove unused files and directories
- Update imports after deletion

### Prevention
- ESLint `no-unused-vars` as error in CI
- Code review checklist: verify no dead code introduced
- Regular codebase cleanup sprints
- Feature flag lifecycle management (define expiration dates)

---

## 3. Inconsistent Patterns

### Pattern
Multiple ways of doing the same thing across the codebase, causing confusion and increasing cognitive load for developers.

### Detection
- Search for multiple implementations of similar functionality
- Check import patterns across files
- Review error handling approaches
- Examine state management patterns (multiple approaches)
- Check styling approaches (StyleSheet vs inline vs styled-components)

### Indicators
- Some files use `async/await`, others use `.then()` chains
- Mix of named exports and default exports
- Some components use TypeScript interfaces, others use types
- Multiple error handling patterns (try/catch, .catch(), error boundaries)
- Inconsistent file naming (camelCase vs PascalCase vs kebab-case)
- Different testing approaches across similar components
- Mixed state management (some Context, some Redux, some local state)

### Common Examples
```js
// Pattern A: async/await
const fetchData = async () => {
  try {
    const result = await api.get('/data');
    return result;
  } catch (error) {
    throw error;
  }
};

// Pattern B: .then chains
const fetchData = () => {
  return api.get('/data')
    .then(result => result)
    .catch(error => { throw error; });
};
```

### Remediation
- Document the preferred pattern in style guide
- Create ESLint rules to enforce patterns where possible
- Refactor inconsistencies gradually (one pattern per sprint)
- Use linting tools: `eslint-plugin-unicorn`, `@typescript-eslint`
- Create shared utilities for common patterns

### Prevention
- Establish and document coding standards early
- Use linting and formatting tools consistently
- Include pattern consistency in code review criteria
- Onboard new developers with style guide

---

## 4. Missing Tests

### Pattern
Critical functionality lacks test coverage, making refactoring risky and bugs harder to catch.

### Detection
```bash
npm test -- --coverage
# Review coverage report for gaps

# Find files without tests
find src -name "*.tsx" -o -name "*.ts" | while read f; do
  test_file="${f%.ts*}.test.ts*"
  [ ! -f "$test_file" ] && echo "No test: $f"
done
```

### Indicators
- Code coverage below 60% for critical paths
- Core business logic has no unit tests
- Component interactions have no integration tests
- API services have no tests
- Error handling paths have no tests
- New features merged without tests
- Test files exist but contain skipped tests

### Common Examples
- Chat message parsing logic (complex, error-prone) has no tests
- Authentication flow has no integration tests
- Moderation rules engine has minimal test cases
- Navigation flows have no E2E tests
- API error handling is untested
- Edge cases in data transformation are untested

### Remediation
- Prioritize tests for critical business logic first
- Write tests for bugs before fixing them (regression tests)
- Add tests when modifying existing code (boy scout rule)
- Create test coverage thresholds in CI
- Focus on behavior over implementation details
- Test edge cases: null, empty, boundary values, errors

### Prevention
- Definition of Done includes "tests pass and coverage maintained"
- PR review requires test coverage for new features
- Set up coverage thresholds in CI (fail build below threshold)
- Track test debt as technical debt items

---

## 5. Poor Error Handling

### Pattern
Errors are swallowed, handled inconsistently, or not handled at all, making debugging difficult and user experience poor.

### Detection
- Search for empty catch blocks
- Search for generic error messages
- Check for missing error boundaries
- Review API error handling consistency
- Check for unhandled promise rejections

### Indicators
```js
// Empty catch block
try {
  await fetchData();
} catch (error) {
  // nothing here
}

// Generic error
catch (error) {
  console.log('Error occurred'); // no context
}

// Swallowed error
.catch(() => {}); // silently ignoring
```

- `console.log` used for error reporting instead of proper logging
- No global error boundary
- Missing try/catch around async operations
- Error messages not helpful to users or developers
- No error reporting service integration

### Common Examples
- Network errors not handled — app shows blank screen
- Parse errors in chat messages crash the app
- Authentication token expiry not handled gracefully
- File upload failures not reported to user
- Deep link parsing errors not caught

### Remediation
- Add meaningful error messages for all catch blocks
- Implement global error boundary component
- Add error boundaries around screen-level components
- Use error reporting service (Sentry) for unhandled errors
- Create user-friendly error messages for common failures
- Implement retry logic for transient network errors
- Add fallback UI for error states

### Prevention
- ESLint rule: `no-empty` catch blocks
- Code review: verify error handling in all async code
- Create error handling utilities and patterns
- Include error scenarios in test cases

---

## 6. Hardcoded Values

### Pattern
Configuration values, strings, colors, dimensions, or URLs are hardcoded in source files instead of being centralized.

### Detection
```bash
# Find hardcoded URLs
grep -rn "http://\|https://" src/ --include="*.ts" --include="*.tsx"

# Find hardcoded colors
grep -rn "rgba\|#[0-9a-fA-F]\{3,8\}" src/ --include="*.ts" --include="*.tsx"

# Find hardcoded strings that should be i18n
grep -rn '"[A-Z][a-z].*"' src/ --include="*.tsx" | head -20
```

### Indicators
- API base URLs in source files
- Color values scattered across components
- Magic numbers without named constants
- Hardcoded dimensions that should be responsive
- User-facing strings not in translation files
- Test data mixed with production configuration
- Feature flag values hardcoded instead of config-driven

### Common Examples
```tsx
// Bad: hardcoded everywhere
<View style={{ backgroundColor: '#FF5722', padding: 16 }}>
  <Text style={{ color: '#FFFFFF', fontSize: 14 }}>Send Message</Text>
</View>

// Multiple screens with same hardcoded color '#FF5722'
```

### Remediation
- Centralize theme values (colors, spacing, typography)
- Use environment variables for URLs and configuration
- Create constants files for magic numbers
- Set up i18n for user-facing strings
- Move configuration to config files or environment variables
- Use Expo Constants for app configuration

### Prevention
- Theme system established from project start
- ESLint rules for magic numbers
- Code review check: no hardcoded values in components
- Configuration documentation

---

## 7. TODO/FIXME Accumulation

### Pattern
TODO and FIXME comments accumulate without being addressed, indicating deferred work that may never be completed.

### Detection
```bash
# Count all TODOs
grep -rn "TODO\|FIXME\|HACK\|XXX\|TEMP\|WORKAROUND" src/ --include="*.ts" --include="*.tsx" | wc -l

# List with context
grep -rn "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx"

# Find oldest TODOs (by git blame)
git log --all -p -S "TODO" --follow -- src/ | head -50
```

### Indicators
- More than 20 TODOs in the codebase
- TODOs that are months or years old
- FIXMEs indicating known bugs
- HACK or WORKAROUND comments
- TODOs without associated tickets
- TODOs in critical production code

### Common Examples
```
// TODO: implement pagination (from 6 months ago)
// FIXME: crash when user sends empty message
// HACK: workaround for React Native bug #12345
// TEMP: hardcoded until API is ready
// XXX: this is terrible, needs rewrite
```

### Remediation
- Create tickets for all significant TODOs
- Remove trivial TODOs (just do the work or delete the comment)
- Prioritize FIXMEs as bugs
- Remove HACK comments after proper fix is implemented
- Set up automated TODO tracking in CI
- Review TODOs in sprint planning

### Prevention
- TODO policy: every TODO must have a ticket reference
- `// TODO(#123): description` format
- Regular TODO review (monthly)
- TODO budget: no more than X per module
- Avoid TODOs in code review — either do it now or ticket it

---

## 8. Architectural Shortcuts

### Pattern
Quick architectural decisions that work short-term but create long-term maintenance burden.

### Detection
- Review module boundaries and dependency direction
- Check for circular dependencies
- Review state management consistency
- Examine data flow patterns
- Check for proper separation of concerns

### Indicators
- Circular dependencies between modules
- God components (1000+ lines, doing too much)
- Business logic in UI components
- API calls directly in components
- No clear data flow direction
- Shared mutable state without clear ownership
- Tight coupling between unrelated features

### Common Examples
- Chat screen component handles fetching, parsing, rendering, and moderation
- API calls scattered across components instead of service layer
- State managed in deeply nested components instead of lifted up
- Direct database/service access from presentation layer
- No abstraction between business logic and UI

### Remediation
- Extract business logic into custom hooks or service modules
- Establish clear layer boundaries (UI → Hook → Service → API)
- Create module structure with explicit public APIs
- Refactor god components into smaller, focused components
- Implement proper state management patterns
- Add dependency direction rules (outer layers depend on inner, never reverse)

### Prevention
- Architecture decision records for significant decisions
- Module structure documentation
- Code review focused on architectural concerns
- Regular architecture review sessions
- Clear component responsibility guidelines

---

## 9. Debt Quantification

### Severity Levels
| Level | Description | Examples |
|-------|-------------|---------|
| **Critical** | Blocks development or causes production issues | Circular deps, security vulns, broken tests |
| **High** | Significantly impacts productivity or quality | Missing tests on core logic, inconsistent patterns |
| **Medium** | Creates friction but workarounds exist | Outdated deps, hardcoded values, poor docs |
| **Low** | Minor inconvenience, cosmetic | Style inconsistencies, minor TODOs |

### Tracking Template
```markdown
## Technical Debt: [Name]
- **Severity:** Critical/High/Medium/Low
- **Category:** Dependencies/Code Quality/Tests/Architecture/Config
- **Location:** file path or module
- **Impact:** [What it affects]
- **Effort to fix:** [Hours/days]
- **Ticket:** [Link to issue]
- **Discovered:** [Date]
- **Priority:** [1-5]
```

### Debt Budget
- Allocate 15–20% of sprint capacity to technical debt
- Critical debt: Fix immediately
- High debt: Fix within current quarter
- Medium debt: Fix within 6 months
- Low debt: Backlog, address opportunistically

---

## 10. Prevention Strategies

### Code Review Checklist
- [ ] No new hardcoded values
- [ ] Error handling for all async operations
- [ ] Tests for new functionality
- [ ] No new TODOs without tickets
- [ ] Follows established patterns
- [ ] No new dependencies without justification
- [ ] Types are specific (no `any`)
- [ ] No dead code introduced

### Automated Guards
- ESLint rules for common issues
- TypeScript strict mode
- CI coverage thresholds
- Dependency vulnerability scanning
- Bundle size budgets
- TODO tracking in CI

### Team Practices
- Boy scout rule: leave code better than you found it
- Refactoring Friday: dedicated time for debt reduction
- Architecture review: quarterly review of patterns
- Knowledge sharing: document patterns and decisions
- Regular audits: use the audit checklist monthly

### Debt Review Cadence
| Activity | Frequency |
|----------|-----------|
| TODO cleanup | Monthly |
| Dependency updates | Biweekly |
| Test coverage review | Monthly |
| Architecture review | Quarterly |
| Full codebase audit | Quarterly |
| Documentation review | Quarterly |
