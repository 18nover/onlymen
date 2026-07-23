# Definition of Done

## For a Task

A task is "done" when ALL of the following are true:

### Code Quality
- [ ] Code compiles without errors
- [ ] TypeScript strict mode passes
- [ ] Biome lint passes with no errors
- [ ] No new warnings introduced
- [ ] Follows coding standards (naming, structure, comments)
- [ ] No `any` types introduced without justification

### Testing
- [ ] Unit tests written and passing
- [ ] Integration tests written (if applicable)
- [ ] Edge cases covered (null, empty, errors, concurrent)
- [ ] No mocks for external services in integration tests
- [ ] Coverage meets minimum thresholds

### Security
- [ ] Seth has reviewed security implications
- [ ] No hardcoded secrets
- [ ] Input validation at all runtime boundaries
- [ ] OWASP Mobile Top 10 checked
- [ ] No new dependencies without security audit

### Accessibility
- [ ] Screen reader labels on all interactive elements
- [ ] Keyboard navigation works (web)
- [ ] Dynamic Type / font scaling works
- [ ] High contrast mode supported
- [ ] Tested with VoiceOver/TalkBack

### Documentation
- [ ] Code comments explain "why" (not "what")
- [ ] API changes documented
- [ ] README updated (if structural change)
- [ ] ADR written (if architectural decision)

### Performance
- [ ] No regressions in bundle size
- [ ] No new memory leaks
- [ ] Startup time unaffected
- [ ] Animations run at 60fps
- [ ] Network requests have timeouts

### Review
- [ ] Domain agent has reviewed
- [ ] All review comments addressed
- [ ] No unresolved discussions
- [ ] Andrew has approved (for architectural changes)

### Evidence
- [ ] Screenshots/video for UI changes
- [ ] Test results attached
- [ ] Performance metrics attached (if applicable)
- [ ] Logs for backend changes

## For a PR

A PR is "done" when:
1. All task-level DoD items are complete
2. Branch is synced with `develop` (rebase, no merge commits)
3. CI passes (lint, typecheck, test)
4. Reviewer has approved
5. No merge conflicts
6. Commit messages follow conventional format

## For a Release

A release is "done" when:
1. All PRs in the release meet PR DoD
2. E2E tests pass on all platforms
3. Seth has signed off on security
4. Quinn has signed off on QA
5. Penelope has updated release notes
6. Andrew has approved the release
7. Changelog is complete
