# Backup and Restore

## Overview

Backup and restore procedures for PostgreSQL, Redis, automated schedules, restore validation, and disaster recovery testing.

## PostgreSQL Backup

### pg_dump (Logical Backup)

```bash
# Full database dump
pg_dump -h localhost -U postgres -d myapp -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# Dump specific tables
pg_dump -h localhost -U postgres -d myapp -t users -t posts -F c -f tables_backup.dump

# Dump as SQL (for cross-version compatibility)
pg_dump -h localhost -U postgres -d myapp -F p -f backup.sql

# Dump schema only
pg_dump -h localhost -U postgres -d myapp --schema-only -f schema.sql

# Dump data only
pg_dump -h localhost -U postgres -d myapp --data-only -f data.sql
```

### pg_dump Options

| Flag     | Description                              | Default |
|----------|------------------------------------------|---------|
| `-F c`   | Custom format (compressed, flexible)     | -       |
| `-F p`   | Plain SQL text format                    | -       |
| `-F d`   | Directory format (parallel-safe)         | -       |
| `-j 4`   | Parallel dump with 4 workers             | 1       |
| `-Z 6`   | Compression level (0-9)                  | 6       |
| `--no-owner`  | Skip owner commands                | -       |
| `--no-privileges` | Skip privilege commands          | -       |
| `--verbose` | Print progress to stderr               | -       |

### pg_basebackup (Physical Backup)

```bash
# Full physical backup
pg_basebackup -h localhost -U replicator -D /backup/base -Ft -Xs -P -R

# With WAL streaming
pg_basebackup -h localhost -U replicator -D /backup/base \
  -Ft -Xs -P -R \
  --checkpoint=fast \
  --wal-method=stream

# Restore from physical backup
pg_ctl stop -D /var/lib/postgresql/data
rm -rf /var/lib/postgresql/data/*
tar xf /backup/base/base.tar -C /var/lib/postgresql/data/
tar xf /backup/base/pg_wal.tar -C /var/lib/postgresql/data/pg_wal/
```

### pg_basebackup Options

| Flag                | Description                            |
|---------------------|----------------------------------------|
| `-Ft`               | Tar format                             |
| `-Xs`               | Stream WAL during backup               |
| `-P`                | Show progress                          |
| `-R`                | Create standby signal file             |
| `--checkpoint=fast` | Force immediate checkpoint             |
| `--wal-method=stream` | Include WAL in backup               |

### WAL Archiving Setup

```bash
# postgresql.conf
archive_mode = on
archive_command = 'test ! -f /archive/%f && cp %p /archive/%f'
wal_level = replica
max_wal_senders = 3
```

## Redis Backup

### RDB (Snapshotting)

```bash
# redis.conf
save 900 1      # Save if at least 1 key changed in 900 seconds
save 300 10     # Save if at least 10 keys changed in 300 seconds
save 60 10000   # Save if at least 10000 keys changed in 60 seconds

dbfilename dump.rdb
dir /var/lib/redis

# Manual save
redis-cli BGSAVE

# Manual snapshot
redis-cli SAVE
```

### AOF (Append-Only File)

```bash
# redis.conf
appendonly yes
appendfilename "appendonly.aof"

# Sync policy
appendfsync everysec    # Best balance of safety and performance
# appendfsync always    # Safest, slowest
# appendfsync no        # Fastest, least safe

# AOF rewrite
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

### RDB + AOF Combined

```bash
# Use both for maximum safety
appendonly yes
appendfsync everysec
save 900 1
save 300 10
save 60 10000
```

### Redis Backup Commands

```bash
# Manual RDB snapshot
redis-cli BGSAVE

# Trigger AOF rewrite
redis-cli BGREWRITEAOF

# Copy backup files
redis-cli LASTSAVE  # Get last save timestamp
cp /var/lib/redis/dump.rdb /backup/redis/dump_$(date +%Y%m%d).rdb
cp /var/lib/redis/appendonly.aof /backup/redis/appendonly_$(date +%Y%m%d).aof
```

## Automated Backup Schedules

### Cron Configuration

```bash
# /etc/cron.d/backup-jobs

# PostgreSQL: Daily at 2 AM
0 2 * * * postgres /usr/local/bin/pg-backup.sh >> /var/log/pg-backup.log 2>&1

# PostgreSQL: Hourly WAL archive check
0 * * * * postgres /usr/local/bin/wal-archive-cleanup.sh >> /var/log/wal-cleanup.log 2>&1

# Redis: Every 6 hours
0 */6 * * * redis /usr/local/bin/redis-backup.sh >> /var/log/redis-backup.log 2>&1

# Cleanup: Weekly on Sunday at 3 AM
0 3 * * 0 root /usr/local/bin/backup-cleanup.sh >> /var/log/backup-cleanup.log 2>&1
```

### Backup Script

```bash
#!/bin/bash
# /usr/local/bin/pg-backup.sh

set -euo pipefail

BACKUP_DIR="/backup/postgres"
RETENTION_DAYS=7
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="myapp"
HOST="localhost"
USER="postgres"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Run backup
pg_dump -h "$HOST" -U "$USER" -d "$DB_NAME" \
  -F c -j 4 -Z 6 -f "$BACKUP_DIR/$DB_NAME_$DATE.dump"

# Verify backup
if pg_restore -l "$BACKUP_DIR/$DB_NAME_$DATE.dump" > /dev/null 2>&1; then
    echo "[$(date)] Backup successful: $DB_NAME_$DATE.dump"
else
    echo "[$(date)] ERROR: Backup verification failed!" >&2
    exit 1
fi

# Cleanup old backups
find "$BACKUP_DIR" -name "*.dump" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Cleanup: removed backups older than $RETENTION_DAYS days"
```

### Backup Schedule

| Database   | Frequency   | Method          | Retention | Storage      |
|------------|-------------|-----------------|-----------|--------------|
| PostgreSQL | Daily       | pg_dump         | 7 days    | Local + S3   |
| PostgreSQL | Hourly      | WAL archive     | 72 hours  | Local + S3   |
| Redis      | Every 6hrs  | RDB + AOF copy  | 3 days    | Local + S3   |
| Full image | Weekly      | Disk snapshot   | 4 weeks   | S3/GCS       |

## Restore Procedures

### PostgreSQL Restore

```bash
# Stop the application first
systemctl stop myapp

# Restore from pg_dump
pg_restore -h localhost -U postgres -d myapp \
  --clean --if-exists \
  --no-owner --no-privileges \
  -j 4 \
  /backup/postgres/myapp_20250101_020000.dump

# Restore from SQL dump
psql -h localhost -U postgres -d myapp -f /backup/postgres/backup.sql

# Verify restoration
psql -h localhost -U postgres -d myapp -c "SELECT COUNT(*) FROM users;"

# Restart the application
systemctl start myapp
```

### Redis Restore

```bash
# Stop Redis
redis-cli SHUTDOWN NOSAVE

# Restore RDB
cp /backup/redis/dump_20250101.rdb /var/lib/redis/dump.rdb
chown redis:redis /var/lib/redis/dump.rdb

# Restore AOF (if using)
cp /backup/redis/appendonly_20250101.aof /var/lib/redis/appendonly.aof
chown redis:redis /var/lib/redis/appendonly.aof

# Start Redis
redis-server /etc/redis/redis.conf

# Verify
redis-cli DBSIZE
```

### Point-in-Time Recovery (PostgreSQL)

```bash
# Restore base backup
pg_basebackup -h replica-host -D /var/lib/postgresql/data -Ft -Xs -P -R

# Configure recovery
cat > /var/lib/postgresql/data/postgresql.auto.conf << EOF
restore_command = 'cp /archive/%f %p'
recovery_target_time = '2025-01-15 14:30:00'
recovery_target_action = 'pause'
EOF

# Create recovery signal
touch /var/lib/postgresql/data/recovery.signal

# Start PostgreSQL
pg_ctl start -D /var/lib/postgresql/data

# Verify and promote
psql -c "SELECT now();"
pg_ctl promote -D /var/lib/postgresql/data
```

## Disaster Recovery Testing

### Test Procedure

```bash
#!/bin/bash
# dr-test.sh - Disaster Recovery Test

echo "=== DR Test Started: $(date) ==="

# 1. Create test database
createdb -h localhost -U postgres dr_test

# 2. Restore backup to test database
pg_restore -h localhost -U postgres -d dr_test \
  --clean --if-exists \
  /backup/postgres/myapp_latest.dump

# 3. Verify data integrity
USER_COUNT=$(psql -h localhost -U postgres -d dr_test -t -c "SELECT COUNT(*) FROM users;")
POST_COUNT=$(psql -h localhost -U postgres -d dr_test -t -c "SELECT COUNT(*) FROM posts;")

echo "Users: $USER_COUNT, Posts: $POST_COUNT"

# 4. Run application smoke tests
curl -s http://localhost:3000/health | jq .

# 5. Cleanup
dropdb -h localhost -U postgres dr_test

echo "=== DR Test Completed: $(date) ==="
```

### Recovery Time Objectives

| Metric                        | Target       | Acceptable Range   |
|-------------------------------|--------------|--------------------|
| Recovery Time Objective (RTO) | 30 minutes   | 15-60 minutes      |
| Recovery Point Objective (RPO) | 1 hour      | 5 minutes-24 hours |
| Backup Verification           | Daily        | Per backup cycle   |
| DR Test Frequency             | Monthly      | Quarterly minimum  |
| Full DR Drill                 | Annually     | Semi-annually      |

### DR Checklist

- [ ] Backups are stored in separate location from primary
- [ ] Backups are encrypted at rest
- [ ] Backup integrity verified after each backup
- [ ] Point-in-time recovery tested
- [ ] Restore procedure documented and tested
- [ ] RTO and RPO targets defined and monitored
- [ ] DR test performed at least quarterly
- [ ] Backup access restricted to authorized personnel
- [ ] Monitoring alerts for backup failures configured
- [ ] Off-site backup copy maintained
