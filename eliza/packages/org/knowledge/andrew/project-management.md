# Project Management — Andrew Knowledge Base

## Sprint Planning Methodology

### Sprint Structure
- **Sprint duration:** 2 weeks (10 business days)
- **Sprint start:** Monday morning, kickoff meeting ≤ 15 min
- **Sprint end:** Friday afternoon, demo + retro
- **Planning:** First Monday of sprint, 60–90 min session
- **Buffer:** Reserve 10–15% of sprint capacity for unplanned work

### Sprint Planning Session
1. Review previous sprint velocity and carryover items
2. Groomed backlog items presented in priority order
3. Team estimates using planning poker (Fibonacci: 1, 2, 3, 5, 8, 13, 21)
4. Commit to sprint goal — one clear statement
5. Break stories into tasks (≤ 8 hours each)
6. Identify dependencies and risks before committing

### Definition of Ready (DoR)
- [ ] User story has clear acceptance criteria
- [ ] Dependencies identified and blockers resolved
- [ ] Design assets available (if UI work)
- [ ] Estimated by the team
- [ ] API contracts defined (if cross-service)
- [ ] Testing strategy agreed upon

### Definition of Done (DoD)
- [ ] Code complete and passing CI
- [ ] Unit tests written and passing (≥ 80% coverage for new code)
- [ ] Integration tests passing
- [ ] Code reviewed and approved by ≥ 1 reviewer
- [ ] Documentation updated (README, API docs, ADRs if needed)
- [ ] No regressions in existing functionality
- [ ] Product owner accepted
- [ ] Deployed to staging environment

## Task Estimation

### Story Points vs Hours
- **Story points** for user stories (relative sizing)
- **Hours** for technical tasks and spikes
- Story points map to rough hour ranges: 1pt ≈ 2–4h, 2pt ≈ 4–8h, 3pt ≈ 8–16h, 5pt ≈ 16–24h

### Estimation Guidelines
- Estimate as a team, not individually
- Consider: complexity, uncertainty, effort
- When uncertain, timebox a spike (max 4 hours) to reduce unknowns
- If a story is > 13 points, break it down further
- Add explicit testing estimate — don't assume it's included

### Planning Poker Rules
1. Each estimator independently selects a card
2. Reveal simultaneously
3. If spread is large (e.g., 3 vs 13), discuss assumptions
4. Re-estimate after discussion
5. Continue until consensus or narrow range (±1 point)

## Velocity Tracking

### Measurement
- Track **committed vs completed** story points per sprint
- Calculate rolling average over last 5 sprints
- Velocity is a team metric, never an individual metric
- Track separately: new work, bug fixes, tech debt, unplanned

### Velocity Stability Indicators
- **Stable:** Variance < 15% sprint to sprint
- **Unstable:** Variance > 25% — investigate root causes
- Common causes of variance: scope changes mid-sprint, external interruptions, estimation inconsistency, team composition changes

### Using Velocity
- Plan sprint commitments at 85–90% of average velocity
- Forecast release dates using velocity × remaining points
- Never use velocity for performance evaluation
- Re-baseline after major team changes (new members, reorgs)

## Burndown Charts

### Sprint Burndown
- X-axis: sprint days (1–10)
- Y-axis: remaining story points
- Ideal line: straight diagonal from total to zero
- Actual line: daily remaining work
- Update daily at standup

### Reading Burndown Patterns
- **Flat horizontal:** Work blocked or not started
- **Rising line:** Scope added after sprint start
- **Late drop:** Work completed in batches, not incrementally
- **Early steep drop:** Under-estimation likely
- **Consistent diagonal:** Healthy sprint

### Release Burndown
- Tracks remaining points across multiple sprints
- Use for roadmap forecasting
- Update after each sprint completion
- Account for known velocity changes (holidays, PTO, onboarding)

## Retrospectives

### Format: Start / Stop / Continue / Actions
1. **Start:** What should we begin doing?
2. **Stop:** What's not working that we should drop?
3. **Continue:** What's working well and should persist?
4. **Actions:** Specific, assigned, time-bound improvements (max 3)

### Retro Facilitation
- Use anonymous input gathering (sticky notes, digital tools)
- Timebox discussion: 3 min per topic
- Focus on process, not people
- Track action items from previous retro at start of each session
- Rotate facilitator role

### Anti-Patterns
- Blame game → redirect to systems thinking
- Action item overload → limit to 3 per retro
- No follow-through → carry action items as sprint tasks
- Skip retros → never skip, even in "good" sprints
- Same issues recurring → escalate to management or structural change

## Stakeholder Communication

### Communication Cadence
| Audience | Frequency | Format | Content |
|----------|-----------|--------|---------|
| Engineering team | Daily | Standup (15 min) | Blockers, progress, plans |
| Product owner | Daily | Async chat | Sprint health, decisions needed |
| Leadership | Weekly | Written update | Velocity, risks, milestones |
| Cross-functional | Biweekly | Demo | Working software, feedback |
| Full org | Monthly | All-hands | Roadmap progress, wins, learnings |

### Status Report Template
```
## Sprint [N] Status — [Date]

### Sprint Goal
[One sentence]

### Progress
- Completed: [X] points ([Y]%)
- In Progress: [Z] points
- Blocked: [W] points (reason)

### Risks / Blockers
- [Risk 1]: Mitigation plan

### Next Week Focus
- [Priority 1]
- [Priority 2]

### Key Decisions Needed
- [Decision needed from whom]
```

### Escalation Path
1. Team level: discuss in standup → team lead
2. Team lead: escalate to engineering manager
3. Engineering manager: escalate to VP/Director
4. Emergency: direct escalation with context document

## Risk Management

### Risk Categories
- **Technical:** Unknown complexity, tech debt, integration issues
- **Resource:** Team availability, skill gaps, competing priorities
- **Scope:** Unclear requirements, scope creep, changing priorities
- **External:** Third-party dependencies, platform changes, deadlines

### Risk Assessment Matrix
| | Low Impact | High Impact |
|---|---|---|
| **High Likelihood** | Monitor | Act immediately |
| **Low Likelihood** | Accept | Mitigate plan |

### Risk Register Format
```
## Risk: [Name]
- **Category:** Technical/Resource/Scope/External
- **Likelihood:** High/Medium/Low
- **Impact:** High/Medium/Low
- **Mitigation:** [Action plan]
- **Owner:** [Person responsible]
- **Status:** Open/Mitigating/Closed
```

### Proactive Risk Management
- Identify top 3 risks at sprint planning
- Review risk register weekly
- Add risks as backlog items if mitigation requires engineering work
- Post-mortem after materialized risks → update process

## Ceremonies Quick Reference

| Ceremony | Duration | Frequency | Participants |
|----------|----------|-----------|-------------|
| Standup | 15 min | Daily | Engineering team |
| Sprint Planning | 60–90 min | Biweekly | Team + PO |
| Sprint Review/Demo | 30 min | Biweekly | Team + stakeholders |
| Retrospective | 45 min | Biweekly | Team only |
| Backlog Grooming | 30–45 min | Weekly | Team + PO |
| 1:1s | 30 min | Weekly | Manager + report |

## Tools and Integrations

### Recommended Stack
- **Project tracking:** Linear or GitHub Projects
- **Documentation:** Notion or Confluence
- **Communication:** Slack with dedicated sprint channel
- **Code:** GitHub with branch protection rules
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry + Datadog/Grafana

### Integration Principles
- Single source of truth for backlog (one tool)
- Automate status reporting where possible
- Link PRs to issues/tickets
- Auto-close tickets on merge to main
- Dashboard for sprint health visible to all
