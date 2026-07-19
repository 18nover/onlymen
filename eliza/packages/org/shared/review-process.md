# Review Process

## Review Matrix

| Change Type | Required Reviewers | Optional Reviewers |
|-------------|-------------------|-------------------|
| Frontend UI | Nova, Pixel | Pulse, Compass |
| Backend API | Forge | Sentinel, Circuit |
| AT Protocol | Forge, Echo | Atlas |
| Security-related | Sentinel | Forge, Atlas |
| DevOps/Infra | Circuit | Sentinel, Pulse |
| Design system | Pixel | Nova, Compass |
| Moderation & labeling | Vision | Sentinel, Atlas |
| Lexicon/schema changes | Lexi | Forge, Nova |
| Documentation | Scribe | Domain expert |
| Database | Forge | Sentinel |
| Performance | Pulse | Nova, Circuit |
| Testing | Compass | Domain expert |
| Cross-cutting | Atlas | All domain leads |

## Review Process

### 1. Request Review
```json
{
  "action": "REQUEST_REVIEW",
  "taskId": "TASK-042",
  "reviewer": "sentinel-sec",
  "artifact": "pr-123-auth-flow",
  "type": "security_review",
  "urgency": "high",
  "context": "OAuth integration for new login flow"
}
```

### 2. Review Execution
Reviewer checks:
- Domain-specific concerns (see review checklists below)
- Code quality and standards compliance
- Test coverage
- Documentation completeness
- Security implications

### 3. Review Verdict
```json
{
  "verdict": "approved | changes_requested | blocked",
  "findings": [
    {
      "severity": "critical | high | medium | low | info",
      "description": "Missing input validation on auth endpoint",
      "file": "src/services/auth.ts",
      "line": 42,
      "recommendation": "Add Zod schema validation"
    }
  ],
  "conditions": ["Fix critical findings before merge"],
  "summary": "Overall solid implementation, two security items to address"
}
```

### 4. Resolution
- **Approved** — Can proceed to next stage
- **Changes Requested** — Fix findings, re-request review
- **Blocked** — Escalate to Atlas for resolution

## Domain Review Checklists

### Nova (React Native/Expo)
- [ ] Platform-specific code uses correct extensions
- [ ] No New Architecture breaking changes
- [ ] Expo SDK compatibility verified
- [ ] React Compiler compatible (no manual memoization)
- [ ] Navigation follows established patterns

### Forge (Backend)
- [ ] API endpoints follow RESTful conventions
- [ ] Database queries are indexed and efficient
- [ ] Error responses are structured and helpful
- [ ] Rate limiting applied to new endpoints
- [ ] Input validation on all parameters

### Sentinel (Security)
- [ ] No hardcoded credentials
- [ ] Auth/authz checked on all endpoints
- [ ] Input sanitized against injection
- [ ] Sensitive data encrypted at rest
- [ ] Audit logging for privileged operations

### Pixel (Design)
- [ ] Uses ALF atoms, no inline styles
- [ ] Theme-aware colors (light/dark)
- [ ] Responsive on phone and tablet
- [ ] Consistent with existing patterns
- [ ] Animations are smooth and purposeful
