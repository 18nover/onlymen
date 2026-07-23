# Security Standards

## OWASP Mobile Top 10 Compliance

Every feature must be reviewed against OWASP Mobile Top 10:

1. **M1: Improper Credential Usage** — No hardcoded secrets, use secure storage
2. **M2: Inadequate Supply Chain Security** — Audit dependencies, pin versions
3. **M3: Insecure Authentication/Authorization** — OAuth 2.0 via AT Protocol, no custom auth
4. **M4: Insufficient Input/Output Validation** — Validate all data at runtime boundaries
5. **M5: Insecure Communication** — TLS 1.3 minimum, certificate pinning for API
6. **M6: Inadequate Privacy Controls** — Minimal data collection, user consent
7. **M7: Insufficient Binary Protections** — Obfuscation, anti-tampering for releases
8. **M8: Security Misconfiguration** — Secure defaults, no debug in production
9. **M9: Insecure Data Storage** — Encrypted local storage, secure keychain
10. **M10: Insufficient Cryptography** — Ed25519 for AT Protocol, AES-256 for storage

## Secret Management

- **Never in code** — No API keys, passwords, tokens in source files.
- **Environment variables** — Use `.env` files (gitignored) for development.
- **Secure storage** — Use platform keychain/keystore for production secrets.
- **Rotation** — Rotate secrets every 90 days. Automated where possible.
- **No logging** — Never log secrets, tokens, or credentials.

## API Security

- **Rate limiting** — All endpoints must have rate limits.
- **Input validation** — Validate and sanitize all inputs with Zod schemas.
- **Output encoding** — Never trust downstream consumers.
- **CORS** — Restrict to known origins.
- **Authentication** — AT Protocol OAuth for user-facing APIs.
- **Authorization** — Verify permissions on every request.

## Data Protection

- **Encryption at rest** — AES-256 for stored data.
- **Encryption in transit** — TLS 1.3 for all connections.
- **Data minimization** — Collect only what's needed.
- **Right to delete** — Users can delete all their data.
- **No tracking** — No analytics without explicit consent.

## Code Security

- **Dependency scanning** — Run `npm audit` / Snyk on every PR.
- **SAST** — Static analysis in CI pipeline.
- **No eval()** — Never use `eval()`, `Function()`, or dynamic code execution.
- **NoSQL injection** — Parameterized queries only.
- **XSS prevention** — Sanitize all rendered content.

## Incident Response

1. **Detect** — Automated monitoring alerts
2. **Contain** — Isolate affected systems
3. **Eradicate** — Remove the vulnerability
4. **Recover** — Restore from clean state
5. **Learn** — Post-mortem within 48 hours

## Release Gate

**No production release without Seth's approval.** Seth reviews:
- All code changes for security implications
- Dependency updates for vulnerabilities
- Configuration changes for security impact
- Permission changes for least-privilege compliance
