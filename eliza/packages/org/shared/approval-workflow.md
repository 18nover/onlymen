# Approval Workflow

## Approval Gates

| Gate | Approver | When Required |
|------|----------|---------------|
| Architecture decision | Andrew + domain lead | New patterns, major refactors |
| Security change | Seth | Any auth, crypto, permission changes |
| Design change | Desiree | New components, layout changes |
| API change | Morgan | New endpoints, breaking changes |
| Release | Andrew + Seth + Quinn | Every production release |
| Dependency update | Audrey + Seth | New or major version updates |
| Infrastructure | Devon | Docker, CI/CD, deployment changes |

## Approval Request Format

```json
{
  "taskId": "TASK-042",
  "requester": "nadia-rn",
  "approver": "seth-sec",
  "type": "architecture_approval",
  "title": "OAuth integration for login flow",
  "summary": "Implementing AT Protocol OAuth for the new login flow...",
  "artifacts": [
    "adr-003-oauth-flow.md",
    "src/services/auth.ts",
    "src/screens/LoginScreen.tsx"
  ],
  "decision": "Use @atproto/oauth-client-browser with PKCE flow",
  "alternatives": [
    "Custom OAuth implementation",
    "Third-party auth provider"
  ],
  "risks": ["Token storage security", "Session management complexity"]
}
```

## Approval Decision

```json
{
  "taskId": "TASK-042",
  "approver": "seth-sec",
  "decision": "approved | denied | conditional",
  "conditions": [
    "Store tokens in secure enclave only",
    "Add token refresh mechanism",
    "Implement session timeout"
  ],
  "rationale": "PKCE flow is the correct approach for mobile OAuth...",
  "expires": "2025-02-01T00:00:00Z"
}
```

## Conditions

- **Approved** — Proceed with implementation
- **Approved with conditions** — Implement conditions, then proceed
- **Denied** — Rework required. Re-submit after addressing concerns.

## Auto-Approval Criteria

Some changes can be auto-approved without human review:
- Documentation-only changes (Penelope approval)
- Test additions (Quinn approval)
- Minor bug fixes (domain agent approval)
- Formatting/linting fixes

## Escalation

If approval is denied and the requester disagrees:
1. First: Direct discussion between requester and approver
2. Second: Andrew convenes a review with additional domain agents
3. Third: Andrew makes final decision with documented rationale
4. Fourth: Escalate to human operator (if available)
