/**
 * Platform runtime seam — Node / Vercel implementation (the default).
 *
 * Server code imports `@/lib/platform/runtime` for env reads, the database
 * handle and background work. The Cloudflare Workers build (`npm run build:cf`,
 * DEPLOY_TARGET=cloudflare) swaps this module for ./cloudflare.ts at bundle
 * time (see `platformRuntimePlugin` in vite.config.ts), so the Vercel build
 * never sees `cloudflare:workers` and the Worker never sees a Node pool.
 *
 * Keep the export surface of this file and ./cloudflare.ts identical.
 */
import type { PoolLike } from "./pool-like.ts";

export type { PoolLike } from "./pool-like.ts";

export const PLATFORM: "node" | "workers" = "node";

/** Trimmed env/secret value, or undefined when unset or blank. */
export function platformEnv(key: string): string | undefined {
  const v = typeof process !== "undefined" ? process.env[key]?.trim() : undefined;
  return v || undefined;
}

/** True when the Worker has a Hyperdrive binding. Always false on Node. */
export function workerDbAvailable(): boolean {
  return false;
}

/** Request-scoped pg "pool" facade (Workers only). Null on Node. */
export function workerPgPool(): PoolLike | null {
  return null;
}

/** Keep a fire-and-forget promise alive past the response (no-op on Node). */
export function runInBackground(promise: Promise<unknown>): void {
  void promise.catch(() => {});
}
