import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
function __accessProp(key) {
  return this[key];
}
var __toESMCache_node;
var __toESMCache_esm;
var __toESM = (mod, isNodeMode, target) => {
  var canCache = mod != null && typeof mod === "object";
  if (canCache) {
    var cache = isNodeMode ? __toESMCache_node ??= new WeakMap : __toESMCache_esm ??= new WeakMap;
    var cached = cache.get(mod);
    if (cached)
      return cached;
  }
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: __accessProp.bind(mod, key),
        enumerable: true
      });
  if (canCache)
    cache.set(mod, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __returnValue = (v) => v;
function __exportSetter(name, newValue) {
  this[name] = __returnValue.bind(null, newValue);
}
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: __exportSetter.bind(all, name)
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// src/utils/type-guards.ts
function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  if (proto.constructor === Object) {
    return true;
  }
  return false;
}
function isObjectRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function asRecord(value) {
  return isPlainObject(value) ? value : null;
}
function asRecordOrUndefined(value) {
  return asRecord(value) ?? undefined;
}

// ../../node_modules/.bun/vitest@4.1.5+2ba94b5cc489aebc/node_modules/vitest/index.cjs
var require_vitest = __commonJS(() => {
  throw new Error('Vitest cannot be imported in a CommonJS module using require(). Please use "import" instead.' + `

If you are using "import" in your source code, then it's possible it was bundled into require() automatically by your bundler. ` + "In that case, do not bundle CommonJS output since it will never work with Vitest, or use dynamic import() which is available in all CommonJS modules.");
});

// src/testing/live-provider.ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// src/ambient-context.ts
function ambientSlot() {
  return globalThis;
}
function getAmbientSingleton(key, factory) {
  const slot = ambientSlot();
  const existing = slot[key];
  if (existing !== undefined) {
    return existing;
  }
  const created = factory();
  slot[key] = created;
  return created;
}
function setAmbientSingleton(key, value) {
  ambientSlot()[key] = value;
}
function peekAmbientSingleton(key) {
  return ambientSlot()[key];
}

// src/boot-env.ts
var DEFAULT_BOOT_CONFIG = {};
var BOOT_CONFIG_STORE_KEY = Symbol.for("elizaos.app.boot-config");
var BOOT_CONFIG_WINDOW_KEY = "__ELIZAOS_APP_BOOT_CONFIG__";
function getGlobalSlot() {
  return globalThis;
}
function getBootConfigStore() {
  const existing = peekAmbientSingleton(BOOT_CONFIG_STORE_KEY);
  if (existing && typeof existing === "object" && "current" in existing) {
    return existing;
  }
  const globalObject = getGlobalSlot();
  const mirroredWindowConfig = globalObject[BOOT_CONFIG_WINDOW_KEY];
  const store = {
    current: mirroredWindowConfig ?? DEFAULT_BOOT_CONFIG
  };
  setAmbientSingleton(BOOT_CONFIG_STORE_KEY, store);
  globalObject[BOOT_CONFIG_WINDOW_KEY] = store.current;
  return store;
}
function getBootConfig() {
  return getBootConfigStore().current;
}
function getBootConfigEnvAliases() {
  return getBootConfig().envAliases;
}
function getProcessEnv() {
  try {
    const p = globalThis.process;
    return p?.env ?? null;
  } catch {
    return null;
  }
}
function buildAliasPartnerMap(aliases) {
  const map = new Map;
  const link = (from, to) => {
    if (from === to)
      return;
    const existing = map.get(from);
    if (existing) {
      if (!existing.includes(to))
        existing.push(to);
    } else {
      map.set(from, [to]);
    }
  };
  for (const [brandKey, elizaKey] of aliases) {
    link(brandKey, elizaKey);
    link(elizaKey, brandKey);
  }
  return map;
}
function presentEnvValue(value) {
  if (typeof value !== "string")
    return;
  return value.trim() ? value : undefined;
}
function resolveAliasedEnvValue(key, aliases = getBootConfig().envAliases, env = getProcessEnv()) {
  if (!env)
    return;
  const direct = presentEnvValue(env[key]);
  if (direct !== undefined)
    return direct;
  if (!aliases || aliases.length === 0)
    return;
  const partners = buildAliasPartnerMap(aliases).get(key);
  if (!partners)
    return;
  for (const partner of partners) {
    const value = presentEnvValue(env[partner]);
    if (value !== undefined)
      return value;
  }
  return;
}

// src/contracts/service-routing.ts
var DEFAULT_CEREBRAS_TEXT_MODEL = "gemma-4-31b";

// src/testing/live-provider.ts
var ELIZA_CLOUD_OPENAI_BASE_URL = "https://elizacloud.ai/api/v1";
var CEREBRAS_OPENAI_BASE_URL = "https://api.cerebras.ai/v1";
function loadConfiguredCloudApiKey() {
  const namespace = resolveAliasedEnvValue("ELIZA_NAMESPACE")?.trim() || "eliza";
  const configuredPath = resolveAliasedEnvValue("ELIZA_CONFIG_PATH")?.trim() || path.join(os.homedir(), `.${namespace}`, `${namespace}.json`);
  try {
    const raw = fs.readFileSync(configuredPath, "utf8");
    const parsed = JSON.parse(raw);
    return typeof parsed.cloud?.apiKey === "string" ? parsed.cloud.apiKey.trim() : "";
  } catch {
    return "";
  }
}
var cachedConfiguredCloudApiKey = null;
function getConfiguredCloudApiKey() {
  if (cachedConfiguredCloudApiKey === null) {
    cachedConfiguredCloudApiKey = loadConfiguredCloudApiKey();
  }
  return cachedConfiguredCloudApiKey;
}
var PROVIDERS = [
  {
    name: "groq",
    plugin: "@elizaos/plugin-groq",
    keyEnvVars: ["GROQ_API_KEY"],
    defaultBaseUrl: "https://api.groq.com/openai/v1",
    smallModelEnvVar: "GROQ_SMALL_MODEL",
    largeModelEnvVar: "GROQ_LARGE_MODEL",
    defaultSmallModel: "openai/gpt-oss-120b",
    defaultLargeModel: "openai/gpt-oss-120b"
  },
  {
    name: "openai",
    plugin: "@elizaos/plugin-openai",
    keyEnvVars: ["OPENAI_API_KEY", "CEREBRAS_API_KEY"],
    baseUrlEnvVar: "OPENAI_BASE_URL",
    defaultBaseUrl: "https://api.openai.com/v1",
    smallModelEnvVar: "OPENAI_SMALL_MODEL",
    largeModelEnvVar: "OPENAI_LARGE_MODEL",
    defaultSmallModel: "gpt-5-mini",
    defaultLargeModel: "gpt-5-mini"
  },
  {
    name: "anthropic",
    plugin: "@elizaos/plugin-anthropic",
    keyEnvVars: ["ANTHROPIC_API_KEY"],
    defaultBaseUrl: "https://api.anthropic.com",
    smallModelEnvVar: "ANTHROPIC_SMALL_MODEL",
    largeModelEnvVar: "ANTHROPIC_LARGE_MODEL",
    defaultSmallModel: "claude-haiku-4-5-20251001",
    defaultLargeModel: "claude-haiku-4-5-20251001"
  },
  {
    name: "google",
    plugin: "@elizaos/plugin-google-genai",
    keyEnvVars: ["GOOGLE_GENERATIVE_AI_API_KEY", "GOOGLE_API_KEY"],
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1beta",
    smallModelEnvVar: "GOOGLE_SMALL_MODEL",
    largeModelEnvVar: "GOOGLE_LARGE_MODEL",
    defaultSmallModel: "gemini-2.0-flash-001",
    defaultLargeModel: "gemini-2.0-flash-001"
  },
  {
    name: "openrouter",
    plugin: "@elizaos/plugin-openrouter",
    keyEnvVars: ["OPENROUTER_API_KEY"],
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    smallModelEnvVar: "OPENROUTER_SMALL_MODEL",
    largeModelEnvVar: "OPENROUTER_LARGE_MODEL",
    defaultSmallModel: "google/gemini-2.5-flash-lite",
    defaultLargeModel: "google/gemini-2.5-flash-lite"
  }
];
var CLI_BACKENDS = ["claude", "claude-sdk", "codex", "codex-sdk"];
var CLI_SUBSCRIPTION_SENTINEL_API_KEY = "cli-subscription:no-api-key-cli-reads-own-credentials";
var CLI_PASSTHROUGH_ENV_VARS = [
  "ELIZA_PLANNER_NATIVE_TOOLS",
  "ELIZA_CLI_CLAUDE_MODEL",
  "ELIZA_CLI_CLAUDE_PLANNER_MODEL",
  "ELIZA_CLI_CLAUDE_BIN",
  "ELIZA_CLI_SDK_RESTART_AFTER_TURNS",
  "ELIZA_CLI_CODEX_MODEL",
  "ELIZA_CLI_CODEX_PLANNER_MODEL",
  "ELIZA_CLI_CODEX_REASONING_EFFORT",
  "ELIZA_CLI_CODEX_BIN",
  "ELIZA_CLI_TIMEOUT_MS"
];
function resolveConfiguredCliBackend() {
  const raw = process.env.ELIZA_CHAT_VIA_CLI?.trim().toLowerCase();
  return CLI_BACKENDS.includes(raw ?? "") ? raw : null;
}
function cliBackendCredentialsPath(backend) {
  return backend.startsWith("codex") ? path.join(os.homedir(), ".codex", "auth.json") : path.join(os.homedir(), ".claude", ".credentials.json");
}
function selectCliProvider() {
  const backend = resolveConfiguredCliBackend();
  if (!backend)
    return null;
  if (!fs.existsSync(cliBackendCredentialsPath(backend)))
    return null;
  const isCodex = backend.startsWith("codex");
  const model = isCodex ? process.env.ELIZA_CLI_CODEX_MODEL?.trim() || "gpt-5.5" : process.env.ELIZA_CLI_CLAUDE_MODEL?.trim() || "claude-opus-4-7";
  const env = { ELIZA_CHAT_VIA_CLI: backend };
  for (const envVar of CLI_PASSTHROUGH_ENV_VARS) {
    const val = process.env[envVar]?.trim();
    if (val !== undefined && val !== "")
      env[envVar] = val;
  }
  return {
    name: "cli",
    apiKey: CLI_SUBSCRIPTION_SENTINEL_API_KEY,
    baseUrl: `cli://${backend}`,
    smallModel: model,
    largeModel: model,
    pluginPackage: "@elizaos/plugin-cli-inference",
    env
  };
}
function selectLiveProvider(preferredProvider) {
  const candidates = preferredProvider ? PROVIDERS.filter((p) => p.name === preferredProvider) : PROVIDERS;
  for (const def of candidates) {
    let apiKey = "";
    let apiKeyEnvVar = "";
    for (const envVar of def.keyEnvVars) {
      const val = process.env[envVar]?.trim();
      if (val) {
        apiKey = val;
        apiKeyEnvVar = envVar;
        break;
      }
    }
    if (!apiKey)
      continue;
    const isCerebrasOpenAi = def.name === "openai" && apiKeyEnvVar === "CEREBRAS_API_KEY";
    const baseUrl = def.baseUrlEnvVar ? process.env[def.baseUrlEnvVar]?.trim() || (isCerebrasOpenAi ? CEREBRAS_OPENAI_BASE_URL : def.defaultBaseUrl) : def.defaultBaseUrl;
    const defaultSmallModel = isCerebrasOpenAi ? DEFAULT_CEREBRAS_TEXT_MODEL : def.defaultSmallModel;
    const defaultLargeModel = isCerebrasOpenAi ? DEFAULT_CEREBRAS_TEXT_MODEL : def.defaultLargeModel;
    const smallModel = process.env[def.smallModelEnvVar]?.trim() || defaultSmallModel;
    const largeModel = process.env[def.largeModelEnvVar]?.trim() || defaultLargeModel;
    const env = {};
    for (const envVar of def.keyEnvVars) {
      const val = process.env[envVar]?.trim();
      if (val)
        env[envVar] = val;
    }
    if (def.baseUrlEnvVar) {
      const baseUrlVal = process.env[def.baseUrlEnvVar]?.trim();
      if (baseUrlVal)
        env[def.baseUrlEnvVar] = baseUrlVal;
      else if (isCerebrasOpenAi)
        env[def.baseUrlEnvVar] = baseUrl;
    }
    if (isCerebrasOpenAi) {
      env.ELIZA_PROVIDER = process.env.ELIZA_PROVIDER?.trim() || "cerebras";
    }
    env[def.smallModelEnvVar] = smallModel;
    env[def.largeModelEnvVar] = largeModel;
    env.SMALL_MODEL = process.env.SMALL_MODEL?.trim() || smallModel;
    env.LARGE_MODEL = process.env.LARGE_MODEL?.trim() || largeModel;
    return {
      name: def.name,
      apiKey,
      baseUrl,
      smallModel,
      largeModel,
      pluginPackage: def.plugin,
      env
    };
  }
  const cloudApiKey = process.env.ELIZAOS_CLOUD_API_KEY?.trim() || process.env.ELIZA_CLOUD_API_KEY?.trim() || getConfiguredCloudApiKey();
  if (cloudApiKey && (!preferredProvider || preferredProvider === "openai")) {
    const smallModel = process.env.OPENAI_SMALL_MODEL?.trim() || "gpt-5.4-mini";
    const largeModel = process.env.OPENAI_LARGE_MODEL?.trim() || process.env.OPENAI_SMALL_MODEL?.trim() || "gpt-5.4-mini";
    return {
      name: "openai",
      apiKey: cloudApiKey,
      baseUrl: ELIZA_CLOUD_OPENAI_BASE_URL,
      smallModel,
      largeModel,
      pluginPackage: "@elizaos/plugin-openai",
      env: {
        OPENAI_API_KEY: cloudApiKey,
        OPENAI_BASE_URL: ELIZA_CLOUD_OPENAI_BASE_URL,
        OPENAI_SMALL_MODEL: smallModel,
        OPENAI_LARGE_MODEL: largeModel,
        SMALL_MODEL: process.env.SMALL_MODEL?.trim() || smallModel,
        LARGE_MODEL: process.env.LARGE_MODEL?.trim() || largeModel
      }
    };
  }
  if (!preferredProvider || preferredProvider === "cli") {
    return selectCliProvider();
  }
  return null;
}
function requireLiveProvider(preferredProvider) {
  const provider = selectLiveProvider(preferredProvider);
  if (!provider) {
    const { test } = require_vitest();
    test.skip("No LLM provider API key available");
    throw new Error("No LLM provider API key available");
  }
  return provider;
}
function isLiveTestEnabled() {
  return process.env.ELIZA_LIVE_TEST === "1" || process.env.LIVE === "1";
}
function availableProviderNames() {
  const providers = new Set(PROVIDERS.filter((def) => def.keyEnvVars.some((k) => process.env[k]?.trim())).map((def) => def.name));
  if (process.env.ELIZAOS_CLOUD_API_KEY?.trim() || process.env.ELIZA_CLOUD_API_KEY?.trim() || getConfiguredCloudApiKey()) {
    providers.add("openai");
  }
  if (selectCliProvider()) {
    providers.add("cli");
  }
  return [...providers];
}
export {
  selectLiveProvider,
  requireLiveProvider,
  isLiveTestEnabled,
  cliBackendCredentialsPath,
  availableProviderNames,
  CLI_SUBSCRIPTION_SENTINEL_API_KEY
};

//# debugId=D2EAF7D2787C89F064756E2164756E21
//# sourceMappingURL=live-provider.js.map
