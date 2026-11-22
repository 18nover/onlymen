/**
 * Minimal ambient types for the Workers runtime module, enough for
 * src/lib/platform/cloudflare.ts and src/worker.ts. (Full generated types:
 * `npm run cf-typegen`, kept out of tsconfig so DOM types don't clash.)
 */
declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
  export function waitUntil(promise: Promise<unknown>): void;
}

interface CfExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}
