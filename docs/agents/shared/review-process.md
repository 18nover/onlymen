# Review Process

## Review Matrix

| Change Type | Required Reviewers | Optional Reviewers |
|-------------|-------------------|-------------------|
| Frontend UI | Nadia, Desiree | Parker, Quinn |
| Backend API | Morgan | Seth, Devon |
| AT Protocol | Morgan, Audrey | Andrew |
| Security-related | Seth | Morgan, Andrew |
| DevOps/Infra | Devon | Seth, Parker |
| Design system | Desiree | Nadia, Quinn |
| Moderation & labeling | Karen | Seth, Andrew |
| Lexicon/schema changes | Lexi | Morgan, Nadia |
| Documentation | Penelope | Domain expert |
| Database | Morgan | Seth |
| Performance | Parker | Nadia, Devon |
| Testing | Quinn | Domain expert |
| Cross-cutting | Andrew | All domain leads |

## Review Process

### 1. Request Review
```json
{
  "action": "REQUEST_REVIEW",
  "taskId": "TASK-042",
  "reviewer": "seth-sec",
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
- **Blocked** — Escalate to Andrew for resolution

## Domain Review Checklists

### Nadia (React Native/Expo)
- [ ] Platform-specific code uses correct extensions
- [ ] No New Architecture breaking changes
- [ ] Expo SDK compatibility verified
- [ ] React Compiler compatible (no manual memoization)
- [ ] Navigation follows established patterns

### Morgan (Backend)
- [ ] API endpoints follow RESTful conventions
- [ ] Database queries are indexed and efficient
- [ ] Error responses are structured and helpful
- [ ] Rate limiting applied to new endpoints
- [ ] Input validation on all parameters

### Seth (Security)
- [ ] No hardcoded credentials
- [ ] Auth/authz checked on all endpoints
- [ ] Input sanitized against injection
- [ ] Sensitive data encrypted at rest
- [ ] Audit logging for privileged operations

### Desiree (Design)
- [ ] Uses ALF atoms, no inline styles
- [ ] Theme-aware colors (light/dark)
- [ ] Responsive on phone and tablet
- [ ] Consistent with existing patterns
- [ ] Animations are smooth and purposeful
