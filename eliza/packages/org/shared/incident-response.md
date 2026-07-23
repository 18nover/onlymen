# Incident Response

## Severity Levels

| Level | Description | Response Time | Resolution Target | Examples |
|-------|-------------|---------------|-------------------|----------|
| Sev1 | Complete outage or data breach | 15 minutes | 2 hours | Server down, security breach, data loss |
| Sev2 | Major feature broken | 1 hour | 8 hours | Login broken, posting fails, DMs down |
| Sev3 | Minor feature broken | 4 hours | 24 hours | Notification delay, UI glitch, slow loading |
| Sev4 | Cosmetic or low-impact | 24 hours | 1 sprint | Typo, minor visual bug, edge case |

## Response Process

### Detection
- Automated monitoring alerts (Devon)
- User reports (Penelope triages)
- Agent discovery during routine work

### Triage (Andrew)
1. Determine severity level
2. Assign incident commander (usually Andrew)
3. Assemble response team
4. Create incident channel

### Containment (Devon + Seth)
1. Identify root cause
2. Implement immediate fix or workaround
3. Verify fix in staging
4. Deploy to production
5. Monitor for regression

### Communication
- **Internal:** Andrew updates all agents via `ORG_INCIDENT` event
- **External:** Penelope updates users if user-facing
- **Status page:** Devon updates status.onlymen.com

### Resolution
1. Fix confirmed working in production
2. Monitoring confirms no regression
3. Andrew declares incident resolved
4. Penelope writes post-mortem

### Post-Mortem (Penelope + Andrew)
Within 48 hours of resolution:
1. Timeline of events
2. Root cause analysis
3. Impact assessment
4. Action items to prevent recurrence
5. Lessons learned

## Incident Roles

| Role | Agent | Responsibilities |
|------|-------|-----------------|
| Incident Commander | Andrew | Decision making, coordination, communication |
| Technical Lead | Devon | Implementation of fix, infrastructure |
| Security Lead | Seth | Security implications, data protection |
| Communications | Penelope | User-facing updates, documentation |
| Subject Expert | Domain agent | Domain-specific investigation |

## Escalation Matrix

```
User Report → Penelope triages → Andrew assigns severity
    ↓
Sev3/Sev4 → Domain agent fixes → Quinn verifies → Andrew closes
    ↓
Sev1/Sev2 → Andrew assembles team → Devon contains → Seth reviews → Penelope documents
```
