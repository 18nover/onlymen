# Dependency Analysis — Echo Knowledge Base

## Overview

Dependency analysis ensures the project's dependency tree is secure, up-to-date, well-licensed, and performant. Run these checks regularly and before major releases.

---

## 1. Vulnerability Scanning

### npm audit
```bash
# Basic audit
npm audit

# JSON output for CI parsing
npm audit --json

# Include dev dependencies
npm audit --omit=dev  # production only
npm audit             # all dependencies

# Fix automatically (safe fixes only)
npm audit fix

# Fix including breaking changes (use with caution)
npm audit fix --force

# Dry run to preview changes
npm audit fix --dry-run
```

### Interpreting Results
- **critical:** Exploitable vulnerability, immediate action required
- **high:** Serious vulnerability, fix within 1 week
- **moderate:** Potential vulnerability, fix within quarter
- **low:** Minimal risk, schedule for maintenance
- **info:** Informational, no action required

### Advanced Scanning
```bash
# Snyk (more comprehensive, covers more ecosystems)
npx snyk test
npx snyk test --severity-threshold=high  # only show high+

# CI integration
npx snyk test --severity-threshold=critical --json-file-output=report.json

# GitHub Advisory Database
npx audit-ci --critical  # fail CI on critical vulnerabilities
```

### Remediation Strategies
1. **Direct dependency:** Update to patched version
2. **Transitive dependency:** 
   - Check if parent has updated version
   - Use `npm overrides` to force version
   - Fork and patch if critical and no upstream fix
3. **No fix available:**
   - Document the risk
   - Implement compensating controls
   - Monitor for patch release
   - Consider alternative package

### npm Overrides (package.json)
```json
{
  "overrides": {
    "vulnerable-package": "^patched-version"
  }
}
```

---

## 2. Outdated Dependencies

### Checking for Updates
```bash
# List all outdated packages
npm outdated

# Detailed JSON output
npm outdated --json

# Update interactively
npx npm-check-updates -i

# Update specific package
npm update package-name

# Update to latest (may include breaking changes)
npx npm-check-updates -u
```

### Update Strategy

#### Semantic Versioning Quick Reference
- **Patch (x.x.Z):** Bug fixes, safe to update
- **Minor (x.Y.0):** New features, backward compatible
- **Major (X.0.0):** Breaking changes, requires migration

#### Update Categories

**Safe Updates (patch versions):**
- Update immediately, run tests, merge
- Example: `1.2.3` → `1.2.4`

**Moderate Updates (minor versions):**
- Update weekly, review changelog, test thoroughly
- Example: `1.2.3` → `1.3.0`

**Major Updates:**
- Plan migration, create dedicated ticket
- Review breaking changes documentation
- Update in isolated branch, test extensively
- Example: `1.2.3` → `2.0.0`

**Critical Framework Updates (React Native, Expo SDK):**
- Follow official migration guide
- Update in dedicated sprint/iteration
- Test on both platforms thoroughly
- May require coordinated updates of multiple packages

### Changelog Review Process
1. Read the changelog for the new version
2. Search for: breaking changes, deprecations, security fixes
3. Check GitHub issues for known problems
4. Review peer dependency requirements
5. Check compatibility with other project dependencies

---

## 3. License Checking

### Tools and Commands
```bash
# List all licenses
npx license-checker

# Summary view
npx license-checker --summary

# Fail on specific licenses
npx license-checker --failOn "GPL;AGPL"

# Output as JSON
npx license-checker --json --output licenses.json

# Check for unknown licenses
npx license-checker --unknown
```

### License Compatibility Matrix

| License | Commercial Use | Modification | Distribution | Patents | Risk |
|---------|---------------|--------------|--------------|---------|------|
| MIT | Yes | Yes | Yes | Yes | Low |
| Apache 2.0 | Yes | Yes | Yes | Yes | Low |
| BSD 2-Clause | Yes | Yes | Yes | No | Low |
| BSD 3-Clause | Yes | Yes | Yes | No | Low |
| ISC | Yes | Yes | Yes | Yes | Low |
| MPL 2.0 | Yes | Yes | Yes | Yes | Medium |
| LGPL | Yes | Yes | Yes* | Yes | Medium |
| GPL 2.0 | Yes | Yes | Yes* | No | High |
| GPL 3.0 | Yes | Yes | Yes* | Yes | High |
| AGPL | Yes | Yes | Yes* | Yes | Very High |

*With conditions (source code disclosure, copyleft)

### License Policy
- **Allowed:** MIT, Apache 2.0, BSD, ISC, 0BSD, Unlicense
- **Review Required:** MPL 2.0, LGPL (consult legal)
- **Prohibited:** GPL 2.0, GPL 3.0, AGPL (without legal approval)

### Handling License Issues
1. Find alternative package with compatible license
2. Contact maintainer to discuss license change
3. Implement functionality directly (avoid the dependency)
4. Fork and relicense (if allowed by license terms)
5. Get legal approval for exception (document decision)

---

## 4. Duplicate Detection

### Finding Duplicates
```bash
# Find duplicate packages in node_modules
npx depcheck

# Check for duplicate React / React Native
npm ls react
npm ls react-native

# Bundle analysis for duplicates
npx react-native-bundle-visualizer

# Yarn (if using Yarn)
yarn why package-name
```

### Common Duplicate Issues
- **Multiple React instances:** Causes hooks errors, memory issues
- **Multiple React Native instances:** Build failures, runtime errors
- **Duplicate utility libraries:** Bundle bloat
- **Conflicting polyfills:** Runtime errors

### Resolving Duplicates
1. **Identify source:** Use `npm ls` to trace where duplicates come from
2. **Deduplicate:** Run `npm dedupe` or `npx yarn-deduplicate`
3. **Force resolution:** Use npm overrides or resolutions
4. **Replace dependency:** Choose packages with fewer transitive dependencies
5. **Fork and fix:** Last resort for critical duplicates

### Resolution Patterns (package.json)
```json
{
  "resolutions": {
    "react": "^18.3.1",
    "react-native": "^0.76.0"
  }
}
```

---

## 5. Bundle Impact Analysis

### Measuring Bundle Size
```bash
# Generate bundle report
npx react-native-bundle-visualizer

# Metro bundle analysis
npx metro-inspector-proxy

# Analyze what's in the bundle
npx source-map-explorer main.jsbundle --source-map main.jsbundle.map
```

### What to Look For
- Unexpected large packages in bundle
- Duplicate code across packages
- Unused code from imported packages
- Large assets (images, fonts, data)
- Development-only code in production bundle

### Bundle Size Budgets
| Category | Target | Max |
|----------|--------|-----|
| JavaScript bundle | < 1 MB | 2 MB |
| Main bundle | < 500 KB | 1 MB |
| Per-screen chunk | < 100 KB | 200 KB |
| Images (total) | < 2 MB | 5 MB |
| Fonts | < 200 KB | 500 KB |

### Reducing Bundle Impact
1. **Tree shaking:** Use ES module imports, avoid barrel exports
2. **Code splitting:** Lazy-load screens and features
3. **Selective imports:** Import only what's needed
   ```js
   // Bad
   import _ from 'lodash';
   // Good
   import debounce from 'lodash/debounce';
   ```
4. **Alternative packages:** Choose smaller alternatives
   - `lodash` → `lodash-es` or individual functions
   - `moment` → `dayjs` or `date-fns`
   - `axios` → native `fetch`
5. **Asset optimization:** Compress images, subset fonts
6. **Dynamic imports:** Load features on demand

---

## 6. Update Strategies

### Weekly Maintenance
```bash
# Check for security updates
npm audit

# Check for patch updates
npm outdated | grep "patch"

# Update patch versions
npx npm-check-updates --target patch -u && npm install
```

### Monthly Maintenance
```bash
# Full outdated check
npm outdated

# Update minor versions
npx npm-check-updates --target minor -u && npm install

# Run full test suite
npm test

# Check bundle size
npx react-native-bundle-visualizer
```

### Major Version Migration Process
1. **Research:** Read migration guide, changelog, and community feedback
2. **Branch:** Create dedicated migration branch
3. **Update:** Update package and all related packages
4. **Fix:** Address breaking changes
5. **Test:** Run full test suite + manual testing on both platforms
6. **Review:** Code review with attention to edge cases
7. **Merge:** Merge after CI passes and review approval
8. **Monitor:** Watch error tracking for regressions

### Expo SDK Upgrade Process
1. Check Expo SDK changelog for breaking changes
2. Run `npx expo install --fix` to update compatible packages
3. Update `app.json`/`app.config.js` if needed
4. Update any deprecated API usage
5. Test on both platforms (iOS simulator, Android emulator)
6. Test development build and production build
7. Verify OTA updates work correctly
8. Update documentation

---

## 7. Risk Assessment

### Risk Scoring Model

For each dependency, assess:

| Factor | Score (1–5) | Weight |
|--------|-------------|--------|
| Maintenance activity | | 0.2 |
| Community adoption | | 0.15 |
| Vulnerability history | | 0.2 |
| License risk | | 0.1 |
| Bundle size impact | | 0.15 |
| Criticality to app | | 0.2 |

**Risk Score** = Σ (factor score × weight)

- **1.0–2.0:** Low risk — normal updates
- **2.1–3.5:** Medium risk — monitor closely
- **3.6–5.0:** High risk — plan alternatives

### Risk Indicators (Red Flags)
- Package hasn't been updated in 12+ months
- Maintainer has abandoned the project
- Known security issues without patches
- Very large bundle size for functionality provided
- Heavy native code dependencies (build complexity)
- Single maintainer with no bus factor mitigation
- GPL/AGPL license in production dependency

### High-Risk Dependencies to Monitor
- **React Native itself:** Track version compatibility with Expo SDK
- **React Navigation:** Major versions can require significant migration
- **Expo modules:** Tightly coupled to SDK version
- **Native modules:** May need updates for new OS versions
- **Authentication libraries:** Security-critical, must be maintained

### Decision Framework for Risky Dependencies
```
Is there a maintained alternative?
├── Yes → Evaluate migration cost
│   ├── Low cost → Migrate
│   └── High cost → Monitor + mitigate
└── No → Can we implement the functionality ourselves?
    ├── Yes → Plan implementation
    └── No → Accept risk, document, monitor actively
```

---

## 8. Automated Checks

### CI Pipeline Integration
```yaml
# Example GitHub Actions step
- name: Security Audit
  run: |
    npm audit --audit-level=critical
    npx audit-ci --critical

- name: License Check
  run: npx license-checker --failOn "GPL;AGPL"

- name: Bundle Size Check
  run: |
    npx react-native-bundle-visualizer
    # Custom script to check against budget
```

### Pre-commit Hooks
```json
// .husky/pre-commit
{
  "hooks": {
    "pre-commit": "npx lint-staged",
    "commit-msg": "npx commitlint --edit"
  }
}
```

### Monitoring Setup
- Dependabot or Renovate for automated PR creation
- Snyk for continuous vulnerability monitoring
- Codecov for coverage tracking
- Custom scripts for bundle size tracking

---

## 9. Reporting Template

### Monthly Dependency Report
```
## Dependency Health Report — [Month Year]

### Summary
- Total dependencies: [X]
- Outdated: [X] ([Y]%)
- Vulnerabilities: [critical: X, high: X, medium: X]
- License issues: [X]

### Actions Taken
- Updated [X] packages
- Fixed [X] vulnerabilities
- Removed [X] unused dependencies

### Risks
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

### Recommendations
1. [Recommendation 1]
2. [Recommendation 2]
```
