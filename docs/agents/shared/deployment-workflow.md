# Deployment Workflow

## Build Pipeline

```
Code Push → Lint → TypeCheck → Unit Tests → Integration Tests → Build → Deploy
```

### Stage Details

| Stage | Tool | Owner | Fail Action |
|-------|------|-------|-------------|
| Lint | Biome | CI | Block merge |
| TypeCheck | TypeScript | CI | Block merge |
| Unit Tests | Vitest | CI | Block merge |
| Integration Tests | Vitest + Docker | CI | Block merge |
| E2E Tests | Maestro | CI | Block merge (main) |
| Build (Web) | Vite | Devon | Block deploy |
| Build (iOS) | EAS | Devon | Block deploy |
| Build (Android) | EAS | Devon | Block deploy |
| Deploy (Staging) | EAS Submit | Devon | Alert Andrew |
| Deploy (Production) | EAS Submit | Andrew + Devon | Full review |

## Platform Builds

### Web
```bash
cd ../app
pnpm build-web
# Deploys to Vercel/Cloudflare
```

### iOS
```bash
cd ../app
eas build --platform ios --profile production
eas submit --platform ios
```

### Android
```bash
cd ../app
eas build --platform android --profile production
eas submit --platform android
```

### Backend (Docker)
```bash
cd ../atproto
docker compose -f services/pds/docker-compose.yml up -d
```

## Environment Promotion

```
Development → Preview → TestFlight/Play Store Beta → Production
```

| Environment | Build Profile | Approval Required |
|-------------|---------------|-------------------|
| Development | `development` | None |
| Preview | `preview` | Domain agent |
| Beta | `testflight` | Domain agent + Andrew |
| Production | `production` | Andrew + Seth + Quinn |

## Rollback

1. Detect issue via monitoring or user reports
2. Devon triggers rollback to previous stable build
3. Andrew convenes incident review
4. Fix forward or rollback decision within 1 hour
5. Post-mortem for any Sev1/Sev2 incident

## Feature Flags

Use GrowthBook for feature flags:
- `new-login-flow` — Toggle new OAuth implementation
- `tablet-layout` — Toggle responsive tablet UI
- `ai-features` — Toggle AI-powered features
- Flags must have kill switches for quick disable
