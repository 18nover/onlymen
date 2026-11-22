/**
 * Workers build stand-in for `@electric-sql/pglite`. The embedded WASM Postgres
 * is a local/dev fallback only and must not ship in the Worker bundle; the
 * Worker always uses Hyperdrive. Any attempt to use it fails loudly.
 */
export class PGlite {
  constructor() {
    throw new Error("PGLite is not available in the Cloudflare Workers build (use the HYPERDRIVE binding).");
  }
}
export default PGlite;
