# Documentation Templates

## Overview

Standard documentation templates for the Scribe agent, including README, API docs, architecture docs, deployment guides, runbooks, release notes, post-mortems, and ADRs.

## README Template

```markdown
# Project Name

One-paragraph description of what this project does and why it exists.

## Features

- Feature 1: Brief description
- Feature 2: Brief description
- Feature 3: Brief description

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Installation

\`\`\`bash
git clone https://github.com/org/repo.git
cd repo
npm install
cp .env.example .env
npm run dev
\`\`\`

### Available Scripts

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm run dev`        | Start development server             |
| `npm run build`      | Build for production                 |
| `npm test`           | Run test suite                       |
| `npm run lint`       | Run linter                           |
| `npm run typecheck`  | Run type checker                     |

## Architecture

Brief description of how the project is structured. Link to detailed architecture doc.

## Configuration

| Variable          | Description                | Default           |
|-------------------|----------------------------|-------------------|
| `DATABASE_URL`    | PostgreSQL connection URL  | Required          |
| `REDIS_URL`       | Redis connection URL       | Required          |
| `API_KEY`         | External API key           | Required          |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](./LICENSE) for details.
```

## API Documentation Template

```markdown
# API Reference

Base URL: `https://api.example.com/v1`

## Authentication

All requests require a Bearer token:

\`\`\`
Authorization: Bearer <token>
\`\`\`

## Endpoints

### List Users

\`\`\`
GET /users
\`\`\`

**Parameters:**

| Name     | Type   | Required | Description              |
|----------|--------|----------|--------------------------|
| page     | int    | No       | Page number (default: 1) |
| limit    | int    | No       | Items per page (max: 100)|
| search   | string | No       | Search query             |

**Response (200):**

\`\`\`json
{
  "data": [
    {
      "id": "usr_123",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
\`\`\`

**Error Responses:**

| Status | Code              | Description              |
|--------|-------------------|--------------------------|
| 401    | unauthorized      | Invalid or missing token |
| 429    | rate_limited      | Too many requests        |
| 500    | internal_error    | Server error             |
```

## Architecture Document Template

```markdown
# Architecture: [System Name]

## Overview

Brief description of the system and its purpose.

## System Context

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Mobile    │────▶│   API       │────▶│  Database   │
│   Client    │     │   Gateway   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  External   │
                    │  Services   │
                    └─────────────┘
\`\`\`

## Components

### API Server
- **Technology:** Node.js + Express
- **Responsibility:** Request handling, authentication, business logic
- **Port:** 3000

### Database
- **Technology:** PostgreSQL 16
- **Responsibility:** Data persistence, queries
- **Port:** 5432

### Cache
- **Technology:** Redis 7
- **Responsibility:** Session storage, rate limiting
- **Port:** 6379

## Data Flow

1. Client sends request to API Gateway
2. Gateway validates authentication token
3. Request routed to appropriate service
4. Service queries database/cache
5. Response returned to client

## Security

- TLS 1.3 for all connections
- JWT tokens for authentication
- Rate limiting per client
- Input validation on all endpoints

## Scalability

| Component    | Current Capacity | Scaling Strategy      |
|--------------|------------------|----------------------|
| API Server   | 1000 req/s       | Horizontal (2+ inst) |
| Database     | 10K connections  | Read replicas        |
| Cache        | 10K ops/s        | Cluster              |
```

## Deployment Guide Template

```markdown
# Deployment Guide

## Prerequisites

- Docker 24+
- Docker Compose v2
- Access to container registry
- SSH access to target server

## Environments

| Environment | URL                        | Branch    | Auto-deploy |
|-------------|----------------------------|-----------|-------------|
| Development | https://dev.example.com    | develop   | Yes         |
| Staging     | https://staging.example.com| main      | Yes         |
| Production  | https://api.example.com    | main      | Manual      |

## Deployment Steps

### 1. Pre-deployment

\`\`\`bash
# Verify tests pass
npm test

# Check for security vulnerabilities
npm audit

# Build the application
npm run build
\`\`\`

### 2. Deploy

\`\`\`bash
# Build Docker image
docker build -t myapp:latest .

# Push to registry
docker push registry.example.com/myapp:latest

# Deploy to server
ssh deploy@server "cd /opt/myapp && docker compose pull && docker compose up -d"
\`\`\`

### 3. Post-deployment

\`\`\`bash
# Verify health check
curl -f https://api.example.com/health

# Check logs
docker compose logs -f api
\`\`\`

## Rollback

\`\`\`bash
# Rollback to previous version
ssh deploy@server "cd /opt/myapp && docker compose down && docker tag myapp:previous myapp:latest && docker compose up -d"
\`\`\`

## Environment Variables

| Variable          | Description                | Where to set         |
|-------------------|----------------------------|----------------------|
| `DATABASE_URL`    | Database connection string | Server env vars      |
| `API_KEY`         | External API key           | Server env vars      |
| `JWT_SECRET`      | JWT signing secret         | KMS                  |
```

## Runbook Template

```markdown
# Runbook: [Incident Type]

## Overview

**Severity:** P0 | P1 | P2 | P3
**Response Time:** 15 min | 1 hour | 4 hours | 24 hours
**Last Updated:** YYYY-MM-DD

## Symptoms

- What users experience
- What appears in monitoring/alerts
- Error messages or codes

## Impact

- Which users are affected
- Which services are impacted
- Business impact assessment

## Diagnosis Steps

1. **Check service health**
   \`\`\`bash
   curl -f https://api.example.com/health
   \`\`\`

2. **Check error logs**
   \`\`\`bash
   docker compose logs --tail=100 api | grep -i error
   \`\`\`

3. **Check database connectivity**
   \`\`\`bash
   psql -h localhost -U postgres -c "SELECT 1;"
   \`\`\`

4. **Check metrics dashboard**
   - Grafana: https://grafana.example.com/d/overview
   - Look for: error rate spikes, latency increases, connection pool exhaustion

## Remediation Steps

### Scenario A: Database connection pool exhausted

1. Restart API server to reset connections:
   \`\`\`bash
   docker compose restart api
   \`\`\`

2. If persistent, increase pool size:
   \`\`\`bash
   # Edit docker-compose.yml
   environment:
     - DB_POOL_SIZE=50
   docker compose up -d
   \`\`\`

### Scenario B: Memory leak

1. Check memory usage:
   \`\`\`bash
   docker stats api
   \`\`\`

2. If memory exceeds threshold, restart:
   \`\`\`bash
   docker compose restart api
   \`\`\`

3. Capture heap snapshot for analysis

## Prevention

- [ ] Monitor connection pool metrics
- [ ] Set up memory usage alerts
- [ ] Regular load testing
- [ ] Code review for resource leaks

## Escalation

| Level | Contact              | When                        |
|-------|----------------------|-----------------------------|
| L1    | On-call engineer     | Initial response            |
| L2    | Team lead            | Can't resolve in 30 min     |
| L3    | Engineering manager  | Service-wide impact         |
| L4    | CTO                  | Business-critical, data loss|

## Estimated Resolution Time

- Simple restart: 5-10 minutes
- Configuration change: 15-30 minutes
- Code fix deployment: 1-2 hours
- Data recovery: 2-4 hours
```

## Release Notes Template

```markdown
# Release Notes - v1.2.0

**Release Date:** YYYY-MM-DD
**Status:** Stable

## What's New

### Feature 1: [Feature Name]
Brief description of the new feature and its benefits.

**How to use:**
1. Step one
2. Step two
3. Step three

### Feature 2: [Feature Name]
Brief description of the new feature.

## Improvements

- Improved search performance by 40%
- Reduced app startup time by 500ms
- Updated UI for settings screen

## Bug Fixes

- Fixed crash when uploading large files
- Fixed incorrect timestamp display in UTC
- Fixed notification sound not playing on Android 14

## Known Issues

- [Issue #123]: Workaround available
- [Issue #124]: Fix scheduled for v1.2.1

## Breaking Changes

⚠️ **API Change:** The `/users/search` endpoint now requires authentication.

**Migration:**
\`\`\`bash
# Update client to include auth header
Authorization: Bearer <your-token>
\`\`\`

## Upgrade Instructions

1. Update dependency:
   \`\`\`bash
   npm install myapp@1.2.0
   \`\`\`

2. Run migrations:
   \`\`\`bash
   npm run migrate
   \`\`\`

3. Update environment variables (if any):
   - `NEW_VAR`: Description

## Acknowledgments

Thanks to contributors: @user1, @user2
```

## Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date:** YYYY-MM-DD
**Duration:** X hours Y minutes
**Severity:** P0 | P1 | P2 | P3
**Author:** [Name]

## Summary

One-paragraph summary of what happened, impact, and resolution.

## Timeline

| Time (UTC) | Event                                              |
|------------|----------------------------------------------------|
| 14:00      | Alert triggered: High error rate on /api/users     |
| 14:05      | On-call engineer acknowledged alert                |
| 14:10      | Identified database connection pool exhaustion     |
| 14:15      | Restarted API server                               |
| 14:20      | Error rate returned to normal                      |
| 14:30      | Confirmed all systems healthy                      |

## Root Cause

Description of the underlying cause of the incident.

## Impact

- **Users affected:** 5,000 (out of 50,000 active)
- **Duration:** 20 minutes
- **Revenue impact:** $0
- **Data loss:** None

## What Went Well

- Alert triggered within 1 minute
- On-call responded within 5 minutes
- Root cause identified quickly

## What Went Wrong

- Connection pool monitoring was insufficient
- No automatic scaling for pool exhaustion
- Runbook was outdated

## Action Items

| Action                                    | Owner     | Due Date   | Status |
|-------------------------------------------|-----------|------------|--------|
| Add connection pool metrics to dashboard  | @user1    | 2025-02-01 | Open   |
| Implement auto-scaling for pool           | @user2    | 2025-02-15 | Open   |
| Update runbook with new procedures        | @user1    | 2025-01-25 | Open   |
| Add load test for connection pool         | @user3    | 2025-02-01 | Open   |

## Lessons Learned

1. Connection pools need dedicated monitoring
2. Auto-scaling should handle connection pressure
3. Runbooks need regular review and updates
```

## ADR Template

```markdown
# ADR-001: [Decision Title]

**Status:** Proposed | Accepted | Deprecated | Superseded
**Date:** YYYY-MM-DD
**Deciders:** [Names]

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

### Positive
- Benefit 1
- Benefit 2

### Negative
- Drawback 1
- Drawback 2

### Risks
- Risk 1: Mitigation

## Alternatives Considered

### Option A: [Name]
- Pros: ...
- Cons: ...

### Option B: [Name]
- Pros: ...
- Cons: ...

## References

- [Link to related discussion]
- [Link to research]
```
