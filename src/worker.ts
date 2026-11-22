/**
 * Cloudflare Workers entry (wrangler.jsonc "main"). Vercel never builds this file.
 *
 * Wraps TanStack Start's handler with the same two global middlewares that
 * Nitro auto-registers from server/middleware/ on Vercel, in the same order
 * (Nitro registers them alphabetically):
 *
 *   grok-pwa (manifest, ?install=1 page, head-tag injection)
 *     └─ private-gate (coming-soon page, 403 for anonymous writes, noindex)
 *          └─ TanStack Start (SSR, server functions, /api/* server routes)
 *
 * Static files in dist/client are served by Workers Static Assets before this
 * code runs (same as Vercel's CDN serving public/), so the gate only ever sees
 * app routes. Each request also gets its own DB scope (request-scoped pg
 * clients over Hyperdrive), closed once the response body has finished.
 *
 * Named worker.ts, not server.ts: TanStack Start auto-detects src/server.ts as
 * its server entry, which would change the Vercel build too.
 */
import handler from "@tanstack/react-start/server-entry";
import grokPwaMiddleware from "../server/middleware/grok-pwa";
import privateGate from "../server/middleware/private-gate";
import { runWithDbScope } from "./lib/platform/cloudflare";

type Next = () => unknown | Promise<unknown>;

/** Allow official Chaturbate embeds; does not tighten other directives. */
const FRAME_SRC = "frame-src 'self' https://cbxyz.com https://www.cbxyz.com https://chaturbate.com https://www.chaturbate.com";

function withFrameSrcCsp(res: Response): Response {
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("text/html")) return res;
  const headers = new Headers(res.headers);
  const existing = headers.get("content-security-policy");
  if (existing && existing.toLowerCase().includes("frame-src")) return res;
  headers.set("content-security-policy", existing ? `${existing}; ${FRAME_SRC}` : FRAME_SRC);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

async function toResponse(value: unknown): Promise<Response> {
  if (value instanceof Response) return value;
  if (value === undefined || value === null) return new Response(null, { status: 204 });
  if (typeof value === "string") return new Response(value, { headers: { "content-type": "text/html; charset=utf-8" } });
  return new Response(JSON.stringify(value), { headers: { "content-type": "application/json" } });
}

async function handle(request: Request): Promise<Response> {
  const event = { url: new URL(request.url), req: { method: request.method, headers: request.headers } };
  const app: Next = () => handler.fetch(request);
  const gated: Next = () => privateGate(event, app);
  // In `vite dev` the grok-pwa Vite plugin already wraps HTML at the Node layer.
  const outer = import.meta.env.DEV ? gated() : grokPwaMiddleware(event, gated);
  return withFrameSrcCsp(await toResponse(await outer));
}

export default {
  async fetch(request: Request, _env: unknown, ctx: CfExecutionContext): Promise<Response> {
    const { result: res, close } = await runWithDbScope(() => handle(request));
    if (!res.body) {
      ctx.waitUntil(close());
      return res;
    }
    // Close the request's DB clients only after the (possibly streamed SSR) body is done.
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    ctx.waitUntil(res.body.pipeTo(writable).catch(() => {}).finally(close));
    return new Response(readable, { status: res.status, statusText: res.statusText, headers: res.headers });
  },
};
