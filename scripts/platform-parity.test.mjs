// The Workers build swaps src/lib/platform/runtime.ts for ./cloudflare.ts at
// bundle time (vite.config.ts → platformRuntimePlugin). Both must export the
// same names, or one target fails at runtime with an undefined import.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (rel) => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");
const exportsOf = (src) =>
  new Set([...src.matchAll(/^export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/gm)].map((m) => m[1]));

test("platform runtime seams export the same names", () => {
  const node = exportsOf(read("../src/lib/platform/runtime.ts"));
  const cf = exportsOf(read("../src/lib/platform/cloudflare.ts"));
  for (const name of node) assert.ok(cf.has(name), `cloudflare.ts is missing export ${name}`);
});

test("wrangler.jsonc stays workers.dev-only with the Hyperdrive binding", () => {
  const cfg = read("../wrangler.jsonc");
  assert.match(cfg, /"name":\s*"onlymen"/);
  assert.match(cfg, /"workers_dev":\s*true/);
  assert.doesNotMatch(cfg, /"routes?"\s*:/);
  assert.doesNotMatch(cfg, /custom_domain/);
  assert.match(cfg, /"binding":\s*"HYPERDRIVE"[\s\S]*"id":\s*"2e620b8e625e454fb58fc8120df9e02f"/);
});
