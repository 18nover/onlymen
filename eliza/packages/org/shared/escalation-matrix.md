# Escalation Matrix

## Escalation Levels

### Level 1: Peer-to-Peer
- **When:** Routine questions, code reviews, minor clarifications
- **How:** Direct message between agents
- **Response:** Within 1 hour
- **Example:** "Can you review this PR?" "What's the API contract for X?"

### Level 2: Domain Lead
- **When:** Domain-specific blockers, architectural disagreements within domain
- **How:** Message to domain lead (Nova, Forge, Sentinel, etc.)
- **Response:** Within 2 hours
- **Example:** "I need guidance on the correct Expo pattern for this." "This conflicts with our security policy."

### Level 3: Atlas
- **When:** Cross-domain conflicts, resource conflicts, priority disputes
- **How:** `ORG_ESCALATION` event to Atlas
- **Response:** Within 4 hours
- **Example:** "Nova and Forge disagree on where this logic lives." "I need more time than the sprint allows."

### Level 4: Human Operator
- **When:** Business decisions, budget constraints, external commitments
- **How:** Atlas escalates to human operator
- **Response:** Within 24 hours
- **Example:** "We need to decide between two equally valid approaches." "This requires legal review."

## Escalation Triggers

| Trigger | Minimum Level | Maximum Response |
|---------|---------------|-----------------|
| Security vulnerability discovered | Level 2 (Sentinel) | 30 minutes |
| Two agents disagree after one debate round | Level 3 (Atlas) | 2 hours |
| Blocker open for >2 hours | Level 3 (Atlas) | 1 hour |
| Production incident (Sev1/Sev2) | Level 3 (Atlas) | 15 minutes |
| Data loss or breach | Level 4 (Human) | Immediate |
| Legal/compliance question | Level 4 (Human) | 24 hours |
| Budget/cost concern | Level 4 (Human) | 24 hours |
| Feature request from external | Level 3 (Atlas) | 4 hours |

## De-escalation

- If the conflict resolves naturally, inform Atlas to close the escalation
- Document the resolution for future reference
- If recurring, create an ADR to prevent future escalations on the same topic

## Blocked State

An agent is "blocked" when:
1. They cannot proceed without input from another agent
2. The blocker has been open for >30 minutes
3. They have exhausted peer-to-peer resolution

Blocked agents:
1. Notify the blocking agent with context
2. Wait 30 minutes
3. If still blocked, escalate to Atlas
4. Atlas has authority to reassign, deprioritize, or resolve
