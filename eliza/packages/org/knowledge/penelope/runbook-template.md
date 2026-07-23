# Runbook Template

## Overview

Standard runbook template for incident response, including symptoms, diagnosis, remediation, and prevention procedures.

## Runbook Structure

### Header

```markdown
# Runbook: [Incident Type]

**Last Updated:** YYYY-MM-DD
**Owner:** [Team/Person]
**Severity Range:** P1-P3
**Average Resolution Time:** [X minutes/hours]
```

### Symptoms

```markdown
## Symptoms

### User-Facing Symptoms
- Users report [specific behavior]
- Error messages shown: "[exact error text]"
- [Feature] is unavailable or slow
- Users unable to [specific action]

### System Symptoms
- Alert: [Alert name] triggered in [system]
- Error rate exceeded [threshold]%
- Response time exceeded [X]ms
- [Specific metric] is abnormally high/low

### Monitoring Indicators
| Metric                    | Normal Range | Current Value | Threshold    |
|---------------------------|--------------|---------------|--------------|
| Error rate                | < 1%         | [Value]       | > 5%         |
| Response time (P95)       | < 500ms      | [Value]       | > 2000ms     |
| CPU usage                 | < 70%        | [Value]       | > 90%        |
| Memory usage              | < 80%        | [Value]       | > 95%        |
| Database connections      | < 50         | [Value]       | > 80         |
```

### Impact Assessment

```markdown
## Impact Assessment

### User Impact
- **Number of users affected:** [X]
- **Features impacted:** [List]
- **Severity of impact:** Complete outage / Degraded / Minor

### Business Impact
- **Revenue impact:** [Estimate]
- **SLA impact:** [Yes/No, which SLA]
- **Customer complaints:** [Number or N/A]

### Data Impact
- **Data loss:** [Yes/No, scope]
- **Data corruption:** [Yes/No, scope]
- **Data exposure:** [Yes/No, scope]
```

## Diagnosis Steps

```markdown
## Diagnosis Steps

### Step 1: Verify the Issue
\`\`\`bash
# Check service health endpoint
curl -f https://api.example.com/health

# Verify from external monitoring
# Check: https://statuspage.example.com

# Check recent deployments
git log --oneline -10
\`\`\`

**Expected outcome:** [What you should see]
**If different:** [What it means]

### Step 2: Check Service Logs
\`\`\`bash
# Recent error logs
docker compose logs --tail=100 api | grep -i error

# Search for specific error
docker compose logs api | grep "ERROR_CODE"

# Check application logs
tail -100 /var/log/app/error.log
\`\`\`

**Look for:**
- Stack traces
- Error messages matching symptoms
- Timing correlation with incident start

### Step 3: Check Infrastructure
\`\`\`bash
# CPU and memory
docker stats api --no-stream

# Disk space
df -h

# Network connectivity
ping db-host
ping redis-host
\`\`\`

**Expected outcome:** All resources within normal ranges

### Step 4: Check Database
\`\`\`bash
# Connection count
psql -h localhost -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Slow queries
psql -h localhost -U postgres -c "
  SELECT pid, now() - pg_stat_activity.query_start AS duration, query
  FROM pg_stat_activity
  WHERE state != 'idle' AND now() - pg_stat_activity.query_start > interval '5 seconds';
"

# Locks
psql -h localhost -U postgres -c "SELECT * FROM pg_locks WHERE NOT granted;"
\`\`\`

**Expected outcome:** Connection count normal, no long-running queries

### Step 5: Check External Dependencies
\`\`\`bash
# Test external API connectivity
curl -w "@curl-format.txt" -o /dev/null -s https://external-api.com/health

# Check DNS resolution
nslookup external-api.com

# Check SSL certificate
openssl s_client -connect external-api.com:443 </dev/null 2>/dev/null | openssl x509 -noout -dates
\`\`\`
```

## Remediation Steps

```markdown
## Remediation Steps

### Scenario A: [Most Common Cause]

**Symptoms match:** [Description]
**Likelihood:** High

1. **Immediate action:**
   \`\`\`bash
   # Restart the affected service
   docker compose restart api

   # Verify recovery
   curl -f https://api.example.com/health
   \`\`\`

2. **If restart doesn't work:**
   \`\`\`bash
   # Check for resource exhaustion
   docker system prune -f

   # Restart with increased resources
   docker compose down && docker compose up -d --scale api=3
   \`\`\`

3. **Verify recovery:**
   - [ ] Health check passes
   - [ ] Error rate returns to normal
   - [ ] Users can access affected features

### Scenario B: [Secondary Cause]

**Symptoms match:** [Description]
**Likelihood:** Medium

1. **Identify root cause:**
   \`\`\`bash
   # Check database for specific issue
   psql -h localhost -U postgres -c "SELECT ..."
   \`\`\`

2. **Apply fix:**
   \`\`\`bash
   # Execute remediation
   [specific commands]
   \`\`\`

3. **Verify recovery:**
   - [ ] Specific metric returns to normal
   - [ ] No related errors in logs

### Scenario C: [Escalation Required]

**When to escalate:**
- Cannot identify root cause within 30 minutes
- Fix requires code changes
- Data integrity concerns
- Affects multiple services

**Escalation path:**
1. Notify team lead: [Contact]
2. Page on-call: [Contact]
3. Engage vendor support: [Details]
```

## Prevention

```markdown
## Prevention

### Monitoring Improvements
- [ ] Add alert for [specific metric]
- [ ] Add dashboard for [component]
- [ ] Implement canary deployment

### Process Improvements
- [ ] Update deployment checklist
- [ ] Add load testing for [scenario]
- [ ] Implement circuit breaker for [dependency]

### Code Improvements
- [ ] Add retry logic for [operation]
- [ ] Implement connection pooling
- [ ] Add rate limiting
- [ ] Improve error handling

### Documentation Improvements
- [ ] Update this runbook
- [ ] Add to onboarding documentation
- [ ] Create troubleshooting guide
```

## Escalation Contacts

```markdown
## Escalation Contacts

### Level 1: On-Call Engineer
- **Response time:** 15 minutes
- **Contact:** [PagerDuty/Slack/Phone]
- **When:** Initial response, common issues

### Level 2: Team Lead
- **Response time:** 30 minutes
- **Contact:** [Phone/Slack]
- **When:** Cannot resolve in 30 min, needs code change

### Level 3: Engineering Manager
- **Response time:** 1 hour
- **Contact:** [Phone/Slack]
- **When:** Service-wide impact, resource needs

### Level 4: CTO / VP Engineering
- **Response time:** 2 hours
- **Contact:** [Phone]
- **When:** Business-critical, data breach, legal implications

### External Contacts
| Vendor           | Contact                | Account ID    |
|------------------|------------------------|---------------|
| AWS Support      | [Phone/Portal]         | [Account #]   |
| Database vendor  | [Phone/Portal]         | [Contract #]  |
| CDN provider     | [Phone/Portal]         | [Account #]   |
```

## Estimated Resolution Time

```markdown
## Estimated Resolution Time

| Scenario                      | Resolution Time | Notes                     |
|-------------------------------|-----------------|---------------------------|
| Simple restart                | 5-10 minutes    | Most common               |
| Configuration change          | 15-30 minutes   | Requires testing          |
| Code fix (simple)             | 1-2 hours       | Hotfix deployment         |
| Code fix (complex)            | 4-8 hours       | Full fix + testing        |
| Data recovery                 | 2-24 hours      | Depends on scope          |
| Infrastructure migration      | 24-72 hours     | Major changes needed      |
```

## Post-Incident Checklist

```markdown
## Post-Incident Checklist

- [ ] Incident documented in this runbook
- [ ] Root cause identified
- [ ] Timeline documented
- [ ] Impact assessed
- [ ] Action items created
- [ ] Team notified of resolution
- [ ] Status page updated
- [ ] Customer communication sent (if needed)
- [ ] Post-mortem scheduled (if P0/P1)
- [ ] Monitoring improved
- [ ] Runbook updated
```

## Quick Reference

```markdown
## Quick Reference

### Key Commands
\`\`\`bash
# Health check
curl -f https://api.example.com/health

# Restart service
docker compose restart api

# Check logs
docker compose logs --tail=100 api

# Check database
psql -h localhost -U postgres -c "SELECT 1;"

# Check Redis
redis-cli ping
\`\`\`

### Key URLs
| Service     | URL                              |
|-------------|----------------------------------|
| Dashboard   | https://grafana.example.com      |
| Logs        | https://loki.example.com         |
| Traces      | https://jaeger.example.com       |
| Status      | https://status.example.com       |
| Runbooks    | https://wiki.example.com/runbooks|
```
