# Docker Compose

## Overview

Docker Compose configuration reference for multi-container development and production environments.

## Service Definitions

### Base Structure

```yaml
# docker-compose.yml
version: "3.9"

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### Multi-Stage Builds

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS development
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Networking

### Custom Networks

```yaml
services:
  api:
    networks:
      - frontend
      - backend

  db:
    networks:
      - backend

  nginx:
    networks:
      - frontend
    ports:
      - "80:80"
      - "443:443"

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

### DNS Resolution

Services on the same network resolve by service name:

```yaml
# api service can connect to db at "db:5432"
services:
  api:
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/app
```

## Volumes

### Named Volumes

```yaml
volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  app_uploads:
    driver: local

services:
  api:
    volumes:
      - app_uploads:/app/uploads
      - ./config:/app/config:ro  # Read-only bind mount
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect postgres_data

# Remove unused volumes
docker volume prune

# Backup volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Health Checks

### Configuration

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s

  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d app"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  redis:
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### Health Check Parameters

| Parameter      | Description                           | Recommended      |
|----------------|---------------------------------------|------------------|
| test           | Command to run                        | CMD or CMD-SHELL |
| interval       | Time between checks                   | 10-30s           |
| timeout        | Max time for check                    | 5-10s            |
| retries        | Consecutive failures before unhealthy | 3-5              |
| start_period   | Grace period for startup              | 30-60s           |
| start_interval | Checks during start period            | 5s               |

## Resource Limits

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: "2.0"
          memory: 512M
        reservations:
          cpus: "0.5"
          memory: 256M

  db:
    deploy:
      resources:
        limits:
          cpus: "4.0"
          memory: 2G
        reservations:
          cpus: "1.0"
          memory: 1G
    shm_size: '2gb'  # Required for PostgreSQL
```

## Environment Management

### Environment Files

```bash
# .env (base defaults)
NODE_ENV=development
POSTGRES_DB=app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=devpassword

# .env.production (production overrides)
NODE_ENV=production
POSTGRES_PASSWORD=<strong-password>
REDIS_PASSWORD=<redis-password>
```

### Variable Precedence

```
1. Shell environment variables
2. .env file in compose directory
3. Compose file environment section
4. Compose file env_file section
5. Image default environment
```

### Secrets in Compose

```yaml
services:
  api:
    environment:
      - DATABASE_URL_FILE=/run/secrets/db_url
    secrets:
      - db_url

secrets:
  db_url:
    file: ./secrets/db_url.txt
```

## Override Files

### Development Overrides

```yaml
# docker-compose.override.yml
services:
  api:
    build:
      target: development
    volumes:
      - ./src:/app/src  # Hot reload
    environment:
      - NODE_ENV=development
      - DEBUG=*
    ports:
      - "3000:3000"
      - "9229:9229"  # Node.js debugger
```

### Production Overrides

```yaml
# docker-compose.prod.yml
services:
  api:
    restart: always
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: "2.0"
          memory: 1G
```

### Usage

```bash
# Development (uses default + override)
docker compose up

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# Test
docker compose -f docker-compose.yml -f docker-compose.test.yml up
```

## Production vs Development

| Feature            | Development                | Production                     |
|--------------------|----------------------------|--------------------------------|
| Hot reload         | Enabled (volume mounts)    | Disabled                       |
| Debug ports        | Exposed (9229)             | Not exposed                    |
| Logging            | stdout, verbose            | json-file, rotated            |
| Resource limits    | None                       | Strict limits                  |
| Health checks      | Optional                   | Required                       |
| Restart policy     | no                         | unless-stopped or always       |
| Image target       | development                | production                     |
| Secrets            | .env file                  | Docker secrets or K8s secrets  |
| Replicas           | 1                          | 2+ (load balanced)             |

## Common Patterns

### Database Initialization

```yaml
services:
  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
```

### Wait-for-it Script

```yaml
services:
  api:
    depends_on:
      db:
        condition: service_healthy
    # Or use a wait script:
    # command: ["./wait-for.sh", "db:5432", "--", "npm", "start"]
```

### Profile-Based Services

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"

  debug:
    build:
      target: development
    profiles:
      - debug
    ports:
      - "9229:9229"

# Run with: docker compose --profile debug up
```

## Troubleshooting

| Issue                          | Solution                                 |
|--------------------------------|------------------------------------------|
| Service can't reach another    | Check network assignment                 |
| Volume permission denied       | Fix UID/GID in Dockerfile                |
| Health check failing           | Increase start_period                    |
| Container keeps restarting     | Check logs: `docker compose logs api`    |
| Port already in use            | Change port mapping or stop other service|
| Slow builds                    | Use BuildKit: `DOCKER_BUILDKIT=1`        |
