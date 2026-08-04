# GitHub Actions

## Overview

GitHub Actions workflow templates, caching strategies, matrix builds, secrets management, and branch protection configuration.

## Workflow Templates

### CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          REDIS_URL: redis://localhost:6379
```

### CD Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4

      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha
            type=ref,event=branch

      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to server
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /opt/app
            docker compose pull
            docker compose up -d
```

### Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - "v*"

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Generate changelog
        id: changelog
        uses: orhun/git-cliff-action@v3

      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          body: ${{ steps.changelog.outputs.content }}
          files: |
            dist/*
```

## Caching Strategies

### npm Cache

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: "npm"

# Or explicit cache step
- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### Docker Layer Cache

```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Custom Cache

```yaml
- uses: actions/cache@v4
  id: cache-deps
  with:
    path: |
      ~/.cache/pip
      ~/.cache/yarn
      node_modules
    key: ${{ runner.os }}-deps-${{ hashFiles('**/package-lock.json', '**/requirements.txt') }}

- if: steps.cache-deps.outputs.cache-hit != 'true'
  run: npm ci
```

### Cache Key Patterns

```yaml
# Good: Specific keys with fallback
key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
restore-keys: |
  ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
  ${{ runner.os }}-node-

# Bad: Too generic (will always hit cache)
key: ${{ runner.os }}-deps
```

## Matrix Builds

### Platform Matrix

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18, 20, 22]
        include:
          - os: ubuntu-latest
            node-version: 20
            coverage: true
        exclude:
          - os: windows-latest
            node-version: 18
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test

      - if: matrix.coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
```

### Advanced Matrix

```yaml
strategy:
  fail-fast: false
  matrix:
    include:
      - name: "ESLint"
        command: "npm run lint"
      - name: "TypeScript"
        command: "npm run typecheck"
      - name: "Unit Tests"
        command: "npm run test:unit"
      - name: "Integration Tests"
        command: "npm run test:integration"
        needs-postgres: true
        needs-redis: true
```

## Secrets Management

### Environment Secrets

```yaml
jobs:
  deploy:
    environment: production
    steps:
      - name: Use secrets
        env:
          API_KEY: ${{ secrets.PRODUCTION_API_KEY }}
          DB_PASSWORD: ${{ secrets.PRODUCTION_DB_PASSWORD }}
        run: echo "Deploying with secrets..."
```

### Secret Injection

```yaml
# Use secrets in workflow
env:
  DATABASE_URL: postgresql://user:${{ secrets.DB_PASSWORD }}@host/db
```

### Secret Scanning

```yaml
# Enable in repo settings, then:
- uses: trufflesecurity/trufflehog@main
  with:
    extra_args: --only-verified
```

## Reusable Workflows

### Define Reusable Workflow

```yaml
# .github/workflows/reusable-deploy.yml
name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      image-tag:
        required: true
        type: string
    secrets:
      SERVER_HOST:
        required: true
      SSH_KEY:
        required: true
    outputs:
      deploy-status:
        value: ${{ jobs.deploy.outputs.status }}
```

### Call Reusable Workflow

```yaml
jobs:
  deploy-staging:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: staging
      image-tag: ${{ needs.build.outputs.image-tag }}
    secrets:
      SERVER_HOST: ${{ secrets.STAGING_HOST }}
      SSH_KEY: ${{ secrets.STAGING_SSH_KEY }}

  deploy-production:
    needs: deploy-staging
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: production
      image-tag: ${{ needs.build.outputs.image-tag }}
    secrets:
      SERVER_HOST: ${{ secrets.PRODUCTION_HOST }}
      SSH_KEY: ${{ secrets.PRODUCTION_SSH_KEY }}
```

## Branch Protection

### Recommended Rules

```yaml
# Via GitHub API or Terraform
branch_protection:
  main:
    required_pull_request_reviews:
      required_approving_review_count: 1
      dismiss_stale_reviews: true
      require_code_owner_reviews: true
    required_status_checks:
      strict: true
      contexts:
        - "lint"
        - "test"
    enforce_admins: false
    restrictions:
      teams: ["core-developers"]
    allow_force_pushes: false
    allow_deletions: false
```

### CODEOWNERS

```
# .github/CODEOWNERS
* @org/core-team
/src/api/ @org/api-team
/src/web/ @org/web-team
/.github/ @org/devops-team
/docs/ @org/docs-team
```

## Workflow Best Practices

| Practice                    | Description                                   |
|-----------------------------|-----------------------------------------------|
| Minimize workflow runs      | Use `paths` filter on push                   |
| Cache aggressively          | npm, Docker, pip caches                      |
| Use matrix strategically    | Avoid full cross-product when not needed     |
| Pin action versions         | `actions/checkout@v4` not `@main`            |
| Use OIDC for cloud deploy   | Avoid long-lived credentials                  |
| Concurrency groups          | Cancel in-progress runs for same branch      |
| Status checks required      | Prevent merge with failing CI                 |

## Concurrency Control

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

# Or for deployments (don't cancel)
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false
```
