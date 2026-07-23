# Redis Patterns

## Overview

Redis is used as an in-memory data store for caching, rate limiting, session storage, pub/sub messaging, and queue management. This guide covers common patterns, data structures, persistence, and memory management.

---

## Caching Strategies

### TTL (Time-To-Live) Caching

The simplest caching pattern — set a value with an expiry time.

```ts
import Redis from 'ioredis';

const redis = new Redis();

// Cache with TTL
async function getCachedUser(userId: string): Promise<User | null> {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(userId);
  if (user) {
    await redis.setex(`user:${userId}`, 300, JSON.stringify(user)); // 5 min TTL
  }
  return user;
}

// Cache-aside pattern
async function getUser(userId: string): Promise<User> {
  const cached = await getCachedUser(userId);
  if (cached) return cached;

  // This shouldn't happen if getCachedUser works correctly
  throw new Error('User not found');
}
```

### Cache Invalidation

```ts
// Invalidate on update
async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.users.update(userId, data);
  await redis.del(`user:${userId}`);
  return user;
}

// Pattern-based invalidation
async function invalidateUserCache(userId: string) {
  const keys = await redis.keys(`user:${userId}:*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

### LRU (Least Recently Used) Eviction

```redis
# Redis config
maxmemory 256mb
maxmemory-policy allkeys-lru
```

| Policy          | Description                                      |
|-----------------|--------------------------------------------------|
| `noeviction`    | Return errors when memory limit reached          |
| `allkeys-lru`   | Evict least recently used keys (recommended)     |
| `volatile-lru`  | Evict LRU among keys with expiry set             |
| `allkeys-random`| Evict random keys                                |
| `volatile-ttl`  | Evict keys with shortest TTL                     |

### Write-Through Caching

```ts
// Write to DB, then update cache
async function updateUser(userId: string, data: Partial<User>) {
  const user = await db.users.update(userId, data);
  await redis.setex(`user:${userId}`, 300, JSON.stringify(user));
  return user;
}

// Read from cache, fall back to DB
async function getUser(userId: string): Promise<User> {
  const cached = await redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(userId);
  if (user) {
    await redis.setex(`user:${userId}`, 300, JSON.stringify(user));
  }
  return user;
}
```

### Cache Warming

```ts
// Pre-populate cache on startup
async function warmCache() {
  const popularUsers = await db.users.findMany({
    orderBy: { lastActiveAt: 'desc' },
    take: 100,
  });

  const pipeline = redis.pipeline();
  for (const user of popularUsers) {
    pipeline.setex(`user:${user.id}`, 600, JSON.stringify(user));
  }
  await pipeline.exec();
}
```

---

## Pub/Sub

### Basic Publish/Subscribe

```ts
// Publisher
async function notifyNewPost(post: Post) {
  await redis.publish('new-post', JSON.stringify({
    postId: post.id,
    authorId: post.authorId,
    createdAt: post.createdAt,
  }));
}

// Subscriber
const subscriber = new Redis();
subscriber.subscribe('new-post');

subscriber.on('message', (channel, message) => {
  if (channel === 'new-post') {
    const data = JSON.parse(message);
    broadcastToFollowers(data.authorId, data);
  }
});
```

### Channel Patterns

```ts
// Pattern subscribe
const subscriber = new Redis();
subscriber.psubscribe('user:*:notifications');

subscriber.on('pmessage', (pattern, channel, message) => {
  const userId = channel.split(':')[1];
  sendPushNotification(userId, JSON.parse(message));
});

// Publish to user-specific channel
async function notifyUser(userId: string, notification: Notification) {
  await redis.publish(`user:${userId}:notifications`, JSON.stringify(notification));
}
```

### Stream代替Pub/Sub (可靠消息)

```ts
// Producer — add to stream
await redis.xadd('events:*', '*',
  'type', 'new_post',
  'postId', post.id,
  'authorId', post.authorId,
);

// Consumer — read from stream
async function consumeEvents(lastId = '0') {
  const result = await redis.xread('BLOCK', 5000, 'STREAMS', 'events', lastId);

  if (result) {
    const [stream, messages] = result[0];
    for (const [id, fields] of messages) {
      await processEvent(fields);
      lastId = id;
    }
  }

  // Continue consuming
  return consumeEvents(lastId);
}
```

---

## Rate Limiting

### Sliding Window (Sorted Set)

```ts
async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now();
  const windowStart = now - windowMs;
  const resetAt = Math.ceil(now / windowMs) * windowMs;

  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, 0, windowStart); // Remove expired entries
  pipe.zadd(key, now.toString(), `${now}:${Math.random()}`); // Add current request
  pipe.zcard(key); // Count entries in window
  pipe.pexpire(key, windowMs); // Set expiry
  const results = await pipe.exec();

  const count = results[2][1] as number;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt,
  };
}
```

### Fixed Window (Simpler)

```ts
async function fixedWindowRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const windowKey = `${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`;

  const count = await redis.incr(windowKey);
  if (count === 1) {
    await redis.expire(windowKey, windowSeconds);
  }

  return count <= limit;
}
```

### Token Bucket

```ts
async function tokenBucket(
  key: string,
  maxTokens: number,
  refillRate: number, // tokens per second
): Promise<{ allowed: boolean; tokens: number }> {
  const now = Date.now();
  const bucket = await redis.hgetall(key);

  let tokens = bucket.tokens ? parseFloat(bucket.tokens) : maxTokens;
  const lastRefill = bucket.lastRefill ? parseInt(bucket.lastRefill) : now;

  // Refill tokens
  const elapsed = (now - lastRefill) / 1000;
  tokens = Math.min(maxTokens, tokens + elapsed * refillRate);

  if (tokens >= 1) {
    tokens -= 1;
    await redis.hmset(key, {
      tokens: tokens.toString(),
      lastRefill: now.toString(),
    });
    await redis.expire(key, Math.ceil(maxTokens / refillRate) * 2);
    return { allowed: true, tokens };
  }

  return { allowed: false, tokens };
}
```

---

## Session Storage

### Session Store

```ts
interface Session {
  id: string;
  userId: string;
  data: Record<string, any>;
  createdAt: number;
  expiresAt: number;
}

class SessionStore {
  private prefix = 'session:';

  async create(userId: string, data: Record<string, any>, ttlSeconds = 86400): Promise<string> {
    const id = crypto.randomUUID();
    const session: Session = {
      id,
      userId,
      data,
      createdAt: Date.now(),
      expiresAt: Date.now() + ttlSeconds * 1000,
    };

    await redis.setex(
      `${this.prefix}${id}`,
      ttlSeconds,
      JSON.stringify(session),
    );

    // Track active sessions for user
    await redis.sadd(`user:${userId}:sessions`, id);
    await redis.expire(`user:${userId}:sessions`, ttlSeconds);

    return id;
  }

  async get(sessionId: string): Promise<Session | null> {
    const data = await redis.get(`${this.prefix}${sessionId}`);
    if (!data) return null;

    const session = JSON.parse(data);
    if (Date.now() > session.expiresAt) {
      await this.destroy(sessionId);
      return null;
    }

    return session;
  }

  async update(sessionId: string, data: Record<string, any>): Promise<void> {
    const session = await this.get(sessionId);
    if (!session) return;

    session.data = { ...session.data, ...data };
    const ttl = Math.ceil((session.expiresAt - Date.now()) / 1000);
    await redis.setex(`${this.prefix}${sessionId}`, ttl, JSON.stringify(session));
  }

  async destroy(sessionId: string): Promise<void> {
    const session = await this.get(sessionId);
    if (session) {
      await redis.srem(`user:${session.userId}:sessions`, sessionId);
    }
    await redis.del(`${this.prefix}${sessionId}`);
  }

  async destroyAllForUser(userId: string): Promise<void> {
    const sessionIds = await redis.smembers(`user:${userId}:sessions`);
    if (sessionIds.length > 0) {
      const pipe = redis.pipeline();
      for (const id of sessionIds) {
        pipe.del(`${this.prefix}${id}`);
      }
      pipe.del(`user:${userId}:sessions`);
      await pipe.exec();
    }
  }
}
```

---

## Queue Management

### Simple Queue (List)

```ts
// Producer
async function enqueueJob(queue: string, job: JobData) {
  await redis.rpush(`queue:${queue}`, JSON.stringify({
    id: crypto.randomUUID(),
    data: job,
    createdAt: Date.now(),
    attempts: 0,
  }));
}

// Consumer
async function dequeueJob(queue: string): Promise<JobData | null> {
  const raw = await redis.lpop(`queue:${queue}`);
  if (!raw) return null;

  const job = JSON.parse(raw);
  job.attempts += 1;

  // Store in processing queue for crash recovery
  await redis.hset('processing', job.id, JSON.stringify(job));

  return job;
}

// Acknowledge job completion
async function ackJob(jobId: string) {
  await redis.hdel('processing', jobId);
}
```

### Priority Queue (Sorted Set)

```ts
async function enqueuePriority(
  queue: string,
  job: JobData,
  priority: number, // Lower = higher priority
) {
  await redis.zadd(`pq:${queue}`, priority.toString(), JSON.stringify({
    id: crypto.randomUUID(),
    data: job,
    priority,
    createdAt: Date.now(),
  }));
}

async function dequeuePriority(queue: string): Promise<JobData | null> {
  // Get highest priority job (lowest score)
  const result = await redis.zpopmin(`pq:${queue}`);
  if (result.length === 0) return null;

  const [member] = result[0];
  return JSON.parse(member);
}
```

---

## Data Structures

### Common Redis Commands

| Command         | Type    | Usage                                    |
|-----------------|---------|------------------------------------------|
| `GET/SET`       | String  | Simple key-value                         |
| `HGET/HSET`     | Hash    | Object fields                            |
| `LPUSH/RPOP`    | List    | Queue/stack                              |
| `SADD/SMEMBERS` | Set     | Unique collections                       |
| `ZADD/ZRANGE`   | Sorted  | Ranked data, priority queues             |
| `XADD/XREAD`    | Stream  | Event streaming, reliable pub/sub        |

### Hash Pattern (Objects)

```ts
// Store user as hash
await redis.hset('user:abc', {
  handle: 'alice',
  email: 'alice@example.com',
  displayName: 'Alice',
  createdAt: '2025-01-15T10:30:00Z',
});

// Read entire hash
const user = await redis.hgetall('user:abc');

// Read specific fields
const handle = await redis.hget('user:abc', 'handle');

// Update specific fields
await redis.hset('user:abc', { displayName: 'Alice B' });
```

### Sorted Set Pattern (Leaderboards)

```ts
// Add score
await redis.zadd('leaderboard', score.toString(), userId);

// Get top 10
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// Get user rank
const rank = await redis.zrevrank('leaderboard', userId);

// Get user score
const score = await redis.zscore('leaderboard', userId);
```

---

## Memory Management

### Memory Analysis

```redis
# Check memory usage
INFO memory

# Find large keys
redis-cli --bigkeys

# Analyze specific key memory
MEMORY USAGE user:abc

# Scan for keys by pattern
SCAN 0 MATCH user:* COUNT 100
```

### Memory Optimization

1. **Use appropriate data types** — Hash for objects, not multiple strings
2. **Set TTLs** — never store data without expiry unless intentionally permanent
3. **Compress large values** — gzip/deflate before storing
4. **Use hashes for small objects** — Redis optimizes small hashes with ziplist
5. **Avoid storing large strings** — split into chunks or use external storage

```ts
// Compress large values
import zlib from 'zlib';

async function setCompressed(key: string, value: any, ttl: number) {
  const json = JSON.stringify(value);
  const compressed = zlib.deflateSync(json).toString('base64');
  await redis.setex(key, ttl, compressed);
}

async function getCompressed(key: string) {
  const compressed = await redis.get(key);
  if (!compressed) return null;
  const json = zlib.inflateSync(Buffer.from(compressed, 'base64')).toString();
  return JSON.parse(json);
}
```

---

## Persistence

### RDB (Snapshotting)

```redis
# redis.conf
save 900 1      # Save if 1 key changed in 900 seconds
save 300 10     # Save if 10 keys changed in 300 seconds
save 60 10000   # Save if 10000 keys changed in 60 seconds
dbfilename dump.rdb
dir /data
```

### AOF (Append-Only File)

```redis
# redis.conf
appendonly yes
appendfsync everysec    # fsync every second (recommended)
appendfilename "appendonly.aof"

# Auto-rewrite AOF
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

### Persistence Strategy

| Strategy   | Durability | Performance | Use Case              |
|------------|------------|-------------|------------------------|
| RDB only   | Medium     | Best        | Caching, non-critical  |
| AOF only   | High       | Good        | Session storage        |
| RDB + AOF  | Highest    | Good        | Production default     |

---

## Best Practices

1. **Use pipelines** for batch operations — reduces round trips
2. **Set TTLs on all cache keys** — prevent unbounded memory growth
3. **Use `SCAN` instead of `KEYS`** — `KEYS` blocks the server
4. **Connection pooling** — reuse connections, don't create per request
5. **Monitor memory** — set `maxmemory` and `maxmemory-policy`
6. **Use appropriate data structures** — Hash for objects, Sorted Set for rankings
7. **Compress large values** — reduce memory usage
8. **Handle connection errors** — Redis is not the source of truth, degrade gracefully
9. **Use namespaced keys** — `user:abc`, `session:def`, not bare keys
10. **Test failover** — ensure app works when Redis is down
