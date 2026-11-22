/**
 * Platform runtime seam — Cloudflare Workers implementation.
 *
 * Swapped in for ./runtime.ts by vite.config.ts when DEPLOY_TARGET=cloudflare.
 * Never imported by the Vercel/Node build.
 *
 * Database: every request gets its own short-lived pg Client(s) over
 * Hyperdrive (`env.HYPERDRIVE.connectionString`). Hyperdrive does the real
 * pooling; there is NO module-level pool here. `runWithDbScope` (called by
 * src/worker.ts around each request) opens a scope; clients are created lazily
 * on first query, reused within the request, and all closed when the response
 * body finishes (via ctx.waitUntil). A query outside a request scope throws.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import { env, waitUntil } from "cloudflare:workers";
import pg from "pg";
import type { PoolClientLike, PoolLike } from "./pool-like.ts";

export type { PoolLike } from "./pool-like.ts";

export const PLATFORM: "node" | "workers" = "workers";

const bindings = env as unknown as Record<string, unknown> & { HYPERDRIVE?: { connectionString: string } };

/** Trimmed env/secret value from the Worker env (falls back to process.env). */
export function platformEnv(key: string): string | undefined {
  const v = bindings[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  const p = typeof process !== "undefined" ? process.env?.[key]?.trim() : undefined;
  return p || undefined;
}

export function workerDbAvailable(): boolean {
  return Boolean(bindings.HYPERDRIVE);
}

// Same result-type parity as src/lib/db.ts (int8 -> number, date/interval -> text).
pg.types.setTypeParser(20, Number);
pg.types.setTypeParser(1082, (v: string) => v);
pg.types.setTypeParser(1186, (v: string) => v);

interface DbScope {
  idle: pg.Client[];
  all: pg.Client[];
  closed: boolean;
}

const scopes = new AsyncLocalStorage<DbScope>();

/** Run `fn` inside a fresh per-request DB scope. Returns the result plus a closer. */
export async function runWithDbScope<T>(fn: () => Promise<T>): Promise<{ result: T; close: () => Promise<void> }> {
  const scope: DbScope = { idle: [], all: [], closed: false };
  const close = async () => {
    if (scope.closed) return;
    scope.closed = true;
    // Never let a slow Terminate handshake hold the invocation open (waitUntil
    // is capped at 30 s); the socket is torn down with the request anyway.
    const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2000));
    await Promise.race([Promise.allSettled(scope.all.map((c) => c.end())), timeout]);
  };
  try {
    const result = await scopes.run(scope, fn);
    return { result, close };
  } catch (err) {
    await close();
    throw err;
  }
}

async function acquire(): Promise<pg.Client> {
  const scope = scopes.getStore();
  if (!scope) throw new Error("[db] database used outside a request scope (Workers)");
  if (scope.closed) throw new Error("[db] request DB scope already closed");
  const reuse = scope.idle.pop();
  if (reuse) return reuse;
  const hd = bindings.HYPERDRIVE;
  if (!hd) throw new Error("[db] HYPERDRIVE binding is missing");
  const client = new pg.Client({ connectionString: hd.connectionString });
  scope.all.push(client);
  await client.connect();
  return client;
}

/**
 * Pool facade for Kysely (Better Auth) and `getSql`: each `connect()` hands out
 * a client owned by the current request's scope; `release()` returns it to that
 * scope's idle list. Stateless itself, so it is safe to memoize globally.
 */
const facade: PoolLike = {
  async connect(): Promise<PoolClientLike> {
    const scope = scopes.getStore();
    const client = await acquire();
    let released = false;
    return {
      query: (text: string, params?: unknown[]) => client.query(text, params as unknown[]),
      release: () => {
        if (released) return;
        released = true;
        if (scope && !scope.closed) scope.idle.push(client);
      },
    };
  },
  async end() {
    /* per-request clients are closed by the scope, not here */
  },
};

export function workerPgPool(): PoolLike | null {
  return facade;
}

/** Keep a fire-and-forget promise alive past the response. */
export function runInBackground(promise: Promise<unknown>): void {
  waitUntil(promise.catch(() => {}));
}
