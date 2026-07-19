# Audit Checklist — Echo Knowledge Base

## How to Use This Checklist

Run audits regularly (weekly for security, monthly for full audit). Check items off, note findings, and track remediation. Each section includes what to check, tools to use, and remediation guidance.

---

## 1. Dependencies

### 1.1 Vulnerability Scanning
- [ ] Run `npm audit` — zero critical/high vulnerabilities
- [ ] Check `npm audit --json` for full report with severity levels
- [ ] Review transitive dependency vulnerabilities
- [ ] Verify audit fixes don't break functionality (`npm audit fix --dry-run`)
- [ ] Check for known CVEs in production dependencies
- [ ] Review Expo SDK security advisories
- [ ] Check React Native and React vulnerability disclosures

**Tools:** `npm audit`, `yarn audit`, Snyk (`snyk test`), `npx audit-ci`

**Remediation:**
- Critical: Fix immediately, same sprint
- High: Fix within 1 week
- Medium: Fix within current quarter
- Low: Track and schedule for upcoming sprints

### 1.2 Outdated Dependencies
- [ ] Run `npm outdated` — list all outdated packages
- [ ] Identify packages with major version gaps
- [ ] Check for deprecated packages (npm shows deprecation warnings)
- [ ] Review Expo SDK version compatibility matrix
- [ ] Check React Native version alignment with Expo SDK
- [ ] Review TypeScript version and compatibility
- [ ] Check for abandoned packages (no commits in 6+ months)

**Tools:** `npm outdated`, `npx npm-check-updates`, `depcheck`

**Remediation:**
- Patch/minor: Update regularly, test, merge
- Major: Plan migration, create ticket, test thoroughly
- Deprecated: Find replacement, plan migration
- Abandoned: Evaluate alternatives, fork if critical

### 1.3 Unused Dependencies
- [ ] Run `npx depcheck` — identify unused packages
- [ ] Check for packages in package.json not imported anywhere
- [ ] Verify dev dependencies are actually used in build/test
- [ ] Check for duplicate functionality across packages
- [ ] Review if all Babel/TypeScript plugins are needed
- [ ] Check for unused Expo modules imported but not used

**Tools:** `npx depcheck`, manual grep for imports

**Remediation:**
- Remove unused dependencies and verify build passes
- Remove unused devDependencies after confirming no script references
- Consolidate packages with overlapping functionality

### 1.4 License Compliance
- [ ] Run `npx license-checker` — all licenses are compatible
- [ ] No GPL/AGPL in production dependencies (unless intentional)
- [ ] Review commercial license requirements
- [ ] Check for missing license fields in package.json
- [ ] Verify license compatibility with project license
- [ ] Document any non-standard license obligations

**Tools:** `npx license-checker`, `npx license-checker --summary`

---

## 2. Code Quality

### 2.1 Dead Code
- [ ] Run linter with unused variable detection enabled
- [ ] Check for commented-out code blocks (remove or document)
- [ ] Identify unreachable code paths
- [ ] Check for unused exports across modules
- [ ] Remove unused files (verify no dynamic imports reference them)
- [ ] Check for unused React components
- [ ] Verify no unused styles or assets

**Tools:** ESLint (`no-unused-vars`, `no-unreachable`), VS Code "Find Unused Imports"

**Remediation:**
- Delete dead code — version control preserves history
- If code is feature-flagged, verify flag is still planned for use
- Remove unused assets from bundle

### 2.2 Complexity
- [ ] Check cyclomatic complexity (max 10 per function)
- [ ] Check function length (max 50 lines ideal, 100 max)
- [ ] Check file length (max 300 lines ideal, 500 max)
- [ ] Check nesting depth (max 3–4 levels)
- [ ] Check number of parameters per function (max 4 ideal, 6 max)
- [ ] Check component file count (components > 300 lines need splitting)
- [ ] Review large switch/if-else chains for refactor opportunities

**Tools:** ESLint complexity rules, `eslint-plugin-sonarjs`

**Remediation:**
- Extract helper functions for complex logic
- Use early returns to reduce nesting
- Split large components into smaller, focused components
- Consider strategy pattern for complex conditionals

### 2.3 Type Safety
- [ ] TypeScript strict mode enabled (`strict: true` in tsconfig)
- [ ] No `any` types in source code (search for `: any` and `as any`)
- [ ] All component props are typed
- [ ] All API response types are defined
- [ ] No type assertions that bypass safety (`as unknown as`)
- [ ] Function return types are explicit on exported functions
- [ ] No `// @ts-ignore` or `// @ts-expect-error` without justification

**Tools:** TypeScript compiler, ESLint (`@typescript-eslint/no-explicit-any`)

**Remediation:**
- Replace `any` with proper types or `unknown` with type guards
- Define interfaces for API responses
- Use generics for reusable components
- Document intentional type overrides with `// @ts-expect-error` and reason

### 2.4 Linting & Formatting
- [ ] ESLint passes with zero warnings (or documented exceptions)
- [ ] Prettier formatting consistent across codebase
- [ ] No suppressed warnings without justification
- [ ] Custom lint rules enforce project conventions
- [ ] Import ordering consistent (absolute vs relative)
- [ ] No unused ESLint disable comments

**Tools:** ESLint, Prettier, `lint-staged`, Husky pre-commit hooks

---

## 3. Tests

### 3.1 Coverage
- [ ] Overall code coverage ≥ 70%
- [ ] Critical paths coverage ≥ 80%
- [ ] New code coverage ≥ 80%
- [ ] No coverage decreased from last audit
- [ ] Branch coverage reported (not just line coverage)
- [ ] Coverage reports generated in CI
- [ ] Coverage thresholds enforced in CI (fail build below threshold)

**Tools:** Jest `--coverage`, `nyc`, Codecov/Coveralls

### 3.2 Test Quality
- [ ] Tests are independent (no shared state between tests)
- [ ] Tests are deterministic (no flaky tests)
- [ ] Each test tests one thing (single assertion ideal)
- [ ] Test names are descriptive (should describe behavior)
- [ ] Tests cover happy path AND error paths
- [ ] Edge cases are tested (null, empty, boundary values)
- [ ] Async operations are properly awaited
- [ ] No tests that depend on network, filesystem, or external services

**Remediation for flaky tests:**
- Mock external dependencies
- Use fake timers for time-dependent tests
- Isolate test data setup/teardown

### 3.3 Mocks & Fakes
- [ ] External API calls are mocked
- [ ] AsyncStorage/SecureStore is mocked
- [ ] Navigation is mocked in component tests
- [ ] Platform-specific code has platform mocks
- [ ] Mocks are minimal (mock only what's needed)
- [ ] No overly broad mocks that hide real bugs
- [ ] Mock data is realistic and representative

**Remediation:**
- Prefer dependency injection over module mocking
- Use `jest.fn()` for specific function mocks
- Create shared mock factories for common patterns

### 3.4 Test Architecture
- [ ] Test file co-located with source file (or consistent convention)
- [ ] Test utilities and helpers are shared
- [ ] Snapshot tests are used sparingly and reviewed
- [ ] Integration tests cover critical user flows
- [ ] E2E tests cover smoke test and critical paths
- [ ] Test setup/teardown is clean and isolated

---

## 4. Documentation

### 4.1 READMEs
- [ ] Root README has: project overview, setup instructions, scripts, contributing guide
- [ ] Package/module READMEs explain purpose and usage
- [ ] Setup instructions are accurate and tested
- [ ] Environment variables are documented
- [ ] Build/deploy instructions are current
- [ ] Badge links (CI status, coverage, license) work

### 4.2 API Documentation
- [ ] All public APIs have documentation
- [ ] Request/response examples are provided
- [ ] Error responses are documented
- [ ] Authentication requirements are documented
- [ ] Rate limiting is documented
- [ ] API versioning strategy is documented
- [ ] OpenAPI/Swagger spec is current (if applicable)

### 4.3 Architecture Decision Records (ADRs)
- [ ] Key architectural decisions are documented as ADRs
- [ ] ADRs include: context, decision, consequences
- [ ] Superseded ADRs are marked but preserved
- [ ] ADR template exists and is followed
- [ ] Major technology choices have corresponding ADRs

### 4.4 Code Documentation
- [ ] Complex algorithms are commented
- [ ] Non-obvious business logic has explanations
- [ ] Public module APIs have JSDoc/TSDoc
- [ ] Type definitions have explanatory comments where needed
- [ ] No outdated comments that contradict code

### 4.5 Changelog
- [ ] CHANGELOG.md follows Keep a Changelog format
- [ ] Entries are added for every notable change
- [ ] Version numbers follow semantic versioning
- [ ] Breaking changes are clearly marked

---

## 5. Security

### 5.1 Secrets Management
- [ ] No secrets in source code (search for API keys, tokens, passwords)
- [ ] No secrets in git history (run `git log -p | grep -i "key\|secret\|password\|token"`)
- [ ] `.env` files are in `.gitignore`
- [ ] `.env.example` exists with placeholder values
- [ ] Secrets are stored in environment variables or secure vault
- [ ] Build configurations don't embed secrets
- [ ] No hardcoded URLs with embedded credentials

**Tools:** `git-secrets`, `trufflehog`, `gitleaks`, `detect-secrets`

**Remediation:**
- Rotate any exposed secrets immediately
- Add pre-commit hooks to prevent future leaks
- Use Expo secure store for mobile secrets
- Use server-side environment variables for API secrets

### 5.2 Authentication & Authorization
- [ ] Authentication uses industry-standard protocols (OAuth 2.0, JWT)
- [ ] Tokens have appropriate expiration times
- [ ] Refresh token rotation is implemented
- [ ] Password requirements are enforced (if applicable)
- [ ] Multi-factor authentication is supported
- [ ] Session management is secure
- [ ] Authorization checks on all protected endpoints/routes
- [ ] Role-based access control is properly enforced
- [ ] No IDOR vulnerabilities (user can't access other users' data by ID)

### 5.3 Input Validation
- [ ] All user input is validated on the client
- [ ] All user input is validated on the server (never trust client)
- [ ] SQL queries use parameterized queries (no string concatenation)
- [ ] XSS prevention: output encoding, Content Security Policy
- [ ] File upload validation (type, size, content)
- [ ] URL parameters are validated and sanitized
- [ ] Deep link parameters are validated

### 5.4 Network Security
- [ ] All API calls use HTTPS
- [ ] Certificate pinning implemented (if applicable)
- [ ] Network security configuration is proper (iOS ATS, Android network config)
- [ ] No sensitive data in URL query parameters
- [ ] CORS is properly configured
- [ ] API rate limiting is implemented

### 5.5 Data Security
- [ ] Sensitive data is encrypted at rest
- [ ] Sensitive data is encrypted in transit
- [ ] Personal data handling complies with privacy regulations
- [ ] Data retention policies are implemented
- [ ] Secure deletion of sensitive data
- [ ] No sensitive data in logs or analytics
- [ ] PII is not stored in plaintext

---

## 6. Configuration

### 6.1 Environment Configuration
- [ ] Environment variables are documented
- [ ] Required variables have validation at startup
- [ ] Default values are sensible (or fail fast if missing)
- [ ] No environment-specific hardcoding in source
- [ ] Configuration differs appropriately per environment (dev/staging/prod)
- [ ] Feature flags are configurable per environment
- [ ] Configuration is version-controlled (except secrets)

### 6.2 Build Configuration
- [ ] Build profiles are consistent (dev, staging, production)
- [ ] Source maps are disabled in production
- [ ] Minification is enabled in production
- [ ] Bundle analysis is performed regularly
- [ ] Platform-specific configurations are correct
- [ ] App version and build number are managed consistently
- [ ] Native module configurations are correct

### 6.3 TypeScript Configuration
- [ ] `strict: true` enabled
- [ ] `noUnusedLocals` and `noUnusedParameters` enabled
- [ ] Path aliases are configured and consistent
- [ ] Target and module settings are appropriate
- [ ] `include`/`exclude` patterns are correct
- [ ] Project references configured for monorepo (if applicable)

### 6.4 Linting Configuration
- [ ] ESLint config extends appropriate base configs
- [ ] Custom rules enforce project conventions
- [ ] Prettier config is consistent with ESLint
- [ ] Ignore patterns cover generated files
- [ ] Config is shared across packages (monorepo)

---

## 7. Performance

### 7.1 React Native Performance
- [ ] No unnecessary re-renders (use React DevTools Profiler)
- [ ] Components use `React.memo` appropriately
- [ ] Expensive computations use `useMemo`/`useCallback`
- [ ] Large lists use `FlatList` or `FlashList` (not ScrollView)
- [ ] Images are optimized and properly sized
- [ ] No synchronous storage calls on main thread
- [ ] Animated values use `useNativeDriver: true`
- [ ] No memory leaks (cleanup in useEffect returns)

### 7.2 Bundle Performance
- [ ] Bundle size is tracked and within budget
- [ ] Code splitting/lazy loading is used for non-critical screens
- [ ] Tree shaking is effective (no large unused imports)
- [ ] Images are compressed and use appropriate formats
- [ ] Fonts are subsetted if custom
- [ ] No duplicate dependencies bloating bundle

**Tools:** `npx react-native-bundle-visualizer`, Metro bundle analysis

### 7.3 Network Performance
- [ ] API responses are cached appropriately
- [ ] Images use CDN with proper caching headers
- [ ] Pagination is implemented for large datasets
- [ ] Debouncing is used for search/input endpoints
- [ ] Connection timeouts are configured
- [ ] Retry logic with exponential backoff
- [ ] Request deduplication for concurrent identical requests

### 7.4 Memory & Resource Management
- [ ] No memory leaks (subscriptions, timers cleaned up)
- [ ] Large data structures are released when no longer needed
- [ ] Image caching has size limits
- [ ] WebSocket connections are properly managed
- [ ] Background tasks are minimized
- [ ] Battery usage is reasonable (location, polling frequency)

### 7.5 Startup Performance
- [ ] App cold start time < 3 seconds
- [ ] Critical path is prioritized in loading
- [ ] Splash screen is meaningful (not just a delay)
- [ ] Lazy initialization for non-critical services
- [ ] No blocking operations during startup

---

## Audit Schedule

| Audit Type | Frequency | Owner | Timebox |
|------------|-----------|-------|---------|
| Security (vulnerabilities) | Weekly | Echo | 30 min |
| Dependencies (updates) | Biweekly | Echo | 1 hour |
| Full code audit | Monthly | Echo + team | 2–4 hours |
| Performance audit | Monthly | Nova | 2 hours |
| Documentation review | Quarterly | Atlas | 1 hour |
| License compliance | Quarterly | Echo | 30 min |

## Tracking & Remediation

- Create issues for all findings with severity and due date
- Critical: Fix within 24 hours
- High: Fix within current sprint
- Medium: Fix within current quarter
- Low: Backlog, address opportunistically
- Track audit completion and findings in project management tool
- Review audit trends monthly to identify systemic issues
