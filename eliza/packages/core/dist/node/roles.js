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

// src/connectors.ts
function mergeMetadata(base, registered) {
  return {
    aliases: Array.from(new Set([...base?.aliases ?? [], ...registered?.aliases ?? []])),
    sourceKind: registered?.sourceKind ?? base?.sourceKind,
    isPassive: registered?.isPassive ?? base?.isPassive,
    identityMetadataMapping: registered?.identityMetadataMapping ?? base?.identityMetadataMapping,
    worldIdMetadataKeys: registered?.worldIdMetadataKeys ?? base?.worldIdMetadataKeys
  };
}
function listRegisteredCanonicalSources() {
  const sources = new Set;
  for (const ownerMetadata of registeredMetadataByOwner.values()) {
    for (const canonical of ownerMetadata.keys()) {
      sources.add(canonical);
    }
  }
  return [...sources];
}
function getMergedMetadata(canonical) {
  let merged;
  for (const ownerMetadata of registeredMetadataByOwner.values()) {
    merged = mergeMetadata(merged, ownerMetadata.get(canonical));
  }
  return merged ?? {};
}
function rebuildRawToCanonical() {
  rawToCanonical.clear();
  for (const canonical of listRegisteredCanonicalSources()) {
    for (const alias of getMergedMetadata(canonical).aliases ?? [canonical]) {
      rawToCanonical.set(alias, canonical);
    }
  }
}
function registerConnectorSourceAliases(canonical, aliases) {
  registerConnectorSourceMetadata(canonical, { aliases });
}
function registerConnectorSourceMetadata(canonical, metadata, owner = DEFAULT_CONNECTOR_SOURCE_OWNER) {
  const key = canonical.trim().toLowerCase();
  if (!key)
    return;
  const ownerKey = owner.trim() || DEFAULT_CONNECTOR_SOURCE_OWNER;
  let ownerMetadata = registeredMetadataByOwner.get(ownerKey);
  if (!ownerMetadata) {
    ownerMetadata = new Map;
    registeredMetadataByOwner.set(ownerKey, ownerMetadata);
  }
  const existing = ownerMetadata.get(key);
  const mergedAliases = new Set([
    key,
    ...existing?.aliases ?? [],
    ...(metadata.aliases ?? []).map((alias) => alias.trim().toLowerCase())
  ]);
  ownerMetadata.set(key, {
    ...existing,
    ...metadata,
    aliases: Array.from(mergedAliases)
  });
  rebuildRawToCanonical();
}
function registerConnectorSourceDefinitions(definitions, owner = DEFAULT_CONNECTOR_SOURCE_OWNER) {
  for (const definition of definitions ?? []) {
    const { source, ...metadata } = definition;
    registerConnectorSourceMetadata(source, metadata, owner);
  }
}
function unregisterConnectorSourceMetadataOwner(owner) {
  const ownerKey = owner.trim();
  if (!ownerKey)
    return;
  registeredMetadataByOwner.delete(ownerKey);
  rebuildRawToCanonical();
}
function getMergedAliases(canonical) {
  return getMergedMetadata(canonical).aliases ?? [];
}
function normalizeConnectorSource(source) {
  if (typeof source !== "string") {
    return "";
  }
  const trimmed = source.trim().toLowerCase();
  if (!trimmed) {
    return "";
  }
  return rawToCanonical.get(trimmed) ?? trimmed;
}
function getConnectorSourceAliases(source) {
  const canonical = normalizeConnectorSource(source);
  if (!canonical) {
    return [];
  }
  const aliases = getMergedAliases(canonical);
  return [...aliases.length > 0 ? aliases : [canonical]];
}
function getConnectorSourceMetadata(source) {
  const canonical = normalizeConnectorSource(source);
  if (!canonical) {
    return null;
  }
  const metadata = getMergedMetadata(canonical);
  return Object.keys(metadata).length > 0 ? metadata : null;
}
function isPassiveConnectorSource(source) {
  const metadata = getConnectorSourceMetadata(source);
  return Boolean(metadata?.isPassive || metadata?.sourceKind === "passive");
}
function getConnectorIdentityMetadataMapping(source) {
  const metadata = getConnectorSourceMetadata(source);
  const mapping = metadata?.identityMetadataMapping;
  if (!mapping || typeof mapping.userIdField !== "string") {
    return null;
  }
  const userIdField = mapping.userIdField.trim();
  if (!userIdField) {
    return null;
  }
  const nameField = typeof mapping.nameField === "string" && mapping.nameField.trim() ? mapping.nameField.trim() : undefined;
  return { userIdField, ...nameField ? { nameField } : {} };
}
function getConnectorWorldIdMetadataKeys(source) {
  const metadata = getConnectorSourceMetadata(source);
  const keys = metadata?.worldIdMetadataKeys;
  if (!Array.isArray(keys)) {
    return [];
  }
  return keys.filter((key) => typeof key === "string").map((key) => key.trim()).filter((key) => key.length > 0);
}
function expandConnectorSourceFilter(sources) {
  const expanded = new Set;
  for (const source of sources ?? []) {
    for (const alias of getConnectorSourceAliases(source)) {
      expanded.add(alias);
    }
  }
  return expanded;
}
var DEFAULT_CONNECTOR_SOURCE_OWNER = "manual", registeredMetadataByOwner, rawToCanonical, LEGACY_DISCORD_CONNECTOR_SOURCE_OWNER = "core:legacy-discord-metadata", LEGACY_DISCORD_CONNECTOR_SOURCE_METADATA;
var init_connectors = __esm(() => {
  registeredMetadataByOwner = new Map;
  rawToCanonical = new Map;
  LEGACY_DISCORD_CONNECTOR_SOURCE_METADATA = {
    identityMetadataMapping: {
      userIdField: "fromId",
      nameField: "entityName"
    },
    worldIdMetadataKeys: ["discordServerId", "discordChannelId"]
  };
  registerConnectorSourceMetadata("discord", LEGACY_DISCORD_CONNECTOR_SOURCE_METADATA, LEGACY_DISCORD_CONNECTOR_SOURCE_OWNER);
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/picocolors-dummy.js
var init_picocolors_dummy = () => {};

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/tools.js
class Tools {
  globalStore;
  constructor(globalStore) {
    this.globalStore = globalStore;
  }
  clear() {
    console.clear();
  }
  filterByLabel(label) {
    const logs = filterByLabel(label, this.globalStore.cache);
    logs.forEach((log) => {
      render(log);
    });
  }
  filterByNamespace(...namespace) {
    const logs = filterByNamespace(namespace, this.globalStore.cache);
    logs.forEach((log) => {
      render(log);
    });
  }
  filterByLevel(level) {
    const logs = filterByLevel(level, this.globalStore.cache);
    logs.forEach((log) => {
      render(log);
    });
  }
  renderAll() {
    this.globalStore.cache.forEach((log) => {
      render(log);
    });
  }
}
var init_tools = __esm(() => {
  init_functions();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/adze-global.js
class AdzeGlobal {
  config;
  pidCounter = 1;
  labels = new Map;
  _listenerCounter = 0;
  _levelsToListeners = new Map;
  _cache = [];
  constructor(configuration = {}) {
    this.config = configuration;
  }
  get cache() {
    return this._cache;
  }
  get configuration() {
    return this.config;
  }
  get pid() {
    const current = this.pidCounter;
    this.pidCounter++;
    return current;
  }
  get tools() {
    return new Tools(this);
  }
  addLogToCache(log) {
    if (this._cache.length < (this.config.cacheSize ?? 300)) {
      this._cache.push(log);
    }
  }
  clearCache() {
    this._cache = [];
  }
  getLabel(name) {
    return this.labels.get(name);
  }
  setLabel(name, label) {
    this.labels.set(name, label);
  }
  addListener(levels, listener) {
    const id = this._listenerCounter += 1;
    const normalizedLevels = normalizeLevelSelector({ ...defaultConfiguration.levels, ...this.config.levels ?? {} }, levels);
    normalizedLevels.forEach((level) => {
      if (this._levelsToListeners.has(level)) {
        const levelContainer = this._levelsToListeners.get(level);
        levelContainer.set(id, listener);
      } else {
        this._levelsToListeners.set(level, new Map([[id, listener]]));
      }
    });
    return id;
  }
  removeListener(id) {
    this._levelsToListeners.forEach((levelContainer) => {
      levelContainer.delete(id);
    });
  }
  getListeners(level) {
    return Array.from(this._levelsToListeners.get(level)?.values() ?? []);
  }
}
var init_adze_global = __esm(() => {
  init_constants();
  init_functions();
  init_tools();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/global.js
function setup(cfg) {
  globalThis.$adzeGlobal = new AdzeGlobal(cfg);
  return globalThis.$adzeGlobal;
}
function getGlobal(cfg) {
  const store = globalThis.$adzeGlobal;
  if (isGlobalInitialized(store)) {
    return store;
  }
  const globalCtxt = new AdzeGlobal(cfg);
  globalThis.$adzeGlobal = globalCtxt;
  return globalCtxt;
}
function isGlobalInitialized(global) {
  return global instanceof AdzeGlobal;
}
function isBrowser() {
  return typeof window !== "undefined" && typeof window.location !== "undefined" && typeof window.navigator.userAgent !== "undefined" && !isDeno();
}
function isDeno() {
  return typeof Deno !== "undefined";
}
function envIsWindow(_) {
  return isBrowser();
}
function isTestEnvironment() {
  let urlAdzeEnvTest = false;
  if (isBrowser()) {
    const urlParams = new URLSearchParams(globalThis.location.search);
    urlAdzeEnvTest = urlParams.get("ADZE_ENV") === "test";
  }
  return globalThis.$ADZE_ENV === "test" || urlAdzeEnvTest;
}
function isFirefox() {
  const _glbl = globalThis;
  if (envIsWindow(_glbl)) {
    return _glbl.navigator.userAgent.includes("Firefox");
  }
  return false;
}
var init_global = __esm(() => {
  init_adze_global();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/type-guards.js
function isString(value) {
  return Object.prototype.toString.call(value) === "[object String]";
}
function isNumber(value) {
  return value !== null && typeof value === "number" && !isNaN(Number(value));
}
function isMethodWithArgs(value) {
  return methodsWithArgs.includes(value);
}
function isSpecialMethod(value) {
  return specialMethods.includes(value);
}
function isSpecialMethodWithLeader(value) {
  return specialMethodsWithArgsAndLeader.includes(value);
}
function isStringArray(value) {
  return value.every((v) => isString(v));
}
function isRange(value) {
  return Array.isArray(value) && value.length === 3 && value[1] === "-";
}
var init_type_guards = __esm(() => {
  init_constants();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/data.js
function stacktrace() {
  return Error().stack?.replace(/^Error\n/, `
`);
}
function getActiveLevel(cfg) {
  if (isNumber(cfg.activeLevel))
    return cfg.activeLevel;
  return cfg.levels[cfg.activeLevel].level;
}
var init_data = __esm(() => {
  init_global();
  init_type_guards();
});

// ../../node_modules/.bun/picocolors@1.1.1/node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS((exports, module) => {
  var p = process || {};
  var argv = p.argv || [];
  var env = p.env || {};
  var isColorSupported = !(!!env.NO_COLOR || argv.includes("--no-color")) && (!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || (p.stdout || {}).isTTY && env.TERM !== "dumb" || !!env.CI);
  var formatter = (open, close, replace = open) => (input) => {
    let string = "" + input, index = string.indexOf(close, open.length);
    return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
  };
  var replaceClose = (string, close, replace, index) => {
    let result = "", cursor = 0;
    do {
      result += string.substring(cursor, index) + replace;
      cursor = index + close.length;
      index = string.indexOf(close, cursor);
    } while (~index);
    return result + string.substring(cursor);
  };
  var createColors = (enabled = isColorSupported) => {
    let f = enabled ? formatter : () => String;
    return {
      isColorSupported: enabled,
      reset: f("\x1B[0m", "\x1B[0m"),
      bold: f("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"),
      dim: f("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"),
      italic: f("\x1B[3m", "\x1B[23m"),
      underline: f("\x1B[4m", "\x1B[24m"),
      inverse: f("\x1B[7m", "\x1B[27m"),
      hidden: f("\x1B[8m", "\x1B[28m"),
      strikethrough: f("\x1B[9m", "\x1B[29m"),
      black: f("\x1B[30m", "\x1B[39m"),
      red: f("\x1B[31m", "\x1B[39m"),
      green: f("\x1B[32m", "\x1B[39m"),
      yellow: f("\x1B[33m", "\x1B[39m"),
      blue: f("\x1B[34m", "\x1B[39m"),
      magenta: f("\x1B[35m", "\x1B[39m"),
      cyan: f("\x1B[36m", "\x1B[39m"),
      white: f("\x1B[37m", "\x1B[39m"),
      gray: f("\x1B[90m", "\x1B[39m"),
      bgBlack: f("\x1B[40m", "\x1B[49m"),
      bgRed: f("\x1B[41m", "\x1B[49m"),
      bgGreen: f("\x1B[42m", "\x1B[49m"),
      bgYellow: f("\x1B[43m", "\x1B[49m"),
      bgBlue: f("\x1B[44m", "\x1B[49m"),
      bgMagenta: f("\x1B[45m", "\x1B[49m"),
      bgCyan: f("\x1B[46m", "\x1B[49m"),
      bgWhite: f("\x1B[47m", "\x1B[49m"),
      blackBright: f("\x1B[90m", "\x1B[39m"),
      redBright: f("\x1B[91m", "\x1B[39m"),
      greenBright: f("\x1B[92m", "\x1B[39m"),
      yellowBright: f("\x1B[93m", "\x1B[39m"),
      blueBright: f("\x1B[94m", "\x1B[39m"),
      magentaBright: f("\x1B[95m", "\x1B[39m"),
      cyanBright: f("\x1B[96m", "\x1B[39m"),
      whiteBright: f("\x1B[97m", "\x1B[39m"),
      bgBlackBright: f("\x1B[100m", "\x1B[49m"),
      bgRedBright: f("\x1B[101m", "\x1B[49m"),
      bgGreenBright: f("\x1B[102m", "\x1B[49m"),
      bgYellowBright: f("\x1B[103m", "\x1B[49m"),
      bgBlueBright: f("\x1B[104m", "\x1B[49m"),
      bgMagentaBright: f("\x1B[105m", "\x1B[49m"),
      bgCyanBright: f("\x1B[106m", "\x1B[49m"),
      bgWhiteBright: f("\x1B[107m", "\x1B[49m")
    };
  };
  module.exports = createColors();
  module.exports.createColors = createColors;
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/picocolors-loader.js
var _picocolors, picocolors;
var init_picocolors_loader = __esm(() => {
  _picocolors = __toESM(require_picocolors(), 1);
  picocolors = _picocolors.default ?? _picocolors;
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/util.js
function initialCaps(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function allLevels(levels) {
  return Object.values(levels).map((level) => level.level);
}
function makeRange(allLevels2, start, end) {
  return allLevels2.filter((level) => level >= start && level <= end);
}
function addPadding(str, withEmoji = false, emoji) {
  const len = withEmoji && emoji ? 9 + emoji.length : 9;
  const diff = len - str.length;
  let padded = str;
  for (let i = 0;i <= diff; i += 1) {
    padded += " ";
  }
  return padded;
}
function applyStyles(str, styles) {
  return styles.reduce((acc, style) => {
    return picocolors[style](acc);
  }, str);
}
function render(log) {
  if (log.data) {
    console[log.data.method](...log.data.message);
  }
}
function cleanMessage(message) {
  return message.filter((msg) => msg !== "");
}
function isObject(val) {
  return typeof val === "object" && val !== null;
}
var init_util = __esm(() => {
  init_picocolors_loader();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/filters.js
function normalizeLevelSelector(levels, selector) {
  if (selector === "*")
    return Object.values(levels).map((lvl) => lvl.level);
  if (isString(selector)) {
    return [levels[selector].level];
  }
  if (isNumber(selector))
    return [selector];
  if (isRange(selector)) {
    if (isStringArray(selector)) {
      const start = levels[selector[0]].level;
      const end = levels[selector[2]].level;
      return makeRange(allLevels(levels), start, end);
    }
    return makeRange(allLevels(levels), selector[0], selector[2]);
  }
  if (Array.isArray(selector) && isStringArray(selector)) {
    return selector.map((f) => levels[f].level);
  }
  return selector;
}
function failsLevelSelector(type, levels, level) {
  if (levels.length === 0)
    return false;
  return type === "include" ? !levels.includes(level) : levels.includes(level);
}
function isNotIncluded(source, values) {
  if (source.length === 0)
    return false;
  if (source.length > 0 && values.length === 0)
    return true;
  return !values.map((v) => source.includes(v)).includes(true);
}
function isExcluded(source, values) {
  if (source.length === 0)
    return false;
  if (source.length > 0 && values.length === 0)
    return true;
  return values.map((v) => source.includes(v)).includes(true);
}
function filterByLabel(label, logs) {
  return logs.filter((log) => log.data?.label?.name === label);
}
function filterByNamespace(namespace, logs) {
  return logs.filter((log) => {
    if (log.data?.namespace) {
      const isMatched = log.data.namespace.map((ns) => namespace.includes(ns)).includes(true);
      return isMatched;
    }
    return false;
  });
}
function filterByLevel(level, logs) {
  return logs.filter((log) => {
    const levels = normalizeLevelSelector(log.configuration.levels, level);
    if (log.data?.level === undefined)
      return false;
    return failsLevelSelector("exclude", levels, log.data.level);
  });
}
var init_filters = __esm(() => {
  init_type_guards();
  init_util();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/formatters.js
function formatNamespace(ns) {
  if (ns && ns.length > 0) {
    return ns.reduce((acc, name) => `${acc}#${name} `, "");
  }
  return "";
}
function formatLabel(lbl) {
  return lbl ? `[${lbl.name}] ` : "";
}
function formatCount(count) {
  return count !== undefined ? `(Count: ${count}) ` : "";
}
function formatAssert(expression, withEmoji) {
  return expression !== undefined && !expression ? `${withEmoji ? "❌ " : ""}Assertion failed:` : "";
}
function formatIf(expression, withEmoji) {
  return expression !== undefined && expression ? `${withEmoji ? "✅ " : ""}Expression passed:` : "";
}

// ../../node_modules/.bun/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/types.js
var VOID = -1, PRIMITIVE = 0, ARRAY = 1, OBJECT = 2, DATE = 3, REGEXP = 4, MAP = 5, SET = 6, ERROR = 7, BIGINT = 8;

// ../../node_modules/.bun/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/deserialize.js
var env, deserializer = ($, _) => {
  const as = (out, index) => {
    $.set(index, out);
    return out;
  };
  const unpair = (index) => {
    if ($.has(index))
      return $.get(index);
    const [type, value] = _[index];
    switch (type) {
      case PRIMITIVE:
      case VOID:
        return as(value, index);
      case ARRAY: {
        const arr = as([], index);
        for (const index2 of value)
          arr.push(unpair(index2));
        return arr;
      }
      case OBJECT: {
        const object = as({}, index);
        for (const [key, index2] of value)
          object[unpair(key)] = unpair(index2);
        return object;
      }
      case DATE:
        return as(new Date(value), index);
      case REGEXP: {
        const { source, flags } = value;
        return as(new RegExp(source, flags), index);
      }
      case MAP: {
        const map = as(new Map, index);
        for (const [key, index2] of value)
          map.set(unpair(key), unpair(index2));
        return map;
      }
      case SET: {
        const set = as(new Set, index);
        for (const index2 of value)
          set.add(unpair(index2));
        return set;
      }
      case ERROR: {
        const { name, message } = value;
        return as(new env[name](message), index);
      }
      case BIGINT:
        return as(BigInt(value), index);
      case "BigInt":
        return as(Object(BigInt(value)), index);
    }
    return as(new env[type](value), index);
  };
  return unpair;
}, deserialize = (serialized) => deserializer(new Map, serialized)(0);
var init_deserialize = __esm(() => {
  env = typeof self === "object" ? self : globalThis;
});

// ../../node_modules/.bun/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/serialize.js
var EMPTY = "", toString, keys, typeOf = (value) => {
  const type = typeof value;
  if (type !== "object" || !value)
    return [PRIMITIVE, type];
  const asString = toString.call(value).slice(8, -1);
  switch (asString) {
    case "Array":
      return [ARRAY, EMPTY];
    case "Object":
      return [OBJECT, EMPTY];
    case "Date":
      return [DATE, EMPTY];
    case "RegExp":
      return [REGEXP, EMPTY];
    case "Map":
      return [MAP, EMPTY];
    case "Set":
      return [SET, EMPTY];
  }
  if (asString.includes("Array"))
    return [ARRAY, asString];
  if (asString.includes("Error"))
    return [ERROR, asString];
  return [OBJECT, asString];
}, shouldSkip = ([TYPE, type]) => TYPE === PRIMITIVE && (type === "function" || type === "symbol"), serializer = (strict, json, $, _) => {
  const as = (out, value) => {
    const index = _.push(out) - 1;
    $.set(value, index);
    return index;
  };
  const pair = (value) => {
    if ($.has(value))
      return $.get(value);
    let [TYPE, type] = typeOf(value);
    switch (TYPE) {
      case PRIMITIVE: {
        let entry = value;
        switch (type) {
          case "bigint":
            TYPE = BIGINT;
            entry = value.toString();
            break;
          case "function":
          case "symbol":
            if (strict)
              throw new TypeError("unable to serialize " + type);
            entry = null;
            break;
          case "undefined":
            return as([VOID], value);
        }
        return as([TYPE, entry], value);
      }
      case ARRAY: {
        if (type)
          return as([type, [...value]], value);
        const arr = [];
        const index = as([TYPE, arr], value);
        for (const entry of value)
          arr.push(pair(entry));
        return index;
      }
      case OBJECT: {
        if (type) {
          switch (type) {
            case "BigInt":
              return as([type, value.toString()], value);
            case "Boolean":
            case "Number":
            case "String":
              return as([type, value.valueOf()], value);
          }
        }
        if (json && "toJSON" in value)
          return pair(value.toJSON());
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const key of keys(value)) {
          if (strict || !shouldSkip(typeOf(value[key])))
            entries.push([pair(key), pair(value[key])]);
        }
        return index;
      }
      case DATE:
        return as([TYPE, value.toISOString()], value);
      case REGEXP: {
        const { source, flags } = value;
        return as([TYPE, { source, flags }], value);
      }
      case MAP: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const [key, entry] of value) {
          if (strict || !(shouldSkip(typeOf(key)) || shouldSkip(typeOf(entry))))
            entries.push([pair(key), pair(entry)]);
        }
        return index;
      }
      case SET: {
        const entries = [];
        const index = as([TYPE, entries], value);
        for (const entry of value) {
          if (strict || !shouldSkip(typeOf(entry)))
            entries.push(pair(entry));
        }
        return index;
      }
    }
    const { message } = value;
    return as([TYPE, { name: type, message }], value);
  };
  return pair;
}, serialize = (value, { json, lossy } = {}) => {
  const _ = [];
  return serializer(!(json || lossy), !!json, new Map, _)(value), _;
};
var init_serialize = __esm(() => {
  ({ toString } = {});
  ({ keys } = Object);
});

// ../../node_modules/.bun/@ungap+structured-clone@1.2.0/node_modules/@ungap/structured-clone/esm/index.js
var esm_default;
var init_esm = __esm(() => {
  init_deserialize();
  init_serialize();
  esm_default = typeof structuredClone === "function" ? (any, options) => options && (("json" in options) || ("lossy" in options)) ? deserialize(serialize(any, options)) : structuredClone(any) : (any, options) => deserialize(serialize(any, options));
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/seal.js
function SealedLog(Base, cfg, mods, modifierQueue) {
  const { formatters, middleware = [], ...cfgWithoutFormatters } = cfg.exportValues();
  const sealing = class Sealing extends Base {
    _cfg = new Configuration({
      ...esm_default(cfgWithoutFormatters),
      formatters: { ...formatters },
      middleware: [...middleware]
    });
    _modifierData = esm_default(mods);
    modifierQueue = [...modifierQueue];
  };
  const sealed = sealing;
  return sealed;
}
var init_seal = __esm(() => {
  init_configuration();
  init_esm();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/time.js
function formatTime([sec, nano]) {
  return `${sec}s ${nano / 1e6}ms`;
}
function captureTimeNow() {
  return formatTime(hrtime());
}
function hrtime(prev) {
  const time = performance.now() * 0.001;
  const seconds = Math.floor(time);
  const nanoseconds = Math.floor(time % 1 * 1e9);
  if (prev === undefined) {
    return [seconds, nanoseconds];
  }
  let secondsDiff = seconds - prev[0];
  let nanosecondsDiff = nanoseconds - prev[1];
  if (nanosecondsDiff < 0) {
    secondsDiff -= 1;
    nanosecondsDiff += 1e9;
  }
  return [secondsDiff, nanosecondsDiff];
}
function dateFormatISO(date) {
  const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const timezone = `${diff}${pad(tzOffset / 60)}:${pad(tzOffset % 60)}`;
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${timezone}`;
}
function dateFormatCommon(date) {
  const pad = (num, size = 2) => String(num).padStart(size, "0");
  const day = pad(date.getDate());
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const tzOffset = -date.getTimezoneOffset();
  const sign = tzOffset >= 0 ? "+" : "-";
  const absOffset = Math.abs(tzOffset);
  const tzHours = pad(Math.floor(absOffset / 60));
  const tzMinutes = pad(absOffset % 60);
  const timezone = `${sign}${tzHours}${tzMinutes}`;
  return `${day}/${month}/${year}:${hours}:${minutes}:${seconds} ${timezone}`;
}

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/functions/index.js
var init_functions = __esm(() => {
  init_picocolors_dummy();
  init_data();
  init_filters();
  init_global();
  init_seal();
  init_type_guards();
  init_util();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/formatter.js
class Formatter {
  cfg;
  level;
  timestampFormatFunction = (date) => dateFormatISO(date);
  constructor(cfg, level) {
    this.cfg = cfg;
    this.level = level;
  }
  get timestampFormatter() {
    return this.cfg.timestampFormatter ? this.cfg.timestampFormatter : this.timestampFormatFunction;
  }
  print(mods, timestamp, args) {
    if (this.level.level > getActiveLevel(this.cfg))
      return [];
    if (this.failsFilters(mods))
      return [];
    if (mods.assertion === true)
      return [];
    if (mods.if === false)
      return [];
    if (mods.method && !isSpecialMethodWithLeader(mods.method)) {
      if (isSpecialMethod(mods.method) && isMethodWithArgs(mods.method))
        return args;
    }
    const message = isBrowser() ? this.formatBrowser(mods, timestamp, args) : this.formatServer(mods, timestamp, args);
    if (mods.stacktrace)
      message.push(mods.stacktrace);
    return message;
  }
  failsFilters(mods) {
    if (this.failsLevelSelector())
      return true;
    if (this.failsNamespacesFilter(mods))
      return true;
    if (this.failsLabelsFilter(mods))
      return true;
    return false;
  }
  failsLevelSelector() {
    if (this.cfg.filters?.levels === undefined)
      return false;
    const normalizedLevelSelector = normalizeLevelSelector(this.cfg.levels, this.cfg.filters.levels.values);
    if (failsLevelSelector(this.cfg.filters.levels.type, normalizedLevelSelector, this.level.level))
      return true;
    return false;
  }
  failsNamespacesFilter(mods) {
    if (this.cfg.filters?.namespaces === undefined)
      return false;
    if (this.cfg.filters.namespaces.values.length > 0 && mods.namespace === undefined)
      return true;
    if (this.cfg.filters.namespaces.type === "include") {
      const namespaces2 = mods.namespace ?? [];
      return isNotIncluded(this.cfg.filters.namespaces.values, namespaces2);
    }
    const namespaces = mods.namespace ?? [];
    return isExcluded(this.cfg.filters.namespaces.values, namespaces);
  }
  failsLabelsFilter(mods) {
    if (this.cfg.filters?.labels === undefined)
      return false;
    if (this.cfg.filters.labels.values.length > 0 && mods.label === undefined)
      return true;
    const label = mods.label ? [mods.label.name] : [];
    if (this.cfg.filters.labels.type === "include") {
      return isNotIncluded(this.cfg.filters.labels.values, label);
    }
    return isExcluded(this.cfg.filters.labels.values, label);
  }
}
var init_formatter = __esm(() => {
  init_functions();
  init_filters();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/common/common.js
var CommonFormatter;
var init_common = __esm(() => {
  init_formatter();
  init_functions();
  CommonFormatter = class CommonFormatter extends Formatter {
    timestampFormatFunction = (date) => dateFormatCommon(date);
    formatBrowser(mods, timestamp, args) {
      return this.formatMessage(mods, timestamp, args);
    }
    formatServer(mods, timestamp, args) {
      return this.formatMessage(mods, timestamp, args);
    }
    formatMessage(_, timestamp, args) {
      if (this.cfg.meta.hostname === undefined) {
        console.warn(new Error("Adze: 'hostname' is required for the common log format. Please provide this value in your log's meta data."));
      }
      const hostname = this.cfg.meta.hostname;
      const ident = this.cfg.meta.ident ?? "-";
      const user = this.cfg.meta.user ?? "-";
      const firstArg = args[0];
      return [`${hostname} ${ident} ${user} [${timestamp}] ${firstArg}`];
    }
  };
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/common/types.js
var init_types = () => {};

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/common/index.js
var common_default;
var init_common2 = __esm(() => {
  init_common();
  init_types();
  common_default = CommonFormatter;
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/json/type-guards.js
function hasRequiredFields(meta) {
  return typeof meta.name === "string" && typeof meta.hostname === "string";
}

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/json/json.js
function autoSerializer(_key, value) {
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value instanceof Map) {
    return Object.fromEntries(value);
  }
  if (value instanceof Set) {
    return Array.from(value);
  }
  if (ArrayBuffer.isView(value)) {
    return Array.from(value);
  }
  if (typeof value === "function" || typeof value === "symbol" || value === undefined) {
    return;
  }
  return value;
}
var JsonFormatter;
var init_json = __esm(() => {
  init_functions();
  init_formatter();
  JsonFormatter = class JsonFormatter extends Formatter {
    timestampFormatFunction = (date) => dateFormatISO(date);
    formatBrowser(mods, timestamp, args) {
      return this.formatMessage(mods, timestamp, args);
    }
    formatServer(mods, timestamp, args) {
      return this.formatMessage(mods, timestamp, args);
    }
    formatMessage(mods, timestamp, _args) {
      const global2 = getGlobal();
      const args = [..._args];
      const msg = args.shift();
      if (hasRequiredFields(this.cfg.meta)) {
        const { src, err, req_id, req, res, latency, hostname, name, ...meta } = this.cfg.meta;
        const { namespace, label } = mods;
        const json = {
          v: 1,
          level: this.level.level,
          levelName: this.level.levelName,
          name,
          hostname,
          msg,
          args,
          pid: global2.pid,
          time: timestamp,
          meta: Object.keys(meta).length > 0 ? meta : undefined,
          namespace,
          label: label?.name,
          src,
          err,
          req_id,
          req,
          res,
          latency
        };
        try {
          let result;
          if (this.cfg.autoSerialize) {
            const serializer2 = this.cfg.customReplacer ?? autoSerializer;
            result = JSON.stringify(json, serializer2);
          } else {
            result = JSON.stringify(json);
          }
          return [result];
        } catch (e) {
          console.warn(`Adze: Failed to stringify log message to JSON format. Returning original args. Be sure to use the appropriate serializer functions for errors, requests, and responses. More info: https://adzejs.com/reference/formatters.html#jsonlogformatmeta-serializer-functions

`, e);
          return [...args];
        }
      }
      console.warn(new Error("Adze: Required fields are missing from the log meta for generating a JSON log. If using TypeScript, use the JsonLogFormatMeta type for type safety. More info: https://adzejs.com/reference/formatters.html#jsonlogformatmeta-interface"));
      return [...args];
    }
  };
});
// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/json/types.js
var init_types2 = () => {};

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/json/index.js
var json_default;
var init_json2 = __esm(() => {
  init_json();
  init_types2();
  json_default = JsonFormatter;
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/pretty/pretty.js
var PrettyFormatter;
var init_pretty = __esm(() => {
  init_formatter();
  init_functions();
  PrettyFormatter = class PrettyFormatter extends Formatter {
    formatBrowser(mods, timestamp, args) {
      const leader = this.formatLeader();
      const meta = this.formatMeta(mods, timestamp);
      if (this.cfg.withEmoji) {
        return [leader, "font-size: 12px;", this.level.style, meta, ...args];
      }
      return [leader, this.level.style, meta, ...args];
    }
    formatServer(mods, timestamp, args) {
      const message = [];
      const leaderRaw = addPadding(this.formatLeader(false), this.cfg.withEmoji, this.level.emoji);
      const leader = `${leaderRaw} `;
      const meta = this.formatMeta(mods, timestamp);
      const styledLeader = applyStyles(leader, this.level.terminalStyle);
      message.push(styledLeader);
      meta !== "" && message.push(meta);
      return [styledLeader, meta, ...args];
    }
    formatLeader(isBrowser2 = true) {
      const tag = isBrowser2 ? "%c" : "";
      const name = " " + initialCaps(this.level.levelName);
      if (this.cfg.withEmoji) {
        return `${tag}${this.formatEmoji(isBrowser2)}${tag}${name}`;
      }
      return `${tag}${name}`;
    }
    formatEmoji(isBrowser2) {
      const space = isBrowser2 ? " " : "";
      return this.level.emoji ? `${this.level.emoji}${space}` : "";
    }
    formatMeta(mods, timestamp) {
      const ts = this.cfg.showTimestamp ? `${timestamp} ` : "";
      const ns = formatNamespace(mods.namespace);
      const lbl = formatLabel(mods.label);
      const time2 = this.formatTime(mods);
      const cnt = formatCount(mods.label?.count);
      const asrt = formatAssert(mods.assertion, this.cfg.withEmoji);
      const _if = formatIf(mods.if, this.cfg.withEmoji);
      const tst = asrt !== "" ? asrt : _if !== "" ? _if : "";
      return ts + ns + lbl + time2 + cnt + tst;
    }
    formatTime(mods) {
      const timeLeader = this.cfg.withEmoji ? "⏱ " : "Time elapsed: ";
      if (mods.timeNow) {
        return `(${timeLeader}${mods.timeNow})`;
      }
      return mods.label?.timeElapsed ? `(${timeLeader}${mods.label.timeElapsed})` : "";
    }
  };
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/pretty/index.js
var pretty_default;
var init_pretty2 = __esm(() => {
  init_pretty();
  pretty_default = PrettyFormatter;
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/standard/standard.js
var StandardFormatter;
var init_standard = __esm(() => {
  init_formatter();
  init_functions();
  StandardFormatter = class StandardFormatter extends Formatter {
    timestampFormatFunction = (date) => dateFormatISO(date);
    formatBrowser(mods, timestamp, args) {
      return this.formatMessage(timestamp, mods, args);
    }
    formatServer(mods, timestamp, args) {
      return this.formatMessage(timestamp, mods, args);
    }
    formatMessage(timestamp, mods, args) {
      let leader = "";
      const { appname, hostname, port } = this.cfg.meta;
      const _port = isNumber(port) ? `/${port}` : "";
      const appPort = isString(appname) ? `${appname}${_port}` : "";
      const _host = isString(hostname) ? ` on ${hostname}: ` : "";
      const namespace = this.formatNamespace(mods.namespace);
      const label = mods.label ? `[${mods.label.name}] ` : "";
      leader = `${appPort}${_host}${namespace}${label}`;
      return [
        `[${timestamp}] ${this.level.levelName.toUpperCase()}: ${leader}${args[0]} `,
        args.map((arg) => isObject(arg) ? JSON.stringify(arg) : arg).slice(1).join(" ")
      ];
    }
    formatNamespace(namespace) {
      if (namespace && namespace.length > 0) {
        const str = namespace.reduce((acc, mod, index) => {
          return index === namespace.length - 1 ? `${acc}${mod}` : `${acc}${mod}/`;
        }, "");
        return `${str} `;
      }
      return "";
    }
  };
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/constants.js
function getAlertConfig(overrides = {}) {
  return {
    levelName: "alert",
    level: 0,
    style: `padding-right: 24px; font-size: 12px; border-radius: 4px; background: linear-gradient(to right, #fc8585, #fc2323); color: #fff; border-color: #b70101;`,
    terminalStyle: ["white", "bold", "bgRed"],
    method: "error",
    emoji: "\uD83D\uDEA8",
    ...overrides
  };
}
function getErrorConfig(overrides = {}) {
  return {
    levelName: "error",
    level: 1,
    style: `padding-right: 24px; font-size: 12px; border-radius: 4px; background: linear-gradient(to right, #fff, #ffd1d1); color: #a4000f; border-color: #e3bbbb;`,
    terminalStyle: ["white", "bgRed"],
    method: "error",
    emoji: "\uD83D\uDD25",
    ...overrides
  };
}
function getWarnConfig(overrides = {}) {
  return {
    levelName: "warn",
    level: 2,
    style: `font-size: 12px; border-radius: 4px;  background: linear-gradient(to right, #fff, #fff0a8); color: #715100; border-color: #e3d696; padding-right: ${isFirefox() ? "44px" : "30px"};`,
    terminalStyle: ["white", "bgYellow"],
    method: "warn",
    emoji: "\uD83D\uDD14",
    ...overrides
  };
}
function getInfoConfig(overrides = {}) {
  return {
    levelName: "info",
    level: 3,
    style: `padding-right: 44px; font-size: 12px; border-radius: 4px; background: linear-gradient(to right, #d8ebff, #b2d7ff); color: #465464; border-color: #96b5d7;`,
    terminalStyle: ["white", "bgBlue"],
    method: "info",
    emoji: "ℹ️",
    ...overrides
  };
}
function getFailConfig(overrides = {}) {
  return {
    levelName: "fail",
    level: 4,
    style: `padding-right: 44px; font-size: 12px; border-radius: 4px; background: linear-gradient(to right, #ffe8e8, #ffd1d1); color: #a4000f; border-color: #e3bbbb;`,
    terminalStyle: ["white", "bgRed"],
    method: "info",
    emoji: "❌",
    ...overrides
  };
}
function getSuccessConfig(overrides = {}) {
  return {
    levelName: "success",
    level: 5,
    style: "font-size: 12px; border-radius: 4px; padding-right: 22px; background: linear-gradient(to right, #e6f6e4, #ceedc9); color: #4e594d; border-color: #b7d1b3;",
    terminalStyle: ["white", "bgGreen"],
    method: "info",
    emoji: "\uD83C\uDF89",
    ...overrides
  };
}
function getLogConfig(overrides = {}) {
  return {
    levelName: "log",
    level: 6,
    style: "font-size: 12px; border-radius: 4px; padding-right: 51px; background: linear-gradient(to right, #ecedef, #d9dce0); color: #333435; border-color: #bfc1c5;",
    terminalStyle: ["white", "bgBlackBright"],
    method: "log",
    emoji: "\uD83E\uDEB5",
    ...overrides
  };
}
function getDebugConfig(overrides = {}) {
  return {
    levelName: "debug",
    level: 7,
    style: "font-size: 12px; padding-right: 36px; border-right: 1px solid #d9dce0; color: #465464; border-color: #999999;",
    terminalStyle: ["white", "bgBlack"],
    method: "debug",
    emoji: "\uD83D\uDC1E",
    ...overrides
  };
}
function getVerboseConfig(overrides = {}) {
  return {
    levelName: "verbose",
    level: 8,
    style: "font-size: 12px; padding-right: 22px; color: #999999;",
    terminalStyle: ["black", "italic"],
    method: "debug",
    emoji: "\uD83D\uDCAC",
    ...overrides
  };
}
var specialMethodsWithArgsAndLeader, specialMethodsWithArgs, methodsWithArgs, specialMethodsWithoutArgs, specialMethods, methods, defaultConfiguration;
var init_constants = __esm(() => {
  init_common2();
  init_json2();
  init_pretty2();
  init_standard();
  init_functions();
  specialMethodsWithArgsAndLeader = ["group", "groupCollapsed"];
  specialMethodsWithArgs = [
    "dir",
    "dirxml",
    "table",
    ...specialMethodsWithArgsAndLeader
  ];
  methodsWithArgs = [
    "error",
    "warn",
    "info",
    "log",
    "debug",
    ...specialMethodsWithArgs
  ];
  specialMethodsWithoutArgs = ["clear", "groupEnd"];
  specialMethods = [...specialMethodsWithArgs, ...specialMethodsWithoutArgs];
  methods = [...methodsWithArgs, ...specialMethodsWithoutArgs];
  defaultConfiguration = {
    activeLevel: "log",
    autoSerialize: true,
    cache: false,
    cacheSize: 300,
    dump: false,
    format: "pretty",
    meta: {},
    middleware: [],
    showTimestamp: false,
    silent: false,
    withEmoji: false,
    levels: {
      alert: getAlertConfig(),
      error: getErrorConfig(),
      warn: getWarnConfig(),
      info: getInfoConfig(),
      fail: getFailConfig(),
      success: getSuccessConfig(),
      log: getLogConfig(),
      debug: getDebugConfig(),
      verbose: getVerboseConfig()
    },
    formatters: {
      default: pretty_default,
      pretty: pretty_default,
      standard: StandardFormatter,
      common: common_default,
      json: json_default
    }
  };
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/configuration.js
class Configuration {
  logCfg;
  glblCfg;
  constructor(logCfg) {
    this.logCfg = logCfg ?? {};
    this.glblCfg = globalThis.$adzeGlobal?.configuration;
  }
  updateConfiguration(cfg) {
    this.logCfg = cfg;
  }
  get activeLevel() {
    return this.glblCfg?.activeLevel ?? this.logCfg.activeLevel ?? defaultConfiguration.activeLevel;
  }
  set activeLevel(level) {
    this.logCfg.activeLevel = level;
  }
  set autoSerialize(value) {
    this.logCfg.autoSerialize = value;
  }
  get autoSerialize() {
    return this.glblCfg?.autoSerialize ?? this.logCfg.autoSerialize ?? defaultConfiguration.autoSerialize;
  }
  get cache() {
    return this.glblCfg?.cache ?? this.logCfg.cache ?? defaultConfiguration.cache;
  }
  set cache(value) {
    this.logCfg.cache = value;
  }
  get cacheSize() {
    return this.glblCfg?.cacheSize ?? this.logCfg.cacheSize ?? defaultConfiguration.cacheSize;
  }
  set cacheSize(size) {
    this.logCfg.cacheSize = size;
  }
  set customReplacer(value) {
    this.logCfg.customReplacer = value;
  }
  get customReplacer() {
    return this.glblCfg?.customReplacer ?? this.logCfg.customReplacer;
  }
  get dump() {
    return this.glblCfg?.dump ?? this.logCfg.dump ?? defaultConfiguration.dump;
  }
  set dump(value) {
    this.logCfg.dump = value;
  }
  get meta() {
    return { ...this.logCfg.meta, ...this.glblCfg?.meta };
  }
  set meta(value) {
    this.logCfg.meta = value;
  }
  get silent() {
    return this.glblCfg?.silent ?? this.logCfg.silent ?? defaultConfiguration.silent;
  }
  set silent(value) {
    this.logCfg.silent = value;
  }
  get showTimestamp() {
    return this.glblCfg?.showTimestamp ?? this.logCfg.showTimestamp ?? defaultConfiguration.showTimestamp;
  }
  set showTimestamp(value) {
    this.logCfg.showTimestamp = value;
  }
  get withEmoji() {
    return this.glblCfg?.withEmoji ?? this.logCfg.withEmoji ?? defaultConfiguration.withEmoji;
  }
  set withEmoji(value) {
    this.logCfg.withEmoji = value;
  }
  get format() {
    return this.glblCfg?.format ?? this.logCfg.format ?? defaultConfiguration.format;
  }
  set format(value) {
    this.logCfg.format = value;
  }
  get levels() {
    return { ...defaultConfiguration.levels, ...this.logCfg.levels ?? {}, ...this.glblCfg?.levels ?? {} };
  }
  set levels(value) {
    this.logCfg.levels = value;
  }
  get middleware() {
    return [...this.glblCfg?.middleware ?? [], ...this.logCfg.middleware ?? []];
  }
  set middleware(value) {
    this.logCfg.middleware = value;
  }
  get filters() {
    return this.glblCfg?.filters ?? this.logCfg.filters;
  }
  set filters(value) {
    this.logCfg.filters = value;
  }
  get timestampFormatter() {
    return this.glblCfg?.timestampFormatter ?? this.logCfg.timestampFormatter;
  }
  set timestampFormatter(value) {
    this.logCfg.timestampFormatter = value;
  }
  get formatters() {
    return {
      ...defaultConfiguration.formatters,
      ...this.logCfg.formatters ?? {},
      ...this.glblCfg?.formatters ?? {}
    };
  }
  set formatters(value) {
    this.logCfg.formatters = value;
  }
  exportValues() {
    return {
      activeLevel: this.logCfg.activeLevel,
      cache: this.logCfg.cache,
      cacheSize: this.logCfg.cacheSize,
      dump: this.logCfg.dump,
      meta: this.logCfg.meta,
      silent: this.logCfg.silent,
      showTimestamp: this.logCfg.showTimestamp,
      withEmoji: this.logCfg.withEmoji,
      format: this.logCfg.format,
      levels: this.logCfg.levels,
      middleware: this.logCfg.middleware,
      filters: this.logCfg.filters,
      timestampFormatter: this.logCfg.timestampFormatter,
      formatters: this.logCfg.formatters
    };
  }
}
var init_configuration = __esm(() => {
  init_constants();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/log.js
function isCallback(maybeFunction) {
  return typeof maybeFunction === "function";
}

class Log {
  globalStore;
  _cfg;
  _modifierData;
  _data;
  modifierQueue = [];
  constructor(cfg, modifierData) {
    this.globalStore = getGlobal(cfg);
    this._modifierData = modifierData ?? {};
    this._cfg = new Configuration(cfg);
    this.doHook((m) => {
      if (m.constructed)
        m.constructed(this);
    });
  }
  get data() {
    return this._data;
  }
  get modifierData() {
    return this._modifierData;
  }
  get configuration() {
    return this._cfg;
  }
  alert(...args) {
    this.terminate("alert", args);
  }
  static alert(...args) {
    new this().alert(...args);
  }
  error(...args) {
    this.terminate("error", args);
  }
  static error(...args) {
    new this().error(...args);
  }
  warn(...args) {
    this.terminate("warn", args);
  }
  static warn(...args) {
    new this().warn(...args);
  }
  info(...args) {
    this.terminate("info", args);
  }
  static info(...args) {
    new this().info(...args);
  }
  fail(...args) {
    this.terminate("fail", args);
  }
  static fail(...args) {
    new this().fail(...args);
  }
  success(...args) {
    this.terminate("success", args);
  }
  static success(...args) {
    new this().success(...args);
  }
  log(...args) {
    this.terminate("log", args);
  }
  static log(args_0, ...args) {
    new this().log(...[args_0, ...args]);
  }
  debug(...args) {
    this.terminate("debug", args);
  }
  static debug(...args) {
    new this().debug(...args);
  }
  verbose(...args) {
    this.terminate("verbose", args);
  }
  static verbose(...args) {
    new this().verbose(...args);
  }
  clear() {
    console.clear();
  }
  static clear() {
    console.clear();
  }
  clr() {
    console.clear();
  }
  static clr() {
    console.clear();
  }
  custom(levelName, ...args) {
    if (!this._cfg.levels[levelName]) {
      console.warn(new Error("Custom log level not found in configuration."));
      return this;
    }
    this.terminate(levelName, args);
    return this;
  }
  static custom(levelName, ...args) {
    return new this().custom(levelName, ...args);
  }
  seal(_cfg) {
    if (_cfg)
      this._cfg.updateConfiguration(_cfg);
    return SealedLog(Log, this._cfg, this.modifierData, this.modifierQueue);
  }
  static seal(cfg) {
    return new this().seal(cfg);
  }
  sealTag(method, cfg) {
    this._cfg = new Configuration({ ...this._cfg.exportValues(), ...cfg });
    return (strings, ...values) => {
      const message = String.raw({ raw: strings }, ...values);
      const sealed = SealedLog(Log, this._cfg, this.modifierData, this.modifierQueue);
      const _method = method;
      if (isCallback(sealed[_method])) {
        sealed[_method](message);
      }
    };
  }
  static sealTag(method, cfg) {
    return new this().sealTag(method, cfg);
  }
  thread(key, value) {
    this.runModifierQueue();
    if (this._modifierData.label) {
      if (!this._modifierData.label.context)
        this._modifierData.label.context = {};
      this._modifierData.label.context = { ...this._modifierData.label.context, [key]: value };
    }
  }
  static thread(key, value) {
    new this().thread(key, value);
  }
  assert(expression) {
    this.modifierQueue.push([
      "assert",
      (data2) => {
        data2.assertion = expression;
        return data2;
      }
    ]);
    return this;
  }
  static assert(expression) {
    return new this().assert(expression);
  }
  get closeThread() {
    this.modifierQueue.push([
      "closeThread",
      (data2) => {
        if (data2.label?.context) {
          data2.label.context = undefined;
        }
        return data2;
      }
    ]);
    return this;
  }
  static get closeThread() {
    return new this().closeThread;
  }
  get count() {
    this.modifierQueue.push([
      "count",
      (data2) => {
        if (data2.label) {
          data2.label.count = data2.label.count !== undefined ? data2.label.count + 1 : 1;
        }
        return data2;
      }
    ]);
    return this;
  }
  static get count() {
    return new this().count;
  }
  get countClear() {
    this.modifierQueue.push([
      "countClear",
      (data2) => {
        if (data2.label) {
          delete data2.label.count;
        }
        return data2;
      }
    ]);
    return this;
  }
  static get countClear() {
    return new this().countClear;
  }
  get countReset() {
    this.modifierQueue.push([
      "countReset",
      (data2) => {
        if (data2.label) {
          data2.label.count = 0;
        }
        return data2;
      }
    ]);
    return this;
  }
  static get countReset() {
    return new this().countReset;
  }
  get dir() {
    this.modifierQueue.push([
      "dir",
      (data2) => {
        data2.method = "dir";
        return data2;
      }
    ]);
    return this;
  }
  static get dir() {
    return new this().dir;
  }
  get dirxml() {
    this.modifierQueue.push([
      "dirxml",
      (data2) => {
        data2.method = "dirxml";
        return data2;
      }
    ]);
    return this;
  }
  static get dirxml() {
    return new this().dirxml;
  }
  get dump() {
    this.modifierQueue.push([
      "dump",
      (data2, ctxt) => {
        ctxt._cfg.dump = true;
        return data2;
      }
    ]);
    return this;
  }
  static get dump() {
    return new this().dump;
  }
  format(format) {
    this.modifierQueue.push([
      "format",
      (data2, ctxt) => {
        if (Object.keys(ctxt._cfg.formatters).includes(format)) {
          ctxt._cfg.format = format;
          return data2;
        }
        console.warn(new Error(`Adze: Formatter "${format}" not found in configuration.`));
        return data2;
      }
    ]);
    return this;
  }
  static format(format) {
    return new this().format(format);
  }
  get group() {
    this.modifierQueue.push([
      "group",
      (data2) => {
        data2.method = "group";
        return data2;
      }
    ]);
    return this;
  }
  static get group() {
    return new this().group;
  }
  get groupCollapsed() {
    this.modifierQueue.push([
      "groupCollapsed",
      (data2) => {
        data2.method = "groupCollapsed";
        return data2;
      }
    ]);
    return this;
  }
  static get groupCollapsed() {
    return new this().groupCollapsed;
  }
  get groupEnd() {
    this.modifierQueue.push([
      "groupEnd",
      (data2) => {
        data2.method = "groupEnd";
        return data2;
      }
    ]);
    return this;
  }
  static get groupEnd() {
    return new this().groupEnd;
  }
  if(expression) {
    this.modifierQueue.push([
      "if",
      (data2) => {
        data2.if = expression;
        return data2;
      }
    ]);
    return this;
  }
  static if(expression) {
    return new this().if(expression);
  }
  test(expression) {
    return this.if(expression);
  }
  static test(expression) {
    return new this().if(expression);
  }
  label(name) {
    this.modifierQueue.unshift([
      "label",
      (data2) => {
        const label = this.globalStore.getLabel(name) ?? { name };
        data2.label = label;
        this.globalStore.setLabel(name, label);
        return data2;
      }
    ]);
    return this;
  }
  static label(name) {
    return new this().label(name);
  }
  meta(meta) {
    this.modifierQueue.push([
      "meta",
      (data2, ctxt) => {
        ctxt._cfg.meta = { ...ctxt._cfg.meta, ...meta };
        return data2;
      }
    ]);
    return this;
  }
  static meta(meta) {
    return new this().meta(meta);
  }
  namespace(...namespace) {
    this.modifierQueue.push([
      "namespace",
      (data2) => {
        const arr = data2.namespace ?? [];
        data2.namespace = arr.length > 0 ? [...arr, ...namespace] : namespace;
        return data2;
      }
    ]);
    return this;
  }
  static namespace(...namespace) {
    return new this().namespace(...namespace);
  }
  ns(...namespace) {
    return this.namespace(...namespace);
  }
  static ns(...namespace) {
    return new this().namespace(...namespace);
  }
  get silent() {
    this.modifierQueue.push([
      "silent",
      (data2, ctxt) => {
        ctxt._cfg.silent = true;
        return data2;
      }
    ]);
    return this;
  }
  static get silent() {
    return new this().silent;
  }
  get table() {
    this.modifierQueue.push([
      "table",
      (data2) => {
        data2.method = "table";
        return data2;
      }
    ]);
    return this;
  }
  static get table() {
    return new this().table;
  }
  get time() {
    this.modifierQueue.push([
      "time",
      (data2) => {
        const timeStart = hrtime();
        if (data2.label) {
          data2.label.timeStart = timeStart;
        }
        return data2;
      }
    ]);
    return this;
  }
  static get time() {
    return new this().time;
  }
  get timeEnd() {
    this.modifierQueue.push([
      "timeEnd",
      (data2) => {
        if (data2.label?.timeStart) {
          data2.label.timeElapsed = formatTime(hrtime(data2.label.timeStart));
        }
        return data2;
      }
    ]);
    return this;
  }
  static get timeEnd() {
    return new this().timeEnd;
  }
  get timeNow() {
    this.modifierQueue.push([
      "timeNow",
      (data2) => {
        data2.timeNow = captureTimeNow();
        return data2;
      }
    ]);
    return this;
  }
  static get timeNow() {
    return new this().timeNow;
  }
  get timestamp() {
    this.modifierQueue.push([
      "timestamp",
      (data2, ctxt) => {
        ctxt._cfg.showTimestamp = true;
        return data2;
      }
    ]);
    return this;
  }
  static get timestamp() {
    return new this().timestamp;
  }
  get trace() {
    this.modifierQueue.push([
      "trace",
      (data2) => {
        data2.stacktrace = stacktrace();
        return data2;
      }
    ]);
    return this;
  }
  static get trace() {
    return new this().trace;
  }
  get withEmoji() {
    this.modifierQueue.push([
      "withEmoji",
      (data2, ctxt) => {
        ctxt._cfg.withEmoji = true;
        return data2;
      }
    ]);
    return this;
  }
  static get withEmoji() {
    return new this().withEmoji;
  }
  print(data2) {
    if (isTestEnvironment())
      return;
    if (data2.silent)
      return;
    if (data2.message.length < 1)
      return;
    if (isMethodWithArgs(data2.method)) {
      console[data2.method](...data2.message);
    } else {
      console[data2.method]();
    }
  }
  terminate(terminator, args) {
    this.doHook((m) => {
      if (m.beforeTerminated)
        m.beforeTerminated(this, terminator, args);
    });
    this.runModifierQueue();
    const level = this.getLevelConfig(terminator);
    const formatterConstructor = this.selectFormatter(this._cfg.format);
    const formatter = new formatterConstructor(this._cfg, level);
    const timestamp = formatter.timestampFormatter(new Date);
    let message = cleanMessage(formatter.print(this.modifierData, timestamp, args));
    if (this._cfg.dump && this.modifierData.label?.context) {
      message.push(this.modifierData.label.context);
    }
    this.doHook((m) => {
      if (m.beforeFormatApplied) {
        message = m.beforeFormatApplied(this, this._cfg.format, message);
      }
    });
    const { activeLevel, cache, cacheSize, dump, format, meta, showTimestamp, silent, withEmoji } = this._cfg;
    const data2 = {
      activeLevel,
      cache,
      cacheSize,
      dump,
      format,
      meta,
      showTimestamp,
      silent,
      withEmoji,
      ...level,
      ...this._modifierData,
      terminator,
      args,
      timestamp,
      message
    };
    this.doHook((m) => {
      if (m.afterFormatApplied)
        m.afterFormatApplied(this, this._cfg.format, message);
    });
    this._data = data2;
    if (this._cfg.cache) {
      this.globalStore.addLogToCache(this);
    }
    this.doHook((m) => {
      if (m.beforePrint)
        m.beforePrint(this);
    });
    this.print(this._data);
    this.doHook((m) => {
      if (m.afterTerminated)
        m.afterTerminated(this, terminator, args);
    });
    this.globalStore.getListeners(level.level).forEach((listener) => {
      listener(this);
    });
  }
  selectFormatter(format) {
    return this._cfg.formatters[format];
  }
  getLevelConfig(levelName) {
    return this._cfg.levels[levelName];
  }
  runModifierQueue() {
    this.modifierQueue.forEach(([modName, modFunc]) => {
      const result = modFunc(this.modifierData, this);
      this.doHook((m) => {
        if (m.beforeModifierApplied)
          m.beforeModifierApplied(this, modName, result);
      });
      this._modifierData = result;
      this.doHook((m) => {
        if (m.afterModifierApplied)
          m.afterModifierApplied(this, modName, result);
      });
    });
  }
  doHook(cb) {
    this._cfg.middleware?.forEach((middleware) => {
      cb(middleware);
    });
  }
}
var init_log = __esm(() => {
  init_configuration();
  init_functions();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/middleware.js
class Middleware {
  targetEnvironment;
  environment = isBrowser() ? "browser" : "server";
  dependencyLoaders = [];
  constructor(targetEnvironment) {
    this.targetEnvironment = targetEnvironment ?? "both";
    if (!isBrowser() && (this.targetEnvironment === "server" || this.targetEnvironment === "both")) {
      this.dependencyLoaders.push(this.loadServerDependencies());
    }
    if (isBrowser() && (this.targetEnvironment === "browser" || this.targetEnvironment === "both")) {
      this.dependencyLoaders.push(this.loadBrowserDependencies());
    }
  }
  async load() {
    await Promise.all(this.dependencyLoaders);
  }
  async loadServerDependencies() {}
  async loadBrowserDependencies() {}
}
var init_middleware = __esm(() => {
  init_dist();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/standard/types.js
var init_types3 = () => {};

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/formatters/standard/index.js
var init_standard2 = __esm(() => {
  init_standard();
  init_types3();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/_types/styles.js
var styles_raw, console_styles;
var init_styles = __esm(() => {
  styles_raw = [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray",
    "blackBright",
    "redBright",
    "greenBright",
    "yellowBright",
    "blueBright",
    "magentaBright",
    "cyanBright",
    "whiteBright",
    "bgBlack",
    "bgRed",
    "bgGreen",
    "bgYellow",
    "bgBlue",
    "bgMagenta",
    "bgCyan",
    "bgWhite",
    "bgBlackBright",
    "bgRedBright",
    "bgGreenBright",
    "bgYellowBright",
    "bgBlueBright",
    "bgMagentaBright",
    "bgCyanBright",
    "bgWhiteBright",
    "reset",
    "bold",
    "dim",
    "italic",
    "underline",
    "inverse",
    "hidden",
    "strikethrough"
  ];
  console_styles = Object.freeze(styles_raw);
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/_types/index.js
var init__types = __esm(() => {
  init_styles();
});

// ../../node_modules/.bun/adze@2.3.0/node_modules/adze/dist/index.js
var dist_default;
var init_dist = __esm(() => {
  init_log();
  init_formatter();
  init_functions();
  init__types();
  init_configuration();
  init_middleware();
  init_common2();
  init_standard2();
  init_json2();
  init_constants();
  dist_default = Log;
});

// ../logger/src/env.ts
function browserEnvBag() {
  const g = globalThis;
  return { ...g.window?.ENV ?? {}, ...g.__ENV__ ?? {} };
}
function getEnv(key, defaultValue) {
  if (isNode) {
    return process.env[key] ?? defaultValue;
  }
  const value = browserEnvBag()[key];
  return value !== undefined ? String(value) : defaultValue;
}
var isNode;
var init_env = __esm(() => {
  isNode = typeof process !== "undefined" && !!process.versions && typeof process.versions.node === "string";
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/lib/validator.js
var require_validator = __commonJS((exports, module) => {
  module.exports = validator;
  function validator(opts = {}) {
    const {
      ERR_PATHS_MUST_BE_STRINGS = () => "fast-redact - Paths must be (non-empty) strings",
      ERR_INVALID_PATH = (s) => `fast-redact – Invalid path (${s})`
    } = opts;
    return function validate({ paths }) {
      paths.forEach((s) => {
        if (typeof s !== "string") {
          throw Error(ERR_PATHS_MUST_BE_STRINGS());
        }
        try {
          if (/〇/.test(s))
            throw Error();
          const expr = (s[0] === "[" ? "" : ".") + s.replace(/^\*/, "〇").replace(/\.\*/g, ".〇").replace(/\[\*\]/g, "[〇]");
          if (/\n|\r|;/.test(expr))
            throw Error();
          if (/\/\*/.test(expr))
            throw Error();
          Function(`
            'use strict'
            const o = new Proxy({}, { get: () => o, set: () => { throw Error() } });
            const 〇 = null;
            o${expr}
            if ([o${expr}].length !== 1) throw Error()`)();
        } catch (e) {
          throw Error(ERR_INVALID_PATH(s));
        }
      });
    };
  }
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/lib/rx.js
var require_rx = __commonJS((exports, module) => {
  module.exports = /[^.[\]]+|\[((?:.)*?)\]/g;
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  var rx = require_rx();
  module.exports = parse;
  function parse({ paths }) {
    const wildcards = [];
    var wcLen = 0;
    const secret = paths.reduce(function(o, strPath, ix) {
      var path = strPath.match(rx).map((p) => p.replace(/'|"|`/g, ""));
      const leadingBracket = strPath[0] === "[";
      path = path.map((p) => {
        if (p[0] === "[")
          return p.substr(1, p.length - 2);
        else
          return p;
      });
      const star = path.indexOf("*");
      if (star > -1) {
        const before = path.slice(0, star);
        const beforeStr = before.join(".");
        const after = path.slice(star + 1, path.length);
        const nested = after.length > 0;
        wcLen++;
        wildcards.push({
          before,
          beforeStr,
          after,
          nested
        });
      } else {
        o[strPath] = {
          path,
          val: undefined,
          precensored: false,
          circle: "",
          escPath: JSON.stringify(strPath),
          leadingBracket
        };
      }
      return o;
    }, {});
    return { wildcards, wcLen, secret };
  }
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/lib/redactor.js
var require_redactor = __commonJS((exports, module) => {
  var rx = require_rx();
  module.exports = redactor;
  function redactor({ secret, serialize: serialize2, wcLen, strict, isCensorFct, censorFctTakesPath }, state) {
    const redact = Function("o", `
    if (typeof o !== 'object' || o == null) {
      ${strictImpl(strict, serialize2)}
    }
    const { censor, secret } = this
    const originalSecret = {}
    const secretKeys = Object.keys(secret)
    for (var i = 0; i < secretKeys.length; i++) {
      originalSecret[secretKeys[i]] = secret[secretKeys[i]]
    }

    ${redactTmpl(secret, isCensorFct, censorFctTakesPath)}
    this.compileRestore()
    ${dynamicRedactTmpl(wcLen > 0, isCensorFct, censorFctTakesPath)}
    this.secret = originalSecret
    ${resultTmpl(serialize2)}
  `).bind(state);
    redact.state = state;
    if (serialize2 === false) {
      redact.restore = (o) => state.restore(o);
    }
    return redact;
  }
  function redactTmpl(secret, isCensorFct, censorFctTakesPath) {
    return Object.keys(secret).map((path) => {
      const { escPath, leadingBracket, path: arrPath } = secret[path];
      const skip = leadingBracket ? 1 : 0;
      const delim = leadingBracket ? "" : ".";
      const hops = [];
      var match;
      while ((match = rx.exec(path)) !== null) {
        const [, ix] = match;
        const { index, input } = match;
        if (index > skip)
          hops.push(input.substring(0, index - (ix ? 0 : 1)));
      }
      var existence = hops.map((p) => `o${delim}${p}`).join(" && ");
      if (existence.length === 0)
        existence += `o${delim}${path} != null`;
      else
        existence += ` && o${delim}${path} != null`;
      const circularDetection = `
      switch (true) {
        ${hops.reverse().map((p) => `
          case o${delim}${p} === censor:
            secret[${escPath}].circle = ${JSON.stringify(p)}
            break
        `).join(`
`)}
      }
    `;
      const censorArgs = censorFctTakesPath ? `val, ${JSON.stringify(arrPath)}` : `val`;
      return `
      if (${existence}) {
        const val = o${delim}${path}
        if (val === censor) {
          secret[${escPath}].precensored = true
        } else {
          secret[${escPath}].val = val
          o${delim}${path} = ${isCensorFct ? `censor(${censorArgs})` : "censor"}
          ${circularDetection}
        }
      }
    `;
    }).join(`
`);
  }
  function dynamicRedactTmpl(hasWildcards, isCensorFct, censorFctTakesPath) {
    return hasWildcards === true ? `
    {
      const { wildcards, wcLen, groupRedact, nestedRedact } = this
      for (var i = 0; i < wcLen; i++) {
        const { before, beforeStr, after, nested } = wildcards[i]
        if (nested === true) {
          secret[beforeStr] = secret[beforeStr] || []
          nestedRedact(secret[beforeStr], o, before, after, censor, ${isCensorFct}, ${censorFctTakesPath})
        } else secret[beforeStr] = groupRedact(o, before, censor, ${isCensorFct}, ${censorFctTakesPath})
      }
    }
  ` : "";
  }
  function resultTmpl(serialize2) {
    return serialize2 === false ? `return o` : `
    var s = this.serialize(o)
    this.restore(o)
    return s
  `;
  }
  function strictImpl(strict, serialize2) {
    return strict === true ? `throw Error('fast-redact: primitives cannot be redacted')` : serialize2 === false ? `return o` : `return this.serialize(o)`;
  }
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/lib/modifiers.js
var require_modifiers = __commonJS((exports, module) => {
  module.exports = {
    groupRedact,
    groupRestore,
    nestedRedact,
    nestedRestore
  };
  function groupRestore({ keys: keys2, values, target }) {
    if (target == null || typeof target === "string")
      return;
    const length = keys2.length;
    for (var i = 0;i < length; i++) {
      const k = keys2[i];
      target[k] = values[i];
    }
  }
  function groupRedact(o, path, censor, isCensorFct, censorFctTakesPath) {
    const target = get(o, path);
    if (target == null || typeof target === "string")
      return { keys: null, values: null, target, flat: true };
    const keys2 = Object.keys(target);
    const keysLength = keys2.length;
    const pathLength = path.length;
    const pathWithKey = censorFctTakesPath ? [...path] : undefined;
    const values = new Array(keysLength);
    for (var i = 0;i < keysLength; i++) {
      const key = keys2[i];
      values[i] = target[key];
      if (censorFctTakesPath) {
        pathWithKey[pathLength] = key;
        target[key] = censor(target[key], pathWithKey);
      } else if (isCensorFct) {
        target[key] = censor(target[key]);
      } else {
        target[key] = censor;
      }
    }
    return { keys: keys2, values, target, flat: true };
  }
  function nestedRestore(instructions) {
    for (let i = 0;i < instructions.length; i++) {
      const { target, path, value } = instructions[i];
      let current = target;
      for (let i2 = path.length - 1;i2 > 0; i2--) {
        current = current[path[i2]];
      }
      current[path[0]] = value;
    }
  }
  function nestedRedact(store, o, path, ns, censor, isCensorFct, censorFctTakesPath) {
    const target = get(o, path);
    if (target == null)
      return;
    const keys2 = Object.keys(target);
    const keysLength = keys2.length;
    for (var i = 0;i < keysLength; i++) {
      const key = keys2[i];
      specialSet(store, target, key, path, ns, censor, isCensorFct, censorFctTakesPath);
    }
    return store;
  }
  function has(obj, prop) {
    return obj !== undefined && obj !== null ? "hasOwn" in Object ? Object.hasOwn(obj, prop) : Object.prototype.hasOwnProperty.call(obj, prop) : false;
  }
  function specialSet(store, o, k, path, afterPath, censor, isCensorFct, censorFctTakesPath) {
    const afterPathLen = afterPath.length;
    const lastPathIndex = afterPathLen - 1;
    const originalKey = k;
    var i = -1;
    var n;
    var nv;
    var ov;
    var oov = null;
    var wc = null;
    var kIsWc;
    var wcov;
    var consecutive = false;
    var level = 0;
    var depth = 0;
    var redactPathCurrent = tree();
    ov = n = o[k];
    if (typeof n !== "object")
      return;
    while (n != null && ++i < afterPathLen) {
      depth += 1;
      k = afterPath[i];
      oov = ov;
      if (k !== "*" && !wc && !(typeof n === "object" && (k in n))) {
        break;
      }
      if (k === "*") {
        if (wc === "*") {
          consecutive = true;
        }
        wc = k;
        if (i !== lastPathIndex) {
          continue;
        }
      }
      if (wc) {
        const wcKeys = Object.keys(n);
        for (var j = 0;j < wcKeys.length; j++) {
          const wck = wcKeys[j];
          wcov = n[wck];
          kIsWc = k === "*";
          if (consecutive) {
            redactPathCurrent = node(redactPathCurrent, wck, depth);
            level = i;
            ov = iterateNthLevel(wcov, level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, o[originalKey], depth + 1);
          } else {
            if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
              if (kIsWc) {
                ov = wcov;
              } else {
                ov = wcov[k];
              }
              nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov) : censor;
              if (kIsWc) {
                const rv = restoreInstr(node(redactPathCurrent, wck, depth), ov, o[originalKey]);
                store.push(rv);
                n[wck] = nv;
              } else {
                if (wcov[k] === nv) {} else if (nv === undefined && censor !== undefined || has(wcov, k) && nv === ov) {
                  redactPathCurrent = node(redactPathCurrent, wck, depth);
                } else {
                  redactPathCurrent = node(redactPathCurrent, wck, depth);
                  const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, o[originalKey]);
                  store.push(rv);
                  wcov[k] = nv;
                }
              }
            }
          }
        }
        wc = null;
      } else {
        ov = n[k];
        redactPathCurrent = node(redactPathCurrent, k, depth);
        nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov) : censor;
        if (has(n, k) && nv === ov || nv === undefined && censor !== undefined) {} else {
          const rv = restoreInstr(redactPathCurrent, ov, o[originalKey]);
          store.push(rv);
          n[k] = nv;
        }
        n = n[k];
      }
      if (typeof n !== "object")
        break;
      if (ov === oov || typeof ov === "undefined") {}
    }
  }
  function get(o, p) {
    var i = -1;
    var l = p.length;
    var n = o;
    while (n != null && ++i < l) {
      n = n[p[i]];
    }
    return n;
  }
  function iterateNthLevel(wcov, level, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth) {
    if (level === 0) {
      if (kIsWc || typeof wcov === "object" && wcov !== null && k in wcov) {
        if (kIsWc) {
          ov = wcov;
        } else {
          ov = wcov[k];
        }
        nv = i !== lastPathIndex ? ov : isCensorFct ? censorFctTakesPath ? censor(ov, [...path, originalKey, ...afterPath]) : censor(ov) : censor;
        if (kIsWc) {
          const rv = restoreInstr(redactPathCurrent, ov, parent);
          store.push(rv);
          n[wck] = nv;
        } else {
          if (wcov[k] === nv) {} else if (nv === undefined && censor !== undefined || has(wcov, k) && nv === ov) {} else {
            const rv = restoreInstr(node(redactPathCurrent, k, depth + 1), ov, parent);
            store.push(rv);
            wcov[k] = nv;
          }
        }
      }
    }
    for (const key in wcov) {
      if (typeof wcov[key] === "object") {
        redactPathCurrent = node(redactPathCurrent, key, depth);
        iterateNthLevel(wcov[key], level - 1, k, path, afterPath, censor, isCensorFct, censorFctTakesPath, originalKey, n, nv, ov, kIsWc, wck, i, lastPathIndex, redactPathCurrent, store, parent, depth + 1);
      }
    }
  }
  function tree() {
    return { parent: null, key: null, children: [], depth: 0 };
  }
  function node(parent, key, depth) {
    if (parent.depth === depth) {
      return node(parent.parent, key, depth);
    }
    var child = {
      parent,
      key,
      depth,
      children: []
    };
    parent.children.push(child);
    return child;
  }
  function restoreInstr(node2, value, target) {
    let current = node2;
    const path = [];
    do {
      path.push(current.key);
      current = current.parent;
    } while (current.parent != null);
    return { path, value, target };
  }
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/lib/restorer.js
var require_restorer = __commonJS((exports, module) => {
  var { groupRestore, nestedRestore } = require_modifiers();
  module.exports = restorer;
  function restorer() {
    return function compileRestore() {
      if (this.restore) {
        this.restore.state.secret = this.secret;
        return;
      }
      const { secret, wcLen } = this;
      const paths = Object.keys(secret);
      const resetters = resetTmpl(secret, paths);
      const hasWildcards = wcLen > 0;
      const state = hasWildcards ? { secret, groupRestore, nestedRestore } : { secret };
      this.restore = Function("o", restoreTmpl(resetters, paths, hasWildcards)).bind(state);
      this.restore.state = state;
    };
  }
  function resetTmpl(secret, paths) {
    return paths.map((path) => {
      const { circle, escPath, leadingBracket } = secret[path];
      const delim = leadingBracket ? "" : ".";
      const reset = circle ? `o.${circle} = secret[${escPath}].val` : `o${delim}${path} = secret[${escPath}].val`;
      const clear = `secret[${escPath}].val = undefined`;
      return `
      if (secret[${escPath}].val !== undefined) {
        try { ${reset} } catch (e) {}
        ${clear}
      }
    `;
    }).join("");
  }
  function restoreTmpl(resetters, paths, hasWildcards) {
    const dynamicReset = hasWildcards === true ? `
    const keys = Object.keys(secret)
    const len = keys.length
    for (var i = len - 1; i >= ${paths.length}; i--) {
      const k = keys[i]
      const o = secret[k]
      if (o) {
        if (o.flat === true) this.groupRestore(o)
        else this.nestedRestore(o)
        secret[k] = null
      }
    }
  ` : "";
    return `
    const secret = this.secret
    ${dynamicReset}
    ${resetters}
    return o
  `;
  }
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/lib/state.js
var require_state = __commonJS((exports, module) => {
  module.exports = state;
  function state(o) {
    const {
      secret,
      censor,
      compileRestore,
      serialize: serialize2,
      groupRedact,
      nestedRedact,
      wildcards,
      wcLen
    } = o;
    const builder = [{ secret, censor, compileRestore }];
    if (serialize2 !== false)
      builder.push({ serialize: serialize2 });
    if (wcLen > 0)
      builder.push({ groupRedact, nestedRedact, wildcards, wcLen });
    return Object.assign(...builder);
  }
});

// ../../node_modules/.bun/fast-redact@3.5.0/node_modules/fast-redact/index.js
var require_fast_redact = __commonJS((exports, module) => {
  var validator = require_validator();
  var parse = require_parse();
  var redactor = require_redactor();
  var restorer = require_restorer();
  var { groupRedact, nestedRedact } = require_modifiers();
  var state = require_state();
  var rx = require_rx();
  var validate = validator();
  var noop = (o) => o;
  noop.restore = noop;
  var DEFAULT_CENSOR = "[REDACTED]";
  fastRedact.rx = rx;
  fastRedact.validator = validator;
  module.exports = fastRedact;
  function fastRedact(opts = {}) {
    const paths = Array.from(new Set(opts.paths || []));
    const serialize2 = "serialize" in opts ? opts.serialize === false ? opts.serialize : typeof opts.serialize === "function" ? opts.serialize : JSON.stringify : JSON.stringify;
    const remove = opts.remove;
    if (remove === true && serialize2 !== JSON.stringify) {
      throw Error("fast-redact – remove option may only be set when serializer is JSON.stringify");
    }
    const censor = remove === true ? undefined : ("censor" in opts) ? opts.censor : DEFAULT_CENSOR;
    const isCensorFct = typeof censor === "function";
    const censorFctTakesPath = isCensorFct && censor.length > 1;
    if (paths.length === 0)
      return serialize2 || noop;
    validate({ paths, serialize: serialize2, censor });
    const { wildcards, wcLen, secret } = parse({ paths, censor });
    const compileRestore = restorer();
    const strict = "strict" in opts ? opts.strict : true;
    return redactor({ secret, wcLen, serialize: serialize2, strict, isCensorFct, censorFctTakesPath }, state({
      secret,
      censor,
      compileRestore,
      serialize: serialize2,
      groupRedact,
      nestedRedact,
      wildcards,
      wcLen
    }));
  }
});

// ../logger/src/logger.ts
function addLogListener(listener) {
  logListeners.add(listener);
  return () => logListeners.delete(listener);
}
function removeLogListener(listener) {
  logListeners.delete(listener);
}
function shouldLog(messageLevel, currentLevel) {
  const messagePriority = LOG_LEVEL_PRIORITY[messageLevel.toLowerCase()] || 30;
  const currentPriority = LOG_LEVEL_PRIORITY[currentLevel.toLowerCase()] || 30;
  return messagePriority >= currentPriority;
}
function safeStringify(obj) {
  try {
    const seen = new WeakSet;
    return JSON.stringify(obj, (_, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value))
          return "[Circular]";
        seen.add(value);
      }
      return value;
    });
  } catch {
    return String(obj);
  }
}
function parseBooleanFromText(value) {
  if (!value)
    return false;
  const normalized = value.toLowerCase().trim();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "on";
}
function formatExtraValue(value) {
  if (value === null)
    return "null";
  if (value === undefined)
    return "undefined";
  if (typeof value === "string")
    return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (value instanceof Error)
    return value.message;
  return safeStringify(value);
}
function formatPrettyLog(context, message, isJsonMode) {
  if (isJsonMode) {
    return message;
  }
  const src = context.src;
  const srcPart = src ? `[${src.toUpperCase()}] ` : "";
  const excludeKeys = ["src", "agentId", "agentName"];
  const extraPairs = [];
  for (const [key, value] of Object.entries(context)) {
    if (excludeKeys.includes(key))
      continue;
    if (value === undefined)
      continue;
    extraPairs.push(`${key}=${formatExtraValue(value)}`);
  }
  const extrasPart = extraPairs.length > 0 ? ` (${extraPairs.join(", ")})` : "";
  return `${srcPart}${message}${extrasPart}`;
}
function getFs() {
  if (_fs)
    return _fs;
  try {
    _fs = __require("node:fs");
    return _fs;
  } catch {
    return null;
  }
}
function stripAnsi(str) {
  const ESC = "\x1B";
  const BEL = "\x07";
  const re = new RegExp(`${ESC}(?:\\[[\\x20-\\x3F]*[\\x40-\\x7E]|\\].*?(?:${BEL}|${ESC}\\\\|\\(B))`, "g");
  return str.replace(re, "");
}
function ensureFileLog() {
  if (_fileLogState === "active")
    return true;
  if (_fileLogState === "disabled")
    return false;
  _fileLogState = "disabled";
  try {
    if (typeof process === "undefined" || !process.env || !process.versions)
      return false;
    if (!process.versions.node && !process.versions.bun)
      return false;
    const logFileEnv = process.env.LOG_FILE;
    if (!logFileEnv || logFileEnv.trim() === "" || logFileEnv.trim() === "0" || logFileEnv.trim().toLowerCase() === "false") {
      return false;
    }
    const fs = getFs();
    if (!fs)
      return false;
    const pathMod = __require("node:path");
    const isBooleanFlag = ["true", "1", "yes", "on"].includes(logFileEnv.trim().toLowerCase());
    const logFilePath = isBooleanFlag ? pathMod.join(process.cwd(), "output.log") : logFileEnv.trim();
    const logDir = pathMod.dirname(isBooleanFlag ? pathMod.join(process.cwd(), "output.log") : logFilePath);
    fs.mkdirSync(logDir, { recursive: true });
    const promptLogPath = pathMod.join(logDir, "prompts.log");
    const chatLogPath = pathMod.join(logDir, "chat.log");
    _fileLogFd = fs.openSync(logFilePath, "a");
    _promptLogFd = fs.openSync(promptLogPath, "a");
    _chatLogFd = fs.openSync(chatLogPath, "a");
    _fileLogState = "active";
    process.on("exit", () => {
      const fs2 = getFs();
      if (fs2 && _fileLogFd !== null) {
        try {
          fs2.closeSync(_fileLogFd);
        } catch {}
        _fileLogFd = null;
      }
      if (fs2 && _promptLogFd !== null) {
        try {
          fs2.closeSync(_promptLogFd);
        } catch {}
        _promptLogFd = null;
      }
      if (fs2 && _chatLogFd !== null) {
        try {
          fs2.closeSync(_chatLogFd);
        } catch {}
        _chatLogFd = null;
      }
    });
    return true;
  } catch {
    return false;
  }
}
function writeLogEntryToFile(entry) {
  if (!ensureFileLog())
    return;
  try {
    const fs = getFs();
    if (!fs)
      return;
    const fd = _fileLogFd;
    if (fd === null)
      return;
    const timestamp = new Date(entry.time).toISOString();
    const levelStr = LEVEL_TO_NAME[entry.level ?? 30] || "info";
    const line = `${timestamp} [${levelStr.toUpperCase().padEnd(8)}] ${stripAnsi(entry.msg)}
`;
    fs.writeSync(fd, line);
  } catch (error) {
    if (!_fileLogWriteErrorWarned) {
      _fileLogWriteErrorWarned = true;
      console.error(`[logger] failed to write to the log file; further errors are suppressed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
function promptSlug(counter, agentName, modelType) {
  return `#${String(counter).padStart(4, "0")}/${agentName}/${modelType}`;
}
function writeToPromptLog(slug, kind, modelType, body, metadata) {
  if (!ensureFileLog() || _promptLogFd === null)
    return;
  try {
    const fs = getFs();
    if (!fs)
      return;
    const sep = "=".repeat(80);
    let header = `${sep}
 ${slug}  ${kind}: ${modelType} (${body.length} chars)
`;
    header += ` ${new Date().toISOString()}
`;
    if (metadata) {
      header += ` ${JSON.stringify(metadata, null, 2)}
`;
    }
    header += `${sep}
`;
    fs.writeSync(_promptLogFd, header);
    if (body.length > MAX_PROMPT_LOG_CHARS) {
      fs.writeSync(_promptLogFd, body.substring(0, MAX_PROMPT_LOG_CHARS));
      fs.writeSync(_promptLogFd, `
... [TRUNCATED - ${body.length - MAX_PROMPT_LOG_CHARS} more chars]
`);
    } else {
      fs.writeSync(_promptLogFd, body);
    }
    fs.writeSync(_promptLogFd, `
${sep}

`);
  } catch {}
}
function logPrompt(modelType, prompt, metadata) {
  if (!ensureFileLog())
    return "";
  const counter = ++_promptLogCounter;
  const agentName = metadata?.agentName ?? "unknown";
  const slug = promptSlug(counter, agentName, modelType);
  writeToPromptLog(slug, "PROMPT", modelType, prompt, {
    ...metadata,
    promptSlug: slug
  });
  return slug;
}
function logResponse(modelType, response, metadata) {
  if (!ensureFileLog())
    return "";
  const slug = metadata?.promptSlug;
  if (!slug) {
    logger.warn({ src: "logger" }, "logResponse missing promptSlug - responses can't be correlated");
    return "";
  }
  writeToPromptLog(slug, "RESPONSE", modelType, response, metadata);
  return slug;
}
function escapeChatPreview(text) {
  const safe = text.length > 1e4 ? text.slice(0, 1e4) : text;
  const oneLine = safe.replace(/\s+/g, " ").trim();
  return oneLine.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
}
function writeChatLine(line) {
  if (!ensureFileLog() || _chatLogFd === null)
    return;
  try {
    const fs = getFs();
    if (!fs)
      return;
    const timestamp = new Date().toISOString();
    fs.writeSync(_chatLogFd, `${timestamp} ${line}
`);
  } catch {}
}
function logChatIn(params) {
  const preview = escapeChatPreview(params.text.length > CHAT_PREVIEW_IN_MAX ? `${params.text.slice(0, CHAT_PREVIEW_IN_MAX)}...` : params.text);
  const roomShort = params.roomId.slice(0, 8);
  const msgShort = params.messageId.slice(0, 8);
  const source = params.source ?? "unknown";
  const line = `[CHAT:IN]  #agent:${params.agentName} room=${roomShort} msg=${msgShort} source=${source} "${preview}"`;
  writeChatLine(line);
  return line;
}
function logChatOut(params) {
  const roomShort = params.roomId.slice(0, 8);
  let part = `[CHAT:OUT] #agent:${params.agentName} room=${roomShort} action=${params.action}`;
  if (params.actions && params.actions.length > 0) {
    part += ` actions=${params.actions.join(",")}`;
  }
  if (params.emoji) {
    part += ` emoji=${params.emoji}`;
  }
  if (params.text !== undefined && params.text !== "") {
    const preview = escapeChatPreview(params.text.length > CHAT_PREVIEW_OUT_MAX ? `${params.text.slice(0, CHAT_PREVIEW_OUT_MAX)}...` : params.text);
    part += ` len=${params.text.length} "${preview}"`;
  } else if (params.emoji) {
    part += " len=0";
  }
  if (params.providers && params.providers.length > 0) {
    part += ` providers=${params.providers.join(",")}`;
  }
  if (params.reasoning !== undefined && params.reasoning !== "") {
    const safe = escapeChatPreview(params.reasoning.length > 80 ? `${params.reasoning.slice(0, 80)}...` : params.reasoning);
    part += ` reasoning="${safe}"`;
  }
  writeChatLine(part);
  return part;
}
function createInMemoryDestination(maxLogs = 100) {
  const logs = [];
  return {
    write(entry) {
      logs.push(entry);
      if (logs.length > maxLogs) {
        logs.shift();
      }
      for (const listener of logListeners) {
        listener(entry);
      }
    },
    clear() {
      logs.length = 0;
    },
    recentLogs() {
      return logs.map((entry) => {
        const timestamp = showTimestamps ? new Date(entry.time).toISOString() : "";
        const levelStr = LEVEL_TO_NAME[entry.level ?? 30] || "info";
        return `${timestamp} ${levelStr} ${entry.msg}`.trim();
      }).join(`
`);
    }
  };
}
function sealAdze(base) {
  let chain = dist_default;
  const namespaces = [];
  if (typeof base.namespace === "string")
    namespaces.push(base.namespace);
  if (Array.isArray(base.namespaces))
    namespaces.push(...base.namespaces);
  if (namespaces.length > 0) {
    chain = chain.ns(...namespaces);
  }
  const metaBase = { ...base };
  delete metaBase.namespace;
  delete metaBase.namespaces;
  if (!metaBase.name) {
    metaBase.name = "elizaos";
  }
  if (!metaBase.pid && typeof process !== "undefined" && process.pid) {
    metaBase.pid = process.pid;
  }
  if (!metaBase.environment && typeof process !== "undefined" && process.env) {
    metaBase.environment = "development";
  }
  if (!metaBase.serverId) {
    metaBase.serverId = serverId;
  }
  if (raw && !metaBase.hostname) {
    let hostname = "unknown";
    if (typeof process !== "undefined" && process.platform) {
      const os = __require("node:os");
      hostname = os.hostname();
    } else {
      const browserLocation = globalThis.location;
      if (browserLocation) {
        hostname = browserLocation.hostname || "browser";
      }
    }
    metaBase.hostname = hostname;
  }
  const globalConfig = {
    activeLevel: getAdzeActiveLevel(),
    format: raw ? "json" : "pretty",
    timestampFormatter: showTimestamps ? undefined : () => "",
    withEmoji: false,
    levels: customLevelConfig
  };
  return chain.meta(metaBase).seal(globalConfig);
}
function extractBindingsConfig(bindings) {
  let level = effectiveLogLevel;
  let base = {};
  let maxMemoryLogs;
  if (typeof bindings === "object" && bindings !== null) {
    if ("level" in bindings) {
      level = bindings.level;
    }
    if ("maxMemoryLogs" in bindings && typeof bindings.maxMemoryLogs === "number") {
      maxMemoryLogs = bindings.maxMemoryLogs;
    }
    const { level: _, maxMemoryLogs: __, ...rest } = bindings;
    base = rest;
  }
  return { level, base, maxMemoryLogs };
}
function createLogger(bindings = false) {
  const { level, base, maxMemoryLogs } = extractBindingsConfig(bindings);
  if (typeof maxMemoryLogs === "number" && maxMemoryLogs > 0) {
    globalInMemoryDestination.clear();
  }
  const forceBrowser = typeof bindings === "object" && bindings && "__forceType" in bindings && bindings.__forceType === "browser";
  if (forceBrowser) {
    const levelStr2 = typeof level === "number" ? "info" : level || effectiveLogLevel;
    const currentLevel2 = levelStr2.toLowerCase();
    const formatArgs = (...args) => {
      return args.map((arg) => {
        if (typeof arg === "string")
          return arg;
        if (arg instanceof Error)
          return arg.message;
        return safeStringify(arg);
      }).join(" ");
    };
    const logToConsole = (method, ...args) => {
      if (!shouldLog(method, currentLevel2)) {
        return;
      }
      const message = formatArgs(...args);
      const consoleMethod = method === "fatal" ? "error" : method === "trace" || method === "verbose" ? "debug" : method === "success" || method === "progress" ? "info" : method === "log" ? "log" : (method in console) && typeof console[method] === "function" ? method : "log";
      const consoleFn = console[consoleMethod];
      if (consoleFn && typeof consoleFn === "function") {
        consoleFn(message);
      }
    };
    const safeRedact2 = (obj) => {
      try {
        const copy = { ...obj };
        redact(copy);
        return copy;
      } catch {
        return obj;
      }
    };
    const adaptArgs2 = (obj, msg, ...args) => {
      if (typeof obj === "string") {
        return msg !== undefined ? [obj, msg, ...args] : [obj, ...args];
      }
      if (obj instanceof Error) {
        return msg !== undefined ? [obj.message, msg, ...args] : [obj.message, ...args];
      }
      const redactedObj = safeRedact2(obj);
      if (msg !== undefined) {
        const formatted2 = formatPrettyLog(redactedObj, msg, false);
        return [formatted2, ...args];
      }
      const formatted = formatPrettyLog(redactedObj, "", false);
      return formatted ? [formatted, ...args] : [...args];
    };
    return {
      level: currentLevel2,
      trace: (obj, msg, ...args) => logToConsole("trace", ...adaptArgs2(obj, msg, ...args)),
      debug: (obj, msg, ...args) => logToConsole("debug", ...adaptArgs2(obj, msg, ...args)),
      info: (obj, msg, ...args) => logToConsole("info", ...adaptArgs2(obj, msg, ...args)),
      warn: (obj, msg, ...args) => logToConsole("warn", ...adaptArgs2(obj, msg, ...args)),
      error: (obj, msg, ...args) => logToConsole("error", ...adaptArgs2(obj, msg, ...args)),
      fatal: (obj, msg, ...args) => logToConsole("fatal", ...adaptArgs2(obj, msg, ...args)),
      success: (obj, msg, ...args) => logToConsole("success", ...adaptArgs2(obj, msg, ...args)),
      progress: (obj, msg, ...args) => logToConsole("progress", ...adaptArgs2(obj, msg, ...args)),
      log: (obj, msg, ...args) => logToConsole("log", ...adaptArgs2(obj, msg, ...args)),
      clear: () => {
        if (typeof console.clear === "function")
          console.clear();
      },
      child: (childBindings) => createLogger({
        level: currentLevel2,
        ...base,
        ...childBindings,
        __forceType: "browser"
      })
    };
  }
  const sealed = sealAdze(base);
  const levelStr = typeof level === "number" ? "info" : level || effectiveLogLevel;
  const currentLevel = levelStr.toLowerCase();
  const invoke = (method, ...args) => {
    if (!shouldLog(method, currentLevel)) {
      return;
    }
    let msg = "";
    if (args.length > 0) {
      msg = args.map((arg) => {
        if (typeof arg === "string")
          return arg;
        if (arg instanceof Error)
          return arg.message;
        return safeStringify(arg);
      }).join(" ");
    }
    if (base.namespace) {
      msg = `#${base.namespace}  ${msg}`;
    }
    const entry = {
      time: Date.now(),
      level: LOG_LEVEL_PRIORITY[method.toLowerCase()] || LOG_LEVEL_PRIORITY.info,
      msg
    };
    globalInMemoryDestination.write(entry);
    writeLogEntryToFile(entry);
    let adzeMethod = method;
    let adzeArgs = args;
    if (method === "fatal") {
      adzeMethod = "alert";
    } else if (method === "progress") {
      adzeMethod = "info";
      adzeArgs = ["[PROGRESS]", ...args];
    } else if (method === "success") {
      adzeMethod = "info";
      adzeArgs = ["[SUCCESS]", ...args];
    } else if (method === "trace") {
      adzeMethod = "verbose";
    }
    try {
      const loggerWithMethods = sealed;
      const logMethod = loggerWithMethods[adzeMethod];
      if (typeof logMethod === "function") {
        logMethod.call(loggerWithMethods, ...adzeArgs);
      }
    } catch {}
  };
  const safeRedact = (obj) => {
    try {
      const copy = { ...obj };
      redact(copy);
      return copy;
    } catch {
      return obj;
    }
  };
  const adaptArgs = (obj, msg, ...args) => {
    if (typeof obj === "string") {
      return msg !== undefined ? [obj, msg, ...args] : [obj, ...args];
    }
    if (obj instanceof Error) {
      return msg !== undefined ? [obj.message, { error: obj }, msg, ...args] : [obj.message, { error: obj }, ...args];
    }
    const redactedObj = safeRedact(obj);
    if (msg !== undefined) {
      if (!raw) {
        const formatted = formatPrettyLog(redactedObj, msg, raw);
        return [formatted, ...args];
      }
      return [msg, redactedObj, ...args];
    }
    if (!raw) {
      const formatted = formatPrettyLog(redactedObj, "", raw);
      return formatted ? [formatted, ...args] : [...args];
    }
    return [redactedObj, ...args];
  };
  const trace = (obj, msg, ...args) => invoke("verbose", ...adaptArgs(obj, msg, ...args));
  const debug = (obj, msg, ...args) => invoke("debug", ...adaptArgs(obj, msg, ...args));
  const info = (obj, msg, ...args) => invoke("info", ...adaptArgs(obj, msg, ...args));
  const warn = (obj, msg, ...args) => invoke("warn", ...adaptArgs(obj, msg, ...args));
  const error = (obj, msg, ...args) => invoke("error", ...adaptArgs(obj, msg, ...args));
  const fatal = (obj, msg, ...args) => invoke("fatal", ...adaptArgs(obj, msg, ...args));
  const success = (obj, msg, ...args) => invoke("success", ...adaptArgs(obj, msg, ...args));
  const progress = (obj, msg, ...args) => invoke("progress", ...adaptArgs(obj, msg, ...args));
  const logFn = (obj, msg, ...args) => invoke("log", ...adaptArgs(obj, msg, ...args));
  const clear = () => {
    const consoleClear = console.clear;
    if (typeof consoleClear === "function") {
      consoleClear();
    }
    globalInMemoryDestination.clear();
  };
  const child = (childBindings) => {
    return createLogger({ level: currentLevel, ...base, ...childBindings });
  };
  return {
    level: currentLevel,
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
    success,
    progress,
    log: logFn,
    clear,
    child
  };
}
var import_fast_redact, __loggerTestHooks, logListeners, LOG_LEVEL_PRIORITY, LEVEL_TO_NAME, DEFAULT_LOG_LEVEL = "info", effectiveLogLevel, customLevels, raw, showTimestamps, serverId, redact, _fileLogState = "pending", _fileLogFd = null, _fileLogWriteErrorWarned = false, _promptLogFd = null, _chatLogFd = null, _promptLogCounter = 0, _fs = null, MAX_PROMPT_LOG_CHARS = 1e5, CHAT_PREVIEW_IN_MAX = 200, CHAT_PREVIEW_OUT_MAX = 120, globalInMemoryDestination, getAdzeActiveLevel = () => {
  const level = effectiveLogLevel.toLowerCase();
  if (level === "trace")
    return "verbose";
  if (level === "debug")
    return "debug";
  if (level === "log")
    return "log";
  if (level === "info")
    return "info";
  if (level === "warn")
    return "warn";
  if (level === "error")
    return "error";
  if (level === "fatal")
    return "alert";
  return "info";
}, adzeActiveLevel, customLevelConfig, adzeStore, logger, elizaLogger, recentLogs = () => globalInMemoryDestination.recentLogs(), logger_default;
var init_logger = __esm(() => {
  init_dist();
  init_env();
  import_fast_redact = __toESM(require_fast_redact(), 1);
  __loggerTestHooks = {
    clearEnvCacheForTests: () => {},
    stripAnsi: (str) => stripAnsi(str)
  };
  logListeners = new Set;
  LOG_LEVEL_PRIORITY = {
    trace: 10,
    verbose: 10,
    debug: 20,
    success: 27,
    progress: 28,
    log: 29,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
    alert: 60
  };
  LEVEL_TO_NAME = {
    10: "trace",
    20: "debug",
    27: "success",
    28: "progress",
    29: "log",
    30: "info",
    40: "warn",
    50: "error",
    60: "fatal"
  };
  effectiveLogLevel = getEnv("LOG_LEVEL") || DEFAULT_LOG_LEVEL;
  customLevels = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    log: 29,
    progress: 28,
    success: 27,
    debug: 20,
    trace: 10
  };
  raw = parseBooleanFromText(getEnv("LOG_JSON_FORMAT"));
  showTimestamps = parseBooleanFromText(getEnv("LOG_TIMESTAMPS") ?? "true");
  serverId = getEnv("SERVER_ID") || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10));
  try {
    redact = import_fast_redact.default({
      paths: [
        "*.password",
        "*.passwd",
        "*.secret",
        "*.token",
        "*.apiKey",
        "*.api_key",
        "*.apiSecret",
        "*.api_secret",
        "*.authorization",
        "*.auth",
        "*.credential",
        "*.credentials",
        "*.privateKey",
        "*.private_key",
        "*.accessToken",
        "*.access_token",
        "*.refreshToken",
        "*.refresh_token",
        "*.cookie",
        "*.session",
        "*.jwt",
        "*.bearer"
      ],
      serialize: false,
      censor: "[REDACTED]"
    });
  } catch {
    redact = (obj) => obj;
    redact.restore = (obj) => obj;
  }
  globalInMemoryDestination = createInMemoryDestination();
  adzeActiveLevel = getAdzeActiveLevel();
  customLevelConfig = {
    alert: {
      levelName: "alert",
      level: 0,
      style: "font-size: 12px; color: #ff0000;",
      terminalStyle: ["bgRed", "white", "bold"],
      method: "error",
      emoji: ""
    },
    error: {
      levelName: "error",
      level: 1,
      style: "font-size: 12px; color: #ff0000;",
      terminalStyle: ["bgRed", "whiteBright", "bold"],
      method: "error",
      emoji: ""
    },
    warn: {
      levelName: "warn",
      level: 2,
      style: "font-size: 12px; color: #ffaa00;",
      terminalStyle: ["bgYellow", "black", "bold"],
      method: "warn",
      emoji: ""
    },
    info: {
      levelName: "info",
      level: 3,
      style: "font-size: 12px; color: #0099ff;",
      terminalStyle: ["cyan"],
      method: "info",
      emoji: ""
    },
    fail: {
      levelName: "fail",
      level: 4,
      style: "font-size: 12px; color: #ff6600;",
      terminalStyle: ["red", "underline"],
      method: "error",
      emoji: ""
    },
    success: {
      levelName: "success",
      level: 5,
      style: "font-size: 12px; color: #00cc00;",
      terminalStyle: ["green"],
      method: "log",
      emoji: ""
    },
    log: {
      levelName: "log",
      level: 6,
      style: "font-size: 12px; color: #888888;",
      terminalStyle: ["white"],
      method: "log",
      emoji: ""
    },
    debug: {
      levelName: "debug",
      level: 7,
      style: "font-size: 12px; color: #9b59b6;",
      terminalStyle: ["gray", "dim"],
      method: "debug",
      emoji: ""
    },
    verbose: {
      levelName: "verbose",
      level: 8,
      style: "font-size: 12px; color: #666666;",
      terminalStyle: ["gray", "dim", "italic"],
      method: "debug",
      emoji: ""
    }
  };
  adzeStore = setup({
    activeLevel: adzeActiveLevel,
    format: raw ? "json" : "pretty",
    timestampFormatter: showTimestamps ? undefined : () => "",
    withEmoji: false,
    levels: customLevelConfig
  });
  adzeStore.addListener("*", (log) => {
    try {
      const d = log.data;
      const dMessage = d?.message;
      const msg = Array.isArray(dMessage) ? dMessage.map((m) => typeof m === "string" ? m : safeStringify(m)).join(" ") : typeof dMessage === "string" ? dMessage : "";
      const entry = {
        time: Date.now(),
        level: d && typeof d.level === "number" ? d.level : undefined,
        msg
      };
      globalInMemoryDestination.write(entry);
    } catch {}
  });
  logger = createLogger();
  elizaLogger = logger;
  logger_default = logger;
});

// ../logger/src/index.ts
var init_src = __esm(() => {
  init_logger();
  init_logger();
});

// src/logger.ts
var init_logger2 = __esm(() => {
  init_src();
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/utils.js
var require_utils = __commonJS((exports) => {
  exports.__esModule = true;
  exports.extend = extend;
  exports.indexOf = indexOf;
  exports.escapeExpression = escapeExpression;
  exports.isEmpty = isEmpty;
  exports.createFrame = createFrame;
  exports.blockParams = blockParams;
  exports.appendContextPath = appendContextPath;
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;",
    "=": "&#x3D;"
  };
  var badChars = /[&<>"'`=]/g;
  var possible = /[&<>"'`=]/;
  function escapeChar(chr) {
    return escape[chr];
  }
  function extend(obj) {
    for (var i = 1;i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          obj[key] = arguments[i][key];
        }
      }
    }
    return obj;
  }
  var toString2 = Object.prototype.toString;
  exports.toString = toString2;
  var isFunction = function isFunction2(value) {
    return typeof value === "function";
  };
  if (isFunction(/x/)) {
    exports.isFunction = isFunction = function(value) {
      return typeof value === "function" && toString2.call(value) === "[object Function]";
    };
  }
  exports.isFunction = isFunction;
  var isArray = Array.isArray || function(value) {
    return value && typeof value === "object" ? toString2.call(value) === "[object Array]" : false;
  };
  exports.isArray = isArray;
  function indexOf(array, value) {
    for (var i = 0, len = array.length;i < len; i++) {
      if (array[i] === value) {
        return i;
      }
    }
    return -1;
  }
  function escapeExpression(string) {
    if (typeof string !== "string") {
      if (string && string.toHTML) {
        return string.toHTML();
      } else if (string == null) {
        return "";
      } else if (!string) {
        return string + "";
      }
      string = "" + string;
    }
    if (!possible.test(string)) {
      return string;
    }
    return string.replace(badChars, escapeChar);
  }
  function isEmpty(value) {
    if (!value && value !== 0) {
      return true;
    } else if (isArray(value) && value.length === 0) {
      return true;
    } else {
      return false;
    }
  }
  function createFrame(object) {
    var frame = extend({}, object);
    frame._parent = object;
    return frame;
  }
  function blockParams(params, ids) {
    params.path = ids;
    return params;
  }
  function appendContextPath(contextPath, id) {
    return (contextPath ? contextPath + "." : "") + id;
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/exception.js
var require_exception = __commonJS((exports, module) => {
  exports.__esModule = true;
  var errorProps = ["description", "fileName", "lineNumber", "endLineNumber", "message", "name", "number", "stack"];
  function Exception(message, node) {
    var loc = node && node.loc, line = undefined, endLineNumber = undefined, column = undefined, endColumn = undefined;
    if (loc) {
      line = loc.start.line;
      endLineNumber = loc.end.line;
      column = loc.start.column;
      endColumn = loc.end.column;
      message += " - " + line + ":" + column;
    }
    var tmp = Error.prototype.constructor.call(this, message);
    for (var idx = 0;idx < errorProps.length; idx++) {
      this[errorProps[idx]] = tmp[errorProps[idx]];
    }
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Exception);
    }
    try {
      if (loc) {
        this.lineNumber = line;
        this.endLineNumber = endLineNumber;
        if (Object.defineProperty) {
          Object.defineProperty(this, "column", {
            value: column,
            enumerable: true
          });
          Object.defineProperty(this, "endColumn", {
            value: endColumn,
            enumerable: true
          });
        } else {
          this.column = column;
          this.endColumn = endColumn;
        }
      }
    } catch (nop) {}
  }
  Exception.prototype = new Error;
  exports.default = Exception;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers/block-helper-missing.js
var require_block_helper_missing = __commonJS((exports, module) => {
  exports.__esModule = true;
  var _utils = require_utils();
  exports.default = function(instance) {
    instance.registerHelper("blockHelperMissing", function(context, options) {
      var { inverse, fn } = options;
      if (context === true) {
        return fn(this);
      } else if (context === false || context == null) {
        return inverse(this);
      } else if (_utils.isArray(context)) {
        if (context.length > 0) {
          if (options.ids) {
            options.ids = [options.name];
          }
          return instance.helpers.each(context, options);
        } else {
          return inverse(this);
        }
      } else {
        if (options.data && options.ids) {
          var data2 = _utils.createFrame(options.data);
          data2.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
          options = { data: data2 };
        }
        return fn(context, options);
      }
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers/each.js
var require_each = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _utils = require_utils();
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  exports.default = function(instance) {
    instance.registerHelper("each", function(context, options) {
      if (!options) {
        throw new _exception2["default"]("Must pass iterator to #each");
      }
      var { fn, inverse } = options, i = 0, ret = "", data2 = undefined, contextPath = undefined;
      if (options.data && options.ids) {
        contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + ".";
      }
      if (_utils.isFunction(context)) {
        context = context.call(this);
      }
      if (options.data) {
        data2 = _utils.createFrame(options.data);
      }
      function execIteration(field, index, last) {
        if (data2) {
          data2.key = field;
          data2.index = index;
          data2.first = index === 0;
          data2.last = !!last;
          if (contextPath) {
            data2.contextPath = contextPath + field;
          }
        }
        ret = ret + fn(context[field], {
          data: data2,
          blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
        });
      }
      if (context && typeof context === "object") {
        if (_utils.isArray(context)) {
          for (var j = context.length;i < j; i++) {
            if (i in context) {
              execIteration(i, i, i === context.length - 1);
            }
          }
        } else if (typeof Symbol === "function" && context[Symbol.iterator]) {
          var newContext = [];
          var iterator = context[Symbol.iterator]();
          for (var it = iterator.next();!it.done; it = iterator.next()) {
            newContext.push(it.value);
          }
          context = newContext;
          for (var j = context.length;i < j; i++) {
            execIteration(i, i, i === context.length - 1);
          }
        } else {
          (function() {
            var priorKey = undefined;
            Object.keys(context).forEach(function(key) {
              if (priorKey !== undefined) {
                execIteration(priorKey, i - 1);
              }
              priorKey = key;
              i++;
            });
            if (priorKey !== undefined) {
              execIteration(priorKey, i - 1, true);
            }
          })();
        }
      }
      if (i === 0) {
        ret = inverse(this);
      }
      return ret;
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers/helper-missing.js
var require_helper_missing = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  exports.default = function(instance) {
    instance.registerHelper("helperMissing", function() {
      if (arguments.length === 1) {
        return;
      } else {
        throw new _exception2["default"]('Missing helper: "' + arguments[arguments.length - 1].name + '"');
      }
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers/if.js
var require_if = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _utils = require_utils();
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  exports.default = function(instance) {
    instance.registerHelper("if", function(conditional, options) {
      if (arguments.length != 2) {
        throw new _exception2["default"]("#if requires exactly one argument");
      }
      if (_utils.isFunction(conditional)) {
        conditional = conditional.call(this);
      }
      if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    });
    instance.registerHelper("unless", function(conditional, options) {
      if (arguments.length != 2) {
        throw new _exception2["default"]("#unless requires exactly one argument");
      }
      return instance.helpers["if"].call(this, conditional, {
        fn: options.inverse,
        inverse: options.fn,
        hash: options.hash
      });
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers/log.js
var require_log = __commonJS((exports, module) => {
  exports.__esModule = true;
  exports.default = function(instance) {
    instance.registerHelper("log", function() {
      var args = [undefined], options = arguments[arguments.length - 1];
      for (var i = 0;i < arguments.length - 1; i++) {
        args.push(arguments[i]);
      }
      var level = 1;
      if (options.hash.level != null) {
        level = options.hash.level;
      } else if (options.data && options.data.level != null) {
        level = options.data.level;
      }
      args[0] = level;
      instance.log.apply(instance, args);
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers/lookup.js
var require_lookup = __commonJS((exports, module) => {
  exports.__esModule = true;
  exports.default = function(instance) {
    instance.registerHelper("lookup", function(obj, field, options) {
      if (!obj) {
        return obj;
      }
      return options.lookupProperty(obj, field);
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers/with.js
var require_with = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _utils = require_utils();
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  exports.default = function(instance) {
    instance.registerHelper("with", function(context, options) {
      if (arguments.length != 2) {
        throw new _exception2["default"]("#with requires exactly one argument");
      }
      if (_utils.isFunction(context)) {
        context = context.call(this);
      }
      var fn = options.fn;
      if (!_utils.isEmpty(context)) {
        var data2 = options.data;
        if (options.data && options.ids) {
          data2 = _utils.createFrame(options.data);
          data2.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
        }
        return fn(context, {
          data: data2,
          blockParams: _utils.blockParams([context], [data2 && data2.contextPath])
        });
      } else {
        return options.inverse(this);
      }
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/helpers.js
var require_helpers = __commonJS((exports) => {
  exports.__esModule = true;
  exports.registerDefaultHelpers = registerDefaultHelpers;
  exports.moveHelperToHooks = moveHelperToHooks;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _helpersBlockHelperMissing = require_block_helper_missing();
  var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);
  var _helpersEach = require_each();
  var _helpersEach2 = _interopRequireDefault(_helpersEach);
  var _helpersHelperMissing = require_helper_missing();
  var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);
  var _helpersIf = require_if();
  var _helpersIf2 = _interopRequireDefault(_helpersIf);
  var _helpersLog = require_log();
  var _helpersLog2 = _interopRequireDefault(_helpersLog);
  var _helpersLookup = require_lookup();
  var _helpersLookup2 = _interopRequireDefault(_helpersLookup);
  var _helpersWith = require_with();
  var _helpersWith2 = _interopRequireDefault(_helpersWith);
  function registerDefaultHelpers(instance) {
    _helpersBlockHelperMissing2["default"](instance);
    _helpersEach2["default"](instance);
    _helpersHelperMissing2["default"](instance);
    _helpersIf2["default"](instance);
    _helpersLog2["default"](instance);
    _helpersLookup2["default"](instance);
    _helpersWith2["default"](instance);
  }
  function moveHelperToHooks(instance, helperName, keepHelper) {
    if (instance.helpers[helperName]) {
      instance.hooks[helperName] = instance.helpers[helperName];
      if (!keepHelper) {
        instance.helpers[helperName] = undefined;
      }
    }
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/decorators/inline.js
var require_inline = __commonJS((exports, module) => {
  exports.__esModule = true;
  var _utils = require_utils();
  exports.default = function(instance) {
    instance.registerDecorator("inline", function(fn, props, container, options) {
      var ret = fn;
      if (!props.partials) {
        props.partials = {};
        ret = function(context, options2) {
          var original = container.partials;
          container.partials = _utils.extend({}, original, props.partials);
          var ret2 = fn(context, options2);
          container.partials = original;
          return ret2;
        };
      }
      props.partials[options.args[0]] = options.fn;
      return ret;
    });
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/decorators.js
var require_decorators = __commonJS((exports) => {
  exports.__esModule = true;
  exports.registerDefaultDecorators = registerDefaultDecorators;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _decoratorsInline = require_inline();
  var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);
  function registerDefaultDecorators(instance) {
    _decoratorsInline2["default"](instance);
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/logger.js
var require_logger = __commonJS((exports, module) => {
  exports.__esModule = true;
  var _utils = require_utils();
  var logger3 = {
    methodMap: ["debug", "info", "warn", "error"],
    level: "info",
    lookupLevel: function lookupLevel(level) {
      if (typeof level === "string") {
        var levelMap = _utils.indexOf(logger3.methodMap, level.toLowerCase());
        if (levelMap >= 0) {
          level = levelMap;
        } else {
          level = parseInt(level, 10);
        }
      }
      return level;
    },
    log: function log(level) {
      level = logger3.lookupLevel(level);
      if (typeof console !== "undefined" && logger3.lookupLevel(logger3.level) <= level) {
        var method = logger3.methodMap[level];
        if (!console[method]) {
          method = "log";
        }
        for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1;_key < _len; _key++) {
          message[_key - 1] = arguments[_key];
        }
        console[method].apply(console, message);
      }
    }
  };
  exports.default = logger3;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/internal/proto-access.js
var require_proto_access = __commonJS((exports) => {
  exports.__esModule = true;
  exports.createProtoAccessControl = createProtoAccessControl;
  exports.resultIsAllowed = resultIsAllowed;
  exports.resetLoggedProperties = resetLoggedProperties;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _utils = require_utils();
  var _logger = require_logger();
  var _logger2 = _interopRequireDefault(_logger);
  var loggedProperties = Object.create(null);
  function createProtoAccessControl(runtimeOptions) {
    var propertyWhiteList = Object.create(null);
    propertyWhiteList["__proto__"] = false;
    _utils.extend(propertyWhiteList, runtimeOptions.allowedProtoProperties);
    var methodWhiteList = Object.create(null);
    methodWhiteList["constructor"] = false;
    methodWhiteList["__defineGetter__"] = false;
    methodWhiteList["__defineSetter__"] = false;
    methodWhiteList["__lookupGetter__"] = false;
    methodWhiteList["__lookupSetter__"] = false;
    _utils.extend(methodWhiteList, runtimeOptions.allowedProtoMethods);
    return {
      properties: {
        whitelist: propertyWhiteList,
        defaultValue: runtimeOptions.allowProtoPropertiesByDefault
      },
      methods: {
        whitelist: methodWhiteList,
        defaultValue: runtimeOptions.allowProtoMethodsByDefault
      }
    };
  }
  function resultIsAllowed(result, protoAccessControl, propertyName) {
    if (typeof result === "function") {
      return checkWhiteList(protoAccessControl.methods, propertyName);
    } else {
      return checkWhiteList(protoAccessControl.properties, propertyName);
    }
  }
  function checkWhiteList(protoAccessControlForType, propertyName) {
    if (protoAccessControlForType.whitelist[propertyName] !== undefined) {
      return protoAccessControlForType.whitelist[propertyName] === true;
    }
    if (protoAccessControlForType.defaultValue !== undefined) {
      return protoAccessControlForType.defaultValue;
    }
    logUnexpecedPropertyAccessOnce(propertyName);
    return false;
  }
  function logUnexpecedPropertyAccessOnce(propertyName) {
    if (loggedProperties[propertyName] !== true) {
      loggedProperties[propertyName] = true;
      _logger2["default"].log("error", 'Handlebars: Access has been denied to resolve the property "' + propertyName + `" because it is not an "own property" of its parent.
` + `You can add a runtime option to disable the check or this warning:
` + "See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details");
    }
  }
  function resetLoggedProperties() {
    Object.keys(loggedProperties).forEach(function(propertyName) {
      delete loggedProperties[propertyName];
    });
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/base.js
var require_base = __commonJS((exports) => {
  exports.__esModule = true;
  exports.HandlebarsEnvironment = HandlebarsEnvironment;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _utils = require_utils();
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  var _helpers = require_helpers();
  var _decorators = require_decorators();
  var _logger = require_logger();
  var _logger2 = _interopRequireDefault(_logger);
  var _internalProtoAccess = require_proto_access();
  var VERSION = "4.7.9";
  exports.VERSION = VERSION;
  var COMPILER_REVISION = 8;
  exports.COMPILER_REVISION = COMPILER_REVISION;
  var LAST_COMPATIBLE_COMPILER_REVISION = 7;
  exports.LAST_COMPATIBLE_COMPILER_REVISION = LAST_COMPATIBLE_COMPILER_REVISION;
  var REVISION_CHANGES = {
    1: "<= 1.0.rc.2",
    2: "== 1.0.0-rc.3",
    3: "== 1.0.0-rc.4",
    4: "== 1.x.x",
    5: "== 2.0.0-alpha.x",
    6: ">= 2.0.0-beta.1",
    7: ">= 4.0.0 <4.3.0",
    8: ">= 4.3.0"
  };
  exports.REVISION_CHANGES = REVISION_CHANGES;
  var objectType = "[object Object]";
  function HandlebarsEnvironment(helpers, partials, decorators) {
    this.helpers = helpers || {};
    this.partials = partials || {};
    this.decorators = decorators || {};
    _helpers.registerDefaultHelpers(this);
    _decorators.registerDefaultDecorators(this);
  }
  HandlebarsEnvironment.prototype = {
    constructor: HandlebarsEnvironment,
    logger: _logger2["default"],
    log: _logger2["default"].log,
    registerHelper: function registerHelper(name, fn) {
      if (_utils.toString.call(name) === objectType) {
        if (fn) {
          throw new _exception2["default"]("Arg not supported with multiple helpers");
        }
        _utils.extend(this.helpers, name);
      } else {
        this.helpers[name] = fn;
      }
    },
    unregisterHelper: function unregisterHelper(name) {
      delete this.helpers[name];
    },
    registerPartial: function registerPartial(name, partial) {
      if (_utils.toString.call(name) === objectType) {
        _utils.extend(this.partials, name);
      } else {
        if (typeof partial === "undefined") {
          throw new _exception2["default"]('Attempting to register a partial called "' + name + '" as undefined');
        }
        this.partials[name] = partial;
      }
    },
    unregisterPartial: function unregisterPartial(name) {
      delete this.partials[name];
    },
    registerDecorator: function registerDecorator(name, fn) {
      if (_utils.toString.call(name) === objectType) {
        if (fn) {
          throw new _exception2["default"]("Arg not supported with multiple decorators");
        }
        _utils.extend(this.decorators, name);
      } else {
        this.decorators[name] = fn;
      }
    },
    unregisterDecorator: function unregisterDecorator(name) {
      delete this.decorators[name];
    },
    resetLoggedPropertyAccesses: function resetLoggedPropertyAccesses() {
      _internalProtoAccess.resetLoggedProperties();
    }
  };
  var log = _logger2["default"].log;
  exports.log = log;
  exports.createFrame = _utils.createFrame;
  exports.logger = _logger2["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/safe-string.js
var require_safe_string = __commonJS((exports, module) => {
  exports.__esModule = true;
  function SafeString(string) {
    this.string = string;
  }
  SafeString.prototype.toString = SafeString.prototype.toHTML = function() {
    return "" + this.string;
  };
  exports.default = SafeString;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/internal/wrapHelper.js
var require_wrapHelper = __commonJS((exports) => {
  exports.__esModule = true;
  exports.wrapHelper = wrapHelper;
  function wrapHelper(helper, transformOptionsFn) {
    if (typeof helper !== "function") {
      return helper;
    }
    var wrapper = function wrapper2() {
      var options = arguments[arguments.length - 1];
      arguments[arguments.length - 1] = transformOptionsFn(options);
      return helper.apply(this, arguments);
    };
    return wrapper;
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/runtime.js
var require_runtime = __commonJS((exports) => {
  exports.__esModule = true;
  exports.checkRevision = checkRevision;
  exports.template = template;
  exports.wrapProgram = wrapProgram;
  exports.resolvePartial = resolvePartial;
  exports.invokePartial = invokePartial;
  exports.noop = noop;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj["default"] = obj;
      return newObj;
    }
  }
  var _utils = require_utils();
  var Utils = _interopRequireWildcard(_utils);
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  var _base = require_base();
  var _helpers = require_helpers();
  var _internalWrapHelper = require_wrapHelper();
  var _internalProtoAccess = require_proto_access();
  function checkRevision(compilerInfo) {
    var compilerRevision = compilerInfo && compilerInfo[0] || 1, currentRevision = _base.COMPILER_REVISION;
    if (compilerRevision >= _base.LAST_COMPATIBLE_COMPILER_REVISION && compilerRevision <= _base.COMPILER_REVISION) {
      return;
    }
    if (compilerRevision < _base.LAST_COMPATIBLE_COMPILER_REVISION) {
      var runtimeVersions = _base.REVISION_CHANGES[currentRevision], compilerVersions = _base.REVISION_CHANGES[compilerRevision];
      throw new _exception2["default"]("Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").");
    } else {
      throw new _exception2["default"]("Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ").");
    }
  }
  function template(templateSpec, env2) {
    if (!env2) {
      throw new _exception2["default"]("No environment passed to template");
    }
    if (!templateSpec || !templateSpec.main) {
      throw new _exception2["default"]("Unknown template object: " + typeof templateSpec);
    }
    templateSpec.main.decorator = templateSpec.main_d;
    env2.VM.checkRevision(templateSpec.compiler);
    var templateWasPrecompiledWithCompilerV7 = templateSpec.compiler && templateSpec.compiler[0] === 7;
    function invokePartialWrapper(partial, context, options) {
      if (options.hash) {
        context = Utils.extend({}, context, options.hash);
        if (options.ids) {
          options.ids[0] = true;
        }
      }
      partial = env2.VM.resolvePartial.call(this, partial, context, options);
      options.hooks = this.hooks;
      options.protoAccessControl = this.protoAccessControl;
      var result = env2.VM.invokePartial.call(this, partial, context, options);
      if (result == null && env2.compile) {
        options.partials[options.name] = env2.compile(partial, templateSpec.compilerOptions, env2);
        result = options.partials[options.name](context, options);
      }
      if (result != null) {
        if (options.indent) {
          var lines = result.split(`
`);
          for (var i = 0, l = lines.length;i < l; i++) {
            if (!lines[i] && i + 1 === l) {
              break;
            }
            lines[i] = options.indent + lines[i];
          }
          result = lines.join(`
`);
        }
        return result;
      } else {
        throw new _exception2["default"]("The partial " + options.name + " could not be compiled when running in runtime-only mode");
      }
    }
    var container = {
      strict: function strict(obj, name, loc) {
        if (!obj || !(name in obj)) {
          throw new _exception2["default"]('"' + name + '" not defined in ' + obj, {
            loc
          });
        }
        return container.lookupProperty(obj, name);
      },
      lookupProperty: function lookupProperty(parent, propertyName) {
        var result = parent[propertyName];
        if (result == null) {
          return result;
        }
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return result;
        }
        if (_internalProtoAccess.resultIsAllowed(result, container.protoAccessControl, propertyName)) {
          return result;
        }
        return;
      },
      lookup: function lookup(depths, name) {
        var len = depths.length;
        for (var i = 0;i < len; i++) {
          var result = depths[i] && container.lookupProperty(depths[i], name);
          if (result != null) {
            return result;
          }
        }
      },
      lambda: function lambda(current, context) {
        return typeof current === "function" ? current.call(context) : current;
      },
      escapeExpression: Utils.escapeExpression,
      invokePartial: invokePartialWrapper,
      fn: function fn(i) {
        var ret2 = templateSpec[i];
        ret2.decorator = templateSpec[i + "_d"];
        return ret2;
      },
      programs: [],
      program: function program(i, data2, declaredBlockParams, blockParams, depths) {
        var programWrapper = this.programs[i], fn = this.fn(i);
        if (data2 || depths || blockParams || declaredBlockParams) {
          programWrapper = wrapProgram(this, i, fn, data2, declaredBlockParams, blockParams, depths);
        } else if (!programWrapper) {
          programWrapper = this.programs[i] = wrapProgram(this, i, fn);
        }
        return programWrapper;
      },
      data: function data2(value, depth) {
        while (value && depth--) {
          value = value._parent;
        }
        return value;
      },
      mergeIfNeeded: function mergeIfNeeded(param, common2) {
        var obj = param || common2;
        if (param && common2 && param !== common2) {
          obj = Utils.extend({}, common2, param);
        }
        return obj;
      },
      nullContext: Object.seal({}),
      noop: env2.VM.noop,
      compilerInfo: templateSpec.compiler
    };
    function ret(context) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var data2 = options.data;
      ret._setup(options);
      if (!options.partial && templateSpec.useData) {
        data2 = initData(context, data2);
      }
      var depths = undefined, blockParams = templateSpec.useBlockParams ? [] : undefined;
      if (templateSpec.useDepths) {
        if (options.depths) {
          depths = context != options.depths[0] ? [context].concat(options.depths) : options.depths;
        } else {
          depths = [context];
        }
      }
      function main(context2) {
        return "" + templateSpec.main(container, context2, container.helpers, container.partials, data2, blockParams, depths);
      }
      main = executeDecorators(templateSpec.main, main, container, options.depths || [], data2, blockParams);
      return main(context, options);
    }
    ret.isTop = true;
    ret._setup = function(options) {
      if (!options.partial) {
        var mergedHelpers = {};
        addHelpers(mergedHelpers, env2.helpers, container);
        addHelpers(mergedHelpers, options.helpers, container);
        container.helpers = mergedHelpers;
        if (templateSpec.usePartial) {
          container.partials = container.mergeIfNeeded(options.partials, env2.partials);
        }
        if (templateSpec.usePartial || templateSpec.useDecorators) {
          container.decorators = Utils.extend({}, env2.decorators, options.decorators);
        }
        container.hooks = {};
        container.protoAccessControl = _internalProtoAccess.createProtoAccessControl(options);
        var keepHelperInHelpers = options.allowCallsToHelperMissing || templateWasPrecompiledWithCompilerV7;
        _helpers.moveHelperToHooks(container, "helperMissing", keepHelperInHelpers);
        _helpers.moveHelperToHooks(container, "blockHelperMissing", keepHelperInHelpers);
      } else {
        container.protoAccessControl = options.protoAccessControl;
        container.helpers = options.helpers;
        container.partials = options.partials;
        container.decorators = options.decorators;
        container.hooks = options.hooks;
      }
    };
    ret._child = function(i, data2, blockParams, depths) {
      if (templateSpec.useBlockParams && !blockParams) {
        throw new _exception2["default"]("must pass block params");
      }
      if (templateSpec.useDepths && !depths) {
        throw new _exception2["default"]("must pass parent depths");
      }
      return wrapProgram(container, i, templateSpec[i], data2, 0, blockParams, depths);
    };
    return ret;
  }
  function wrapProgram(container, i, fn, data2, declaredBlockParams, blockParams, depths) {
    function prog(context) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var currentDepths = depths;
      if (depths && context != depths[0] && !(context === container.nullContext && depths[0] === null)) {
        currentDepths = [context].concat(depths);
      }
      return fn(container, context, container.helpers, container.partials, options.data || data2, blockParams && [options.blockParams].concat(blockParams), currentDepths);
    }
    prog = executeDecorators(fn, prog, container, depths, data2, blockParams);
    prog.program = i;
    prog.depth = depths ? depths.length : 0;
    prog.blockParams = declaredBlockParams || 0;
    return prog;
  }
  function resolvePartial(partial, context, options) {
    if (!partial) {
      if (options.name === "@partial-block") {
        partial = lookupOwnProperty(options.data, "partial-block");
      } else {
        partial = lookupOwnProperty(options.partials, options.name);
      }
    } else if (!partial.call && !options.name) {
      options.name = partial;
      partial = lookupOwnProperty(options.partials, partial);
    }
    return partial;
  }
  function invokePartial(partial, context, options) {
    var currentPartialBlock = lookupOwnProperty(options.data, "partial-block");
    options.partial = true;
    if (options.ids) {
      options.data.contextPath = options.ids[0] || options.data.contextPath;
    }
    var partialBlock = undefined;
    if (options.fn && options.fn !== noop) {
      (function() {
        options.data = _base.createFrame(options.data);
        var fn = options.fn;
        partialBlock = options.data["partial-block"] = function partialBlockWrapper(context2) {
          var options2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          options2.data = _base.createFrame(options2.data);
          options2.data["partial-block"] = currentPartialBlock;
          return fn(context2, options2);
        };
        if (fn.partials) {
          options.partials = Utils.extend({}, options.partials, fn.partials);
        }
      })();
    }
    if (partial === undefined && partialBlock) {
      partial = partialBlock;
    }
    if (partial === undefined) {
      throw new _exception2["default"]("The partial " + options.name + " could not be found");
    } else if (partial instanceof Function) {
      return partial(context, options);
    }
  }
  function noop() {
    return "";
  }
  function lookupOwnProperty(obj, name) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, name)) {
      return obj[name];
    }
  }
  function initData(context, data2) {
    if (!data2 || !("root" in data2)) {
      data2 = data2 ? _base.createFrame(data2) : {};
      data2.root = context;
    }
    return data2;
  }
  function executeDecorators(fn, prog, container, depths, data2, blockParams) {
    if (fn.decorator) {
      var props = {};
      prog = fn.decorator(prog, props, container, depths && depths[0], data2, blockParams, depths);
      Utils.extend(prog, props);
    }
    return prog;
  }
  function addHelpers(mergedHelpers, helpers, container) {
    if (!helpers)
      return;
    Object.keys(helpers).forEach(function(helperName) {
      var helper = helpers[helperName];
      mergedHelpers[helperName] = passLookupPropertyOption(helper, container);
    });
  }
  function passLookupPropertyOption(helper, container) {
    var lookupProperty = container.lookupProperty;
    return _internalWrapHelper.wrapHelper(helper, function(options) {
      options.lookupProperty = lookupProperty;
      return options;
    });
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/no-conflict.js
var require_no_conflict = __commonJS((exports, module) => {
  exports.__esModule = true;
  exports.default = function(Handlebars) {
    (function() {
      if (typeof globalThis === "object")
        return;
      Object.prototype.__defineGetter__("__magic__", function() {
        return this;
      });
      __magic__.globalThis = __magic__;
      delete Object.prototype.__magic__;
    })();
    var $Handlebars = globalThis.Handlebars;
    Handlebars.noConflict = function() {
      if (globalThis.Handlebars === Handlebars) {
        globalThis.Handlebars = $Handlebars;
      }
      return Handlebars;
    };
  };
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars.runtime.js
var require_handlebars_runtime = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj["default"] = obj;
      return newObj;
    }
  }
  var _handlebarsBase = require_base();
  var base = _interopRequireWildcard(_handlebarsBase);
  var _handlebarsSafeString = require_safe_string();
  var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);
  var _handlebarsException = require_exception();
  var _handlebarsException2 = _interopRequireDefault(_handlebarsException);
  var _handlebarsUtils = require_utils();
  var Utils = _interopRequireWildcard(_handlebarsUtils);
  var _handlebarsRuntime = require_runtime();
  var runtime = _interopRequireWildcard(_handlebarsRuntime);
  var _handlebarsNoConflict = require_no_conflict();
  var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);
  function create() {
    var hb = new base.HandlebarsEnvironment;
    Utils.extend(hb, base);
    hb.SafeString = _handlebarsSafeString2["default"];
    hb.Exception = _handlebarsException2["default"];
    hb.Utils = Utils;
    hb.escapeExpression = Utils.escapeExpression;
    hb.VM = runtime;
    hb.template = function(spec) {
      return runtime.template(spec, hb);
    };
    return hb;
  }
  var inst = create();
  inst.create = create;
  _handlebarsNoConflict2["default"](inst);
  inst["default"] = inst;
  exports.default = inst;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/ast.js
var require_ast = __commonJS((exports, module) => {
  exports.__esModule = true;
  var AST = {
    helpers: {
      helperExpression: function helperExpression(node) {
        return node.type === "SubExpression" || (node.type === "MustacheStatement" || node.type === "BlockStatement") && !!(node.params && node.params.length || node.hash);
      },
      scopedId: function scopedId(path) {
        return /^\.|this\b/.test(path.original);
      },
      simpleId: function simpleId(path) {
        return path.parts.length === 1 && !AST.helpers.scopedId(path) && !path.depth;
      }
    }
  };
  exports.default = AST;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/parser.js
var require_parser = __commonJS((exports, module) => {
  exports.__esModule = true;
  var handlebars = function() {
    var parser = {
      trace: function trace() {},
      yy: {},
      symbols_: { error: 2, root: 3, program: 4, EOF: 5, program_repetition0: 6, statement: 7, mustache: 8, block: 9, rawBlock: 10, partial: 11, partialBlock: 12, content: 13, COMMENT: 14, CONTENT: 15, openRawBlock: 16, rawBlock_repetition0: 17, END_RAW_BLOCK: 18, OPEN_RAW_BLOCK: 19, helperName: 20, openRawBlock_repetition0: 21, openRawBlock_option0: 22, CLOSE_RAW_BLOCK: 23, openBlock: 24, block_option0: 25, closeBlock: 26, openInverse: 27, block_option1: 28, OPEN_BLOCK: 29, openBlock_repetition0: 30, openBlock_option0: 31, openBlock_option1: 32, CLOSE: 33, OPEN_INVERSE: 34, openInverse_repetition0: 35, openInverse_option0: 36, openInverse_option1: 37, openInverseChain: 38, OPEN_INVERSE_CHAIN: 39, openInverseChain_repetition0: 40, openInverseChain_option0: 41, openInverseChain_option1: 42, inverseAndProgram: 43, INVERSE: 44, inverseChain: 45, inverseChain_option0: 46, OPEN_ENDBLOCK: 47, OPEN: 48, mustache_repetition0: 49, mustache_option0: 50, OPEN_UNESCAPED: 51, mustache_repetition1: 52, mustache_option1: 53, CLOSE_UNESCAPED: 54, OPEN_PARTIAL: 55, partialName: 56, partial_repetition0: 57, partial_option0: 58, openPartialBlock: 59, OPEN_PARTIAL_BLOCK: 60, openPartialBlock_repetition0: 61, openPartialBlock_option0: 62, param: 63, sexpr: 64, OPEN_SEXPR: 65, sexpr_repetition0: 66, sexpr_option0: 67, CLOSE_SEXPR: 68, hash: 69, hash_repetition_plus0: 70, hashSegment: 71, ID: 72, EQUALS: 73, blockParams: 74, OPEN_BLOCK_PARAMS: 75, blockParams_repetition_plus0: 76, CLOSE_BLOCK_PARAMS: 77, path: 78, dataName: 79, STRING: 80, NUMBER: 81, BOOLEAN: 82, UNDEFINED: 83, NULL: 84, DATA: 85, pathSegments: 86, SEP: 87, $accept: 0, $end: 1 },
      terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" },
      productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 0], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]],
      performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
        var $0 = $$.length - 1;
        switch (yystate) {
          case 1:
            return $$[$0 - 1];
            break;
          case 2:
            this.$ = yy.prepareProgram($$[$0]);
            break;
          case 3:
            this.$ = $$[$0];
            break;
          case 4:
            this.$ = $$[$0];
            break;
          case 5:
            this.$ = $$[$0];
            break;
          case 6:
            this.$ = $$[$0];
            break;
          case 7:
            this.$ = $$[$0];
            break;
          case 8:
            this.$ = $$[$0];
            break;
          case 9:
            this.$ = {
              type: "CommentStatement",
              value: yy.stripComment($$[$0]),
              strip: yy.stripFlags($$[$0], $$[$0]),
              loc: yy.locInfo(this._$)
            };
            break;
          case 10:
            this.$ = {
              type: "ContentStatement",
              original: $$[$0],
              value: $$[$0],
              loc: yy.locInfo(this._$)
            };
            break;
          case 11:
            this.$ = yy.prepareRawBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
            break;
          case 12:
            this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1] };
            break;
          case 13:
            this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], false, this._$);
            break;
          case 14:
            this.$ = yy.prepareBlock($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0], true, this._$);
            break;
          case 15:
            this.$ = { open: $$[$0 - 5], path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
            break;
          case 16:
            this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
            break;
          case 17:
            this.$ = { path: $$[$0 - 4], params: $$[$0 - 3], hash: $$[$0 - 2], blockParams: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 5], $$[$0]) };
            break;
          case 18:
            this.$ = { strip: yy.stripFlags($$[$0 - 1], $$[$0 - 1]), program: $$[$0] };
            break;
          case 19:
            var inverse = yy.prepareBlock($$[$0 - 2], $$[$0 - 1], $$[$0], $$[$0], false, this._$), program = yy.prepareProgram([inverse], $$[$0 - 1].loc);
            program.chained = true;
            this.$ = { strip: $$[$0 - 2].strip, program, chain: true };
            break;
          case 20:
            this.$ = $$[$0];
            break;
          case 21:
            this.$ = { path: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 2], $$[$0]) };
            break;
          case 22:
            this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
            break;
          case 23:
            this.$ = yy.prepareMustache($$[$0 - 3], $$[$0 - 2], $$[$0 - 1], $$[$0 - 4], yy.stripFlags($$[$0 - 4], $$[$0]), this._$);
            break;
          case 24:
            this.$ = {
              type: "PartialStatement",
              name: $$[$0 - 3],
              params: $$[$0 - 2],
              hash: $$[$0 - 1],
              indent: "",
              strip: yy.stripFlags($$[$0 - 4], $$[$0]),
              loc: yy.locInfo(this._$)
            };
            break;
          case 25:
            this.$ = yy.preparePartialBlock($$[$0 - 2], $$[$0 - 1], $$[$0], this._$);
            break;
          case 26:
            this.$ = { path: $$[$0 - 3], params: $$[$0 - 2], hash: $$[$0 - 1], strip: yy.stripFlags($$[$0 - 4], $$[$0]) };
            break;
          case 27:
            this.$ = $$[$0];
            break;
          case 28:
            this.$ = $$[$0];
            break;
          case 29:
            this.$ = {
              type: "SubExpression",
              path: $$[$0 - 3],
              params: $$[$0 - 2],
              hash: $$[$0 - 1],
              loc: yy.locInfo(this._$)
            };
            break;
          case 30:
            this.$ = { type: "Hash", pairs: $$[$0], loc: yy.locInfo(this._$) };
            break;
          case 31:
            this.$ = { type: "HashPair", key: yy.id($$[$0 - 2]), value: $$[$0], loc: yy.locInfo(this._$) };
            break;
          case 32:
            this.$ = yy.id($$[$0 - 1]);
            break;
          case 33:
            this.$ = $$[$0];
            break;
          case 34:
            this.$ = $$[$0];
            break;
          case 35:
            this.$ = { type: "StringLiteral", value: $$[$0], original: $$[$0], loc: yy.locInfo(this._$) };
            break;
          case 36:
            this.$ = { type: "NumberLiteral", value: Number($$[$0]), original: Number($$[$0]), loc: yy.locInfo(this._$) };
            break;
          case 37:
            this.$ = { type: "BooleanLiteral", value: $$[$0] === "true", original: $$[$0] === "true", loc: yy.locInfo(this._$) };
            break;
          case 38:
            this.$ = { type: "UndefinedLiteral", original: undefined, value: undefined, loc: yy.locInfo(this._$) };
            break;
          case 39:
            this.$ = { type: "NullLiteral", original: null, value: null, loc: yy.locInfo(this._$) };
            break;
          case 40:
            this.$ = $$[$0];
            break;
          case 41:
            this.$ = $$[$0];
            break;
          case 42:
            this.$ = yy.preparePath(true, $$[$0], this._$);
            break;
          case 43:
            this.$ = yy.preparePath(false, $$[$0], this._$);
            break;
          case 44:
            $$[$0 - 2].push({ part: yy.id($$[$0]), original: $$[$0], separator: $$[$0 - 1] });
            this.$ = $$[$0 - 2];
            break;
          case 45:
            this.$ = [{ part: yy.id($$[$0]), original: $$[$0] }];
            break;
          case 46:
            this.$ = [];
            break;
          case 47:
            $$[$0 - 1].push($$[$0]);
            break;
          case 48:
            this.$ = [];
            break;
          case 49:
            $$[$0 - 1].push($$[$0]);
            break;
          case 50:
            this.$ = [];
            break;
          case 51:
            $$[$0 - 1].push($$[$0]);
            break;
          case 58:
            this.$ = [];
            break;
          case 59:
            $$[$0 - 1].push($$[$0]);
            break;
          case 64:
            this.$ = [];
            break;
          case 65:
            $$[$0 - 1].push($$[$0]);
            break;
          case 70:
            this.$ = [];
            break;
          case 71:
            $$[$0 - 1].push($$[$0]);
            break;
          case 78:
            this.$ = [];
            break;
          case 79:
            $$[$0 - 1].push($$[$0]);
            break;
          case 82:
            this.$ = [];
            break;
          case 83:
            $$[$0 - 1].push($$[$0]);
            break;
          case 86:
            this.$ = [];
            break;
          case 87:
            $$[$0 - 1].push($$[$0]);
            break;
          case 90:
            this.$ = [];
            break;
          case 91:
            $$[$0 - 1].push($$[$0]);
            break;
          case 94:
            this.$ = [];
            break;
          case 95:
            $$[$0 - 1].push($$[$0]);
            break;
          case 98:
            this.$ = [$$[$0]];
            break;
          case 99:
            $$[$0 - 1].push($$[$0]);
            break;
          case 100:
            this.$ = [$$[$0]];
            break;
          case 101:
            $$[$0 - 1].push($$[$0]);
            break;
        }
      },
      table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 15: [2, 48], 17: 39, 18: [2, 48] }, { 20: 41, 56: 40, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 44, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 45, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 41, 56: 48, 64: 42, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 49, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 50] }, { 72: [1, 35], 86: 51 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 52, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 53, 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 54, 47: [2, 54] }, { 28: 59, 43: 60, 44: [1, 58], 47: [2, 56] }, { 13: 62, 15: [1, 20], 18: [1, 61] }, { 33: [2, 86], 57: 63, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 64, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 65, 47: [1, 66] }, { 30: 67, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 68, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 69, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 70, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 74, 33: [2, 80], 50: 71, 63: 72, 64: 75, 65: [1, 43], 69: 73, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 79] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 50] }, { 20: 74, 53: 80, 54: [2, 84], 63: 81, 64: 75, 65: [1, 43], 69: 82, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 83, 47: [1, 66] }, { 47: [2, 55] }, { 4: 84, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 85, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 86, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 87, 47: [1, 66] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 74, 33: [2, 88], 58: 88, 63: 89, 64: 75, 65: [1, 43], 69: 90, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 91, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 92, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 31: 93, 33: [2, 60], 63: 94, 64: 75, 65: [1, 43], 69: 95, 70: 76, 71: 77, 72: [1, 78], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 66], 36: 96, 63: 97, 64: 75, 65: [1, 43], 69: 98, 70: 76, 71: 77, 72: [1, 78], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 22: 99, 23: [2, 52], 63: 100, 64: 75, 65: [1, 43], 69: 101, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 74, 33: [2, 92], 62: 102, 63: 103, 64: 75, 65: [1, 43], 69: 104, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 105] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 106, 72: [1, 107], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 108], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 109] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 55, 39: [1, 57], 43: 56, 44: [1, 58], 45: 111, 46: 110, 47: [2, 76] }, { 33: [2, 70], 40: 112, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 113] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87], 85: [2, 87] }, { 33: [2, 89] }, { 20: 74, 63: 115, 64: 75, 65: [1, 43], 67: 114, 68: [2, 96], 69: 116, 70: 76, 71: 77, 72: [1, 78], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 117] }, { 32: 118, 33: [2, 62], 74: 119, 75: [1, 120] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 121, 74: 122, 75: [1, 120] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 123] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 124] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 108] }, { 20: 74, 63: 125, 64: 75, 65: [1, 43], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 74, 33: [2, 72], 41: 126, 63: 127, 64: 75, 65: [1, 43], 69: 128, 70: 76, 71: 77, 72: [1, 78], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 129] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 130] }, { 33: [2, 63] }, { 72: [1, 132], 76: 131 }, { 33: [1, 133] }, { 33: [2, 69] }, { 15: [2, 12], 18: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 134, 74: 135, 75: [1, 120] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 137], 77: [1, 136] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 138] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }],
      defaultActions: { 4: [2, 1], 54: [2, 55], 56: [2, 20], 60: [2, 57], 73: [2, 81], 82: [2, 85], 86: [2, 18], 90: [2, 89], 101: [2, 53], 104: [2, 93], 110: [2, 19], 111: [2, 77], 116: [2, 97], 119: [2, 63], 122: [2, 69], 135: [2, 75], 136: [2, 32] },
      parseError: function parseError(str, hash) {
        throw new Error(str);
      },
      parse: function parse(input) {
        var self2 = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
        this.lexer.setInput(input);
        this.lexer.yy = this.yy;
        this.yy.lexer = this.lexer;
        this.yy.parser = this;
        if (typeof this.lexer.yylloc == "undefined")
          this.lexer.yylloc = {};
        var yyloc = this.lexer.yylloc;
        lstack.push(yyloc);
        var ranges = this.lexer.options && this.lexer.options.ranges;
        if (typeof this.yy.parseError === "function")
          this.parseError = this.yy.parseError;
        function popStack(n) {
          stack.length = stack.length - 2 * n;
          vstack.length = vstack.length - n;
          lstack.length = lstack.length - n;
        }
        function lex() {
          var token;
          token = self2.lexer.lex() || 1;
          if (typeof token !== "number") {
            token = self2.symbols_[token] || token;
          }
          return token;
        }
        var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
        while (true) {
          state = stack[stack.length - 1];
          if (this.defaultActions[state]) {
            action = this.defaultActions[state];
          } else {
            if (symbol === null || typeof symbol == "undefined") {
              symbol = lex();
            }
            action = table[state] && table[state][symbol];
          }
          if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
              expected = [];
              for (p in table[state])
                if (this.terminals_[p] && p > 2) {
                  expected.push("'" + this.terminals_[p] + "'");
                }
              if (this.lexer.showPosition) {
                errStr = "Parse error on line " + (yylineno + 1) + `:
` + this.lexer.showPosition() + `
Expecting ` + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
              } else {
                errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
              }
              this.parseError(errStr, { text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected });
            }
          }
          if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
          }
          switch (action[0]) {
            case 1:
              stack.push(symbol);
              vstack.push(this.lexer.yytext);
              lstack.push(this.lexer.yylloc);
              stack.push(action[1]);
              symbol = null;
              if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                  recovering--;
              } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
              }
              break;
            case 2:
              len = this.productions_[action[1]][1];
              yyval.$ = vstack[vstack.length - len];
              yyval._$ = { first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column };
              if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
              }
              r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
              if (typeof r !== "undefined") {
                return r;
              }
              if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
              }
              stack.push(this.productions_[action[1]][0]);
              vstack.push(yyval.$);
              lstack.push(yyval._$);
              newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
              stack.push(newState);
              break;
            case 3:
              return true;
          }
        }
        return true;
      }
    };
    var lexer = function() {
      var lexer2 = {
        EOF: 1,
        parseError: function parseError(str, hash) {
          if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
          } else {
            throw new Error(str);
          }
        },
        setInput: function setInput(input) {
          this._input = input;
          this._more = this._less = this.done = false;
          this.yylineno = this.yyleng = 0;
          this.yytext = this.matched = this.match = "";
          this.conditionStack = ["INITIAL"];
          this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 };
          if (this.options.ranges)
            this.yylloc.range = [0, 0];
          this.offset = 0;
          return this;
        },
        input: function input() {
          var ch = this._input[0];
          this.yytext += ch;
          this.yyleng++;
          this.offset++;
          this.match += ch;
          this.matched += ch;
          var lines = ch.match(/(?:\r\n?|\n).*/g);
          if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
          } else {
            this.yylloc.last_column++;
          }
          if (this.options.ranges)
            this.yylloc.range[1]++;
          this._input = this._input.slice(1);
          return ch;
        },
        unput: function unput(ch) {
          var len = ch.length;
          var lines = ch.split(/(?:\r\n?|\n)/g);
          this._input = ch + this._input;
          this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
          this.offset -= len;
          var oldLines = this.match.split(/(?:\r\n?|\n)/g);
          this.match = this.match.substr(0, this.match.length - 1);
          this.matched = this.matched.substr(0, this.matched.length - 1);
          if (lines.length - 1)
            this.yylineno -= lines.length - 1;
          var r = this.yylloc.range;
          this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
          };
          if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
          }
          return this;
        },
        more: function more() {
          this._more = true;
          return this;
        },
        less: function less(n) {
          this.unput(this.match.slice(n));
        },
        pastInput: function pastInput() {
          var past = this.matched.substr(0, this.matched.length - this.match.length);
          return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
        },
        upcomingInput: function upcomingInput() {
          var next = this.match;
          if (next.length < 20) {
            next += this._input.substr(0, 20 - next.length);
          }
          return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
        },
        showPosition: function showPosition() {
          var pre = this.pastInput();
          var c = new Array(pre.length + 1).join("-");
          return pre + this.upcomingInput() + `
` + c + "^";
        },
        next: function next() {
          if (this.done) {
            return this.EOF;
          }
          if (!this._input)
            this.done = true;
          var token, match, tempMatch, index, col, lines;
          if (!this._more) {
            this.yytext = "";
            this.match = "";
          }
          var rules = this._currentRules();
          for (var i = 0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
              match = tempMatch;
              index = i;
              if (!this.options.flex)
                break;
            }
          }
          if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines)
              this.yylineno += lines.length;
            this.yylloc = {
              first_line: this.yylloc.last_line,
              last_line: this.yylineno + 1,
              first_column: this.yylloc.last_column,
              last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
            };
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
              this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
            if (this.done && this._input)
              this.done = false;
            if (token)
              return token;
            else
              return;
          }
          if (this._input === "") {
            return this.EOF;
          } else {
            return this.parseError("Lexical error on line " + (this.yylineno + 1) + `. Unrecognized text.
` + this.showPosition(), { text: "", token: null, line: this.yylineno });
          }
        },
        lex: function lex() {
          var r = this.next();
          if (typeof r !== "undefined") {
            return r;
          } else {
            return this.lex();
          }
        },
        begin: function begin(condition) {
          this.conditionStack.push(condition);
        },
        popState: function popState() {
          return this.conditionStack.pop();
        },
        _currentRules: function _currentRules() {
          return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        },
        topState: function topState() {
          return this.conditionStack[this.conditionStack.length - 2];
        },
        pushState: function begin(condition) {
          this.begin(condition);
        }
      };
      lexer2.options = {};
      lexer2.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
        function strip(start, end) {
          return yy_.yytext = yy_.yytext.substring(start, yy_.yyleng - end + start);
        }
        var YYSTATE = YY_START;
        switch ($avoiding_name_collisions) {
          case 0:
            if (yy_.yytext.slice(-2) === "\\\\") {
              strip(0, 1);
              this.begin("mu");
            } else if (yy_.yytext.slice(-1) === "\\") {
              strip(0, 1);
              this.begin("emu");
            } else {
              this.begin("mu");
            }
            if (yy_.yytext)
              return 15;
            break;
          case 1:
            return 15;
            break;
          case 2:
            this.popState();
            return 15;
            break;
          case 3:
            this.begin("raw");
            return 15;
            break;
          case 4:
            this.popState();
            if (this.conditionStack[this.conditionStack.length - 1] === "raw") {
              return 15;
            } else {
              strip(5, 9);
              return "END_RAW_BLOCK";
            }
            break;
          case 5:
            return 15;
            break;
          case 6:
            this.popState();
            return 14;
            break;
          case 7:
            return 65;
            break;
          case 8:
            return 68;
            break;
          case 9:
            return 19;
            break;
          case 10:
            this.popState();
            this.begin("raw");
            return 23;
            break;
          case 11:
            return 55;
            break;
          case 12:
            return 60;
            break;
          case 13:
            return 29;
            break;
          case 14:
            return 47;
            break;
          case 15:
            this.popState();
            return 44;
            break;
          case 16:
            this.popState();
            return 44;
            break;
          case 17:
            return 34;
            break;
          case 18:
            return 39;
            break;
          case 19:
            return 51;
            break;
          case 20:
            return 48;
            break;
          case 21:
            this.unput(yy_.yytext);
            this.popState();
            this.begin("com");
            break;
          case 22:
            this.popState();
            return 14;
            break;
          case 23:
            return 48;
            break;
          case 24:
            return 73;
            break;
          case 25:
            return 72;
            break;
          case 26:
            return 72;
            break;
          case 27:
            return 87;
            break;
          case 28:
            break;
          case 29:
            this.popState();
            return 54;
            break;
          case 30:
            this.popState();
            return 33;
            break;
          case 31:
            yy_.yytext = strip(1, 2).replace(/\\"/g, '"');
            return 80;
            break;
          case 32:
            yy_.yytext = strip(1, 2).replace(/\\'/g, "'");
            return 80;
            break;
          case 33:
            return 85;
            break;
          case 34:
            return 82;
            break;
          case 35:
            return 82;
            break;
          case 36:
            return 83;
            break;
          case 37:
            return 84;
            break;
          case 38:
            return 81;
            break;
          case 39:
            return 75;
            break;
          case 40:
            return 77;
            break;
          case 41:
            return 72;
            break;
          case 42:
            yy_.yytext = yy_.yytext.replace(/\\([\\\]])/g, "$1");
            return 72;
            break;
          case 43:
            return "INVALID";
            break;
          case 44:
            return 5;
            break;
        }
      };
      lexer2.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^\/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]+?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/];
      lexer2.conditions = { mu: { rules: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], inclusive: false }, emu: { rules: [2], inclusive: false }, com: { rules: [6], inclusive: false }, raw: { rules: [3, 4, 5], inclusive: false }, INITIAL: { rules: [0, 1, 44], inclusive: true } };
      return lexer2;
    }();
    parser.lexer = lexer;
    function Parser() {
      this.yy = {};
    }
    Parser.prototype = parser;
    parser.Parser = Parser;
    return new Parser;
  }();
  exports.default = handlebars;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/visitor.js
var require_visitor = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  function Visitor() {
    this.parents = [];
  }
  Visitor.prototype = {
    constructor: Visitor,
    mutating: false,
    acceptKey: function acceptKey(node, name) {
      var value = this.accept(node[name]);
      if (this.mutating) {
        if (value && !Visitor.prototype[value.type]) {
          throw new _exception2["default"]('Unexpected node type "' + value.type + '" found when accepting ' + name + " on " + node.type);
        }
        node[name] = value;
      }
    },
    acceptRequired: function acceptRequired(node, name) {
      this.acceptKey(node, name);
      if (!node[name]) {
        throw new _exception2["default"](node.type + " requires " + name);
      }
    },
    acceptArray: function acceptArray(array) {
      for (var i = 0, l = array.length;i < l; i++) {
        this.acceptKey(array, i);
        if (!array[i]) {
          array.splice(i, 1);
          i--;
          l--;
        }
      }
    },
    accept: function accept(object) {
      if (!object) {
        return;
      }
      if (!this[object.type]) {
        throw new _exception2["default"]("Unknown type: " + object.type, object);
      }
      if (this.current) {
        this.parents.unshift(this.current);
      }
      this.current = object;
      var ret = this[object.type](object);
      this.current = this.parents.shift();
      if (!this.mutating || ret) {
        return ret;
      } else if (ret !== false) {
        return object;
      }
    },
    Program: function Program(program) {
      this.acceptArray(program.body);
    },
    MustacheStatement: visitSubExpression,
    Decorator: visitSubExpression,
    BlockStatement: visitBlock,
    DecoratorBlock: visitBlock,
    PartialStatement: visitPartial,
    PartialBlockStatement: function PartialBlockStatement(partial) {
      visitPartial.call(this, partial);
      this.acceptKey(partial, "program");
    },
    ContentStatement: function ContentStatement() {},
    CommentStatement: function CommentStatement() {},
    SubExpression: visitSubExpression,
    PathExpression: function PathExpression() {},
    StringLiteral: function StringLiteral() {},
    NumberLiteral: function NumberLiteral() {},
    BooleanLiteral: function BooleanLiteral() {},
    UndefinedLiteral: function UndefinedLiteral() {},
    NullLiteral: function NullLiteral() {},
    Hash: function Hash(hash) {
      this.acceptArray(hash.pairs);
    },
    HashPair: function HashPair(pair) {
      this.acceptRequired(pair, "value");
    }
  };
  function visitSubExpression(mustache) {
    this.acceptRequired(mustache, "path");
    this.acceptArray(mustache.params);
    this.acceptKey(mustache, "hash");
  }
  function visitBlock(block) {
    visitSubExpression.call(this, block);
    this.acceptKey(block, "program");
    this.acceptKey(block, "inverse");
  }
  function visitPartial(partial) {
    this.acceptRequired(partial, "name");
    this.acceptArray(partial.params);
    this.acceptKey(partial, "hash");
  }
  exports.default = Visitor;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/whitespace-control.js
var require_whitespace_control = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _visitor = require_visitor();
  var _visitor2 = _interopRequireDefault(_visitor);
  function WhitespaceControl() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    this.options = options;
  }
  WhitespaceControl.prototype = new _visitor2["default"];
  WhitespaceControl.prototype.Program = function(program) {
    var doStandalone = !this.options.ignoreStandalone;
    var isRoot = !this.isRootSeen;
    this.isRootSeen = true;
    var body = program.body;
    for (var i = 0, l = body.length;i < l; i++) {
      var current = body[i], strip = this.accept(current);
      if (!strip) {
        continue;
      }
      var _isPrevWhitespace = isPrevWhitespace(body, i, isRoot), _isNextWhitespace = isNextWhitespace(body, i, isRoot), openStandalone = strip.openStandalone && _isPrevWhitespace, closeStandalone = strip.closeStandalone && _isNextWhitespace, inlineStandalone = strip.inlineStandalone && _isPrevWhitespace && _isNextWhitespace;
      if (strip.close) {
        omitRight(body, i, true);
      }
      if (strip.open) {
        omitLeft(body, i, true);
      }
      if (doStandalone && inlineStandalone) {
        omitRight(body, i);
        if (omitLeft(body, i)) {
          if (current.type === "PartialStatement") {
            current.indent = /([ \t]+$)/.exec(body[i - 1].original)[1];
          }
        }
      }
      if (doStandalone && openStandalone) {
        omitRight((current.program || current.inverse).body);
        omitLeft(body, i);
      }
      if (doStandalone && closeStandalone) {
        omitRight(body, i);
        omitLeft((current.inverse || current.program).body);
      }
    }
    return program;
  };
  WhitespaceControl.prototype.BlockStatement = WhitespaceControl.prototype.DecoratorBlock = WhitespaceControl.prototype.PartialBlockStatement = function(block) {
    this.accept(block.program);
    this.accept(block.inverse);
    var program = block.program || block.inverse, inverse = block.program && block.inverse, firstInverse = inverse, lastInverse = inverse;
    if (inverse && inverse.chained) {
      firstInverse = inverse.body[0].program;
      while (lastInverse.chained) {
        lastInverse = lastInverse.body[lastInverse.body.length - 1].program;
      }
    }
    var strip = {
      open: block.openStrip.open,
      close: block.closeStrip.close,
      openStandalone: isNextWhitespace(program.body),
      closeStandalone: isPrevWhitespace((firstInverse || program).body)
    };
    if (block.openStrip.close) {
      omitRight(program.body, null, true);
    }
    if (inverse) {
      var inverseStrip = block.inverseStrip;
      if (inverseStrip.open) {
        omitLeft(program.body, null, true);
      }
      if (inverseStrip.close) {
        omitRight(firstInverse.body, null, true);
      }
      if (block.closeStrip.open) {
        omitLeft(lastInverse.body, null, true);
      }
      if (!this.options.ignoreStandalone && isPrevWhitespace(program.body) && isNextWhitespace(firstInverse.body)) {
        omitLeft(program.body);
        omitRight(firstInverse.body);
      }
    } else if (block.closeStrip.open) {
      omitLeft(program.body, null, true);
    }
    return strip;
  };
  WhitespaceControl.prototype.Decorator = WhitespaceControl.prototype.MustacheStatement = function(mustache) {
    return mustache.strip;
  };
  WhitespaceControl.prototype.PartialStatement = WhitespaceControl.prototype.CommentStatement = function(node) {
    var strip = node.strip || {};
    return {
      inlineStandalone: true,
      open: strip.open,
      close: strip.close
    };
  };
  function isPrevWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = body.length;
    }
    var prev = body[i - 1], sibling = body[i - 2];
    if (!prev) {
      return isRoot;
    }
    if (prev.type === "ContentStatement") {
      return (sibling || !isRoot ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(prev.original);
    }
  }
  function isNextWhitespace(body, i, isRoot) {
    if (i === undefined) {
      i = -1;
    }
    var next = body[i + 1], sibling = body[i + 2];
    if (!next) {
      return isRoot;
    }
    if (next.type === "ContentStatement") {
      return (sibling || !isRoot ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(next.original);
    }
  }
  function omitRight(body, i, multiple) {
    var current = body[i == null ? 0 : i + 1];
    if (!current || current.type !== "ContentStatement" || !multiple && current.rightStripped) {
      return;
    }
    var original = current.value;
    current.value = current.value.replace(multiple ? /^\s+/ : /^[ \t]*\r?\n?/, "");
    current.rightStripped = current.value !== original;
  }
  function omitLeft(body, i, multiple) {
    var current = body[i == null ? body.length - 1 : i - 1];
    if (!current || current.type !== "ContentStatement" || !multiple && current.leftStripped) {
      return;
    }
    var original = current.value;
    current.value = current.value.replace(multiple ? /\s+$/ : /[ \t]+$/, "");
    current.leftStripped = current.value !== original;
    return current.leftStripped;
  }
  exports.default = WhitespaceControl;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/helpers.js
var require_helpers2 = __commonJS((exports) => {
  exports.__esModule = true;
  exports.SourceLocation = SourceLocation;
  exports.id = id;
  exports.stripFlags = stripFlags;
  exports.stripComment = stripComment;
  exports.preparePath = preparePath;
  exports.prepareMustache = prepareMustache;
  exports.prepareRawBlock = prepareRawBlock;
  exports.prepareBlock = prepareBlock;
  exports.prepareProgram = prepareProgram;
  exports.preparePartialBlock = preparePartialBlock;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  function validateClose(open, close) {
    close = close.path ? close.path.original : close;
    if (open.path.original !== close) {
      var errorNode = { loc: open.path.loc };
      throw new _exception2["default"](open.path.original + " doesn't match " + close, errorNode);
    }
  }
  function SourceLocation(source, locInfo) {
    this.source = source;
    this.start = {
      line: locInfo.first_line,
      column: locInfo.first_column
    };
    this.end = {
      line: locInfo.last_line,
      column: locInfo.last_column
    };
  }
  function id(token) {
    if (/^\[.*\]$/.test(token)) {
      return token.substring(1, token.length - 1);
    } else {
      return token;
    }
  }
  function stripFlags(open, close) {
    return {
      open: open.charAt(2) === "~",
      close: close.charAt(close.length - 3) === "~"
    };
  }
  function stripComment(comment) {
    return comment.replace(/^\{\{~?!-?-?/, "").replace(/-?-?~?\}\}$/, "");
  }
  function preparePath(data2, parts, loc) {
    loc = this.locInfo(loc);
    var original = data2 ? "@" : "", dig = [], depth = 0;
    for (var i = 0, l = parts.length;i < l; i++) {
      var part = parts[i].part, isLiteral = parts[i].original !== part;
      original += (parts[i].separator || "") + part;
      if (!isLiteral && (part === ".." || part === "." || part === "this")) {
        if (dig.length > 0) {
          throw new _exception2["default"]("Invalid path: " + original, { loc });
        } else if (part === "..") {
          depth++;
        }
      } else {
        dig.push(part);
      }
    }
    return {
      type: "PathExpression",
      data: data2,
      depth,
      parts: dig,
      original,
      loc
    };
  }
  function prepareMustache(path, params, hash, open, strip, locInfo) {
    var escapeFlag = open.charAt(3) || open.charAt(2), escaped = escapeFlag !== "{" && escapeFlag !== "&";
    var decorator = /\*/.test(open);
    return {
      type: decorator ? "Decorator" : "MustacheStatement",
      path,
      params,
      hash,
      escaped,
      strip,
      loc: this.locInfo(locInfo)
    };
  }
  function prepareRawBlock(openRawBlock, contents, close, locInfo) {
    validateClose(openRawBlock, close);
    locInfo = this.locInfo(locInfo);
    var program = {
      type: "Program",
      body: contents,
      strip: {},
      loc: locInfo
    };
    return {
      type: "BlockStatement",
      path: openRawBlock.path,
      params: openRawBlock.params,
      hash: openRawBlock.hash,
      program,
      openStrip: {},
      inverseStrip: {},
      closeStrip: {},
      loc: locInfo
    };
  }
  function prepareBlock(openBlock, program, inverseAndProgram, close, inverted, locInfo) {
    if (close && close.path) {
      validateClose(openBlock, close);
    }
    var decorator = /\*/.test(openBlock.open);
    program.blockParams = openBlock.blockParams;
    var inverse = undefined, inverseStrip = undefined;
    if (inverseAndProgram) {
      if (decorator) {
        throw new _exception2["default"]("Unexpected inverse block on decorator", inverseAndProgram);
      }
      if (inverseAndProgram.chain) {
        inverseAndProgram.program.body[0].closeStrip = close.strip;
      }
      inverseStrip = inverseAndProgram.strip;
      inverse = inverseAndProgram.program;
    }
    if (inverted) {
      inverted = inverse;
      inverse = program;
      program = inverted;
    }
    return {
      type: decorator ? "DecoratorBlock" : "BlockStatement",
      path: openBlock.path,
      params: openBlock.params,
      hash: openBlock.hash,
      program,
      inverse,
      openStrip: openBlock.strip,
      inverseStrip,
      closeStrip: close && close.strip,
      loc: this.locInfo(locInfo)
    };
  }
  function prepareProgram(statements, loc) {
    if (!loc && statements.length) {
      var firstLoc = statements[0].loc, lastLoc = statements[statements.length - 1].loc;
      if (firstLoc && lastLoc) {
        loc = {
          source: firstLoc.source,
          start: {
            line: firstLoc.start.line,
            column: firstLoc.start.column
          },
          end: {
            line: lastLoc.end.line,
            column: lastLoc.end.column
          }
        };
      }
    }
    return {
      type: "Program",
      body: statements,
      strip: {},
      loc
    };
  }
  function preparePartialBlock(open, program, close, locInfo) {
    validateClose(open, close);
    return {
      type: "PartialBlockStatement",
      name: open.path,
      params: open.params,
      hash: open.hash,
      program,
      openStrip: open.strip,
      closeStrip: close && close.strip,
      loc: this.locInfo(locInfo)
    };
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/base.js
var require_base2 = __commonJS((exports) => {
  exports.__esModule = true;
  exports.parseWithoutProcessing = parseWithoutProcessing;
  exports.parse = parse;
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key))
            newObj[key] = obj[key];
        }
      }
      newObj["default"] = obj;
      return newObj;
    }
  }
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _parser = require_parser();
  var _parser2 = _interopRequireDefault(_parser);
  var _whitespaceControl = require_whitespace_control();
  var _whitespaceControl2 = _interopRequireDefault(_whitespaceControl);
  var _helpers = require_helpers2();
  var Helpers = _interopRequireWildcard(_helpers);
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  var _utils = require_utils();
  exports.parser = _parser2["default"];
  var yy = {};
  _utils.extend(yy, Helpers);
  function parseWithoutProcessing(input, options) {
    if (input.type === "Program") {
      validateInputAst(input);
      return input;
    }
    _parser2["default"].yy = yy;
    yy.locInfo = function(locInfo) {
      return new yy.SourceLocation(options && options.srcName, locInfo);
    };
    var ast = _parser2["default"].parse(input);
    return ast;
  }
  function parse(input, options) {
    var ast = parseWithoutProcessing(input, options);
    var strip = new _whitespaceControl2["default"](options);
    return strip.accept(ast);
  }
  function validateInputAst(ast) {
    validateAstNode(ast);
  }
  function validateAstNode(node) {
    if (node == null) {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(validateAstNode);
      return;
    }
    if (typeof node !== "object") {
      return;
    }
    if (node.type === "PathExpression") {
      if (!isValidDepth(node.depth)) {
        throw new _exception2["default"]("Invalid AST: PathExpression.depth must be an integer");
      }
      if (!Array.isArray(node.parts)) {
        throw new _exception2["default"]("Invalid AST: PathExpression.parts must be an array");
      }
      for (var i = 0;i < node.parts.length; i++) {
        if (typeof node.parts[i] !== "string") {
          throw new _exception2["default"]("Invalid AST: PathExpression.parts must only contain strings");
        }
      }
    } else if (node.type === "NumberLiteral") {
      if (typeof node.value !== "number" || !isFinite(node.value)) {
        throw new _exception2["default"]("Invalid AST: NumberLiteral.value must be a number");
      }
    } else if (node.type === "BooleanLiteral") {
      if (typeof node.value !== "boolean") {
        throw new _exception2["default"]("Invalid AST: BooleanLiteral.value must be a boolean");
      }
    }
    Object.keys(node).forEach(function(propertyName) {
      if (propertyName === "loc") {
        return;
      }
      validateAstNode(node[propertyName]);
    });
  }
  function isValidDepth(depth) {
    return typeof depth === "number" && isFinite(depth) && Math.floor(depth) === depth && depth >= 0;
  }
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/compiler.js
var require_compiler = __commonJS((exports) => {
  exports.__esModule = true;
  exports.Compiler = Compiler;
  exports.precompile = precompile;
  exports.compile = compile;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  var _utils = require_utils();
  var _ast = require_ast();
  var _ast2 = _interopRequireDefault(_ast);
  var slice = [].slice;
  function Compiler() {}
  Compiler.prototype = {
    compiler: Compiler,
    equals: function equals(other) {
      var len = this.opcodes.length;
      if (other.opcodes.length !== len) {
        return false;
      }
      for (var i = 0;i < len; i++) {
        var opcode = this.opcodes[i], otherOpcode = other.opcodes[i];
        if (opcode.opcode !== otherOpcode.opcode || !argEquals(opcode.args, otherOpcode.args)) {
          return false;
        }
      }
      len = this.children.length;
      for (var i = 0;i < len; i++) {
        if (!this.children[i].equals(other.children[i])) {
          return false;
        }
      }
      return true;
    },
    guid: 0,
    compile: function compile2(program, options) {
      this.sourceNode = [];
      this.opcodes = [];
      this.children = [];
      this.options = options;
      this.stringParams = options.stringParams;
      this.trackIds = options.trackIds;
      options.blockParams = options.blockParams || [];
      options.knownHelpers = _utils.extend(Object.create(null), {
        helperMissing: true,
        blockHelperMissing: true,
        each: true,
        if: true,
        unless: true,
        with: true,
        log: true,
        lookup: true
      }, options.knownHelpers);
      return this.accept(program);
    },
    compileProgram: function compileProgram(program) {
      var childCompiler = new this.compiler, result = childCompiler.compile(program, this.options), guid = this.guid++;
      this.usePartial = this.usePartial || result.usePartial;
      this.children[guid] = result;
      this.useDepths = this.useDepths || result.useDepths;
      return guid;
    },
    accept: function accept(node) {
      if (!this[node.type]) {
        throw new _exception2["default"]("Unknown type: " + node.type, node);
      }
      this.sourceNode.unshift(node);
      var ret = this[node.type](node);
      this.sourceNode.shift();
      return ret;
    },
    Program: function Program(program) {
      this.options.blockParams.unshift(program.blockParams);
      var body = program.body, bodyLength = body.length;
      for (var i = 0;i < bodyLength; i++) {
        this.accept(body[i]);
      }
      this.options.blockParams.shift();
      this.isSimple = bodyLength === 1;
      this.blockParams = program.blockParams ? program.blockParams.length : 0;
      return this;
    },
    BlockStatement: function BlockStatement(block) {
      transformLiteralToPath(block);
      var { program, inverse } = block;
      program = program && this.compileProgram(program);
      inverse = inverse && this.compileProgram(inverse);
      var type = this.classifySexpr(block);
      if (type === "helper") {
        this.helperSexpr(block, program, inverse);
      } else if (type === "simple") {
        this.simpleSexpr(block);
        this.opcode("pushProgram", program);
        this.opcode("pushProgram", inverse);
        this.opcode("emptyHash");
        this.opcode("blockValue", block.path.original);
      } else {
        this.ambiguousSexpr(block, program, inverse);
        this.opcode("pushProgram", program);
        this.opcode("pushProgram", inverse);
        this.opcode("emptyHash");
        this.opcode("ambiguousBlockValue");
      }
      this.opcode("append");
    },
    DecoratorBlock: function DecoratorBlock(decorator) {
      var program = decorator.program && this.compileProgram(decorator.program);
      var params = this.setupFullMustacheParams(decorator, program, undefined), path = decorator.path;
      this.useDecorators = true;
      this.opcode("registerDecorator", params.length, path.original);
    },
    PartialStatement: function PartialStatement(partial) {
      this.usePartial = true;
      var program = partial.program;
      if (program) {
        program = this.compileProgram(partial.program);
      }
      var params = partial.params;
      if (params.length > 1) {
        throw new _exception2["default"]("Unsupported number of partial arguments: " + params.length, partial);
      } else if (!params.length) {
        if (this.options.explicitPartialContext) {
          this.opcode("pushLiteral", "undefined");
        } else {
          params.push({ type: "PathExpression", parts: [], depth: 0 });
        }
      }
      var partialName = partial.name.original, isDynamic = partial.name.type === "SubExpression";
      if (isDynamic) {
        this.accept(partial.name);
      }
      this.setupFullMustacheParams(partial, program, undefined, true);
      var indent = partial.indent || "";
      if (this.options.preventIndent && indent) {
        this.opcode("appendContent", indent);
        indent = "";
      }
      this.opcode("invokePartial", isDynamic, partialName, indent);
      this.opcode("append");
    },
    PartialBlockStatement: function PartialBlockStatement(partialBlock) {
      this.PartialStatement(partialBlock);
    },
    MustacheStatement: function MustacheStatement(mustache) {
      this.SubExpression(mustache);
      if (mustache.escaped && !this.options.noEscape) {
        this.opcode("appendEscaped");
      } else {
        this.opcode("append");
      }
    },
    Decorator: function Decorator(decorator) {
      this.DecoratorBlock(decorator);
    },
    ContentStatement: function ContentStatement(content) {
      if (content.value) {
        this.opcode("appendContent", content.value);
      }
    },
    CommentStatement: function CommentStatement() {},
    SubExpression: function SubExpression(sexpr) {
      transformLiteralToPath(sexpr);
      var type = this.classifySexpr(sexpr);
      if (type === "simple") {
        this.simpleSexpr(sexpr);
      } else if (type === "helper") {
        this.helperSexpr(sexpr);
      } else {
        this.ambiguousSexpr(sexpr);
      }
    },
    ambiguousSexpr: function ambiguousSexpr(sexpr, program, inverse) {
      var path = sexpr.path, name = path.parts[0], isBlock = program != null || inverse != null;
      this.opcode("getContext", path.depth);
      this.opcode("pushProgram", program);
      this.opcode("pushProgram", inverse);
      path.strict = true;
      this.accept(path);
      this.opcode("invokeAmbiguous", name, isBlock);
    },
    simpleSexpr: function simpleSexpr(sexpr) {
      var path = sexpr.path;
      path.strict = true;
      this.accept(path);
      this.opcode("resolvePossibleLambda");
    },
    helperSexpr: function helperSexpr(sexpr, program, inverse) {
      var params = this.setupFullMustacheParams(sexpr, program, inverse), path = sexpr.path, name = path.parts[0];
      if (this.options.knownHelpers[name]) {
        this.opcode("invokeKnownHelper", params.length, name);
      } else if (this.options.knownHelpersOnly) {
        throw new _exception2["default"]("You specified knownHelpersOnly, but used the unknown helper " + name, sexpr);
      } else {
        path.strict = true;
        path.falsy = true;
        this.accept(path);
        this.opcode("invokeHelper", params.length, path.original, _ast2["default"].helpers.simpleId(path));
      }
    },
    PathExpression: function PathExpression(path) {
      this.addDepth(path.depth);
      this.opcode("getContext", path.depth);
      var name = path.parts[0], scoped = _ast2["default"].helpers.scopedId(path), blockParamId = !path.depth && !scoped && this.blockParamIndex(name);
      if (blockParamId) {
        this.opcode("lookupBlockParam", blockParamId, path.parts);
      } else if (!name) {
        this.opcode("pushContext");
      } else if (path.data) {
        this.options.data = true;
        this.opcode("lookupData", path.depth, path.parts, path.strict);
      } else {
        this.opcode("lookupOnContext", path.parts, path.falsy, path.strict, scoped);
      }
    },
    StringLiteral: function StringLiteral(string) {
      this.opcode("pushString", string.value);
    },
    NumberLiteral: function NumberLiteral(number) {
      this.opcode("pushLiteral", number.value);
    },
    BooleanLiteral: function BooleanLiteral(bool) {
      this.opcode("pushLiteral", bool.value);
    },
    UndefinedLiteral: function UndefinedLiteral() {
      this.opcode("pushLiteral", "undefined");
    },
    NullLiteral: function NullLiteral() {
      this.opcode("pushLiteral", "null");
    },
    Hash: function Hash(hash) {
      var pairs = hash.pairs, i = 0, l = pairs.length;
      this.opcode("pushHash");
      for (;i < l; i++) {
        this.pushParam(pairs[i].value);
      }
      while (i--) {
        this.opcode("assignToHash", pairs[i].key);
      }
      this.opcode("popHash");
    },
    opcode: function opcode(name) {
      this.opcodes.push({
        opcode: name,
        args: slice.call(arguments, 1),
        loc: this.sourceNode[0].loc
      });
    },
    addDepth: function addDepth(depth) {
      if (!depth) {
        return;
      }
      this.useDepths = true;
    },
    classifySexpr: function classifySexpr(sexpr) {
      var isSimple = _ast2["default"].helpers.simpleId(sexpr.path);
      var isBlockParam = isSimple && !!this.blockParamIndex(sexpr.path.parts[0]);
      var isHelper = !isBlockParam && _ast2["default"].helpers.helperExpression(sexpr);
      var isEligible = !isBlockParam && (isHelper || isSimple);
      if (isEligible && !isHelper) {
        var _name = sexpr.path.parts[0], options = this.options;
        if (options.knownHelpers[_name]) {
          isHelper = true;
        } else if (options.knownHelpersOnly) {
          isEligible = false;
        }
      }
      if (isHelper) {
        return "helper";
      } else if (isEligible) {
        return "ambiguous";
      } else {
        return "simple";
      }
    },
    pushParams: function pushParams(params) {
      for (var i = 0, l = params.length;i < l; i++) {
        this.pushParam(params[i]);
      }
    },
    pushParam: function pushParam(val) {
      var value = val.value != null ? val.value : val.original || "";
      if (this.stringParams) {
        if (value.replace) {
          value = value.replace(/^(\.?\.\/)*/g, "").replace(/\//g, ".");
        }
        if (val.depth) {
          this.addDepth(val.depth);
        }
        this.opcode("getContext", val.depth || 0);
        this.opcode("pushStringParam", value, val.type);
        if (val.type === "SubExpression") {
          this.accept(val);
        }
      } else {
        if (this.trackIds) {
          var blockParamIndex = undefined;
          if (val.parts && !_ast2["default"].helpers.scopedId(val) && !val.depth) {
            blockParamIndex = this.blockParamIndex(val.parts[0]);
          }
          if (blockParamIndex) {
            var blockParamChild = val.parts.slice(1).join(".");
            this.opcode("pushId", "BlockParam", blockParamIndex, blockParamChild);
          } else {
            value = val.original || value;
            if (value.replace) {
              value = value.replace(/^this(?:\.|$)/, "").replace(/^\.\//, "").replace(/^\.$/, "");
            }
            this.opcode("pushId", val.type, value);
          }
        }
        this.accept(val);
      }
    },
    setupFullMustacheParams: function setupFullMustacheParams(sexpr, program, inverse, omitEmpty) {
      var params = sexpr.params;
      this.pushParams(params);
      this.opcode("pushProgram", program);
      this.opcode("pushProgram", inverse);
      if (sexpr.hash) {
        this.accept(sexpr.hash);
      } else {
        this.opcode("emptyHash", omitEmpty);
      }
      return params;
    },
    blockParamIndex: function blockParamIndex(name) {
      for (var depth = 0, len = this.options.blockParams.length;depth < len; depth++) {
        var blockParams = this.options.blockParams[depth], param = blockParams && _utils.indexOf(blockParams, name);
        if (blockParams && param >= 0) {
          return [depth, param];
        }
      }
    }
  };
  function precompile(input, options, env2) {
    if (input == null || typeof input !== "string" && input.type !== "Program") {
      throw new _exception2["default"]("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
    }
    options = options || {};
    if (!("data" in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }
    var ast = env2.parse(input, options), environment = new env2.Compiler().compile(ast, options);
    return new env2.JavaScriptCompiler().compile(environment, options);
  }
  function compile(input, options, env2) {
    if (options === undefined)
      options = {};
    if (input == null || typeof input !== "string" && input.type !== "Program") {
      throw new _exception2["default"]("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
    }
    options = _utils.extend({}, options);
    if (!("data" in options)) {
      options.data = true;
    }
    if (options.compat) {
      options.useDepths = true;
    }
    var compiled = undefined;
    function compileInput() {
      var ast = env2.parse(input, options), environment = new env2.Compiler().compile(ast, options), templateSpec = new env2.JavaScriptCompiler().compile(environment, options, undefined, true);
      return env2.template(templateSpec);
    }
    function ret(context, execOptions) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled.call(this, context, execOptions);
    }
    ret._setup = function(setupOptions) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._setup(setupOptions);
    };
    ret._child = function(i, data2, blockParams, depths) {
      if (!compiled) {
        compiled = compileInput();
      }
      return compiled._child(i, data2, blockParams, depths);
    };
    return ret;
  }
  function argEquals(a, b) {
    if (a === b) {
      return true;
    }
    if (_utils.isArray(a) && _utils.isArray(b) && a.length === b.length) {
      for (var i = 0;i < a.length; i++) {
        if (!argEquals(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  }
  function transformLiteralToPath(sexpr) {
    if (!sexpr.path.parts) {
      var literal = sexpr.path;
      sexpr.path = {
        type: "PathExpression",
        data: false,
        depth: 0,
        parts: [literal.original + ""],
        original: literal.original + "",
        loc: literal.loc
      };
    }
  }
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/base64.js
var require_base64 = __commonJS((exports) => {
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  exports.encode = function(number) {
    if (0 <= number && number < intToCharMap.length) {
      return intToCharMap[number];
    }
    throw new TypeError("Must be between 0 and 63: " + number);
  };
  exports.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/base64-vlq.js
var require_base64_vlq = __commonJS((exports) => {
  var base64 = require_base64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  exports.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base64.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base64.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/util.js
var require_util = __commonJS((exports) => {
  function getArg(aArgs, aName, aDefaultValue) {
    if (aName in aArgs) {
      return aArgs[aName];
    } else if (arguments.length === 3) {
      return aDefaultValue;
    } else {
      throw new Error('"' + aName + '" is a required argument.');
    }
  }
  exports.getArg = getArg;
  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
  var dataUrlRegexp = /^data:.+\,.+$/;
  function urlParse(aUrl) {
    var match = aUrl.match(urlRegexp);
    if (!match) {
      return null;
    }
    return {
      scheme: match[1],
      auth: match[2],
      host: match[3],
      port: match[4],
      path: match[5]
    };
  }
  exports.urlParse = urlParse;
  function urlGenerate(aParsedUrl) {
    var url = "";
    if (aParsedUrl.scheme) {
      url += aParsedUrl.scheme + ":";
    }
    url += "//";
    if (aParsedUrl.auth) {
      url += aParsedUrl.auth + "@";
    }
    if (aParsedUrl.host) {
      url += aParsedUrl.host;
    }
    if (aParsedUrl.port) {
      url += ":" + aParsedUrl.port;
    }
    if (aParsedUrl.path) {
      url += aParsedUrl.path;
    }
    return url;
  }
  exports.urlGenerate = urlGenerate;
  function normalize(aPath) {
    var path = aPath;
    var url = urlParse(aPath);
    if (url) {
      if (!url.path) {
        return aPath;
      }
      path = url.path;
    }
    var isAbsolute = exports.isAbsolute(path);
    var parts = path.split(/\/+/);
    for (var part, up = 0, i = parts.length - 1;i >= 0; i--) {
      part = parts[i];
      if (part === ".") {
        parts.splice(i, 1);
      } else if (part === "..") {
        up++;
      } else if (up > 0) {
        if (part === "") {
          parts.splice(i + 1, up);
          up = 0;
        } else {
          parts.splice(i, 2);
          up--;
        }
      }
    }
    path = parts.join("/");
    if (path === "") {
      path = isAbsolute ? "/" : ".";
    }
    if (url) {
      url.path = path;
      return urlGenerate(url);
    }
    return path;
  }
  exports.normalize = normalize;
  function join(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    if (aPath === "") {
      aPath = ".";
    }
    var aPathUrl = urlParse(aPath);
    var aRootUrl = urlParse(aRoot);
    if (aRootUrl) {
      aRoot = aRootUrl.path || "/";
    }
    if (aPathUrl && !aPathUrl.scheme) {
      if (aRootUrl) {
        aPathUrl.scheme = aRootUrl.scheme;
      }
      return urlGenerate(aPathUrl);
    }
    if (aPathUrl || aPath.match(dataUrlRegexp)) {
      return aPath;
    }
    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
      aRootUrl.host = aPath;
      return urlGenerate(aRootUrl);
    }
    var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
    if (aRootUrl) {
      aRootUrl.path = joined;
      return urlGenerate(aRootUrl);
    }
    return joined;
  }
  exports.join = join;
  exports.isAbsolute = function(aPath) {
    return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
  };
  function relative(aRoot, aPath) {
    if (aRoot === "") {
      aRoot = ".";
    }
    aRoot = aRoot.replace(/\/$/, "");
    var level = 0;
    while (aPath.indexOf(aRoot + "/") !== 0) {
      var index = aRoot.lastIndexOf("/");
      if (index < 0) {
        return aPath;
      }
      aRoot = aRoot.slice(0, index);
      if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
        return aPath;
      }
      ++level;
    }
    return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
  }
  exports.relative = relative;
  var supportsNullProto = function() {
    var obj = Object.create(null);
    return !("__proto__" in obj);
  }();
  function identity(s) {
    return s;
  }
  function toSetString(aStr) {
    if (isProtoString(aStr)) {
      return "$" + aStr;
    }
    return aStr;
  }
  exports.toSetString = supportsNullProto ? identity : toSetString;
  function fromSetString(aStr) {
    if (isProtoString(aStr)) {
      return aStr.slice(1);
    }
    return aStr;
  }
  exports.fromSetString = supportsNullProto ? identity : fromSetString;
  function isProtoString(s) {
    if (!s) {
      return false;
    }
    var length = s.length;
    if (length < 9) {
      return false;
    }
    if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
      return false;
    }
    for (var i = length - 10;i >= 0; i--) {
      if (s.charCodeAt(i) !== 36) {
        return false;
      }
    }
    return true;
  }
  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
    var cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0 || onlyCompareOriginal) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByOriginalPositions = compareByOriginalPositions;
  function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0 || onlyCompareGenerated) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
  function strcmp(aStr1, aStr2) {
    if (aStr1 === aStr2) {
      return 0;
    }
    if (aStr1 === null) {
      return 1;
    }
    if (aStr2 === null) {
      return -1;
    }
    if (aStr1 > aStr2) {
      return 1;
    }
    return -1;
  }
  function compareByGeneratedPositionsInflated(mappingA, mappingB) {
    var cmp = mappingA.generatedLine - mappingB.generatedLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = strcmp(mappingA.source, mappingB.source);
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalLine - mappingB.originalLine;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = mappingA.originalColumn - mappingB.originalColumn;
    if (cmp !== 0) {
      return cmp;
    }
    return strcmp(mappingA.name, mappingB.name);
  }
  exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
  function parseSourceMapInput(str) {
    return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
  }
  exports.parseSourceMapInput = parseSourceMapInput;
  function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
    sourceURL = sourceURL || "";
    if (sourceRoot) {
      if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
        sourceRoot += "/";
      }
      sourceURL = sourceRoot + sourceURL;
    }
    if (sourceMapURL) {
      var parsed = urlParse(sourceMapURL);
      if (!parsed) {
        throw new Error("sourceMapURL could not be parsed");
      }
      if (parsed.path) {
        var index = parsed.path.lastIndexOf("/");
        if (index >= 0) {
          parsed.path = parsed.path.substring(0, index + 1);
        }
      }
      sourceURL = join(urlGenerate(parsed), sourceURL);
    }
    return normalize(sourceURL);
  }
  exports.computeSourceURL = computeSourceURL;
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/array-set.js
var require_array_set = __commonJS((exports) => {
  var util2 = require_util();
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? new Map : Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet;
    for (var i = 0, len = aArray.length;i < len; i++) {
      set.add(aArray[i], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util2.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util2.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util2.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  exports.ArraySet = ArraySet;
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/mapping-list.js
var require_mapping_list = __commonJS((exports) => {
  var util2 = require_util();
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util2.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util2.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  exports.MappingList = MappingList;
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/source-map-generator.js
var require_source_map_generator = __commonJS((exports) => {
  var base64VLQ = require_base64_vlq();
  var util2 = require_util();
  var ArraySet = require_array_set().ArraySet;
  var MappingList = require_mapping_list().MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util2.getArg(aArgs, "file", null);
    this._sourceRoot = util2.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util2.getArg(aArgs, "skipValidation", false);
    this._sources = new ArraySet;
    this._names = new ArraySet;
    this._mappings = new MappingList;
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot
    });
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util2.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util2.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util2.getArg(aArgs, "generated");
    var original = util2.getArg(aArgs, "original", null);
    var source = util2.getArg(aArgs, "source", null);
    var name = util2.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name);
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util2.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util2.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util2.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error("SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, " + `or the source map's "file" property. Both were omitted.`);
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util2.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet;
    var newNames = new ArraySet;
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util2.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util2.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util2.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util2.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      throw new Error("original.line and original.column are not numbers -- you probably meant to omit " + "the original mapping entirely and only map the generated position. If so, pass " + "null for the original mapping instead of an object with empty or null values.");
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length;i < len; i++) {
      mapping = mappings[i];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i > 0) {
          if (!util2.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result += next;
    }
    return result;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util2.relative(aSourceRoot, source);
      }
      var key = util2.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }
    return map;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  exports.SourceMapGenerator = SourceMapGenerator;
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/binary-search.js
var require_binary_search = __commonJS((exports) => {
  exports.GREATEST_LOWER_BOUND = 1;
  exports.LEAST_UPPER_BOUND = 2;
  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
    var cmp = aCompare(aNeedle, aHaystack[mid], true);
    if (cmp === 0) {
      return mid;
    } else if (cmp > 0) {
      if (aHigh - mid > 1) {
        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return aHigh < aHaystack.length ? aHigh : -1;
      } else {
        return mid;
      }
    } else {
      if (mid - aLow > 1) {
        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
      }
      if (aBias == exports.LEAST_UPPER_BOUND) {
        return mid;
      } else {
        return aLow < 0 ? -1 : aLow;
      }
    }
  }
  exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
    if (aHaystack.length === 0) {
      return -1;
    }
    var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare, aBias || exports.GREATEST_LOWER_BOUND);
    if (index < 0) {
      return -1;
    }
    while (index - 1 >= 0) {
      if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
        break;
      }
      --index;
    }
    return index;
  };
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/quick-sort.js
var require_quick_sort = __commonJS((exports) => {
  function swap(ary, x, y) {
    var temp = ary[x];
    ary[x] = ary[y];
    ary[y] = temp;
  }
  function randomIntInRange(low, high) {
    return Math.round(low + Math.random() * (high - low));
  }
  function doQuickSort(ary, comparator, p, r) {
    if (p < r) {
      var pivotIndex = randomIntInRange(p, r);
      var i = p - 1;
      swap(ary, pivotIndex, r);
      var pivot = ary[r];
      for (var j = p;j < r; j++) {
        if (comparator(ary[j], pivot) <= 0) {
          i += 1;
          swap(ary, i, j);
        }
      }
      swap(ary, i + 1, j);
      var q = i + 1;
      doQuickSort(ary, comparator, p, q - 1);
      doQuickSort(ary, comparator, q + 1, r);
    }
  }
  exports.quickSort = function(ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/source-map-consumer.js
var require_source_map_consumer = __commonJS((exports) => {
  var util2 = require_util();
  var binarySearch = require_binary_search();
  var ArraySet = require_array_set().ArraySet;
  var base64VLQ = require_base64_vlq();
  var quickSort = require_quick_sort().quickSort;
  function SourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util2.parseSourceMapInput(aSourceMap);
    }
    return sourceMap.sections != null ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
  }
  SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
  };
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__generatedMappings;
    }
  });
  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__originalMappings;
    }
  });
  SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;
  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;
  SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    var mappings;
    switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var sourceRoot = this.sourceRoot;
    mappings.map(function(mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util2.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };
  SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util2.getArg(aArgs, "line");
    var needle = {
      source: util2.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util2.getArg(aArgs, "column", 0)
    };
    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }
    var mappings = [];
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util2.compareByOriginalPositions, binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;
        while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      }
    }
    return mappings;
  };
  exports.SourceMapConsumer = SourceMapConsumer;
  function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util2.parseSourceMapInput(aSourceMap);
    }
    var version = util2.getArg(sourceMap, "version");
    var sources = util2.getArg(sourceMap, "sources");
    var names = util2.getArg(sourceMap, "names", []);
    var sourceRoot = util2.getArg(sourceMap, "sourceRoot", null);
    var sourcesContent = util2.getArg(sourceMap, "sourcesContent", null);
    var mappings = util2.getArg(sourceMap, "mappings");
    var file = util2.getArg(sourceMap, "file", null);
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    if (sourceRoot) {
      sourceRoot = util2.normalize(sourceRoot);
    }
    sources = sources.map(String).map(util2.normalize).map(function(source) {
      return sourceRoot && util2.isAbsolute(sourceRoot) && util2.isAbsolute(source) ? util2.relative(sourceRoot, source) : source;
    });
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);
    this._absoluteSources = this._sources.toArray().map(function(s) {
      return util2.computeSourceURL(sourceRoot, s, aSourceMapURL);
    });
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this._sourceMapURL = aSourceMapURL;
    this.file = file;
  }
  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
  BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util2.relative(this.sourceRoot, relativeSource);
    }
    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }
    var i;
    for (i = 0;i < this._absoluteSources.length; ++i) {
      if (this._absoluteSources[i] == aSource) {
        return i;
      }
    }
    return -1;
  };
  BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);
    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(), smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function(s) {
      return util2.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });
    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];
    for (var i = 0, length = generatedMappings.length;i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;
      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;
        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }
        destOriginalMappings.push(destMapping);
      }
      destGeneratedMappings.push(destMapping);
    }
    quickSort(smc.__originalMappings, util2.compareByOriginalPositions);
    return smc;
  };
  BasicSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }
  BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;
    while (index < length) {
      if (aStr.charAt(index) === ";") {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      } else if (aStr.charAt(index) === ",") {
        index++;
      } else {
        mapping = new Mapping;
        mapping.generatedLine = generatedLine;
        for (end = index;end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);
        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }
          if (segment.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (segment.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          cachedSegments[str] = segment;
        }
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;
        if (segment.length > 1) {
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;
          if (segment.length > 4) {
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }
        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === "number") {
          originalMappings.push(mapping);
        }
      }
    }
    quickSort(generatedMappings, util2.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;
    quickSort(originalMappings, util2.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };
  BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
    }
    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };
  BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0;index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];
        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }
      mapping.lastGeneratedColumn = Infinity;
    }
  };
  BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._generatedMappings, "generatedLine", "generatedColumn", util2.compareByGeneratedPositionsDeflated, util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._generatedMappings[index];
      if (mapping.generatedLine === needle.generatedLine) {
        var source = util2.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util2.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util2.getArg(mapping, "name", null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source,
          line: util2.getArg(mapping, "originalLine", null),
          column: util2.getArg(mapping, "originalColumn", null),
          name
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc) {
      return sc == null;
    });
  };
  BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }
    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util2.relative(this.sourceRoot, relativeSource);
    }
    var url;
    if (this.sourceRoot != null && (url = util2.urlParse(this.sourceRoot))) {
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file" && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }
      if ((!url.path || url.path == "/") && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };
  BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util2.getArg(aArgs, "source");
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    var needle = {
      source,
      originalLine: util2.getArg(aArgs, "line"),
      originalColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(needle, this._originalMappings, "originalLine", "originalColumn", util2.compareByOriginalPositions, util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND));
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (mapping.source === needle.source) {
        return {
          line: util2.getArg(mapping, "generatedLine", null),
          column: util2.getArg(mapping, "generatedColumn", null),
          lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
        };
      }
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };
  exports.BasicSourceMapConsumer = BasicSourceMapConsumer;
  function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap = util2.parseSourceMapInput(aSourceMap);
    }
    var version = util2.getArg(sourceMap, "version");
    var sections = util2.getArg(sourceMap, "sections");
    if (version != this._version) {
      throw new Error("Unsupported version: " + version);
    }
    this._sources = new ArraySet;
    this._names = new ArraySet;
    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function(s) {
      if (s.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var offset = util2.getArg(s, "offset");
      var offsetLine = util2.getArg(offset, "line");
      var offsetColumn = util2.getArg(offset, "column");
      if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      lastOffset = offset;
      return {
        generatedOffset: {
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util2.getArg(s, "map"), aSourceMapURL)
      };
    });
  }
  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
  IndexedSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
    get: function() {
      var sources = [];
      for (var i = 0;i < this._sections.length; i++) {
        for (var j = 0;j < this._sections[i].consumer.sources.length; j++) {
          sources.push(this._sections[i].consumer.sources[j]);
        }
      }
      return sources;
    }
  });
  IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var sectionIndex = binarySearch.search(needle, this._sections, function(needle2, section2) {
      var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
      if (cmp) {
        return cmp;
      }
      return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
    });
    var section = this._sections[sectionIndex];
    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }
    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
      bias: aArgs.bias
    });
  };
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function(s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };
  IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0;i < this._sections.length; i++) {
      var section = this._sections[i];
      var content = section.consumer.sourceContentFor(aSource, true);
      if (content) {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0;i < this._sections.length; i++) {
      var section = this._sections[i];
      if (section.consumer._findSourceIndex(util2.getArg(aArgs, "source")) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
        };
        return ret;
      }
    }
    return {
      line: null,
      column: null
    };
  };
  IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0;i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0;j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];
        var source = section.consumer._sources.at(mapping.source);
        source = util2.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);
        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }
        var adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name
        };
        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }
    quickSort(this.__generatedMappings, util2.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util2.compareByOriginalPositions);
  };
  exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/lib/source-node.js
var require_source_node = __commonJS((exports) => {
  var SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
  var util2 = require_util();
  var REGEX_NEWLINE = /(\r?\n)/;
  var NEWLINE_CODE = 10;
  var isSourceNode = "$$$isSourceNode$$$";
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null)
      this.add(aChunks);
  }
  SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    var node = new SourceNode;
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      var newLine = getNextLine() || "";
      return lineContents + newLine;
      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : undefined;
      }
    };
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
    var lastMapping = null;
    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        if (lastGeneratedLine < mapping.generatedLine) {
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
        } else {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          var code = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          lastMapping = mapping;
          return;
        }
      }
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || "";
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util2.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });
    return node;
    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath ? util2.join(aRelativePath, mapping.source) : mapping.source;
        node.add(new SourceNode(mapping.originalLine, mapping.originalColumn, source, code, mapping.name));
      }
    }
  };
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i = aChunk.length - 1;i >= 0; i--) {
        this.prepend(aChunk[i]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk);
    }
    return this;
  };
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i = 0, len = this.children.length;i < len; i++) {
      chunk = this.children[i];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else {
        if (chunk !== "") {
          aFn(chunk, {
            source: this.source,
            line: this.line,
            column: this.column,
            name: this.name
          });
        }
      }
    }
  };
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i = 0;i < len - 1; i++) {
        newChildren.push(this.children[i]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i]);
      this.children = newChildren;
    }
    return this;
  };
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  };
  SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util2.toSetString(aSourceFile)] = aSourceContent;
  };
  SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length;i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }
    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length;i < len; i++) {
      aFn(util2.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  };
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null && original.line !== null && original.column !== null) {
        if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length;idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map.setSourceContent(sourceFile, sourceContent);
    });
    return { code: generated.code, map };
  };
  exports.SourceNode = SourceNode;
});

// ../../node_modules/.bun/source-map@0.6.1/node_modules/source-map/source-map.js
var require_source_map = __commonJS((exports) => {
  exports.SourceMapGenerator = require_source_map_generator().SourceMapGenerator;
  exports.SourceMapConsumer = require_source_map_consumer().SourceMapConsumer;
  exports.SourceNode = require_source_node().SourceNode;
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/code-gen.js
var require_code_gen = __commonJS((exports, module) => {
  exports.__esModule = true;
  var _utils = require_utils();
  var SourceNode = undefined;
  try {
    if (typeof define !== "function" || !define.amd) {
      SourceMap = require_source_map();
      SourceNode = SourceMap.SourceNode;
    }
  } catch (err) {}
  var SourceMap;
  if (!SourceNode) {
    SourceNode = function(line, column, srcFile, chunks) {
      this.src = "";
      if (chunks) {
        this.add(chunks);
      }
    };
    SourceNode.prototype = {
      add: function add(chunks) {
        if (_utils.isArray(chunks)) {
          chunks = chunks.join("");
        }
        this.src += chunks;
      },
      prepend: function prepend(chunks) {
        if (_utils.isArray(chunks)) {
          chunks = chunks.join("");
        }
        this.src = chunks + this.src;
      },
      toStringWithSourceMap: function toStringWithSourceMap() {
        return { code: this.toString() };
      },
      toString: function toString2() {
        return this.src;
      }
    };
  }
  function castChunk(chunk, codeGen, loc) {
    if (_utils.isArray(chunk)) {
      var ret = [];
      for (var i = 0, len = chunk.length;i < len; i++) {
        ret.push(codeGen.wrap(chunk[i], loc));
      }
      return ret;
    } else if (typeof chunk === "boolean" || typeof chunk === "number") {
      return chunk + "";
    }
    return chunk;
  }
  function CodeGen(srcFile) {
    this.srcFile = srcFile;
    this.source = [];
  }
  CodeGen.prototype = {
    isEmpty: function isEmpty() {
      return !this.source.length;
    },
    prepend: function prepend(source, loc) {
      this.source.unshift(this.wrap(source, loc));
    },
    push: function push(source, loc) {
      this.source.push(this.wrap(source, loc));
    },
    merge: function merge() {
      var source = this.empty();
      this.each(function(line) {
        source.add(["  ", line, `
`]);
      });
      return source;
    },
    each: function each(iter) {
      for (var i = 0, len = this.source.length;i < len; i++) {
        iter(this.source[i]);
      }
    },
    empty: function empty() {
      var loc = this.currentLocation || { start: {} };
      return new SourceNode(loc.start.line, loc.start.column, this.srcFile);
    },
    wrap: function wrap(chunk) {
      var loc = arguments.length <= 1 || arguments[1] === undefined ? this.currentLocation || { start: {} } : arguments[1];
      if (chunk instanceof SourceNode) {
        return chunk;
      }
      chunk = castChunk(chunk, this, loc);
      return new SourceNode(loc.start.line, loc.start.column, this.srcFile, chunk);
    },
    functionCall: function functionCall(fn, type, params) {
      params = this.generateList(params);
      return this.wrap([fn, type ? "." + type + "(" : "(", params, ")"]);
    },
    quotedString: function quotedString(str) {
      return '"' + (str + "").replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"';
    },
    objectLiteral: function objectLiteral(obj) {
      var _this = this;
      var pairs = [];
      Object.keys(obj).forEach(function(key) {
        var value = castChunk(obj[key], _this);
        if (value !== "undefined") {
          pairs.push([_this.quotedString(key), ":", value]);
        }
      });
      var ret = this.generateList(pairs);
      ret.prepend("{");
      ret.add("}");
      return ret;
    },
    generateList: function generateList(entries) {
      var ret = this.empty();
      for (var i = 0, len = entries.length;i < len; i++) {
        if (i) {
          ret.add(",");
        }
        ret.add(castChunk(entries[i], this));
      }
      return ret;
    },
    generateArray: function generateArray(entries) {
      var ret = this.generateList(entries);
      ret.prepend("[");
      ret.add("]");
      return ret;
    }
  };
  exports.default = CodeGen;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/javascript-compiler.js
var require_javascript_compiler = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _base = require_base();
  var _exception = require_exception();
  var _exception2 = _interopRequireDefault(_exception);
  var _utils = require_utils();
  var _codeGen = require_code_gen();
  var _codeGen2 = _interopRequireDefault(_codeGen);
  function Literal(value) {
    this.value = value;
  }
  function JavaScriptCompiler() {}
  JavaScriptCompiler.prototype = {
    nameLookup: function nameLookup(parent, name) {
      return this.internalNameLookup(parent, name);
    },
    depthedLookup: function depthedLookup(name) {
      return [this.aliasable("container.lookup"), "(depths, ", JSON.stringify(name), ")"];
    },
    compilerInfo: function compilerInfo() {
      var revision = _base.COMPILER_REVISION, versions = _base.REVISION_CHANGES[revision];
      return [revision, versions];
    },
    appendToBuffer: function appendToBuffer(source, location, explicit) {
      if (!_utils.isArray(source)) {
        source = [source];
      }
      source = this.source.wrap(source, location);
      if (this.environment.isSimple) {
        return ["return ", source, ";"];
      } else if (explicit) {
        return ["buffer += ", source, ";"];
      } else {
        source.appendToBuffer = true;
        return source;
      }
    },
    initializeBuffer: function initializeBuffer() {
      return this.quotedString("");
    },
    internalNameLookup: function internalNameLookup(parent, name) {
      this.lookupPropertyFunctionIsUsed = true;
      return ["lookupProperty(", parent, ",", JSON.stringify(name), ")"];
    },
    lookupPropertyFunctionIsUsed: false,
    compile: function compile(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options;
      this.stringParams = this.options.stringParams;
      this.trackIds = this.options.trackIds;
      this.precompile = !asObject;
      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        decorators: [],
        programs: [],
        environments: []
      };
      this.preamble();
      this.stackSlot = 0;
      this.stackVars = [];
      this.aliases = {};
      this.registers = { list: [] };
      this.hashes = [];
      this.compileStack = [];
      this.inlineStack = [];
      this.blockParams = [];
      this.compileChildren(environment, options);
      this.useDepths = this.useDepths || environment.useDepths || environment.useDecorators || this.options.compat;
      this.useBlockParams = this.useBlockParams || environment.useBlockParams;
      var opcodes = environment.opcodes, opcode = undefined, firstLoc = undefined, i = undefined, l = undefined;
      for (i = 0, l = opcodes.length;i < l; i++) {
        opcode = opcodes[i];
        this.source.currentLocation = opcode.loc;
        firstLoc = firstLoc || opcode.loc;
        this[opcode.opcode].apply(this, opcode.args);
      }
      this.source.currentLocation = firstLoc;
      this.pushSource("");
      if (this.stackSlot || this.inlineStack.length || this.compileStack.length) {
        throw new _exception2["default"]("Compile completed with content left on stack");
      }
      if (!this.decorators.isEmpty()) {
        this.useDecorators = true;
        this.decorators.prepend(["var decorators = container.decorators, ", this.lookupPropertyFunctionVarDeclaration(), `;
`]);
        this.decorators.push("return fn;");
        if (asObject) {
          this.decorators = Function.apply(this, ["fn", "props", "container", "depth0", "data", "blockParams", "depths", this.decorators.merge()]);
        } else {
          this.decorators.prepend(`function(fn, props, container, depth0, data, blockParams, depths) {
`);
          this.decorators.push(`}
`);
          this.decorators = this.decorators.merge();
        }
      } else {
        this.decorators = undefined;
      }
      var fn = this.createFunctionContext(asObject);
      if (!this.isChild) {
        var ret = {
          compiler: this.compilerInfo(),
          main: fn
        };
        if (this.decorators) {
          ret.main_d = this.decorators;
          ret.useDecorators = true;
        }
        var _context = this.context;
        var programs = _context.programs;
        var decorators = _context.decorators;
        for (i = 0, l = programs.length;i < l; i++) {
          ret[i] = programs[i];
          if (decorators[i]) {
            ret[i + "_d"] = decorators[i];
            ret.useDecorators = true;
          }
        }
        if (this.environment.usePartial) {
          ret.usePartial = true;
        }
        if (this.options.data) {
          ret.useData = true;
        }
        if (this.useDepths) {
          ret.useDepths = true;
        }
        if (this.useBlockParams) {
          ret.useBlockParams = true;
        }
        if (this.options.compat) {
          ret.compat = true;
        }
        if (!asObject) {
          ret.compiler = JSON.stringify(ret.compiler);
          this.source.currentLocation = { start: { line: 1, column: 0 } };
          ret = this.objectLiteral(ret);
          if (options.srcName) {
            ret = ret.toStringWithSourceMap({ file: options.destName });
            ret.map = ret.map && ret.map.toString();
          } else {
            ret = ret.toString();
          }
        } else {
          ret.compilerOptions = this.options;
        }
        return ret;
      } else {
        return fn;
      }
    },
    preamble: function preamble() {
      this.lastContext = 0;
      this.source = new _codeGen2["default"](this.options.srcName);
      this.decorators = new _codeGen2["default"](this.options.srcName);
    },
    createFunctionContext: function createFunctionContext(asObject) {
      var _this = this;
      var varDeclarations = "";
      var locals = this.stackVars.concat(this.registers.list);
      if (locals.length > 0) {
        varDeclarations += ", " + locals.join(", ");
      }
      var aliasCount = 0;
      Object.keys(this.aliases).forEach(function(alias) {
        var node = _this.aliases[alias];
        if (node.children && node.referenceCount > 1) {
          varDeclarations += ", alias" + ++aliasCount + "=" + alias;
          node.children[0] = "alias" + aliasCount;
        }
      });
      if (this.lookupPropertyFunctionIsUsed) {
        varDeclarations += ", " + this.lookupPropertyFunctionVarDeclaration();
      }
      var params = ["container", "depth0", "helpers", "partials", "data"];
      if (this.useBlockParams || this.useDepths) {
        params.push("blockParams");
      }
      if (this.useDepths) {
        params.push("depths");
      }
      var source = this.mergeSource(varDeclarations);
      if (asObject) {
        params.push(source);
        return Function.apply(this, params);
      } else {
        return this.source.wrap(["function(", params.join(","), `) {
  `, source, "}"]);
      }
    },
    mergeSource: function mergeSource(varDeclarations) {
      var isSimple = this.environment.isSimple, appendOnly = !this.forceBuffer, appendFirst = undefined, sourceSeen = undefined, bufferStart = undefined, bufferEnd = undefined;
      this.source.each(function(line) {
        if (line.appendToBuffer) {
          if (bufferStart) {
            line.prepend("  + ");
          } else {
            bufferStart = line;
          }
          bufferEnd = line;
        } else {
          if (bufferStart) {
            if (!sourceSeen) {
              appendFirst = true;
            } else {
              bufferStart.prepend("buffer += ");
            }
            bufferEnd.add(";");
            bufferStart = bufferEnd = undefined;
          }
          sourceSeen = true;
          if (!isSimple) {
            appendOnly = false;
          }
        }
      });
      if (appendOnly) {
        if (bufferStart) {
          bufferStart.prepend("return ");
          bufferEnd.add(";");
        } else if (!sourceSeen) {
          this.source.push('return "";');
        }
      } else {
        varDeclarations += ", buffer = " + (appendFirst ? "" : this.initializeBuffer());
        if (bufferStart) {
          bufferStart.prepend("return buffer + ");
          bufferEnd.add(";");
        } else {
          this.source.push("return buffer;");
        }
      }
      if (varDeclarations) {
        this.source.prepend("var " + varDeclarations.substring(2) + (appendFirst ? "" : `;
`));
      }
      return this.source.merge();
    },
    lookupPropertyFunctionVarDeclaration: function lookupPropertyFunctionVarDeclaration() {
      return `
      lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }
    `.trim();
    },
    blockValue: function blockValue(name) {
      var blockHelperMissing = this.aliasable("container.hooks.blockHelperMissing"), params = [this.contextName(0)];
      this.setupHelperArgs(name, 0, params);
      var blockName = this.popStack();
      params.splice(1, 0, blockName);
      this.push(this.source.functionCall(blockHelperMissing, "call", params));
    },
    ambiguousBlockValue: function ambiguousBlockValue() {
      var blockHelperMissing = this.aliasable("container.hooks.blockHelperMissing"), params = [this.contextName(0)];
      this.setupHelperArgs("", 0, params, true);
      this.flushInline();
      var current = this.topStack();
      params.splice(1, 0, current);
      this.pushSource(["if (!", this.lastHelper, ") { ", current, " = ", this.source.functionCall(blockHelperMissing, "call", params), "}"]);
    },
    appendContent: function appendContent(content) {
      if (this.pendingContent) {
        content = this.pendingContent + content;
      } else {
        this.pendingLocation = this.source.currentLocation;
      }
      this.pendingContent = content;
    },
    append: function append() {
      if (this.isInline()) {
        this.replaceStack(function(current) {
          return [" != null ? ", current, ' : ""'];
        });
        this.pushSource(this.appendToBuffer(this.popStack()));
      } else {
        var local = this.popStack();
        this.pushSource(["if (", local, " != null) { ", this.appendToBuffer(local, undefined, true), " }"]);
        if (this.environment.isSimple) {
          this.pushSource(["else { ", this.appendToBuffer("''", undefined, true), " }"]);
        }
      }
    },
    appendEscaped: function appendEscaped() {
      this.pushSource(this.appendToBuffer([this.aliasable("container.escapeExpression"), "(", this.popStack(), ")"]));
    },
    getContext: function getContext(depth) {
      this.lastContext = depth;
    },
    pushContext: function pushContext() {
      this.pushStackLiteral(this.contextName(this.lastContext));
    },
    lookupOnContext: function lookupOnContext(parts, falsy, strict, scoped) {
      var i = 0;
      if (!scoped && this.options.compat && !this.lastContext) {
        this.push(this.depthedLookup(parts[i++]));
      } else {
        this.pushContext();
      }
      this.resolvePath("context", parts, i, falsy, strict);
    },
    lookupBlockParam: function lookupBlockParam(blockParamId, parts) {
      this.useBlockParams = true;
      this.push(["blockParams[", blockParamId[0], "][", blockParamId[1], "]"]);
      this.resolvePath("context", parts, 1);
    },
    lookupData: function lookupData(depth, parts, strict) {
      if (!depth) {
        this.pushStackLiteral("data");
      } else {
        this.pushStackLiteral("container.data(data, " + depth + ")");
      }
      this.resolvePath("data", parts, 0, true, strict);
    },
    resolvePath: function resolvePath(type, parts, startPartIndex, falsy, strict) {
      var _this2 = this;
      if (this.options.strict || this.options.assumeObjects) {
        this.push(strictLookup(this.options.strict && strict, this, parts, startPartIndex, type));
        return;
      }
      var len = parts.length;
      var _loop = function(i2) {
        _this2.replaceStack(function(current) {
          var lookup = _this2.nameLookup(current, parts[i2], type);
          if (!falsy) {
            return [" != null ? ", lookup, " : ", current];
          } else {
            return [" && ", lookup];
          }
        });
      };
      for (var i = startPartIndex;i < len; i++) {
        _loop(i);
      }
    },
    resolvePossibleLambda: function resolvePossibleLambda() {
      this.push([this.aliasable("container.lambda"), "(", this.popStack(), ", ", this.contextName(0), ")"]);
    },
    pushStringParam: function pushStringParam(string, type) {
      this.pushContext();
      this.pushString(type);
      if (type !== "SubExpression") {
        if (typeof string === "string") {
          this.pushString(string);
        } else {
          this.pushStackLiteral(string);
        }
      }
    },
    emptyHash: function emptyHash(omitEmpty) {
      if (this.trackIds) {
        this.push("{}");
      }
      if (this.stringParams) {
        this.push("{}");
        this.push("{}");
      }
      this.pushStackLiteral(omitEmpty ? "undefined" : "{}");
    },
    pushHash: function pushHash() {
      if (this.hash) {
        this.hashes.push(this.hash);
      }
      this.hash = { values: {}, types: [], contexts: [], ids: [] };
    },
    popHash: function popHash() {
      var hash = this.hash;
      this.hash = this.hashes.pop();
      if (this.trackIds) {
        this.push(this.objectLiteral(hash.ids));
      }
      if (this.stringParams) {
        this.push(this.objectLiteral(hash.contexts));
        this.push(this.objectLiteral(hash.types));
      }
      this.push(this.objectLiteral(hash.values));
    },
    pushString: function pushString(string) {
      this.pushStackLiteral(this.quotedString(string));
    },
    pushLiteral: function pushLiteral(value) {
      this.pushStackLiteral(value);
    },
    pushProgram: function pushProgram(guid) {
      if (guid != null) {
        this.pushStackLiteral(this.programExpression(guid));
      } else {
        this.pushStackLiteral(null);
      }
    },
    registerDecorator: function registerDecorator(paramSize, name) {
      var foundDecorator = this.nameLookup("decorators", name, "decorator"), options = this.setupHelperArgs(name, paramSize);
      this.decorators.push(["var decorator = ", foundDecorator, ";"]);
      this.decorators.push(['if (typeof decorator !== "function") { throw new Error(', this.quotedString('Missing decorator: "' + name + '"'), "); }"]);
      this.decorators.push(["fn = ", this.decorators.functionCall("decorator", "", ["fn", "props", "container", options]), " || fn;"]);
    },
    invokeHelper: function invokeHelper(paramSize, name, isSimple) {
      var nonHelper = this.popStack(), helper = this.setupHelper(paramSize, name);
      var possibleFunctionCalls = [];
      if (isSimple) {
        possibleFunctionCalls.push(helper.name);
      }
      possibleFunctionCalls.push(nonHelper);
      if (!this.options.strict) {
        possibleFunctionCalls.push(this.aliasable("container.hooks.helperMissing"));
      }
      var functionLookupCode = ["(", this.itemsSeparatedBy(possibleFunctionCalls, "||"), ")"];
      var functionCall = this.source.functionCall(functionLookupCode, "call", helper.callParams);
      this.push(functionCall);
    },
    itemsSeparatedBy: function itemsSeparatedBy(items, separator) {
      var result = [];
      result.push(items[0]);
      for (var i = 1;i < items.length; i++) {
        result.push(separator, items[i]);
      }
      return result;
    },
    invokeKnownHelper: function invokeKnownHelper(paramSize, name) {
      var helper = this.setupHelper(paramSize, name);
      this.push(this.source.functionCall(helper.name, "call", helper.callParams));
    },
    invokeAmbiguous: function invokeAmbiguous(name, helperCall) {
      this.useRegister("helper");
      var nonHelper = this.popStack();
      this.emptyHash();
      var helper = this.setupHelper(0, name, helperCall);
      var helperName = this.lastHelper = this.nameLookup("helpers", name, "helper");
      var lookup = ["(", "(helper = ", helperName, " || ", nonHelper, ")"];
      if (!this.options.strict) {
        lookup[0] = "(helper = ";
        lookup.push(" != null ? helper : ", this.aliasable("container.hooks.helperMissing"));
      }
      this.push(["(", lookup, helper.paramsInit ? ["),(", helper.paramsInit] : [], "),", "(typeof helper === ", this.aliasable('"function"'), " ? ", this.source.functionCall("helper", "call", helper.callParams), " : helper))"]);
    },
    invokePartial: function invokePartial(isDynamic, name, indent) {
      var params = [], options = this.setupParams(name, 1, params);
      if (isDynamic) {
        name = this.popStack();
        delete options.name;
      }
      if (indent) {
        options.indent = JSON.stringify(indent);
      }
      options.helpers = "helpers";
      options.partials = "partials";
      options.decorators = "container.decorators";
      if (!isDynamic) {
        params.unshift(this.nameLookup("partials", name, "partial"));
      } else {
        params.unshift(name);
      }
      if (this.options.compat) {
        options.depths = "depths";
      }
      options = this.objectLiteral(options);
      params.push(options);
      this.push(this.source.functionCall("container.invokePartial", "", params));
    },
    assignToHash: function assignToHash(key) {
      var value = this.popStack(), context = undefined, type = undefined, id = undefined;
      if (this.trackIds) {
        id = this.popStack();
      }
      if (this.stringParams) {
        type = this.popStack();
        context = this.popStack();
      }
      var hash = this.hash;
      if (context) {
        hash.contexts[key] = context;
      }
      if (type) {
        hash.types[key] = type;
      }
      if (id) {
        hash.ids[key] = id;
      }
      hash.values[key] = value;
    },
    pushId: function pushId(type, name, child) {
      if (type === "BlockParam") {
        this.pushStackLiteral("blockParams[" + name[0] + "].path[" + name[1] + "]" + (child ? " + " + JSON.stringify("." + child) : ""));
      } else if (type === "PathExpression") {
        this.pushString(name);
      } else if (type === "SubExpression") {
        this.pushStackLiteral("true");
      } else {
        this.pushStackLiteral("null");
      }
    },
    compiler: JavaScriptCompiler,
    compileChildren: function compileChildren(environment, options) {
      var children = environment.children, child = undefined, compiler = undefined;
      for (var i = 0, l = children.length;i < l; i++) {
        child = children[i];
        compiler = new this.compiler;
        var existing = this.matchExistingProgram(child);
        if (existing == null) {
          var index = this.context.programs.push("") - 1;
          child.index = index;
          child.name = "program" + index;
          this.context.programs[index] = compiler.compile(child, options, this.context, !this.precompile);
          this.context.decorators[index] = compiler.decorators;
          this.context.environments[index] = child;
          this.useDepths = this.useDepths || compiler.useDepths;
          this.useBlockParams = this.useBlockParams || compiler.useBlockParams;
          child.useDepths = this.useDepths;
          child.useBlockParams = this.useBlockParams;
        } else {
          child.index = existing.index;
          child.name = "program" + existing.index;
          this.useDepths = this.useDepths || existing.useDepths;
          this.useBlockParams = this.useBlockParams || existing.useBlockParams;
        }
      }
    },
    matchExistingProgram: function matchExistingProgram(child) {
      for (var i = 0, len = this.context.environments.length;i < len; i++) {
        var environment = this.context.environments[i];
        if (environment && environment.equals(child)) {
          return environment;
        }
      }
    },
    programExpression: function programExpression(guid) {
      var child = this.environment.children[guid], programParams = [child.index, "data", child.blockParams];
      if (this.useBlockParams || this.useDepths) {
        programParams.push("blockParams");
      }
      if (this.useDepths) {
        programParams.push("depths");
      }
      return "container.program(" + programParams.join(", ") + ")";
    },
    useRegister: function useRegister(name) {
      if (!this.registers[name]) {
        this.registers[name] = true;
        this.registers.list.push(name);
      }
    },
    push: function push(expr) {
      if (!(expr instanceof Literal)) {
        expr = this.source.wrap(expr);
      }
      this.inlineStack.push(expr);
      return expr;
    },
    pushStackLiteral: function pushStackLiteral(item) {
      this.push(new Literal(item));
    },
    pushSource: function pushSource(source) {
      if (this.pendingContent) {
        this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation));
        this.pendingContent = undefined;
      }
      if (source) {
        this.source.push(source);
      }
    },
    replaceStack: function replaceStack(callback) {
      var prefix = ["("], stack = undefined, createdStack = undefined, usedLiteral = undefined;
      if (!this.isInline()) {
        throw new _exception2["default"]("replaceStack on non-inline");
      }
      var top = this.popStack(true);
      if (top instanceof Literal) {
        stack = [top.value];
        prefix = ["(", stack];
        usedLiteral = true;
      } else {
        createdStack = true;
        var _name = this.incrStack();
        prefix = ["((", this.push(_name), " = ", top, ")"];
        stack = this.topStack();
      }
      var item = callback.call(this, stack);
      if (!usedLiteral) {
        this.popStack();
      }
      if (createdStack) {
        this.stackSlot--;
      }
      this.push(prefix.concat(item, ")"));
    },
    incrStack: function incrStack() {
      this.stackSlot++;
      if (this.stackSlot > this.stackVars.length) {
        this.stackVars.push("stack" + this.stackSlot);
      }
      return this.topStackName();
    },
    topStackName: function topStackName() {
      return "stack" + this.stackSlot;
    },
    flushInline: function flushInline() {
      var inlineStack = this.inlineStack;
      this.inlineStack = [];
      for (var i = 0, len = inlineStack.length;i < len; i++) {
        var entry = inlineStack[i];
        if (entry instanceof Literal) {
          this.compileStack.push(entry);
        } else {
          var stack = this.incrStack();
          this.pushSource([stack, " = ", entry, ";"]);
          this.compileStack.push(stack);
        }
      }
    },
    isInline: function isInline() {
      return this.inlineStack.length;
    },
    popStack: function popStack(wrapped) {
      var inline = this.isInline(), item = (inline ? this.inlineStack : this.compileStack).pop();
      if (!wrapped && item instanceof Literal) {
        return item.value;
      } else {
        if (!inline) {
          if (!this.stackSlot) {
            throw new _exception2["default"]("Invalid stack pop");
          }
          this.stackSlot--;
        }
        return item;
      }
    },
    topStack: function topStack() {
      var stack = this.isInline() ? this.inlineStack : this.compileStack, item = stack[stack.length - 1];
      if (item instanceof Literal) {
        return item.value;
      } else {
        return item;
      }
    },
    contextName: function contextName(context) {
      if (this.useDepths && context) {
        return "depths[" + context + "]";
      } else {
        return "depth" + context;
      }
    },
    quotedString: function quotedString(str) {
      return this.source.quotedString(str);
    },
    objectLiteral: function objectLiteral(obj) {
      return this.source.objectLiteral(obj);
    },
    aliasable: function aliasable(name) {
      var ret = this.aliases[name];
      if (ret) {
        ret.referenceCount++;
        return ret;
      }
      ret = this.aliases[name] = this.source.wrap(name);
      ret.aliasable = true;
      ret.referenceCount = 1;
      return ret;
    },
    setupHelper: function setupHelper(paramSize, name, blockHelper) {
      var params = [], paramsInit = this.setupHelperArgs(name, paramSize, params, blockHelper);
      var foundHelper = this.nameLookup("helpers", name, "helper"), callContext = this.aliasable(this.contextName(0) + " != null ? " + this.contextName(0) + " : (container.nullContext || {})");
      return {
        params,
        paramsInit,
        name: foundHelper,
        callParams: [callContext].concat(params)
      };
    },
    setupParams: function setupParams(helper, paramSize, params) {
      var options = {}, contexts = [], types4 = [], ids = [], objectArgs = !params, param = undefined;
      if (objectArgs) {
        params = [];
      }
      options.name = this.quotedString(helper);
      options.hash = this.popStack();
      if (this.trackIds) {
        options.hashIds = this.popStack();
      }
      if (this.stringParams) {
        options.hashTypes = this.popStack();
        options.hashContexts = this.popStack();
      }
      var inverse = this.popStack(), program = this.popStack();
      if (program || inverse) {
        options.fn = program || "container.noop";
        options.inverse = inverse || "container.noop";
      }
      var i = paramSize;
      while (i--) {
        param = this.popStack();
        params[i] = param;
        if (this.trackIds) {
          ids[i] = this.popStack();
        }
        if (this.stringParams) {
          types4[i] = this.popStack();
          contexts[i] = this.popStack();
        }
      }
      if (objectArgs) {
        options.args = this.source.generateArray(params);
      }
      if (this.trackIds) {
        options.ids = this.source.generateArray(ids);
      }
      if (this.stringParams) {
        options.types = this.source.generateArray(types4);
        options.contexts = this.source.generateArray(contexts);
      }
      if (this.options.data) {
        options.data = "data";
      }
      if (this.useBlockParams) {
        options.blockParams = "blockParams";
      }
      return options;
    },
    setupHelperArgs: function setupHelperArgs(helper, paramSize, params, useRegister) {
      var options = this.setupParams(helper, paramSize, params);
      options.loc = JSON.stringify(this.source.currentLocation);
      options = this.objectLiteral(options);
      if (useRegister) {
        this.useRegister("options");
        params.push("options");
        return ["options=", options];
      } else if (params) {
        params.push(options);
        return "";
      } else {
        return options;
      }
    }
  };
  (function() {
    var reservedWords = ("break else new var" + " case finally return void" + " catch for switch while" + " continue function this with" + " default if throw" + " delete in try" + " do instanceof typeof" + " abstract enum int short" + " boolean export interface static" + " byte extends long super" + " char final native synchronized" + " class float package throws" + " const goto private transient" + " debugger implements protected volatile" + " double import public let yield await" + " null true false").split(" ");
    var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};
    for (var i = 0, l = reservedWords.length;i < l; i++) {
      compilerWords[reservedWords[i]] = true;
    }
  })();
  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    return !JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  };
  function strictLookup(requireTerminal, compiler, parts, startPartIndex, type) {
    var stack = compiler.popStack(), len = parts.length;
    if (requireTerminal) {
      len--;
    }
    for (var i = startPartIndex;i < len; i++) {
      stack = compiler.nameLookup(stack, parts[i], type);
    }
    if (requireTerminal) {
      return [compiler.aliasable("container.strict"), "(", stack, ", ", compiler.quotedString(parts[len]), ", ", JSON.stringify(compiler.source.currentLocation), " )"];
    } else {
      return stack;
    }
  }
  exports.default = JavaScriptCompiler;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars.js
var require_handlebars = __commonJS((exports, module) => {
  exports.__esModule = true;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _handlebarsRuntime = require_handlebars_runtime();
  var _handlebarsRuntime2 = _interopRequireDefault(_handlebarsRuntime);
  var _handlebarsCompilerAst = require_ast();
  var _handlebarsCompilerAst2 = _interopRequireDefault(_handlebarsCompilerAst);
  var _handlebarsCompilerBase = require_base2();
  var _handlebarsCompilerCompiler = require_compiler();
  var _handlebarsCompilerJavascriptCompiler = require_javascript_compiler();
  var _handlebarsCompilerJavascriptCompiler2 = _interopRequireDefault(_handlebarsCompilerJavascriptCompiler);
  var _handlebarsCompilerVisitor = require_visitor();
  var _handlebarsCompilerVisitor2 = _interopRequireDefault(_handlebarsCompilerVisitor);
  var _handlebarsNoConflict = require_no_conflict();
  var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);
  var _create = _handlebarsRuntime2["default"].create;
  function create() {
    var hb = _create();
    hb.compile = function(input, options) {
      return _handlebarsCompilerCompiler.compile(input, options, hb);
    };
    hb.precompile = function(input, options) {
      return _handlebarsCompilerCompiler.precompile(input, options, hb);
    };
    hb.AST = _handlebarsCompilerAst2["default"];
    hb.Compiler = _handlebarsCompilerCompiler.Compiler;
    hb.JavaScriptCompiler = _handlebarsCompilerJavascriptCompiler2["default"];
    hb.Parser = _handlebarsCompilerBase.parser;
    hb.parse = _handlebarsCompilerBase.parse;
    hb.parseWithoutProcessing = _handlebarsCompilerBase.parseWithoutProcessing;
    return hb;
  }
  var inst = create();
  inst.create = create;
  _handlebarsNoConflict2["default"](inst);
  inst.Visitor = _handlebarsCompilerVisitor2["default"];
  inst["default"] = inst;
  exports.default = inst;
  module.exports = exports["default"];
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/dist/cjs/handlebars/compiler/printer.js
var require_printer = __commonJS((exports) => {
  exports.__esModule = true;
  exports.print = print;
  exports.PrintVisitor = PrintVisitor;
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }
  var _visitor = require_visitor();
  var _visitor2 = _interopRequireDefault(_visitor);
  function print(ast) {
    return new PrintVisitor().accept(ast);
  }
  function PrintVisitor() {
    this.padding = 0;
  }
  PrintVisitor.prototype = new _visitor2["default"];
  PrintVisitor.prototype.pad = function(string) {
    var out = "";
    for (var i = 0, l = this.padding;i < l; i++) {
      out += "  ";
    }
    out += string + `
`;
    return out;
  };
  PrintVisitor.prototype.Program = function(program) {
    var out = "", body = program.body, i = undefined, l = undefined;
    if (program.blockParams) {
      var blockParams = "BLOCK PARAMS: [";
      for (i = 0, l = program.blockParams.length;i < l; i++) {
        blockParams += " " + program.blockParams[i];
      }
      blockParams += " ]";
      out += this.pad(blockParams);
    }
    for (i = 0, l = body.length;i < l; i++) {
      out += this.accept(body[i]);
    }
    this.padding--;
    return out;
  };
  PrintVisitor.prototype.MustacheStatement = function(mustache) {
    return this.pad("{{ " + this.SubExpression(mustache) + " }}");
  };
  PrintVisitor.prototype.Decorator = function(mustache) {
    return this.pad("{{ DIRECTIVE " + this.SubExpression(mustache) + " }}");
  };
  PrintVisitor.prototype.BlockStatement = PrintVisitor.prototype.DecoratorBlock = function(block) {
    var out = "";
    out += this.pad((block.type === "DecoratorBlock" ? "DIRECTIVE " : "") + "BLOCK:");
    this.padding++;
    out += this.pad(this.SubExpression(block));
    if (block.program) {
      out += this.pad("PROGRAM:");
      this.padding++;
      out += this.accept(block.program);
      this.padding--;
    }
    if (block.inverse) {
      if (block.program) {
        this.padding++;
      }
      out += this.pad("{{^}}");
      this.padding++;
      out += this.accept(block.inverse);
      this.padding--;
      if (block.program) {
        this.padding--;
      }
    }
    this.padding--;
    return out;
  };
  PrintVisitor.prototype.PartialStatement = function(partial) {
    var content = "PARTIAL:" + partial.name.original;
    if (partial.params[0]) {
      content += " " + this.accept(partial.params[0]);
    }
    if (partial.hash) {
      content += " " + this.accept(partial.hash);
    }
    return this.pad("{{> " + content + " }}");
  };
  PrintVisitor.prototype.PartialBlockStatement = function(partial) {
    var content = "PARTIAL BLOCK:" + partial.name.original;
    if (partial.params[0]) {
      content += " " + this.accept(partial.params[0]);
    }
    if (partial.hash) {
      content += " " + this.accept(partial.hash);
    }
    content += " " + this.pad("PROGRAM:");
    this.padding++;
    content += this.accept(partial.program);
    this.padding--;
    return this.pad("{{> " + content + " }}");
  };
  PrintVisitor.prototype.ContentStatement = function(content) {
    return this.pad("CONTENT[ '" + content.value + "' ]");
  };
  PrintVisitor.prototype.CommentStatement = function(comment) {
    return this.pad("{{! '" + comment.value + "' }}");
  };
  PrintVisitor.prototype.SubExpression = function(sexpr) {
    var params = sexpr.params, paramStrings = [], hash = undefined;
    for (var i = 0, l = params.length;i < l; i++) {
      paramStrings.push(this.accept(params[i]));
    }
    params = "[" + paramStrings.join(", ") + "]";
    hash = sexpr.hash ? " " + this.accept(sexpr.hash) : "";
    return this.accept(sexpr.path) + " " + params + hash;
  };
  PrintVisitor.prototype.PathExpression = function(id) {
    var path = id.parts.join("/");
    return (id.data ? "@" : "") + "PATH:" + path;
  };
  PrintVisitor.prototype.StringLiteral = function(string) {
    return '"' + string.value + '"';
  };
  PrintVisitor.prototype.NumberLiteral = function(number) {
    return "NUMBER{" + number.value + "}";
  };
  PrintVisitor.prototype.BooleanLiteral = function(bool) {
    return "BOOLEAN{" + bool.value + "}";
  };
  PrintVisitor.prototype.UndefinedLiteral = function() {
    return "UNDEFINED";
  };
  PrintVisitor.prototype.NullLiteral = function() {
    return "NULL";
  };
  PrintVisitor.prototype.Hash = function(hash) {
    var pairs = hash.pairs, joinedPairs = [];
    for (var i = 0, l = pairs.length;i < l; i++) {
      joinedPairs.push(this.accept(pairs[i]));
    }
    return "HASH{" + joinedPairs.join(", ") + "}";
  };
  PrintVisitor.prototype.HashPair = function(pair) {
    return pair.key + "=" + this.accept(pair.value);
  };
});

// ../../node_modules/.bun/handlebars@4.7.9/node_modules/handlebars/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var handlebars = require_handlebars()["default"];
  var printer = require_printer();
  handlebars.PrintVisitor = printer.PrintVisitor;
  handlebars.print = printer.print;
  module.exports = handlebars;
  function extension(module2, filename) {
    var fs = __require("fs");
    var templateString = fs.readFileSync(filename, "utf8");
    module2.exports = handlebars.compile(templateString);
  }
  if (__require.extensions) {
    __require.extensions[".handlebars"] = extension;
    __require.extensions[".hbs"] = extension;
  }
});

// src/name-tokens.ts
function replaceNameTokens(text, name) {
  if (!text)
    return text;
  return text.replace(/\{\{\s*name\s*\}\}/g, () => name).replace(/\{\{\s*agentName\s*\}\}/g, () => name);
}
function replaceIndexedNameTokens(text, names) {
  if (!text)
    return text;
  return text.replace(/\{\{\s*(?:name|user)(\d+)\s*\}\}/g, (match, slot) => {
    const name = names[Number(slot) - 1];
    return name === undefined ? match : name;
  });
}

// src/types/model.ts
function isTextGenerationModelType(modelType) {
  const normalized = String(modelType ?? "").trim().toUpperCase();
  return TEXT_GENERATION_MODEL_TYPE_SET.has(normalized);
}
function isAudioStreamResult(value) {
  return typeof value === "object" && value !== null && "audioStream" in value && "bytes" in value && "mimeType" in value && typeof value.audioStream?.[Symbol.asyncIterator] === "function";
}
function getModelFallbackChain(modelType) {
  const modelKey = String(modelType);
  const seen = new Set;
  const chain = MODEL_FALLBACK_CHAINS[modelKey] ?? [modelKey];
  const resolved = [];
  for (const candidate of chain) {
    if (!candidate || seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    resolved.push(candidate);
  }
  if (resolved.length === 0) {
    resolved.push(modelKey);
  }
  return resolved;
}
function isStreamableModelType(modelType) {
  return STREAMABLE_MODEL_TYPES.has(modelType);
}
var LLMMode, ModelType, TEXT_GENERATION_MODEL_TYPES, TEXT_GENERATION_MODEL_TYPE_SET, MODEL_SETTINGS, STREAMABLE_MODEL_TYPES, MODEL_FALLBACK_CHAINS;
var init_model = __esm(() => {
  LLMMode = {
    DEFAULT: "DEFAULT",
    SMALL: "SMALL",
    LARGE: "LARGE"
  };
  ModelType = {
    NANO: "TEXT_NANO",
    SMALL: "TEXT_SMALL",
    MEDIUM: "TEXT_MEDIUM",
    LARGE: "TEXT_LARGE",
    MEGA: "TEXT_MEGA",
    TEXT_NANO: "TEXT_NANO",
    TEXT_SMALL: "TEXT_SMALL",
    TEXT_MEDIUM: "TEXT_MEDIUM",
    TEXT_LARGE: "TEXT_LARGE",
    TEXT_MEGA: "TEXT_MEGA",
    RESPONSE_HANDLER: "RESPONSE_HANDLER",
    ACTION_PLANNER: "ACTION_PLANNER",
    TEXT_EMBEDDING: "TEXT_EMBEDDING",
    TEXT_EMBEDDING_BATCH: "TEXT_EMBEDDING_BATCH",
    PII_SCRUB: "PII_SCRUB",
    TEXT_TOKENIZER_ENCODE: "TEXT_TOKENIZER_ENCODE",
    TEXT_TOKENIZER_DECODE: "TEXT_TOKENIZER_DECODE",
    TEXT_REASONING_SMALL: "REASONING_SMALL",
    TEXT_REASONING_LARGE: "REASONING_LARGE",
    TEXT_COMPLETION: "TEXT_COMPLETION",
    IMAGE: "IMAGE",
    IMAGE_DESCRIPTION: "IMAGE_DESCRIPTION",
    TRANSCRIPTION: "TRANSCRIPTION",
    TEXT_TO_SPEECH: "TEXT_TO_SPEECH",
    AUDIO: "AUDIO",
    VIDEO: "VIDEO",
    RESEARCH: "RESEARCH"
  };
  TEXT_GENERATION_MODEL_TYPES = [
    ModelType.TEXT_NANO,
    ModelType.TEXT_SMALL,
    ModelType.TEXT_MEDIUM,
    ModelType.TEXT_LARGE,
    ModelType.TEXT_MEGA,
    ModelType.RESPONSE_HANDLER,
    ModelType.ACTION_PLANNER,
    ModelType.TEXT_REASONING_SMALL,
    ModelType.TEXT_REASONING_LARGE,
    ModelType.TEXT_COMPLETION
  ];
  TEXT_GENERATION_MODEL_TYPE_SET = new Set(TEXT_GENERATION_MODEL_TYPES);
  MODEL_SETTINGS = {
    DEFAULT_MAX_TOKENS: "DEFAULT_MAX_TOKENS",
    DEFAULT_TEMPERATURE: "DEFAULT_TEMPERATURE",
    DEFAULT_TOP_P: "DEFAULT_TOP_P",
    DEFAULT_TOP_K: "DEFAULT_TOP_K",
    DEFAULT_MIN_P: "DEFAULT_MIN_P",
    DEFAULT_SEED: "DEFAULT_SEED",
    DEFAULT_REPETITION_PENALTY: "DEFAULT_REPETITION_PENALTY",
    DEFAULT_FREQUENCY_PENALTY: "DEFAULT_FREQUENCY_PENALTY",
    DEFAULT_PRESENCE_PENALTY: "DEFAULT_PRESENCE_PENALTY",
    TEXT_SMALL_MAX_TOKENS: "TEXT_SMALL_MAX_TOKENS",
    TEXT_SMALL_TEMPERATURE: "TEXT_SMALL_TEMPERATURE",
    TEXT_SMALL_TOP_P: "TEXT_SMALL_TOP_P",
    TEXT_SMALL_TOP_K: "TEXT_SMALL_TOP_K",
    TEXT_SMALL_MIN_P: "TEXT_SMALL_MIN_P",
    TEXT_SMALL_SEED: "TEXT_SMALL_SEED",
    TEXT_SMALL_REPETITION_PENALTY: "TEXT_SMALL_REPETITION_PENALTY",
    TEXT_SMALL_FREQUENCY_PENALTY: "TEXT_SMALL_FREQUENCY_PENALTY",
    TEXT_SMALL_PRESENCE_PENALTY: "TEXT_SMALL_PRESENCE_PENALTY",
    TEXT_NANO_MAX_TOKENS: "TEXT_NANO_MAX_TOKENS",
    TEXT_NANO_TEMPERATURE: "TEXT_NANO_TEMPERATURE",
    TEXT_NANO_TOP_P: "TEXT_NANO_TOP_P",
    TEXT_NANO_TOP_K: "TEXT_NANO_TOP_K",
    TEXT_NANO_MIN_P: "TEXT_NANO_MIN_P",
    TEXT_NANO_SEED: "TEXT_NANO_SEED",
    TEXT_NANO_REPETITION_PENALTY: "TEXT_NANO_REPETITION_PENALTY",
    TEXT_NANO_FREQUENCY_PENALTY: "TEXT_NANO_FREQUENCY_PENALTY",
    TEXT_NANO_PRESENCE_PENALTY: "TEXT_NANO_PRESENCE_PENALTY",
    TEXT_MEDIUM_MAX_TOKENS: "TEXT_MEDIUM_MAX_TOKENS",
    TEXT_MEDIUM_TEMPERATURE: "TEXT_MEDIUM_TEMPERATURE",
    TEXT_MEDIUM_TOP_P: "TEXT_MEDIUM_TOP_P",
    TEXT_MEDIUM_TOP_K: "TEXT_MEDIUM_TOP_K",
    TEXT_MEDIUM_MIN_P: "TEXT_MEDIUM_MIN_P",
    TEXT_MEDIUM_SEED: "TEXT_MEDIUM_SEED",
    TEXT_MEDIUM_REPETITION_PENALTY: "TEXT_MEDIUM_REPETITION_PENALTY",
    TEXT_MEDIUM_FREQUENCY_PENALTY: "TEXT_MEDIUM_FREQUENCY_PENALTY",
    TEXT_MEDIUM_PRESENCE_PENALTY: "TEXT_MEDIUM_PRESENCE_PENALTY",
    TEXT_LARGE_MAX_TOKENS: "TEXT_LARGE_MAX_TOKENS",
    TEXT_LARGE_TEMPERATURE: "TEXT_LARGE_TEMPERATURE",
    TEXT_LARGE_TOP_P: "TEXT_LARGE_TOP_P",
    TEXT_LARGE_TOP_K: "TEXT_LARGE_TOP_K",
    TEXT_LARGE_MIN_P: "TEXT_LARGE_MIN_P",
    TEXT_LARGE_SEED: "TEXT_LARGE_SEED",
    TEXT_LARGE_REPETITION_PENALTY: "TEXT_LARGE_REPETITION_PENALTY",
    TEXT_LARGE_FREQUENCY_PENALTY: "TEXT_LARGE_FREQUENCY_PENALTY",
    TEXT_LARGE_PRESENCE_PENALTY: "TEXT_LARGE_PRESENCE_PENALTY",
    TEXT_MEGA_MAX_TOKENS: "TEXT_MEGA_MAX_TOKENS",
    TEXT_MEGA_TEMPERATURE: "TEXT_MEGA_TEMPERATURE",
    TEXT_MEGA_TOP_P: "TEXT_MEGA_TOP_P",
    TEXT_MEGA_TOP_K: "TEXT_MEGA_TOP_K",
    TEXT_MEGA_MIN_P: "TEXT_MEGA_MIN_P",
    TEXT_MEGA_SEED: "TEXT_MEGA_SEED",
    TEXT_MEGA_REPETITION_PENALTY: "TEXT_MEGA_REPETITION_PENALTY",
    TEXT_MEGA_FREQUENCY_PENALTY: "TEXT_MEGA_FREQUENCY_PENALTY",
    TEXT_MEGA_PRESENCE_PENALTY: "TEXT_MEGA_PRESENCE_PENALTY",
    RESPONSE_HANDLER_MAX_TOKENS: "RESPONSE_HANDLER_MAX_TOKENS",
    RESPONSE_HANDLER_TEMPERATURE: "RESPONSE_HANDLER_TEMPERATURE",
    RESPONSE_HANDLER_TOP_P: "RESPONSE_HANDLER_TOP_P",
    RESPONSE_HANDLER_TOP_K: "RESPONSE_HANDLER_TOP_K",
    RESPONSE_HANDLER_MIN_P: "RESPONSE_HANDLER_MIN_P",
    RESPONSE_HANDLER_SEED: "RESPONSE_HANDLER_SEED",
    RESPONSE_HANDLER_REPETITION_PENALTY: "RESPONSE_HANDLER_REPETITION_PENALTY",
    RESPONSE_HANDLER_FREQUENCY_PENALTY: "RESPONSE_HANDLER_FREQUENCY_PENALTY",
    RESPONSE_HANDLER_PRESENCE_PENALTY: "RESPONSE_HANDLER_PRESENCE_PENALTY",
    ACTION_PLANNER_MAX_TOKENS: "ACTION_PLANNER_MAX_TOKENS",
    ACTION_PLANNER_TEMPERATURE: "ACTION_PLANNER_TEMPERATURE",
    ACTION_PLANNER_TOP_P: "ACTION_PLANNER_TOP_P",
    ACTION_PLANNER_TOP_K: "ACTION_PLANNER_TOP_K",
    ACTION_PLANNER_MIN_P: "ACTION_PLANNER_MIN_P",
    ACTION_PLANNER_SEED: "ACTION_PLANNER_SEED",
    ACTION_PLANNER_REPETITION_PENALTY: "ACTION_PLANNER_REPETITION_PENALTY",
    ACTION_PLANNER_FREQUENCY_PENALTY: "ACTION_PLANNER_FREQUENCY_PENALTY",
    ACTION_PLANNER_PRESENCE_PENALTY: "ACTION_PLANNER_PRESENCE_PENALTY",
    TEXT_COMPLETION_MAX_TOKENS: "TEXT_COMPLETION_MAX_TOKENS",
    TEXT_COMPLETION_TEMPERATURE: "TEXT_COMPLETION_TEMPERATURE",
    TEXT_COMPLETION_TOP_P: "TEXT_COMPLETION_TOP_P",
    TEXT_COMPLETION_TOP_K: "TEXT_COMPLETION_TOP_K",
    TEXT_COMPLETION_MIN_P: "TEXT_COMPLETION_MIN_P",
    TEXT_COMPLETION_SEED: "TEXT_COMPLETION_SEED",
    TEXT_COMPLETION_REPETITION_PENALTY: "TEXT_COMPLETION_REPETITION_PENALTY",
    TEXT_COMPLETION_FREQUENCY_PENALTY: "TEXT_COMPLETION_FREQUENCY_PENALTY",
    TEXT_COMPLETION_PRESENCE_PENALTY: "TEXT_COMPLETION_PRESENCE_PENALTY"
  };
  STREAMABLE_MODEL_TYPES = new Set(TEXT_GENERATION_MODEL_TYPES);
  MODEL_FALLBACK_CHAINS = {
    [ModelType.TEXT_NANO]: [ModelType.TEXT_NANO, ModelType.TEXT_SMALL],
    [ModelType.TEXT_MEDIUM]: [ModelType.TEXT_MEDIUM, ModelType.TEXT_SMALL],
    [ModelType.TEXT_MEGA]: [ModelType.TEXT_MEGA, ModelType.TEXT_LARGE],
    [ModelType.RESPONSE_HANDLER]: [
      ModelType.RESPONSE_HANDLER,
      ModelType.TEXT_NANO,
      ModelType.TEXT_SMALL
    ],
    [ModelType.ACTION_PLANNER]: [
      ModelType.ACTION_PLANNER,
      ModelType.TEXT_MEDIUM,
      ModelType.TEXT_SMALL
    ]
  };
});

// src/types/primitives.ts
function asUUID(id) {
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error(`Invalid UUID format: ${id}`);
  }
  return id;
}
var ChannelType, DEFAULT_UUID = "00000000-0000-0000-0000-000000000000", ContentType;
var init_primitives = __esm(() => {
  ChannelType = {
    SELF: "SELF",
    DM: "DM",
    GROUP: "GROUP",
    VOICE_DM: "VOICE_DM",
    VOICE_GROUP: "VOICE_GROUP",
    FEED: "FEED",
    THREAD: "THREAD",
    WORLD: "WORLD",
    FORUM: "FORUM",
    AUTONOMOUS: "AUTONOMOUS",
    API: "API"
  };
  ContentType = {
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
    DOCUMENT: "document",
    LINK: "link"
  };
});

// src/utils/example-names.ts
var EXAMPLE_NAMES;
var init_example_names = __esm(() => {
  EXAMPLE_NAMES = [
    "Avery",
    "Blake",
    "Casey",
    "Cleo",
    "Drew",
    "Emery",
    "Finley",
    "Harper",
    "Indigo",
    "Jules",
    "Kai",
    "Lane",
    "Logan",
    "Morgan",
    "Nova",
    "Parker",
    "Quinn",
    "Reese",
    "River",
    "Rowan",
    "Sage",
    "Skyler",
    "Taylor",
    "Wren"
  ];
});

// src/utils/deterministic.ts
function buildDeterministicSeed(...parts) {
  const filtered = parts.map((part) => part === undefined || part === null ? "" : String(part).trim()).filter((part) => part.length > 0);
  return filtered.length > 0 ? filtered.join("::") : "default";
}
function hashStringToUint32(value) {
  let hash = 2166136261;
  for (let i = 0;i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function createDeterministicRandom(seed) {
  let state = typeof seed === "number" ? seed >>> 0 : hashStringToUint32(String(seed));
  return () => {
    state = state + 1831565813 >>> 0;
    let t = state;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / UINT32_MAX;
  };
}
function deterministicShuffle(items, seed) {
  const random = createDeterministicRandom(seed);
  const shuffled = [...items];
  for (let i = shuffled.length - 1;i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
function deterministicSample(items, count, seed) {
  if (count <= 0 || items.length === 0) {
    return [];
  }
  return deterministicShuffle(items, seed).slice(0, Math.min(count, items.length));
}
function deterministicPick(items, seed) {
  return deterministicSample(items, 1, seed)[0];
}
function getDeterministicNames(count, seed) {
  if (count <= 0) {
    return [];
  }
  const ordered = deterministicShuffle(EXAMPLE_NAMES, buildDeterministicSeed(seed, "names"));
  return Array.from({ length: count }, (_, index) => {
    const name = ordered[index % ordered.length];
    return typeof name === "string" && name.length > 0 ? name : `user${index + 1}`;
  });
}
function stableStringify(value) {
  return JSON.stringify(sortStable(value));
}
function sortStable(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => sortStable(entry));
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, nestedValue]) => [key, sortStable(nestedValue)]));
  }
  return value;
}
var UINT32_MAX = 4294967296;
var init_deterministic = __esm(() => {
  init_example_names();
});

// ../../node_modules/.bun/json5@2.2.3/node_modules/json5/lib/unicode.js
var require_unicode = __commonJS((exports, module) => {
  exports.Space_Separator = /[\u1680\u2000-\u200A\u202F\u205F\u3000]/;
  exports.ID_Start = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
  exports.ID_Continue = /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/;
});

// ../../node_modules/.bun/json5@2.2.3/node_modules/json5/lib/util.js
var require_util2 = __commonJS((exports, module) => {
  var unicode = require_unicode();
  module.exports = {
    isSpaceSeparator(c) {
      return typeof c === "string" && unicode.Space_Separator.test(c);
    },
    isIdStartChar(c) {
      return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c === "$" || c === "_" || unicode.ID_Start.test(c));
    },
    isIdContinueChar(c) {
      return typeof c === "string" && (c >= "a" && c <= "z" || c >= "A" && c <= "Z" || c >= "0" && c <= "9" || c === "$" || c === "_" || c === "‌" || c === "‍" || unicode.ID_Continue.test(c));
    },
    isDigit(c) {
      return typeof c === "string" && /[0-9]/.test(c);
    },
    isHexDigit(c) {
      return typeof c === "string" && /[0-9A-Fa-f]/.test(c);
    }
  };
});

// ../../node_modules/.bun/json5@2.2.3/node_modules/json5/lib/parse.js
var require_parse2 = __commonJS((exports, module) => {
  var util2 = require_util2();
  var source;
  var parseState;
  var stack;
  var pos;
  var line;
  var column;
  var token;
  var key;
  var root;
  module.exports = function parse(text, reviver) {
    source = String(text);
    parseState = "start";
    stack = [];
    pos = 0;
    line = 1;
    column = 0;
    token = undefined;
    key = undefined;
    root = undefined;
    do {
      token = lex();
      parseStates[parseState]();
    } while (token.type !== "eof");
    if (typeof reviver === "function") {
      return internalize({ "": root }, "", reviver);
    }
    return root;
  };
  function internalize(holder, name, reviver) {
    const value = holder[name];
    if (value != null && typeof value === "object") {
      if (Array.isArray(value)) {
        for (let i = 0;i < value.length; i++) {
          const key2 = String(i);
          const replacement = internalize(value, key2, reviver);
          if (replacement === undefined) {
            delete value[key2];
          } else {
            Object.defineProperty(value, key2, {
              value: replacement,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
      } else {
        for (const key2 in value) {
          const replacement = internalize(value, key2, reviver);
          if (replacement === undefined) {
            delete value[key2];
          } else {
            Object.defineProperty(value, key2, {
              value: replacement,
              writable: true,
              enumerable: true,
              configurable: true
            });
          }
        }
      }
    }
    return reviver.call(holder, name, value);
  }
  var lexState;
  var buffer;
  var doubleQuote;
  var sign;
  var c;
  function lex() {
    lexState = "default";
    buffer = "";
    doubleQuote = false;
    sign = 1;
    for (;; ) {
      c = peek();
      const token2 = lexStates[lexState]();
      if (token2) {
        return token2;
      }
    }
  }
  function peek() {
    if (source[pos]) {
      return String.fromCodePoint(source.codePointAt(pos));
    }
  }
  function read() {
    const c2 = peek();
    if (c2 === `
`) {
      line++;
      column = 0;
    } else if (c2) {
      column += c2.length;
    } else {
      column++;
    }
    if (c2) {
      pos += c2.length;
    }
    return c2;
  }
  var lexStates = {
    default() {
      switch (c) {
        case "\t":
        case "\v":
        case "\f":
        case " ":
        case " ":
        case "\uFEFF":
        case `
`:
        case "\r":
        case "\u2028":
        case "\u2029":
          read();
          return;
        case "/":
          read();
          lexState = "comment";
          return;
        case undefined:
          read();
          return newToken("eof");
      }
      if (util2.isSpaceSeparator(c)) {
        read();
        return;
      }
      return lexStates[parseState]();
    },
    comment() {
      switch (c) {
        case "*":
          read();
          lexState = "multiLineComment";
          return;
        case "/":
          read();
          lexState = "singleLineComment";
          return;
      }
      throw invalidChar(read());
    },
    multiLineComment() {
      switch (c) {
        case "*":
          read();
          lexState = "multiLineCommentAsterisk";
          return;
        case undefined:
          throw invalidChar(read());
      }
      read();
    },
    multiLineCommentAsterisk() {
      switch (c) {
        case "*":
          read();
          return;
        case "/":
          read();
          lexState = "default";
          return;
        case undefined:
          throw invalidChar(read());
      }
      read();
      lexState = "multiLineComment";
    },
    singleLineComment() {
      switch (c) {
        case `
`:
        case "\r":
        case "\u2028":
        case "\u2029":
          read();
          lexState = "default";
          return;
        case undefined:
          read();
          return newToken("eof");
      }
      read();
    },
    value() {
      switch (c) {
        case "{":
        case "[":
          return newToken("punctuator", read());
        case "n":
          read();
          literal("ull");
          return newToken("null", null);
        case "t":
          read();
          literal("rue");
          return newToken("boolean", true);
        case "f":
          read();
          literal("alse");
          return newToken("boolean", false);
        case "-":
        case "+":
          if (read() === "-") {
            sign = -1;
          }
          lexState = "sign";
          return;
        case ".":
          buffer = read();
          lexState = "decimalPointLeading";
          return;
        case "0":
          buffer = read();
          lexState = "zero";
          return;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          buffer = read();
          lexState = "decimalInteger";
          return;
        case "I":
          read();
          literal("nfinity");
          return newToken("numeric", Infinity);
        case "N":
          read();
          literal("aN");
          return newToken("numeric", NaN);
        case '"':
        case "'":
          doubleQuote = read() === '"';
          buffer = "";
          lexState = "string";
          return;
      }
      throw invalidChar(read());
    },
    identifierNameStartEscape() {
      if (c !== "u") {
        throw invalidChar(read());
      }
      read();
      const u = unicodeEscape();
      switch (u) {
        case "$":
        case "_":
          break;
        default:
          if (!util2.isIdStartChar(u)) {
            throw invalidIdentifier();
          }
          break;
      }
      buffer += u;
      lexState = "identifierName";
    },
    identifierName() {
      switch (c) {
        case "$":
        case "_":
        case "‌":
        case "‍":
          buffer += read();
          return;
        case "\\":
          read();
          lexState = "identifierNameEscape";
          return;
      }
      if (util2.isIdContinueChar(c)) {
        buffer += read();
        return;
      }
      return newToken("identifier", buffer);
    },
    identifierNameEscape() {
      if (c !== "u") {
        throw invalidChar(read());
      }
      read();
      const u = unicodeEscape();
      switch (u) {
        case "$":
        case "_":
        case "‌":
        case "‍":
          break;
        default:
          if (!util2.isIdContinueChar(u)) {
            throw invalidIdentifier();
          }
          break;
      }
      buffer += u;
      lexState = "identifierName";
    },
    sign() {
      switch (c) {
        case ".":
          buffer = read();
          lexState = "decimalPointLeading";
          return;
        case "0":
          buffer = read();
          lexState = "zero";
          return;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          buffer = read();
          lexState = "decimalInteger";
          return;
        case "I":
          read();
          literal("nfinity");
          return newToken("numeric", sign * Infinity);
        case "N":
          read();
          literal("aN");
          return newToken("numeric", NaN);
      }
      throw invalidChar(read());
    },
    zero() {
      switch (c) {
        case ".":
          buffer += read();
          lexState = "decimalPoint";
          return;
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
        case "x":
        case "X":
          buffer += read();
          lexState = "hexadecimal";
          return;
      }
      return newToken("numeric", sign * 0);
    },
    decimalInteger() {
      switch (c) {
        case ".":
          buffer += read();
          lexState = "decimalPoint";
          return;
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
      }
      if (util2.isDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    decimalPointLeading() {
      if (util2.isDigit(c)) {
        buffer += read();
        lexState = "decimalFraction";
        return;
      }
      throw invalidChar(read());
    },
    decimalPoint() {
      switch (c) {
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
      }
      if (util2.isDigit(c)) {
        buffer += read();
        lexState = "decimalFraction";
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    decimalFraction() {
      switch (c) {
        case "e":
        case "E":
          buffer += read();
          lexState = "decimalExponent";
          return;
      }
      if (util2.isDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    decimalExponent() {
      switch (c) {
        case "+":
        case "-":
          buffer += read();
          lexState = "decimalExponentSign";
          return;
      }
      if (util2.isDigit(c)) {
        buffer += read();
        lexState = "decimalExponentInteger";
        return;
      }
      throw invalidChar(read());
    },
    decimalExponentSign() {
      if (util2.isDigit(c)) {
        buffer += read();
        lexState = "decimalExponentInteger";
        return;
      }
      throw invalidChar(read());
    },
    decimalExponentInteger() {
      if (util2.isDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    hexadecimal() {
      if (util2.isHexDigit(c)) {
        buffer += read();
        lexState = "hexadecimalInteger";
        return;
      }
      throw invalidChar(read());
    },
    hexadecimalInteger() {
      if (util2.isHexDigit(c)) {
        buffer += read();
        return;
      }
      return newToken("numeric", sign * Number(buffer));
    },
    string() {
      switch (c) {
        case "\\":
          read();
          buffer += escape();
          return;
        case '"':
          if (doubleQuote) {
            read();
            return newToken("string", buffer);
          }
          buffer += read();
          return;
        case "'":
          if (!doubleQuote) {
            read();
            return newToken("string", buffer);
          }
          buffer += read();
          return;
        case `
`:
        case "\r":
          throw invalidChar(read());
        case "\u2028":
        case "\u2029":
          separatorChar(c);
          break;
        case undefined:
          throw invalidChar(read());
      }
      buffer += read();
    },
    start() {
      switch (c) {
        case "{":
        case "[":
          return newToken("punctuator", read());
      }
      lexState = "value";
    },
    beforePropertyName() {
      switch (c) {
        case "$":
        case "_":
          buffer = read();
          lexState = "identifierName";
          return;
        case "\\":
          read();
          lexState = "identifierNameStartEscape";
          return;
        case "}":
          return newToken("punctuator", read());
        case '"':
        case "'":
          doubleQuote = read() === '"';
          lexState = "string";
          return;
      }
      if (util2.isIdStartChar(c)) {
        buffer += read();
        lexState = "identifierName";
        return;
      }
      throw invalidChar(read());
    },
    afterPropertyName() {
      if (c === ":") {
        return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    beforePropertyValue() {
      lexState = "value";
    },
    afterPropertyValue() {
      switch (c) {
        case ",":
        case "}":
          return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    beforeArrayValue() {
      if (c === "]") {
        return newToken("punctuator", read());
      }
      lexState = "value";
    },
    afterArrayValue() {
      switch (c) {
        case ",":
        case "]":
          return newToken("punctuator", read());
      }
      throw invalidChar(read());
    },
    end() {
      throw invalidChar(read());
    }
  };
  function newToken(type, value) {
    return {
      type,
      value,
      line,
      column
    };
  }
  function literal(s) {
    for (const c2 of s) {
      const p = peek();
      if (p !== c2) {
        throw invalidChar(read());
      }
      read();
    }
  }
  function escape() {
    const c2 = peek();
    switch (c2) {
      case "b":
        read();
        return "\b";
      case "f":
        read();
        return "\f";
      case "n":
        read();
        return `
`;
      case "r":
        read();
        return "\r";
      case "t":
        read();
        return "\t";
      case "v":
        read();
        return "\v";
      case "0":
        read();
        if (util2.isDigit(peek())) {
          throw invalidChar(read());
        }
        return "\x00";
      case "x":
        read();
        return hexEscape();
      case "u":
        read();
        return unicodeEscape();
      case `
`:
      case "\u2028":
      case "\u2029":
        read();
        return "";
      case "\r":
        read();
        if (peek() === `
`) {
          read();
        }
        return "";
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        throw invalidChar(read());
      case undefined:
        throw invalidChar(read());
    }
    return read();
  }
  function hexEscape() {
    let buffer2 = "";
    let c2 = peek();
    if (!util2.isHexDigit(c2)) {
      throw invalidChar(read());
    }
    buffer2 += read();
    c2 = peek();
    if (!util2.isHexDigit(c2)) {
      throw invalidChar(read());
    }
    buffer2 += read();
    return String.fromCodePoint(parseInt(buffer2, 16));
  }
  function unicodeEscape() {
    let buffer2 = "";
    let count = 4;
    while (count-- > 0) {
      const c2 = peek();
      if (!util2.isHexDigit(c2)) {
        throw invalidChar(read());
      }
      buffer2 += read();
    }
    return String.fromCodePoint(parseInt(buffer2, 16));
  }
  var parseStates = {
    start() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      push();
    },
    beforePropertyName() {
      switch (token.type) {
        case "identifier":
        case "string":
          key = token.value;
          parseState = "afterPropertyName";
          return;
        case "punctuator":
          pop();
          return;
        case "eof":
          throw invalidEOF();
      }
    },
    afterPropertyName() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      parseState = "beforePropertyValue";
    },
    beforePropertyValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      push();
    },
    beforeArrayValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      if (token.type === "punctuator" && token.value === "]") {
        pop();
        return;
      }
      push();
    },
    afterPropertyValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      switch (token.value) {
        case ",":
          parseState = "beforePropertyName";
          return;
        case "}":
          pop();
      }
    },
    afterArrayValue() {
      if (token.type === "eof") {
        throw invalidEOF();
      }
      switch (token.value) {
        case ",":
          parseState = "beforeArrayValue";
          return;
        case "]":
          pop();
      }
    },
    end() {}
  };
  function push() {
    let value;
    switch (token.type) {
      case "punctuator":
        switch (token.value) {
          case "{":
            value = {};
            break;
          case "[":
            value = [];
            break;
        }
        break;
      case "null":
      case "boolean":
      case "numeric":
      case "string":
        value = token.value;
        break;
    }
    if (root === undefined) {
      root = value;
    } else {
      const parent = stack[stack.length - 1];
      if (Array.isArray(parent)) {
        parent.push(value);
      } else {
        Object.defineProperty(parent, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    }
    if (value !== null && typeof value === "object") {
      stack.push(value);
      if (Array.isArray(value)) {
        parseState = "beforeArrayValue";
      } else {
        parseState = "beforePropertyName";
      }
    } else {
      const current = stack[stack.length - 1];
      if (current == null) {
        parseState = "end";
      } else if (Array.isArray(current)) {
        parseState = "afterArrayValue";
      } else {
        parseState = "afterPropertyValue";
      }
    }
  }
  function pop() {
    stack.pop();
    const current = stack[stack.length - 1];
    if (current == null) {
      parseState = "end";
    } else if (Array.isArray(current)) {
      parseState = "afterArrayValue";
    } else {
      parseState = "afterPropertyValue";
    }
  }
  function invalidChar(c2) {
    if (c2 === undefined) {
      return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
    }
    return syntaxError(`JSON5: invalid character '${formatChar(c2)}' at ${line}:${column}`);
  }
  function invalidEOF() {
    return syntaxError(`JSON5: invalid end of input at ${line}:${column}`);
  }
  function invalidIdentifier() {
    column -= 5;
    return syntaxError(`JSON5: invalid identifier character at ${line}:${column}`);
  }
  function separatorChar(c2) {
    console.warn(`JSON5: '${formatChar(c2)}' in strings is not valid ECMAScript; consider escaping`);
  }
  function formatChar(c2) {
    const replacements = {
      "'": "\\'",
      '"': "\\\"",
      "\\": "\\\\",
      "\b": "\\b",
      "\f": "\\f",
      "\n": "\\n",
      "\r": "\\r",
      "\t": "\\t",
      "\v": "\\v",
      "\x00": "\\0",
      "\u2028": "\\u2028",
      "\u2029": "\\u2029"
    };
    if (replacements[c2]) {
      return replacements[c2];
    }
    if (c2 < " ") {
      const hexString = c2.charCodeAt(0).toString(16);
      return "\\x" + ("00" + hexString).substring(hexString.length);
    }
    return c2;
  }
  function syntaxError(message) {
    const err = new SyntaxError(message);
    err.lineNumber = line;
    err.columnNumber = column;
    return err;
  }
});

// ../../node_modules/.bun/json5@2.2.3/node_modules/json5/lib/stringify.js
var require_stringify = __commonJS((exports, module) => {
  var util2 = require_util2();
  module.exports = function stringify(value, replacer, space) {
    const stack = [];
    let indent = "";
    let propertyList;
    let replacerFunc;
    let gap = "";
    let quote;
    if (replacer != null && typeof replacer === "object" && !Array.isArray(replacer)) {
      space = replacer.space;
      quote = replacer.quote;
      replacer = replacer.replacer;
    }
    if (typeof replacer === "function") {
      replacerFunc = replacer;
    } else if (Array.isArray(replacer)) {
      propertyList = [];
      for (const v of replacer) {
        let item;
        if (typeof v === "string") {
          item = v;
        } else if (typeof v === "number" || v instanceof String || v instanceof Number) {
          item = String(v);
        }
        if (item !== undefined && propertyList.indexOf(item) < 0) {
          propertyList.push(item);
        }
      }
    }
    if (space instanceof Number) {
      space = Number(space);
    } else if (space instanceof String) {
      space = String(space);
    }
    if (typeof space === "number") {
      if (space > 0) {
        space = Math.min(10, Math.floor(space));
        gap = "          ".substr(0, space);
      }
    } else if (typeof space === "string") {
      gap = space.substr(0, 10);
    }
    return serializeProperty("", { "": value });
    function serializeProperty(key, holder) {
      let value2 = holder[key];
      if (value2 != null) {
        if (typeof value2.toJSON5 === "function") {
          value2 = value2.toJSON5(key);
        } else if (typeof value2.toJSON === "function") {
          value2 = value2.toJSON(key);
        }
      }
      if (replacerFunc) {
        value2 = replacerFunc.call(holder, key, value2);
      }
      if (value2 instanceof Number) {
        value2 = Number(value2);
      } else if (value2 instanceof String) {
        value2 = String(value2);
      } else if (value2 instanceof Boolean) {
        value2 = value2.valueOf();
      }
      switch (value2) {
        case null:
          return "null";
        case true:
          return "true";
        case false:
          return "false";
      }
      if (typeof value2 === "string") {
        return quoteString(value2, false);
      }
      if (typeof value2 === "number") {
        return String(value2);
      }
      if (typeof value2 === "object") {
        return Array.isArray(value2) ? serializeArray(value2) : serializeObject(value2);
      }
      return;
    }
    function quoteString(value2) {
      const quotes = {
        "'": 0.1,
        '"': 0.2
      };
      const replacements = {
        "'": "\\'",
        '"': "\\\"",
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
        "\v": "\\v",
        "\x00": "\\0",
        "\u2028": "\\u2028",
        "\u2029": "\\u2029"
      };
      let product = "";
      for (let i = 0;i < value2.length; i++) {
        const c = value2[i];
        switch (c) {
          case "'":
          case '"':
            quotes[c]++;
            product += c;
            continue;
          case "\x00":
            if (util2.isDigit(value2[i + 1])) {
              product += "\\x00";
              continue;
            }
        }
        if (replacements[c]) {
          product += replacements[c];
          continue;
        }
        if (c < " ") {
          let hexString = c.charCodeAt(0).toString(16);
          product += "\\x" + ("00" + hexString).substring(hexString.length);
          continue;
        }
        product += c;
      }
      const quoteChar = quote || Object.keys(quotes).reduce((a, b) => quotes[a] < quotes[b] ? a : b);
      product = product.replace(new RegExp(quoteChar, "g"), replacements[quoteChar]);
      return quoteChar + product + quoteChar;
    }
    function serializeObject(value2) {
      if (stack.indexOf(value2) >= 0) {
        throw TypeError("Converting circular structure to JSON5");
      }
      stack.push(value2);
      let stepback = indent;
      indent = indent + gap;
      let keys2 = propertyList || Object.keys(value2);
      let partial = [];
      for (const key of keys2) {
        const propertyString = serializeProperty(key, value2);
        if (propertyString !== undefined) {
          let member = serializeKey(key) + ":";
          if (gap !== "") {
            member += " ";
          }
          member += propertyString;
          partial.push(member);
        }
      }
      let final;
      if (partial.length === 0) {
        final = "{}";
      } else {
        let properties;
        if (gap === "") {
          properties = partial.join(",");
          final = "{" + properties + "}";
        } else {
          let separator = `,
` + indent;
          properties = partial.join(separator);
          final = `{
` + indent + properties + `,
` + stepback + "}";
        }
      }
      stack.pop();
      indent = stepback;
      return final;
    }
    function serializeKey(key) {
      if (key.length === 0) {
        return quoteString(key, true);
      }
      const firstChar = String.fromCodePoint(key.codePointAt(0));
      if (!util2.isIdStartChar(firstChar)) {
        return quoteString(key, true);
      }
      for (let i = firstChar.length;i < key.length; i++) {
        if (!util2.isIdContinueChar(String.fromCodePoint(key.codePointAt(i)))) {
          return quoteString(key, true);
        }
      }
      return key;
    }
    function serializeArray(value2) {
      if (stack.indexOf(value2) >= 0) {
        throw TypeError("Converting circular structure to JSON5");
      }
      stack.push(value2);
      let stepback = indent;
      indent = indent + gap;
      let partial = [];
      for (let i = 0;i < value2.length; i++) {
        const propertyString = serializeProperty(String(i), value2);
        partial.push(propertyString !== undefined ? propertyString : "null");
      }
      let final;
      if (partial.length === 0) {
        final = "[]";
      } else {
        if (gap === "") {
          let properties = partial.join(",");
          final = "[" + properties + "]";
        } else {
          let separator = `,
` + indent;
          let properties = partial.join(separator);
          final = `[
` + indent + properties + `,
` + stepback + "]";
        }
      }
      stack.pop();
      indent = stepback;
      return final;
    }
  };
});

// ../../node_modules/.bun/json5@2.2.3/node_modules/json5/lib/index.js
var require_lib2 = __commonJS((exports, module) => {
  var parse = require_parse2();
  var stringify = require_stringify();
  var JSON5 = {
    parse,
    stringify
  };
  module.exports = JSON5;
});

// src/utils/json-llm.ts
function extractAndParseJSONObjectFromText(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid input: text must be a non-empty string");
  }
  const safeText = text.length > 1e5 ? text.slice(0, 1e5) : text;
  const match = safeText.match(jsonBlockPattern);
  const textToParse = match ? match[1].trim() : safeText.trim();
  try {
    return import_json5.default.parse(textToParse);
  } catch {
    throw new Error("Failed to parse invalid JSON");
  }
}
var import_json5, jsonBlockPattern;
var init_json_llm = __esm(() => {
  import_json5 = __toESM(require_lib2(), 1);
  jsonBlockPattern = /```(?:json|json5)?\s*\r?\n?([\s\S]*?)\r?\n?```/i;
});

// src/utils/recursive-character-text-splitter.ts
class RecursiveCharacterTextSplitter {
  chunkSize;
  chunkOverlap;
  separators;
  keepSeparator;
  lengthFunction;
  constructor(fields) {
    const chunkSize = fields?.chunkSize ?? 1000;
    const chunkOverlap = fields?.chunkOverlap ?? 200;
    if (chunkOverlap >= chunkSize) {
      throw new Error("Cannot have chunkOverlap >= chunkSize");
    }
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.separators = fields?.separators ?? [`

`, `
`, " ", ""];
    this.keepSeparator = fields?.keepSeparator ?? true;
    this.lengthFunction = fields?.lengthFunction ?? ((t) => t.length);
  }
  splitOnSeparator(text, separator) {
    let splits;
    if (separator) {
      if (this.keepSeparator) {
        const regexEscapedSeparator = separator.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
        splits = text.split(new RegExp(`(?=${regexEscapedSeparator})`));
      } else {
        splits = text.split(separator);
      }
    } else {
      splits = text.split("");
    }
    return splits.filter((s) => s !== "");
  }
  joinDocs(docs, separator) {
    const joined = docs.join(separator).trim();
    return joined === "" ? null : joined;
  }
  async mergeSplits(splits, separator) {
    const docs = [];
    const currentDoc = [];
    let total = 0;
    for (const d of splits) {
      const len = await this.lengthFunction(d);
      if (total + len + currentDoc.length * separator.length > this.chunkSize) {
        if (total > this.chunkSize) {
          logger_default.warn(`[RecursiveCharacterTextSplitter] Created a chunk of size ${total}, which is longer than the specified ${this.chunkSize}`);
        }
        if (currentDoc.length > 0) {
          const doc2 = this.joinDocs(currentDoc, separator);
          if (doc2 !== null)
            docs.push(doc2);
          while (total > this.chunkOverlap || total + len + currentDoc.length * separator.length > this.chunkSize && total > 0) {
            const first = currentDoc[0];
            if (first === undefined)
              break;
            total -= await this.lengthFunction(first);
            currentDoc.shift();
          }
        }
      }
      currentDoc.push(d);
      total += len;
    }
    const doc = this.joinDocs(currentDoc, separator);
    if (doc !== null)
      docs.push(doc);
    return docs;
  }
  async _splitText(text, separators) {
    const finalChunks = [];
    let separator = separators[separators.length - 1] ?? "";
    let newSeparators;
    for (let i = 0;i < separators.length; i += 1) {
      const s = separators[i];
      if (s === undefined)
        continue;
      if (s === "") {
        separator = s;
        break;
      }
      if (text.includes(s)) {
        separator = s;
        newSeparators = separators.slice(i + 1);
        break;
      }
    }
    const splits = this.splitOnSeparator(text, separator);
    const goodSplits = [];
    const sepForMerge = this.keepSeparator ? "" : separator;
    for (const s of splits) {
      if (await this.lengthFunction(s) < this.chunkSize) {
        goodSplits.push(s);
      } else {
        if (goodSplits.length) {
          const mergedText = await this.mergeSplits(goodSplits, sepForMerge);
          finalChunks.push(...mergedText);
          goodSplits.length = 0;
        }
        if (!newSeparators) {
          finalChunks.push(s);
        } else {
          const otherInfo = await this._splitText(s, newSeparators);
          finalChunks.push(...otherInfo);
        }
      }
    }
    if (goodSplits.length) {
      const mergedText = await this.mergeSplits(goodSplits, sepForMerge);
      finalChunks.push(...mergedText);
    }
    return finalChunks;
  }
  async splitText(text) {
    return this._splitText(text, this.separators);
  }
}
var init_recursive_character_text_splitter = __esm(() => {
  init_logger2();
});

// src/utils/time-format.ts
function describeRelativeTime(timestamp, style) {
  const now = Date.now();
  const diff = now - timestamp;
  const absDiff = Math.abs(diff);
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (style === "verbose") {
    if (absDiff < 60000) {
      return "just now";
    }
    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (seconds < 60) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  if (days === 1) {
    return "Yesterday";
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });
}
function formatTimestamp(timestamp) {
  return describeRelativeTime(timestamp, "verbose");
}

// src/runtime/context-normalization.ts
function normalizeContextId(context) {
  return context.trim().toLowerCase().replace(/[\s-]+/g, "_");
}
function expandContextAliases(context) {
  const normalized = normalizeContextId(context);
  const alias = CONTEXT_ALIASES[normalized];
  if (!alias) {
    return [normalized];
  }
  return alias.map((value) => normalizeContextId(value));
}
function normalizeContextList(contexts) {
  if (!contexts?.length) {
    return [];
  }
  const normalized = new Set;
  for (const context of contexts) {
    for (const expanded of expandContextAliases(context)) {
      normalized.add(expanded);
    }
  }
  return [...normalized];
}
var FIRST_PARTY_CONTEXT_IDS, CONTEXT_ALIASES;
var init_context_normalization = __esm(() => {
  FIRST_PARTY_CONTEXT_IDS = [
    "simple",
    "general",
    "memory",
    "documents",
    "knowledge",
    "research",
    "web",
    "browser",
    "code",
    "files",
    "terminal",
    "email",
    "calendar",
    "contacts",
    "tasks",
    "goals",
    "todos",
    "productivity",
    "health",
    "screen_time",
    "subscriptions",
    "finance",
    "payments",
    "wallet",
    "crypto",
    "messaging",
    "phone",
    "social",
    "social_posting",
    "media",
    "automation",
    "connectors",
    "settings",
    "character",
    "secrets",
    "admin",
    "system",
    "state",
    "world",
    "game",
    "agent_internal"
  ];
  CONTEXT_ALIASES = Object.freeze({
    money: ["finance", "wallet", "crypto"],
    balance: ["finance", "wallet", "crypto"],
    balances: ["finance", "wallet", "crypto"],
    portfolio: ["finance", "wallet", "crypto"],
    web3: ["crypto", "wallet", "finance"],
    defi: ["crypto", "wallet", "finance"]
  });
});

// src/utils/context-catalog.ts
function normalizeContexts(contexts) {
  return Array.isArray(contexts) ? contexts.filter((context) => Boolean(context)) : [];
}
function resolveActionContexts(action) {
  const declared = normalizeContexts(action.contexts);
  if (declared.length > 0) {
    return declared;
  }
  return LEGACY_ACTION_CONTEXT_FALLBACK[action.name.toUpperCase()] ?? ["general"];
}
function lookupProviderCatalogContexts(name) {
  return PROVIDER_CONTEXT_MAP[name] ?? PROVIDER_CONTEXT_MAP[name.toLowerCase()] ?? PROVIDER_CONTEXT_MAP[name.toUpperCase()];
}
function resolveProviderContexts(provider) {
  const declared = normalizeContexts(provider.contexts);
  if (declared.length > 0) {
    return declared;
  }
  return lookupProviderCatalogContexts(provider.name) ?? ["general"];
}
var LEGACY_ACTION_CONTEXT_FALLBACK, PROVIDER_CONTEXT_MAP;
var init_context_catalog = __esm(() => {
  init_context_normalization();
  LEGACY_ACTION_CONTEXT_FALLBACK = {
    NONE: ["general"],
    IGNORE: ["general"],
    CONTINUE: ["general"],
    REPLY: ["general"],
    HELP: ["general"],
    STATUS: ["general"],
    MODELS: ["general"],
    CONFIGURE: ["general", "settings"],
    APP: ["connectors"],
    PLUGIN: ["connectors", "admin"],
    PAGE_DELEGATE: ["general"],
    WALLET: ["wallet"],
    PREDICTION_MARKET: ["wallet"],
    MODIFY_CHARACTER: ["settings", "admin"],
    UPDATE_OWNER_NAME: ["settings"],
    SET_USER_NAME: ["settings"],
    SEND_TOKEN: ["wallet"],
    TRANSFER: ["wallet"],
    TRANSFER_TOKEN: ["wallet"],
    CHECK_BALANCE: ["wallet"],
    GET_BALANCE: ["wallet"],
    GET_RECEIVE_ADDRESS: ["wallet"],
    PREPARE_SWAP: ["wallet"],
    PREPARE_TRANSFER: ["wallet"],
    EXECUTE_TRADE: ["wallet"],
    CROSS_CHAIN_TRANSFER: ["wallet"],
    SWAP_TOKEN: ["wallet", "automation"],
    SWAP: ["wallet", "automation"],
    SWAP_SOLANA: ["wallet", "automation"],
    BRIDGE_TOKEN: ["wallet"],
    APPROVE_TOKEN: ["wallet"],
    SIGN_MESSAGE: ["wallet"],
    SIGN_WITH_ELIZA_WALLET: ["wallet"],
    APPROVE_ELIZA_WALLET_REQUEST: ["wallet"],
    REJECT_ELIZA_WALLET_REQUEST: ["wallet"],
    DEPLOY_CONTRACT: ["wallet", "code"],
    CREATE_GOVERNANCE_PROPOSAL: ["wallet", "social_posting"],
    GOV_PROPOSE: ["wallet", "social_posting"],
    VOTE_ON_PROPOSAL: ["wallet", "social_posting"],
    GOV_VOTE: ["wallet", "social_posting"],
    GOV_QUEUE: ["wallet", "social_posting"],
    GOV_EXECUTE: ["wallet", "social_posting"],
    STAKE: ["wallet"],
    UNSTAKE: ["wallet"],
    CLAIM_REWARDS: ["wallet"],
    GET_TOKEN_PRICE: ["wallet", "documents"],
    GET_PORTFOLIO: ["wallet"],
    CREATE_WALLET: ["wallet"],
    IMPORT_WALLET: ["wallet"],
    SEARCH: ["documents", "browser"],
    REMEMBER: ["documents"],
    RECALL: ["documents"],
    LEARN_FROM_EXPERIENCE: ["documents"],
    SEARCH_WEB: ["documents", "browser"],
    WEB_SEARCH: ["documents", "browser"],
    SUMMARIZE: ["documents"],
    ANALYZE: ["documents"],
    CREATE_TASK: ["automation"],
    START_CODING_TASK: ["code", "automation"],
    BROWSER: ["browser"],
    MANAGE_BROWSER_BRIDGE: ["browser", "files", "connectors", "settings"],
    BROWSE: ["browser"],
    SCREENSHOT: ["browser", "media"],
    NAVIGATE: ["browser"],
    CLICK: ["browser"],
    TYPE_TEXT: ["browser"],
    SPAWN_AGENT: ["code", "automation"],
    SEND_TO_AGENT: ["code", "automation"],
    LIST_AGENTS: ["code", "automation"],
    STOP_AGENT: ["code", "automation"],
    TASK_HISTORY: ["code", "automation"],
    TASK_CONTROL: ["code", "automation"],
    TASK_SHARE: ["code", "automation"],
    PROVISION_WORKSPACE: ["code", "automation"],
    FINALIZE_WORKSPACE: ["code", "automation"],
    KILL_AGENT: ["code", "automation"],
    UPDATE_AGENT: ["code", "admin"],
    RUN_SCRIPT: ["code", "automation"],
    REVIEW_CODE: ["code"],
    GENERATE_CODE: ["code"],
    EXECUTE_TASK: ["code", "automation"],
    CREATE_SUBTASK: ["code", "automation"],
    COMPLETE_TASK: ["code", "automation"],
    CANCEL_TASK: ["code", "automation"],
    DESCRIBE_IMAGE: ["media", "documents"],
    DESCRIBE_VIDEO: ["media", "documents"],
    DESCRIBE_AUDIO: ["media", "documents"],
    TEXT_TO_SPEECH: ["media"],
    TRANSCRIBE: ["media", "documents"],
    UPLOAD_FILE: ["media"],
    CREATE_CRON: ["automation"],
    UPDATE_CRON: ["automation"],
    DELETE_CRON: ["automation"],
    LIST_CRONS: ["automation"],
    PAUSE_CRON: ["automation"],
    RUN_CRON: ["automation"],
    WORKFLOW: ["automation"],
    TASK: ["tasks", "automation"],
    TRIGGER: ["automation", "tasks"],
    TRIGGER_WEBHOOK: ["automation"],
    CONTACT: ["contacts", "messaging", "documents"],
    ENTITY: ["contacts", "messaging", "documents"],
    CALENDAR: ["calendar", "automation"],
    ADD_CONTACT: ["contacts"],
    UPDATE_CONTACT: ["contacts"],
    GET_CONTACT: ["contacts"],
    SEARCH_CONTACTS: ["contacts"],
    SUMMARIZE_CONVERSATION: ["messaging", "documents"],
    CHAT_WITH_ATTACHMENTS: ["messaging", "documents", "media"],
    DOWNLOAD_MEDIA: ["messaging", "media"],
    TRANSCRIBE_MEDIA: ["messaging", "documents", "media"],
    SERVER_INFO: ["messaging"],
    VOICE_CALL: ["messaging", "phone", "connectors"],
    OWNER_TODOS: ["tasks"],
    OWNER_REMINDERS: ["tasks", "automation"],
    OWNER_ALARMS: ["tasks", "automation"],
    OWNER_GOALS: ["tasks"],
    OWNER_ROUTINES: ["tasks", "health", "automation"],
    OWNER_HEALTH: ["health"],
    OWNER_SCREENTIME: ["screen_time"],
    OWNER_FINANCES: ["finance", "subscriptions", "payments"],
    SCHEDULED_TASKS: ["tasks", "automation"],
    COMPUTER_USE: ["browser", "files", "terminal", "automation", "admin"],
    PERSONAL_ASSISTANT: ["calendar", "payments", "web"],
    BLOCK: ["automation", "settings"],
    RESOLVE_REQUEST: ["tasks", "automation", "admin", "general"],
    CREDENTIALS: ["browser", "settings", "secrets"],
    CHAT_THREAD: ["messaging"],
    X: ["social_posting", "messaging"],
    CONNECTOR: ["connectors"],
    ELEVATE_TRUST: ["contacts", "admin"],
    REVOKE_TRUST: ["contacts", "admin"],
    BLOCK_USER: ["messaging", "admin"],
    UNBLOCK_USER: ["messaging", "admin"],
    MANAGE_SECRETS: ["secrets", "admin"],
    SHELL_EXEC: ["terminal", "code", "admin"],
    RESTART: ["admin"],
    CONFIGURE_RUNTIME: ["settings", "admin"],
    UPDATE_IDENTITY: ["settings"],
    UPDATE_AI_PROVIDER: ["settings"],
    TOGGLE_CAPABILITY: ["settings"],
    TOGGLE_AUTO_TRAINING: ["settings"],
    TOGGLE_CONNECTOR: ["connectors"],
    SAVE_CONNECTOR_CONFIG: ["connectors"],
    DISCONNECT_CONNECTOR: ["connectors"],
    LIST_CONNECTORS: ["connectors"],
    SEARCH_ACTIONS: ["documents", "connectors"],
    FINISH: ["general"]
  };
  PROVIDER_CONTEXT_MAP = {
    ACTION_STATE: [...FIRST_PARTY_CONTEXT_IDS],
    time: ["general"],
    boredom: ["general"],
    facts: ["general", "documents"],
    documents: ["documents"],
    entities: ["contacts"],
    relationships: ["contacts"],
    recentMessages: ["general"],
    worldInfo: ["general"],
    roleInfo: ["general"],
    settings: ["settings"],
    "page-scoped-context": [
      "browser",
      "wallet",
      "automation",
      "connectors",
      "settings",
      "tasks",
      "messaging"
    ],
    available_apps: ["connectors"],
    app_browser_workspace: ["browser"],
    walletBalance: ["wallet"],
    walletPortfolio: ["wallet"],
    tokenPrices: ["wallet", "documents"],
    chainInfo: ["wallet"],
    wallet: ["wallet"],
    "get-balance": ["wallet"],
    "solana-wallet": ["wallet"],
    CODING_AGENT_EXAMPLES: ["code", "automation"],
    ACTIVE_WORKSPACE_CONTEXT: ["code", "automation"],
    AVAILABLE_AGENTS: ["code", "automation"],
    ACTIVE_SUB_AGENTS: ["code", "automation"],
    contacts: ["contacts"],
    trustScores: ["contacts"],
    platformIdentity: ["messaging"],
    cronJobs: ["automation"],
    taskList: ["automation", "code"],
    agentConfig: ["settings", "admin"],
    pluginList: ["connectors", "admin"],
    pluginConfigurationStatus: ["connectors", "admin"],
    pluginState: ["connectors", "admin"],
    registryPlugins: ["connectors", "admin"],
    webSearch: ["documents", "browser"],
    imessageContacts: ["contacts", "messaging", "connectors"],
    imessageChatContext: ["messaging", "connectors"],
    bluebubblesChatContext: ["messaging", "connectors"],
    slackChannelState: ["messaging", "connectors"],
    twitchChannelState: ["messaging", "connectors"],
    signalConversationState: ["messaging", "connectors"],
    lineChatContext: ["messaging", "connectors"],
    googleChatUserContext: ["messaging", "connectors"],
    googleChatSpaceState: ["messaging", "connectors"],
    PLATFORM_CHAT_CONTEXT: ["messaging", "connectors"],
    PLATFORM_USER_CONTEXT: ["messaging", "connectors"],
    crossChannelContext: ["messaging", "connectors"]
  };
});

// src/utils/message-text.ts
function extractUserText(raw2) {
  let text = raw2.length > 1e5 ? raw2.slice(0, 1e5) : raw2;
  if (text.trimStart().startsWith(DOCUMENT_AUGMENTATION_PREFIX)) {
    const match = text.match(USER_REQUEST_WRAPPER);
    if (match?.[1]) {
      text = match[1];
    }
  }
  return text.replace(LANGUAGE_INSTRUCTION_SUFFIX, "").trim();
}
function getUserMessageText(message) {
  const content = message?.content;
  const contentObject = content && typeof content === "object" ? content : null;
  const raw2 = typeof content === "string" ? content : typeof contentObject?.currentMessageText === "string" ? contentObject.currentMessageText : typeof contentObject?.text === "string" ? contentObject.text : "";
  return extractUserText(raw2);
}
function normalizeUserMessageText(message) {
  return getUserMessageText(message).toLowerCase().replace(/\s+/g, " ").trim();
}
function hasDocumentAugmentationEnvelope(text) {
  if (typeof text !== "string")
    return false;
  return text.trimStart().startsWith(DOCUMENT_AUGMENTATION_PREFIX);
}
function stripAugmentationForPersistence(message) {
  const content = message?.content;
  if (!content || typeof content !== "object")
    return message;
  const rendered = content.text;
  if (!hasDocumentAugmentationEnvelope(rendered))
    return message;
  const clean = extractUserText(rendered);
  if (clean === rendered)
    return message;
  return {
    ...message,
    content: {
      ...content,
      text: clean
    }
  };
}
var DOCUMENT_AUGMENTATION_PREFIX = "Answer the user request using the contextual documents", USER_REQUEST_WRAPPER, LANGUAGE_INSTRUCTION_SUFFIX;
var init_message_text = __esm(() => {
  USER_REQUEST_WRAPPER = /<user_request>\s*([\s\S]*?)\s*<\/user_request>/i;
  LANGUAGE_INSTRUCTION_SUFFIX = /\n*\[language instruction:[^\]]*\]\s*$/i;
});

// src/utils/context-routing.ts
function normalizeContext(value) {
  if (typeof value !== "string")
    return;
  const trimmed = value.trim().toLowerCase();
  return trimmed ? trimmed : undefined;
}
function dedupeStringValues(values) {
  const seen = new Set;
  const result = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }
    const lower = trimmed.toLowerCase();
    if (seen.has(lower)) {
      continue;
    }
    seen.add(lower);
    result.push(trimmed);
  }
  return result;
}
function parseDelimitedList(value) {
  if (!value)
    return [];
  if (Array.isArray(value)) {
    return dedupeStringValues(value.flatMap((entry) => typeof entry === "string" ? entry.split(LIST_SPLIT_RE) : [String(entry)]));
  }
  if (typeof value === "string") {
    return dedupeStringValues(value.split(LIST_SPLIT_RE));
  }
  return [];
}
function parseContextList(value) {
  return dedupeStringValues(parseDelimitedList(value)).map((context) => normalizeContext(context)).filter((context) => Boolean(context));
}
function isPageScopedRoutingContext(context) {
  if (typeof context !== "string")
    return false;
  const normalized = context.trim().toLowerCase();
  return normalized === "page" || normalized.startsWith("page-");
}
function normalizeRoutingContexts(contexts) {
  return dedupeStringValues((contexts ?? []).flatMap((context) => typeof context === "string" ? context.split(LIST_SPLIT_RE) : [])).map((context) => normalizeContext(context)).filter((context) => Boolean(context));
}
function getExplicitRoutingContexts(activeContexts) {
  return normalizeRoutingContexts(activeContexts).filter((context) => context !== "general" && !isPageScopedRoutingContext(context));
}
function routingContextsOverlap(left, right) {
  const normalizedRight = new Set(normalizeRoutingContexts(right).map((context) => `${context}`.toLowerCase()));
  if (normalizedRight.size === 0) {
    return false;
  }
  return normalizeRoutingContexts(left).some((context) => normalizedRight.has(`${context}`.toLowerCase()));
}
function shouldSurfaceContextCapabilities(declaredContexts, activeContexts) {
  if (normalizeRoutingContexts(activeContexts).some(isPageScopedRoutingContext)) {
    return false;
  }
  const explicitContexts = getExplicitRoutingContexts(activeContexts);
  return explicitContexts.length > 0 && routingContextsOverlap(declaredContexts, explicitContexts);
}
function parseContextRoutingMetadata(raw2) {
  if (!raw2 || typeof raw2 !== "object") {
    return {};
  }
  const value = raw2;
  const primaryContext = normalizeContext(value.primaryContext);
  const secondaryContexts = parseContextList(value.secondaryContexts);
  return {
    primaryContext,
    secondaryContexts
  };
}
function getContextRoutingFromState(state) {
  if (!state?.values)
    return {};
  return parseContextRoutingMetadata(state.values[CONTEXT_ROUTING_STATE_KEY]);
}
function getContextRoutingFromMessage(message) {
  const metadata = message.content.metadata;
  if (!metadata || typeof metadata !== "object") {
    return {};
  }
  return parseContextRoutingMetadata(metadata[CONTEXT_ROUTING_METADATA_KEY]);
}
function mergeContextRouting(state, message) {
  const stateRouting = getContextRoutingFromState(state);
  const messageRouting = getContextRoutingFromMessage(message);
  const mergedSecondary = dedupeStringValues([
    ...stateRouting.secondaryContexts || [],
    ...messageRouting.secondaryContexts || []
  ]);
  const primaryContext = messageRouting.primaryContext || stateRouting.primaryContext || undefined;
  if (primaryContext && !mergedSecondary.includes(primaryContext)) {
    mergedSecondary.unshift(primaryContext);
  }
  return {
    primaryContext,
    secondaryContexts: mergedSecondary
  };
}
function getActiveRoutingContexts(routing) {
  const contextSet = new Set;
  if (routing.primaryContext) {
    contextSet.add(routing.primaryContext);
  }
  for (const context of routing.secondaryContexts || []) {
    if (context) {
      contextSet.add(context);
    }
  }
  if (contextSet.size === 0) {
    return [];
  }
  contextSet.add("general");
  return Array.from(contextSet);
}
function getActiveRoutingContextsForTurn(state, message) {
  return getActiveRoutingContexts(mergeContextRouting(state, message));
}
function shouldIncludeByContext(declaredContexts, activeContexts) {
  if (!declaredContexts || declaredContexts.length === 0) {
    return true;
  }
  if (!activeContexts || activeContexts.length === 0) {
    return true;
  }
  const normalizedActive = new Set(activeContexts.map((context) => `${context}`.toLowerCase()));
  return declaredContexts.some((context) => normalizedActive.has(`${context}`.toLowerCase()));
}
function setContextRoutingMetadata(message, routing) {
  const existingMetadata = message.content && typeof message.content.metadata === "object" ? message.content.metadata : {};
  if (!message.content || typeof message.content !== "object") {
    return;
  }
  const routingMetadata = {};
  if (routing.primaryContext) {
    routingMetadata.primaryContext = routing.primaryContext;
  }
  if (routing.secondaryContexts) {
    routingMetadata.secondaryContexts = [...routing.secondaryContexts];
  }
  message.content = {
    ...message.content,
    metadata: {
      ...existingMetadata,
      [CONTEXT_ROUTING_METADATA_KEY]: routingMetadata
    }
  };
}
function deriveAvailableContexts(actions, providers) {
  const contextSet = new Set(["general"]);
  for (const action of actions) {
    for (const context of resolveActionContexts(action)) {
      const normalized = normalizeContext(context);
      if (normalized) {
        contextSet.add(normalized);
      }
    }
  }
  for (const provider of providers) {
    for (const context of resolveProviderContexts(provider)) {
      const normalized = normalizeContext(context);
      if (normalized) {
        contextSet.add(normalized);
      }
    }
  }
  return Array.from(contextSet).sort((a, b) => `${a}`.localeCompare(`${b}`));
}
function inferContextRoutingFromText(text) {
  const normalized = normalizeUserMessageText({
    content: { text: text ?? "" }
  });
  if (!normalized) {
    return { primaryContext: "general", secondaryContexts: [] };
  }
  const scored = CONTEXT_SIGNALS.map((signal) => ({
    context: signal.context,
    score: signal.patterns.reduce((score, pattern) => score + (pattern.test(normalized) ? 1 : 0), 0)
  })).filter((entry) => entry.score > 0).sort((left, right) => right.score - left.score);
  if (scored.length === 0) {
    return { primaryContext: "general", secondaryContexts: [] };
  }
  const primaryContext = scored[0].context;
  const secondaryContexts = scored.slice(1).filter((entry) => entry.score >= Math.max(1, scored[0].score - 1)).map((entry) => entry.context);
  return { primaryContext, secondaryContexts };
}
function inferContextRoutingFromMessage(message) {
  return inferContextRoutingFromText(typeof message.content === "string" ? message.content : typeof message.content.text === "string" ? message.content.text : "");
}
function attachAvailableContexts(state, runtime) {
  const availableContexts = deriveAvailableContexts(runtime.actions, runtime.providers);
  return {
    ...state,
    values: {
      ...state.values,
      [AVAILABLE_CONTEXTS_STATE_KEY]: availableContexts.join(", ")
    }
  };
}
var AVAILABLE_CONTEXTS_STATE_KEY = "availableContexts", CONTEXT_CAPABILITIES_STATE_KEY = "__contextCapabilities", CONTEXT_ROUTING_METADATA_KEY = "__responseContext", CONTEXT_ROUTING_STATE_KEY = "__contextRouting", LIST_SPLIT_RE, CONTEXT_SIGNALS;
var init_context_routing = __esm(() => {
  init_context_catalog();
  init_message_text();
  LIST_SPLIT_RE = /[\n,;]/;
  CONTEXT_SIGNALS = [
    {
      context: "code",
      patterns: [
        /\b(repo|repository|codebase|branch|commit|pull request|pr|diff|workspace|file|directory)\b/u,
        /\b(code|coding|implement|debug|fix|refactor|patch|test|typecheck|lint|build|component|api|server|client)\b/u,
        /\b(task agents?|sub-?agents?|coding agents?|codex|claude code|spawn an? agent|agent running|what are you working on)\b/u
      ]
    },
    {
      context: "automation",
      patterns: [
        /\b(schedule|remind|reminder|cron|workflow|automate|automation|run this|execute|deploy|release|monitor)\b/u,
        /\b(task agents?|sub-?agents?|agent running|pause that|resume that|stop that|continue that|what are you working on)\b/u
      ]
    },
    {
      context: "documents",
      patterns: [
        /\b(uploaded|document|file|pdf|remember|recall|search|lookup|find|summari[sz]e|analy[sz]e|research)\b/u,
        /\b(what is|what was|where is|tell me about|explain)\b/u
      ]
    },
    {
      context: "browser",
      patterns: [
        /\b(browser|browse|website|web page|url|click|type into|screenshot|navigate|extract page)\b/u
      ]
    },
    {
      context: "connectors",
      patterns: [
        /\b(apps?|catalog app|launch app|relaunch app|app session|app viewer)\b/u
      ]
    },
    {
      context: "connectors",
      patterns: [
        /\b(plugins?|install plugin|eject plugin|plugin registry|plugin health|core status)\b/u
      ]
    },
    {
      context: "connectors",
      patterns: [
        /\b(connectors?|telegram|discord|signal|whatsapp|slack|oauth|webhook)\b/u
      ]
    },
    {
      context: "messaging",
      patterns: [
        /\b(phone|call|sms|text message|dialer|voicemail|contact|vcard)\b/u
      ]
    },
    {
      context: "email",
      patterns: [/\b(email|gmail|mail|inbox|unread|draft reply)\b/u]
    },
    {
      context: "calendar",
      patterns: [/\b(calendar|meeting|schedule|event|availability)\b/u]
    },
    {
      context: "tasks",
      patterns: [
        /\b(lifeops|life ops|reminder|goal|habit|task|todo|follow up)\b/u
      ]
    },
    {
      context: "screen_time",
      patterns: [/\b(screen time|app usage|website usage|dwell time)\b/u]
    },
    {
      context: "subscriptions",
      patterns: [/\b(subscription|subscriptions|recurring charge|renewal)\b/u]
    },
    {
      context: "settings",
      patterns: [
        /\b(character|persona|personality|bio|style rules|message examples|voice|identity)\b/u
      ]
    },
    {
      context: "media",
      patterns: [
        /\b(image|picture|photo|video|audio|voice|transcribe|screenshot|draw|generate an image)\b/u
      ]
    },
    {
      context: "wallet",
      patterns: [
        /\b(wallet|token|swap|bridge|stake|unstake|balance|portfolio|transaction|sign message|contract)\b/u
      ]
    },
    {
      context: "messaging",
      patterns: [/\b(message|dm|inbox|contact|relationship|call|send .* to)\b/u]
    },
    {
      context: "admin",
      patterns: [
        /\b(settings?|configure|configuration|plugin|secret|api key|model provider|oauth|login|auth)\b/u
      ]
    },
    {
      context: "settings",
      patterns: [
        /\b(settings?|model provider|feature toggle|auto training|identity settings|permissions|rpc provider)\b/u
      ]
    }
  ];
});

// src/utils/boolean.ts
function parseBooleanValue(value, options = {}) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "string") {
    return;
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return;
  }
  const truthy = options.truthy ?? DEFAULT_TRUTHY;
  const falsy = options.falsy ?? DEFAULT_FALSY;
  const truthySet = truthy === DEFAULT_TRUTHY ? DEFAULT_TRUTHY_SET : new Set(truthy);
  const falsySet = falsy === DEFAULT_FALSY ? DEFAULT_FALSY_SET : new Set(falsy);
  if (truthySet.has(normalized)) {
    return true;
  }
  if (falsySet.has(normalized)) {
    return false;
  }
  return;
}
function parseBooleanText(value) {
  return parseBooleanValue(value, {
    truthy: [...TEXT_TRUTHY],
    falsy: [...TEXT_FALSY]
  }) ?? false;
}
var DEFAULT_TRUTHY, DEFAULT_FALSY, DEFAULT_TRUTHY_SET, DEFAULT_FALSY_SET, TEXT_TRUTHY, TEXT_FALSY;
var init_boolean = __esm(() => {
  DEFAULT_TRUTHY = ["true", "1", "yes", "on"];
  DEFAULT_FALSY = ["false", "0", "no", "off"];
  DEFAULT_TRUTHY_SET = new Set(DEFAULT_TRUTHY);
  DEFAULT_FALSY_SET = new Set(DEFAULT_FALSY);
  TEXT_TRUTHY = ["yes", "y", "true", "t", "1", "on", "enable"];
  TEXT_FALSY = ["no", "n", "false", "f", "0", "off", "disable"];
});

// src/utils/environment.ts
function detectEnvironment() {
  if (typeof process !== "undefined" && process.versions && process.versions.node) {
    return "node";
  }
  if (typeof globalThis !== "undefined" && typeof globalThis.window !== "undefined" && typeof globalThis.document !== "undefined") {
    return "browser";
  }
  return "unknown";
}

class BrowserEnvironmentStore {
  store = {};
  constructor() {
    const globalWindow = globalThis.window;
    if (globalWindow?.ENV) {
      this.store = { ...globalWindow.ENV };
    }
    const globalEnv = globalThis.__ENV__;
    if (globalEnv) {
      this.store = { ...this.store, ...globalEnv };
    }
  }
  get(key) {
    const value = this.store[key];
    return value !== undefined ? String(value) : undefined;
  }
  set(key, value) {
    this.store[key] = value;
  }
  has(key) {
    return key in this.store;
  }
  getAll() {
    return { ...this.store };
  }
}

class Environment {
  runtime;
  browserStore = null;
  cache = new Map;
  constructor() {
    this.runtime = detectEnvironment();
    if (this.runtime === "browser") {
      this.browserStore = new BrowserEnvironmentStore;
    }
  }
  getRuntime() {
    return this.runtime;
  }
  isNode() {
    return this.runtime === "node";
  }
  isBrowser() {
    return this.runtime === "browser";
  }
  get(key, defaultValue) {
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      return cached ?? defaultValue;
    }
    let value;
    if (this.runtime === "node") {
      value = process.env[key];
    } else if (this.browserStore) {
      value = this.browserStore.get(key);
    }
    this.cache.set(key, value);
    return value ?? defaultValue;
  }
  set(key, value) {
    const stringValue = String(value);
    this.cache.delete(key);
    if (this.runtime === "node") {
      process.env[key] = stringValue;
    } else if (this.browserStore) {
      this.browserStore.set(key, value);
    }
  }
  has(key) {
    return this.get(key) !== undefined;
  }
  getAll() {
    if (this.runtime === "node") {
      return { ...process.env };
    }
    if (this.browserStore) {
      return this.browserStore.getAll();
    }
    return {};
  }
  getBoolean(key, defaultValue = false) {
    const value = this.get(key);
    return parseBooleanValue(value) ?? defaultValue;
  }
  getNumber(key, defaultValue) {
    const value = this.get(key);
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  clearCache() {
    this.cache.clear();
  }
}
function getEnvironment() {
  if (!environmentInstance) {
    environmentInstance = new Environment;
  }
  return environmentInstance;
}
function getEnv2(key, defaultValue) {
  return getEnvironment().get(key, defaultValue);
}
function setEnv(key, value) {
  getEnvironment().set(key, value);
}
function hasEnv(key) {
  return getEnvironment().has(key);
}
function getBooleanEnv(key, defaultValue = false) {
  return getEnvironment().getBoolean(key, defaultValue);
}
function getNumberEnv(key, defaultValue) {
  return getEnvironment().getNumber(key, defaultValue);
}
function initBrowserEnvironment(config) {
  const env2 = getEnvironment();
  if (env2.isBrowser()) {
    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined) {
        env2.set(key, value);
      }
    }
  }
}
function findEnvFile(startDir, filenames = [".env", ".env.local"]) {
  if (typeof process === "undefined" || !process.cwd) {
    return null;
  }
  const moduleBuiltin = process.getBuiltinModule("module");
  const nodeRequire = moduleBuiltin?.createRequire?.(import.meta.url);
  if (!nodeRequire) {
    return null;
  }
  const fs = nodeRequire("node:fs");
  const path = nodeRequire("node:path");
  let currentDir = startDir || process.cwd();
  while (true) {
    for (const filename of filenames) {
      const candidate = path.join(currentDir, filename);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }
  return null;
}
function loadEnvFile(envPath) {
  if (typeof process === "undefined" || !process.cwd) {
    return false;
  }
  const moduleBuiltin = process.getBuiltinModule("module");
  const nodeRequire = moduleBuiltin?.createRequire?.(import.meta.url);
  if (!nodeRequire) {
    return false;
  }
  const dotenv = nodeRequire("dotenv");
  const resolvedPath = envPath || findEnvFile();
  if (!resolvedPath) {
    return false;
  }
  const result = dotenv.config({ path: resolvedPath });
  if (result.error) {
    throw new Error(`Failed to parse .env file at ${resolvedPath}: ${result.error.message}`);
  }
  return true;
}
var environmentInstance = null, currentRuntime;
var init_environment = __esm(() => {
  init_boolean();
  currentRuntime = detectEnvironment();
});

// src/utils/read-env.ts
function defaultEnv() {
  return typeof process !== "undefined" && process.env ? process.env : {};
}
function readRaw(env2, key) {
  const value = env2[key];
  if (typeof value !== "string")
    return;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
function readEnv(canonicalKey, options = {}) {
  const env2 = options.env ?? defaultEnv();
  return readRaw(env2, canonicalKey) ?? options.defaultValue;
}
function readEnvBool(canonicalKey, options = {}) {
  const raw2 = readEnv(canonicalKey, { env: options.env });
  return parseBooleanValue(raw2) ?? options.defaultValue ?? false;
}
var init_read_env = __esm(() => {
  init_boolean();
});

// src/utils/state-dir.ts
import { cp, mkdir, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join, resolve } from "node:path";
function resolveUserPath(input) {
  const trimmed = input.trim();
  if (!trimmed)
    return trimmed;
  if (trimmed.startsWith("~")) {
    return resolve(trimmed.replace(/^~(?=$|[\\/])/, homedir()));
  }
  return resolve(trimmed);
}
function getElizaNamespace(env2 = process.env) {
  return readEnv("ELIZA_NAMESPACE", { env: env2 }) ?? "eliza";
}
function resolveStateDir(env2 = process.env, getHome = homedir) {
  const explicit = readEnv("ELIZA_STATE_DIR", { env: env2 });
  if (explicit)
    return resolveUserPath(explicit);
  const namespace = getElizaNamespace(env2);
  const xdgStateHome = readEnv("XDG_STATE_HOME", { env: env2 });
  if (xdgStateHome) {
    const base = xdgStateHome.trim();
    return isAbsolute(base) ? join(base, namespace) : join(getHome(), base, namespace);
  }
  return join(getHome(), ".local", "state", namespace);
}
function resolveOAuthDir(env2 = process.env, stateDirPath = resolveStateDir(env2)) {
  const explicit = readEnv("ELIZA_OAUTH_DIR", { env: env2 });
  return explicit ? resolveUserPath(explicit) : join(stateDirPath, "credentials");
}
async function migrateStateDir(fromPath, toPath) {
  if (fromPath === toPath)
    return { migrated: false };
  try {
    const srcStat = await stat(fromPath);
    if (!srcStat.isDirectory())
      return { migrated: false };
  } catch {
    return { migrated: false };
  }
  await mkdir(toPath, { recursive: true });
  await cp(fromPath, toPath, {
    recursive: true,
    force: false,
    errorOnExist: false,
    dereference: false
  });
  return { migrated: true };
}
var init_state_dir = __esm(() => {
  init_read_env();
});

// src/utils/paths.ts
import { join as join2 } from "node:path";
function getEnvVar(key) {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return;
}

class ElizaPaths {
  cache = new Map;
  getDataDir() {
    const cached = this.cache.get("dataDir");
    if (cached)
      return cached;
    const dir = getEnvVar("ELIZA_DATA_DIR") || join2(resolveStateDir(), "workspace");
    this.cache.set("dataDir", dir);
    return dir;
  }
  getDatabaseDir() {
    return this.getPath("databaseDir", "PGLITE_DATA_DIR");
  }
  getCharactersDir() {
    return this.getPath("charactersDir");
  }
  getGeneratedDir() {
    return this.getPath("generatedDir");
  }
  getUploadsAgentsDir() {
    return this.getPath("uploadsAgentsDir");
  }
  getUploadsChannelsDir() {
    return this.getPath("uploadsChannelsDir");
  }
  getAllPaths() {
    return {
      dataDir: this.getDataDir(),
      databaseDir: this.getDatabaseDir(),
      charactersDir: this.getCharactersDir(),
      generatedDir: this.getGeneratedDir(),
      uploadsAgentsDir: this.getUploadsAgentsDir(),
      uploadsChannelsDir: this.getUploadsChannelsDir()
    };
  }
  clearCache() {
    this.cache.clear();
  }
  getPath(key, fallbackEnvKey) {
    const cached = this.cache.get(key);
    if (cached)
      return cached;
    const config = PATH_CONFIGS[key];
    const envValue = getEnvVar(config.envKey) || (fallbackEnvKey ? getEnvVar(fallbackEnvKey) : undefined);
    const dir = envValue || join2(this.getDataDir(), ...config.subPath);
    this.cache.set(key, dir);
    return dir;
  }
}
var PATH_CONFIGS;
var init_paths = __esm(() => {
  init_state_dir();
  PATH_CONFIGS = {
    databaseDir: {
      envKey: "ELIZA_DATABASE_DIR",
      subPath: [".elizadb"]
    },
    charactersDir: {
      envKey: "ELIZA_DATA_DIR_CHARACTERS",
      subPath: ["data", "characters"]
    },
    generatedDir: {
      envKey: "ELIZA_DATA_DIR_GENERATED",
      subPath: ["data", "generated"]
    },
    uploadsAgentsDir: {
      envKey: "ELIZA_DATA_DIR_UPLOADS_AGENTS",
      subPath: ["data", "uploads", "agents"]
    },
    uploadsChannelsDir: {
      envKey: "ELIZA_DATA_DIR_UPLOADS_CHANNELS",
      subPath: ["data", "uploads", "channels"]
    }
  };
});

// src/utils/server-health.ts
function buildUrl(options) {
  const {
    port,
    endpoint = "/api/agents",
    host = "localhost",
    protocol = "http"
  } = options;
  return `${protocol}://${host}:${port}${endpoint}`;
}
async function checkHealth(url, timeout) {
  const controller = new AbortController;
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal });
    return { ok: response.ok };
  } catch (error) {
    return { ok: false, error };
  } finally {
    clearTimeout(timeoutId);
  }
}
async function waitForServerReady(options) {
  const {
    maxWaitTime = 30000,
    pollInterval = 1000,
    requestTimeout = 2000
  } = options;
  const url = buildUrl(options);
  const startTime = Date.now();
  let lastError;
  while (Date.now() - startTime < maxWaitTime) {
    const result = await checkHealth(url, requestTimeout);
    if (result.ok) {
      await new Promise((resolve2) => setTimeout(resolve2, 1000));
      return;
    }
    lastError = result.error;
    await new Promise((resolve2) => setTimeout(resolve2, pollInterval));
  }
  throw new ServerHealthError(`Server failed to become ready at ${url} within ${maxWaitTime}ms`, url, lastError);
}
async function pingServer(options) {
  const { requestTimeout = 2000 } = options;
  const url = buildUrl(options);
  const result = await checkHealth(url, requestTimeout);
  return result.ok;
}
var ServerHealthError;
var init_server_health = __esm(() => {
  ServerHealthError = class ServerHealthError extends Error {
    url;
    cause;
    constructor(message, url, cause) {
      super(message);
      this.url = url;
      this.cause = cause;
      this.name = "ServerHealthError";
    }
  };
});

// src/utils/node.ts
function getLocalServerUrl(path) {
  const port = getEnv2("SERVER_PORT", "3000");
  return `http://localhost:${port}${path}`;
}
var init_node = __esm(() => {
  init_environment();
  init_paths();
  init_server_health();
});

// src/utils/synthetic-conversation-artifact.ts
function isSyntheticConversationArtifactText(text) {
  const trimmed = text.trim();
  return SYNTHETIC_MARKER_RE.test(trimmed) || /^compacted prior planner trajectory steps/i.test(trimmed) || /^#{1,3}\s*Conversation Summary\b/i.test(trimmed) || /\b(?:conversation summary|compacted prior planner|compactor|summary mode)\b/i.test(trimmed);
}
function isSyntheticConversationArtifactMemory(memory) {
  const metadata = memory.metadata && typeof memory.metadata === "object" ? memory.metadata : {};
  const source = typeof metadata.source === "string" ? metadata.source : "";
  const tags = Array.isArray(metadata.tags) ? metadata.tags.filter((tag) => typeof tag === "string") : [];
  const text = typeof memory.content.text === "string" ? memory.content.text : "";
  return SYNTHETIC_SOURCE_RE.test(source) || tags.some((tag) => SYNTHETIC_SOURCE_RE.test(tag)) || isSyntheticConversationArtifactText(text);
}
var SYNTHETIC_SOURCE_RE, SYNTHETIC_MARKER_RE;
var init_synthetic_conversation_artifact = __esm(() => {
  SYNTHETIC_SOURCE_RE = /\b(?:compaction|compactor|synthetic|summary)\b/i;
  SYNTHETIC_MARKER_RE = /^\[(?:conversation|system)\s+(?:summary|hybrid-ledger|state)(?:\s+\[[^\]]+\])?\]/i;
});

// src/utils/text-splitting.ts
function extractFirstSentence(text) {
  const abbreviations = [
    "Mr",
    "Mrs",
    "Ms",
    "Dr",
    "Prof",
    "Sr",
    "Jr",
    "St",
    "vs",
    "etc",
    "e.g",
    "i.e"
  ];
  let boundaryIndex = -1;
  for (let i = 0;i < text.length; i++) {
    const char = text[i];
    if (".?!".includes(char)) {
      const nextChar = text[i + 1];
      if (nextChar === undefined || /\s/.test(nextChar) || nextChar === '"' || nextChar === "'") {
        const preText = text.substring(0, i);
        const lastWordMatch = preText.match(/([\w.]+)$/);
        let isAbbreviation = false;
        if (lastWordMatch) {
          const lastWord = lastWordMatch[1].replace(/\.$/, "");
          if (abbreviations.some((abbr) => abbr.toLowerCase() === lastWord.toLowerCase())) {
            isAbbreviation = true;
          }
        }
        if (!isAbbreviation) {
          boundaryIndex = i + 1;
          break;
        }
      }
    }
  }
  if (boundaryIndex !== -1) {
    const first = text.substring(0, boundaryIndex).trim();
    const rest = text.substring(boundaryIndex).trim();
    return { first, rest };
  }
  return { first: text.trim(), rest: "" };
}
function hasFirstSentence(text) {
  const { rest } = extractFirstSentence(text);
  return rest.length > 0;
}

// src/utils.ts
import z from "zod";
function isRestrictedCSPEnvironment() {
  if (_isRestrictedCSP !== null)
    return _isRestrictedCSP;
  const isBrowserExtension = typeof globalThis !== "undefined" && typeof globalThis.chrome === "object" && globalThis.chrome !== null && typeof globalThis.chrome?.runtime === "object" && typeof globalThis.chrome?.runtime?.id === "string";
  if (isBrowserExtension) {
    _isRestrictedCSP = true;
    return true;
  }
  try {
    new Function("return 1");
    _isRestrictedCSP = false;
  } catch {
    _isRestrictedCSP = true;
  }
  return _isRestrictedCSP;
}
function simpleTemplateReplace(template, context) {
  let result = template.replace(/\{\{\{([^{}]+)\}\}\}/g, (_match, varName) => {
    const key = varName.trim();
    const value = context[key];
    if (value === undefined || value === null)
      return "";
    return String(value);
  });
  result = result.replace(/\{\{([^{}]+)\}\}/g, (_match, varName) => {
    const key = varName.trim();
    if (key.startsWith("#") || key.startsWith("/") || key.startsWith(">") || key === "else") {
      return "";
    }
    const value = context[key];
    if (value === undefined || value === null)
      return "";
    return String(value);
  });
  return result;
}
function upgradeDoubleToTriple(tpl) {
  return tpl.replace(/(?<!{){{(?![{#/!>])([\s\S]*?)}}/g, (_match, inner) => {
    if (inner.trim() === "else")
      return `{{${inner}}}`;
    return `{{{${inner}}}}`;
  });
}
function getCompiledTemplate(template) {
  const cached = COMPILED_TEMPLATE_CACHE.get(template);
  if (cached) {
    return cached;
  }
  const upgraded = upgradeDoubleToTriple(template);
  const compiled = import_handlebars.default.compile(upgraded);
  COMPILED_TEMPLATE_CACHE.set(template, compiled);
  if (COMPILED_TEMPLATE_CACHE.size > COMPILED_TEMPLATE_CACHE_LIMIT) {
    const oldestKey = COMPILED_TEMPLATE_CACHE.keys().next().value;
    if (typeof oldestKey === "string") {
      COMPILED_TEMPLATE_CACHE.delete(oldestKey);
    }
  }
  return compiled;
}
function resolvePromptSeed(stateLike, stateValues, stateData) {
  const normalizeSeedValue = (value) => {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    return;
  };
  return buildDeterministicSeed(normalizeSeedValue(stateValues?.__conversationSeed), normalizeSeedValue(stateData?.__conversationSeed), normalizeSeedValue(stateLike.__conversationSeed), normalizeSeedValue(stateValues?.agentName), normalizeSeedValue(stateLike.agentName), normalizeSeedValue(stateLike.roomId), "prompt");
}
function parseStructuredResponseFence(text) {
  const trimmed = text.trim();
  const match = /^```(?:toon|text)?\s*([\s\S]*?)\s*```$/i.exec(trimmed);
  return match?.[1]?.trim() ?? trimmed;
}
function parseToonScalar(value) {
  if (!value)
    return "";
  if (value === "null")
    return null;
  if (value.startsWith('"') && value.endsWith('"') || value.startsWith("[") && value.endsWith("]") || value.startsWith("{") && value.endsWith("}")) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
function parseToonKeyValue(text) {
  const body = parseStructuredResponseFence(text);
  if (!body)
    return null;
  const result = {};
  let found = false;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#"))
      continue;
    const match = /^([A-Za-z_][\w.-]*)(?:\[(\d+)\])?\s*:\s*(.*)$/.exec(line);
    if (!match)
      continue;
    found = true;
    const [, key, arrayIndex, rawValue] = match;
    const value = parseToonScalar(rawValue.trim());
    if (arrayIndex === undefined) {
      result[key] = value;
      continue;
    }
    const index = Number.parseInt(arrayIndex, 10);
    const current = result[key];
    const values = Array.isArray(current) ? current : [];
    values[index] = value;
    result[key] = values;
  }
  return found ? result : null;
}
function parseKeyValueXml(text) {
  if (!text)
    return null;
  let xmlContent = null;
  const responseStart = text.indexOf("<response>");
  if (responseStart !== -1) {
    const contentStart = responseStart + "<response>".length;
    const responseEnd = text.indexOf("</response>", contentStart);
    if (responseEnd !== -1) {
      xmlContent = text.slice(contentStart, responseEnd);
    }
  }
  if (!xmlContent) {
    const safeText = text.length > 1e5 ? text.slice(0, 1e5) : text;
    const looksLikeXml = /<[/!?A-Za-z_][^>\n]*>/.test(safeText);
    if (!looksLikeXml) {
      return null;
    }
    const firstBlock = findFirstXmlBlock(text);
    if (!firstBlock) {
      logger_default.warn({ src: "core:utils" }, "Could not find XML block in text");
      return null;
    }
    xmlContent = firstBlock.content;
  }
  const result = {};
  for (const { key, value } of extractDirectXmlChildren(xmlContent)) {
    if (key === "actions" || key === "providers" || key === "evaluators") {
      const singularTag = key.replace(/s$/, "");
      const hasXmlTags = value && new RegExp(`<${singularTag}[\\s>/]`).test(value);
      result[key] = hasXmlTags ? value : value ? value.split(",").map((entry) => entry.trim()) : [];
    } else {
      result[key] = value;
    }
  }
  if (Object.keys(result).length === 0) {
    logger_default.warn({ src: "core:utils" }, "No key-value pairs extracted from XML content");
    return null;
  }
  return result;
}
function findFirstXmlBlock(input) {
  let i = 0;
  const length = input.length;
  while (i < length) {
    const openIdx = input.indexOf("<", i);
    if (openIdx === -1)
      break;
    if (input.startsWith("</", openIdx) || input.startsWith("<!--", openIdx) || input.startsWith("<?", openIdx)) {
      i = openIdx + 1;
      continue;
    }
    const tagInfo = readXmlStartTag(input, openIdx);
    if (!tagInfo || tagInfo.selfClosing) {
      i = (tagInfo?.end ?? openIdx) + 1;
      continue;
    }
    const closeIdx = findMatchingXmlClose(input, tagInfo.tag, tagInfo.end + 1);
    if (closeIdx !== -1) {
      return {
        tag: tagInfo.tag,
        content: input.slice(tagInfo.end + 1, closeIdx)
      };
    }
    i = tagInfo.end + 1;
  }
  return null;
}
function extractDirectXmlChildren(input) {
  const pairs = [];
  let i = 0;
  const length = input.length;
  while (i < length) {
    const openIdx = input.indexOf("<", i);
    if (openIdx === -1)
      break;
    if (input.startsWith("</", openIdx) || input.startsWith("<!--", openIdx) || input.startsWith("<?", openIdx)) {
      i = openIdx + 1;
      continue;
    }
    const tagInfo = readXmlStartTag(input, openIdx);
    if (!tagInfo || tagInfo.selfClosing) {
      i = (tagInfo?.end ?? openIdx) + 1;
      continue;
    }
    const closeIdx = findMatchingXmlClose(input, tagInfo.tag, tagInfo.end + 1);
    if (closeIdx === -1) {
      i = tagInfo.end + 1;
      continue;
    }
    const innerRaw = input.slice(tagInfo.end + 1, closeIdx);
    pairs.push({
      key: tagInfo.tag,
      value: unescapeBasicXmlEntities(innerRaw).trim()
    });
    i = closeIdx + `</${tagInfo.tag}>`.length;
  }
  return pairs;
}
function readXmlStartTag(input, openIdx) {
  let j = openIdx + 1;
  let tag = "";
  while (j < input.length) {
    const ch = input[j];
    if (/^[A-Za-z0-9_-]$/.test(ch)) {
      tag += ch;
      j += 1;
      continue;
    }
    break;
  }
  if (!tag)
    return null;
  const end = input.indexOf(">", j);
  if (end === -1)
    return null;
  return {
    tag,
    end,
    selfClosing: /\/\s*>$/.test(input.slice(openIdx, end + 1))
  };
}
function findMatchingXmlClose(input, tag, start) {
  const closeSeq = `</${tag}>`;
  let depth = 1;
  let cursor = start;
  while (depth > 0 && cursor < input.length) {
    const nextOpen = input.indexOf(`<${tag}`, cursor);
    const nextClose = input.indexOf(closeSeq, cursor);
    if (nextClose === -1)
      return -1;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      const nestedTag = readXmlStartTag(input, nextOpen);
      if (!nestedTag)
        return -1;
      if (nestedTag.tag === tag && !nestedTag.selfClosing) {
        depth += 1;
      }
      cursor = nestedTag.end + 1;
    } else {
      depth -= 1;
      if (depth === 0)
        return nextClose;
      cursor = nextClose + closeSeq.length;
    }
  }
  return -1;
}
function unescapeBasicXmlEntities(value) {
  return value.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
}
function parseJSONObjectFromText(text) {
  try {
    const result = extractAndParseJSONObjectFromText(text);
    if (!result) {
      return null;
    }
    if (Array.isArray(result)) {
      return null;
    }
    return result;
  } catch (_error) {
    return null;
  }
}
function truncateToCompleteSentence(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  const lastPeriodIndex = text.lastIndexOf(".", maxLength - 1);
  if (lastPeriodIndex !== -1) {
    const truncatedAtPeriod = text.slice(0, lastPeriodIndex + 1).trim();
    if (truncatedAtPeriod.length > 0) {
      return truncatedAtPeriod;
    }
  }
  const lastSpaceIndex = text.lastIndexOf(" ", maxLength - 1);
  if (lastSpaceIndex !== -1) {
    const truncatedAtSpace = text.slice(0, lastSpaceIndex).trim();
    if (truncatedAtSpace.length > 0) {
      return `${truncatedAtSpace}...`;
    }
  }
  const hardTruncated = text.slice(0, maxLength - 3).trim();
  return `${hardTruncated}...`;
}
async function splitChunks(content, chunkSize = 512, bleed = 20) {
  const characterstoTokens = 3.5;
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: Number(Math.floor(chunkSize * characterstoTokens)),
    chunkOverlap: Number(Math.floor(bleed * characterstoTokens))
  });
  const chunks = await textSplitter.splitText(content);
  return chunks;
}
async function trimTokens(prompt, maxTokens, runtime) {
  if (!prompt)
    throw new Error("Trim tokens received a null prompt");
  if (prompt.length < maxTokens / 5)
    return prompt;
  if (maxTokens <= 0)
    throw new Error("maxTokens must be positive");
  const tokens = await runtime.useModel(ModelType.TEXT_TOKENIZER_ENCODE, {
    prompt,
    modelType: ModelType.TEXT_TOKENIZER_ENCODE
  });
  if (tokens.length <= maxTokens) {
    return prompt;
  }
  const truncatedTokens = tokens.slice(-maxTokens);
  return runtime.useModel(ModelType.TEXT_TOKENIZER_DECODE, {
    tokens: truncatedTokens,
    modelType: ModelType.TEXT_TOKENIZER_DECODE
  });
}
function parseBooleanFromText2(value) {
  if (value === undefined || value === null)
    return false;
  if (typeof value === "boolean")
    return value;
  const affirmative = ["YES", "Y", "TRUE", "T", "1", "ON", "ENABLE"];
  const negative = ["NO", "N", "FALSE", "F", "0", "OFF", "DISABLE"];
  const normalizedText = value.trim().toUpperCase();
  if (affirmative.includes(normalizedText))
    return true;
  if (negative.includes(normalizedText))
    return false;
  return false;
}
function validateUuid(value) {
  const result = uuidSchema.safeParse(value);
  return result.success ? result.data : null;
}
function stringToUuid(target) {
  if (typeof target === "number") {
    target = target.toString();
  }
  if (typeof target !== "string") {
    throw TypeError("Value must be string");
  }
  const maybeUuid = validateUuid(target);
  if (maybeUuid)
    return maybeUuid;
  const escapedStr = encodeURIComponent(target);
  const digest = getCachedSha1(escapedStr);
  const bytes = digest.slice(0, 16);
  bytes[8] = bytes[8] & 63 | 128;
  bytes[6] = bytes[6] & 15 | 0;
  return bytesToUuid(bytes);
}
async function prewarmUuidCache(values) {
  if (!checkWebCrypto())
    return;
  const promises = values.map(async (value) => {
    const escapedStr = encodeURIComponent(value);
    const digest = await sha1BytesAsync(escapedStr);
    sha1Cache.set(escapedStr, digest);
  });
  await Promise.all(promises);
}
function checkWebCrypto() {
  if (webCryptoAvailable !== null)
    return webCryptoAvailable;
  if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.subtle && typeof globalThis.crypto.subtle.digest === "function") {
    webCryptoAvailable = true;
    return true;
  }
  webCryptoAvailable = false;
  return false;
}
function getCachedSha1(message) {
  const cached = sha1Cache.get(message);
  if (cached)
    return cached;
  const digest = sha1Bytes(message);
  sha1Cache.set(message, digest);
  if (checkWebCrypto()) {
    sha1BytesAsync(message).then((webDigest) => {
      sha1Cache.set(message, webDigest);
    });
  }
  if (sha1Cache.size > 1e4) {
    const keysToDelete = Array.from(sha1Cache.keys()).slice(0, 5000);
    for (const key of keysToDelete) {
      sha1Cache.delete(key);
    }
  }
  return digest;
}
async function sha1BytesAsync(message) {
  if (checkWebCrypto()) {
    const encoder = new TextEncoder;
    const data2 = encoder.encode(message);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-1", data2);
    return new Uint8Array(hashBuffer);
  }
  return sha1Bytes(message);
}
function sha1Bytes(message) {
  const bytes = utf8Encode(message);
  const ml = bytes.length;
  const withOne = new Uint8Array(ml + 9 + 63 >>> 6 << 6);
  withOne.set(bytes);
  withOne[ml] = 128;
  const bitLen = ml * 8;
  const dv = new DataView(withOne.buffer);
  dv.setUint32(withOne.length - 4, bitLen >>> 0, false);
  dv.setUint32(withOne.length - 8, Math.floor(bitLen / 2 ** 32) >>> 0, false);
  let h0 = 1732584193;
  let h1 = 4023233417;
  let h2 = 2562383102;
  let h3 = 271733878;
  let h4 = 3285377520;
  const w = new Uint32Array(80);
  for (let i = 0;i < withOne.length; i += 64) {
    for (let j = 0;j < 16; j++) {
      w[j] = dv.getUint32(i + j * 4, false);
    }
    for (let j = 16;j < 80; j++) {
      const t = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
      w[j] = t << 1 | t >>> 31;
    }
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    for (let j = 0;j < 80; j++) {
      let f;
      let k;
      if (j < 20) {
        f = b & c | ~b & d;
        k = 1518500249;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 1859775393;
      } else if (j < 60) {
        f = b & c | b & d | c & d;
        k = 2400959708;
      } else {
        f = b ^ c ^ d;
        k = 3395469782;
      }
      const temp = (a << 5 | a >>> 27) + f + e + k + w[j] >>> 0;
      e = d;
      d = c;
      c = (b << 30 | b >>> 2) >>> 0;
      b = a;
      a = temp;
    }
    h0 = h0 + a >>> 0;
    h1 = h1 + b >>> 0;
    h2 = h2 + c >>> 0;
    h3 = h3 + d >>> 0;
    h4 = h4 + e >>> 0;
  }
  const out = new Uint8Array(20);
  const outDv = new DataView(out.buffer);
  outDv.setUint32(0, h0, false);
  outDv.setUint32(4, h1, false);
  outDv.setUint32(8, h2, false);
  outDv.setUint32(12, h3, false);
  outDv.setUint32(16, h4, false);
  return out;
}
function utf8Encode(str) {
  if (typeof TextEncoder !== "undefined") {
    return new TextEncoder().encode(str);
  }
  const utf8 = [];
  for (let i = 0;i < str.length; i++) {
    const charcode = str.charCodeAt(i);
    if (charcode < 128)
      utf8.push(charcode);
    else if (charcode < 2048) {
      utf8.push(192 | charcode >> 6, 128 | charcode & 63);
    } else if (charcode < 55296 || charcode >= 57344) {
      utf8.push(224 | charcode >> 12, 128 | charcode >> 6 & 63, 128 | charcode & 63);
    } else {
      i++;
      const codePoint = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
      utf8.push(240 | codePoint >> 18, 128 | codePoint >> 12 & 63, 128 | codePoint >> 6 & 63, 128 | codePoint & 63);
    }
  }
  return new Uint8Array(utf8);
}
function bytesToUuid(bytes) {
  const hex = [];
  for (let i = 0;i < bytes.length; i++) {
    const h = bytes[i].toString(16).padStart(2, "0");
    hex.push(h);
  }
  return hex.slice(0, 4).join("") + "-" + hex.slice(4, 6).join("") + "-" + hex.slice(6, 8).join("") + "-" + hex.slice(8, 10).join("") + "-" + hex.slice(10, 16).join("");
}
var import_handlebars, DEFAULT_MAX_CONVERSATION_TOKENS = 50000, DEFAULT_MAX_EMBEDDING_TOKENS = 8000, DEFAULT_MAX_EMBEDDING_CHARS, DEFAULT_MAX_PROMPT_TOKENS = 128000, _isRestrictedCSP = null, COMPILED_TEMPLATE_CACHE, COMPILED_TEMPLATE_CACHE_LIMIT = 256, composePrompt = ({
  state,
  template
}) => {
  const templateStr = typeof template === "function" ? template({ state }) : template;
  let rendered;
  if (isRestrictedCSPEnvironment()) {
    const upgraded = upgradeDoubleToTriple(templateStr);
    rendered = simpleTemplateReplace(upgraded, state);
  } else {
    const templateFunction = getCompiledTemplate(templateStr);
    rendered = templateFunction(state);
  }
  const output = composeRandomUser(rendered, 10, resolvePromptSeed(state));
  return output;
}, composePromptFromState = ({
  state,
  template
}) => {
  const templateStr = typeof template === "function" ? template({ state }) : template;
  const stateKeys = Object.keys(state);
  const filteredKeys = stateKeys.filter((key) => !["text", "values", "data"].includes(key));
  const filteredState = filteredKeys.reduce((acc, key) => {
    acc[key] = state[key];
    return acc;
  }, {});
  const context = { ...filteredState, ...state.values };
  let rendered;
  if (isRestrictedCSPEnvironment()) {
    const upgraded = upgradeDoubleToTriple(templateStr);
    rendered = simpleTemplateReplace(upgraded, context);
  } else {
    const templateFunction = getCompiledTemplate(templateStr);
    rendered = templateFunction(context);
  }
  const output = composeRandomUser(rendered, 10, resolvePromptSeed(filteredState, state.values, state.data));
  return output;
}, addHeader = (header, body) => {
  return body.length > 0 ? `${header ? `${header}
` : header}${body}
` : "";
}, composeRandomUser = (template, length, seed = "prompt-users") => {
  if (!template.includes("{{name") && !template.includes("{{user")) {
    return template;
  }
  const exampleNames = getDeterministicNames(length, seed);
  return replaceIndexedNameTokens(template, exampleNames);
}, formatPosts = ({
  messages,
  entities,
  conversationHeader = true
}) => {
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));
  const groupedMessages = {};
  messages.forEach((message) => {
    if (message.roomId) {
      if (!groupedMessages[message.roomId]) {
        groupedMessages[message.roomId] = [];
      }
      groupedMessages[message.roomId].push(message);
    }
  });
  Object.values(groupedMessages).forEach((roomMessages) => {
    roomMessages.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  });
  const sortedRooms = Object.entries(groupedMessages).sort(([, messagesA], [, messagesB]) => {
    const lastMessageB = messagesB[messagesB.length - 1];
    const lastMessageA = messagesA[messagesA.length - 1];
    return (lastMessageB?.createdAt || 0) - (lastMessageA?.createdAt || 0);
  });
  const formattedPosts = sortedRooms.map(([roomId, roomMessages]) => {
    const messageStrings = roomMessages.filter((message) => message.entityId).map((message) => {
      const entity = entityById.get(message.entityId);
      if (!entity) {
        logger_default.warn({ src: "core:utils", entityId: message.entityId }, "No entity found for message");
      }
      let userName = entity?.names?.[0];
      let displayName = entity?.names?.[0];
      if (!userName && entity?.metadata && typeof entity.metadata === "object") {
        const source = message.content.source;
        const sourceMeta = source && entity.metadata[source];
        if (sourceMeta) {
          userName = sourceMeta.name ?? sourceMeta.userName ?? sourceMeta.username;
          displayName = sourceMeta.userName ?? sourceMeta.username ?? sourceMeta.name;
        }
        if (!userName) {
          const meta = entity.metadata;
          userName = meta.name ?? meta.userName ?? meta.username;
          displayName = meta.userName ?? meta.username ?? meta.name;
        }
      }
      userName = userName || "Unknown User";
      displayName = displayName || "unknown";
      return `Name: ${userName} (@${displayName} EntityID:${message.entityId})
MessageID: ${message.id}${message.content.inReplyTo ? `
In reply to: ${message.content.inReplyTo}` : ""}
Source: ${message.content.source}
Date: ${formatTimestamp2(message.createdAt || 0)}

--- Text Start ---
${message.content.text ?? ""}
--- Text End ---`;
    });
    const header = conversationHeader ? `Conversation: ${roomId.slice(-5)}
` : "";
    return `${header}${messageStrings.join(`

`)}`;
  });
  return formattedPosts.join(`

`);
}, formatMessages = ({
  messages,
  entities
}) => {
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));
  const messageStrings = [];
  let remainingAttachmentContext = 3;
  let omittedAttachmentCount = 0;
  for (let i = messages.length - 1;i >= 0; i -= 1) {
    const message = messages[i];
    if (!message.entityId) {
      continue;
    }
    const messageText = message.content.text;
    const reactedMessageText = message.content.reactedMessageText;
    const messageActions = message.content.actions;
    const messageThought = message.content.thought;
    const foundEntity = entityById.get(message.entityId);
    const foundEntityNames = foundEntity?.names;
    const baseName = foundEntityNames?.[0] || "Unknown User";
    const senderIsBot = message.metadata?.fromBot === true || message.content?.metadata?.fromBot === true;
    const formattedName = senderIsBot ? `${baseName} (bot)` : baseName;
    const attachments = message.content.attachments;
    const visibleAttachments = attachments && attachments.length > 0 ? attachments.slice(0, Math.max(0, remainingAttachmentContext)) : [];
    if (attachments && attachments.length > 0) {
      remainingAttachmentContext = Math.max(0, remainingAttachmentContext - visibleAttachments.length);
      omittedAttachmentCount += attachments.length - visibleAttachments.length;
    }
    const attachmentString = visibleAttachments.length > 0 ? ` (Attachments: ${visibleAttachments.map((media) => {
      const lines = [`[${media.id} - ${media.title} (${media.url})]`];
      if (media.contentType) {
        lines.push(`Type: ${media.contentType}`);
      }
      if (media.text) {
        lines.push("Stored content available via ATTACHMENT action=read");
      }
      return lines.join(`
`);
    }).join(visibleAttachments.every((media) => !media.text && !media.description && !media.contentType) ? ", " : `
`)})` : null;
    const messageTime = new Date(message.createdAt || 0);
    const hours = messageTime.getHours().toString().padStart(2, "0");
    const minutes = messageTime.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    const timestamp = formatTimestamp2(message.createdAt || 0);
    const thoughtString = messageThought ? `(${formattedName}'s internal thought: ${messageThought})` : null;
    const timestampString = `${timeString} (${timestamp}) [${message.entityId}]`;
    const textString = messageText ? `${timestampString} ${formattedName}: ${messageText}` : null;
    const reactedContextString = typeof reactedMessageText === "string" && reactedMessageText.trim() ? `(reacted-to message in full: "${reactedMessageText.trim()}")` : null;
    const actionString = messageActions && messageActions.length > 0 ? `${textString ? "" : timestampString} (${formattedName}'s actions: ${messageActions.join(", ")})` : null;
    const messageString = [
      textString,
      reactedContextString,
      thoughtString,
      actionString,
      attachmentString
    ].filter(Boolean).join(`
`);
    messageStrings.push(messageString);
  }
  const formattedMessages = messageStrings.join(`
`);
  if (omittedAttachmentCount === 0) {
    return formattedMessages;
  }
  return [
    formattedMessages,
    `Note: ${omittedAttachmentCount} older attachment${omittedAttachmentCount === 1 ? "" : "s"} omitted from context. Use ATTACHMENT action=read to inspect additional attachments.`
  ].filter(Boolean).join(`
`);
}, formatTimestamp2, uuidSchema, sha1Cache, webCryptoAvailable = null, getContentTypeFromMimeType = (mimeType) => {
  if (mimeType.startsWith("image/"))
    return ContentType.IMAGE;
  if (mimeType.startsWith("video/"))
    return ContentType.VIDEO;
  if (mimeType.startsWith("audio/"))
    return ContentType.AUDIO;
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.startsWith("text/")) {
    return ContentType.DOCUMENT;
  }
  return;
};
var init_utils = __esm(() => {
  init_logger2();
  init_model();
  init_primitives();
  init_deterministic();
  init_json_llm();
  init_recursive_character_text_splitter();
  init_context_catalog();
  init_context_routing();
  init_json_llm();
  init_message_text();
  init_node();
  init_synthetic_conversation_artifact();
  import_handlebars = __toESM(require_lib(), 1);
  DEFAULT_MAX_EMBEDDING_CHARS = DEFAULT_MAX_EMBEDDING_TOKENS * 4;
  COMPILED_TEMPLATE_CACHE = new Map;
  formatTimestamp2 = formatTimestamp;
  uuidSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid UUID format");
  sha1Cache = new Map;
});
// src/types/agent.ts
var AgentStatus;
var init_agent = __esm(() => {
  ((AgentStatus2) => {
    AgentStatus2["ACTIVE"] = "active";
    AgentStatus2["INACTIVE"] = "inactive";
  })(AgentStatus ||= {});
});
// src/types/service.ts
class Service {
  runtime;
  constructor(runtime) {
    if (runtime) {
      this.runtime = runtime;
    }
  }
  static serviceType;
  static allowsMultiple;
  config;
  static async start(_runtime) {
    throw new Error("Service.start() must be implemented by subclass");
  }
}
function getTypedService(runtime, serviceType) {
  return runtime.getService(serviceType);
}
function createServiceError(error, code = "UNKNOWN_ERROR") {
  if (error instanceof Error) {
    return {
      code,
      message: error.message,
      cause: error
    };
  }
  return {
    code,
    message: String(error)
  };
}
var ServiceType;
var init_service = __esm(() => {
  ServiceType = {
    TRANSCRIPTION: "transcription",
    VIDEO: "video",
    BROWSER: "browser",
    PDF: "pdf",
    REMOTE_FILES: "aws_s3",
    TUNNEL: "tunnel",
    CLOUD_AUTH: "CLOUD_AUTH",
    WEB_SEARCH: "web_search",
    EMAIL: "email",
    TEE: "tee",
    TASK: "task",
    APPROVAL: "approval",
    TOOL_POLICY: "tool_policy",
    WALLET: "wallet",
    LP_POOL: "lp_pool",
    TOKEN_DATA: "token_data",
    MESSAGE_SERVICE: "message_service",
    MESSAGE: "message",
    POST: "post",
    HOOKS: "hooks",
    PAIRING: "pairing",
    CONNECTOR_ACCOUNT: "connector_account",
    CONNECTOR_ACCOUNT_STORAGE: "connector_account_storage",
    AGENT_EVENT: "agent_event",
    CONTROL_TRANSPORT: "control_transport",
    NOTIFICATION: "notification",
    MEDIA_GENERATION: "media_generation",
    VOICE_CACHE: "voice_cache",
    OPTIMIZED_PROMPT: "optimized_prompt",
    CHANNEL_TOPICS: "channel_topics",
    COMMANDS: "commands",
    MOBILE_DEVICE_BRIDGE: "mobile_device_bridge",
    SCREEN_CAPTURE: "screen_capture",
    DOCUMENTS: "documents",
    RELATIONSHIPS: "relationships",
    FOLLOW_UP: "follow_up",
    TRAJECTORIES: "trajectories",
    SWARM_COORDINATOR: "SWARM_COORDINATOR",
    UNKNOWN: "unknown"
  };
});

// src/types/commands.ts
var CommandRegistryService;
var init_commands = __esm(() => {
  init_service();
  CommandRegistryService = class CommandRegistryService extends Service {
    static serviceType = "commands";
  };
});

// src/types/components.ts
function isActionConfirmationStatus(value) {
  return typeof value === "string" && ACTION_CONFIRMATION_STATUS_VALUES.has(value);
}
var ActionMode, NON_BLOCKING_MODES, HOOK_MODES, FOLLOW_UP_CAPABLE_ACTION_TAG = "follow-up-capable", ACTION_CONFIRMATION_STATUS_VALUES;
var init_components = __esm(() => {
  ActionMode = {
    PLANNER: "PLANNER",
    ALWAYS_BEFORE: "ALWAYS_BEFORE",
    ALWAYS_DURING: "ALWAYS_DURING",
    ALWAYS_AFTER: "ALWAYS_AFTER",
    CONTEXT_BEFORE: "CONTEXT_BEFORE",
    CONTEXT_DURING: "CONTEXT_DURING",
    CONTEXT_AFTER: "CONTEXT_AFTER",
    RESPONSE_HANDLER_BEFORE: "RESPONSE_HANDLER_BEFORE",
    RESPONSE_HANDLER_DURING: "RESPONSE_HANDLER_DURING",
    RESPONSE_HANDLER_AFTER: "RESPONSE_HANDLER_AFTER"
  };
  NON_BLOCKING_MODES = new Set([
    ActionMode.ALWAYS_DURING,
    ActionMode.CONTEXT_DURING,
    ActionMode.RESPONSE_HANDLER_DURING
  ]);
  HOOK_MODES = [
    ActionMode.ALWAYS_BEFORE,
    ActionMode.RESPONSE_HANDLER_BEFORE,
    ActionMode.RESPONSE_HANDLER_DURING,
    ActionMode.RESPONSE_HANDLER_AFTER,
    ActionMode.CONTEXT_BEFORE,
    ActionMode.CONTEXT_DURING,
    ActionMode.CONTEXT_AFTER,
    ActionMode.ALWAYS_DURING,
    ActionMode.ALWAYS_AFTER
  ];
  ACTION_CONFIRMATION_STATUS_VALUES = new Set([
    "CONFIRMATION_REQUIRED",
    "NOT_CONFIRMED",
    "REQUIRES_CONFIRMATION",
    "AWAITING_CONFIRMATION",
    "NEEDS_CONFIRMATION"
  ]);
});

// src/types/connector-setup.ts
function buildSetupError(code, message) {
  return { error: { code, message } };
}
function setupPath(connector, action) {
  return `/api/setup/${connector}/${action}`;
}
var SETUP_ERROR_CODES;
var init_connector_setup = __esm(() => {
  SETUP_ERROR_CODES = {
    BAD_REQUEST: "bad_request",
    SERVICE_UNAVAILABLE: "service_unavailable",
    INTERNAL_ERROR: "internal_error",
    TOO_MANY_SESSIONS: "too_many_sessions"
  };
});
// src/types/database.ts
var DbRunStatus, VECTOR_DIMS;
var init_database = __esm(() => {
  DbRunStatus = {
    UNSPECIFIED: "UNSPECIFIED",
    STARTED: "STARTED",
    COMPLETED: "COMPLETED",
    TIMEOUT: "TIMEOUT",
    ERROR: "ERROR"
  };
  VECTOR_DIMS = {
    SMALL: 384,
    MEDIUM: 512,
    LARGE: 768,
    XL: 1024,
    XXL: 1536,
    XXXL: 3072
  };
});
// src/types/environment.ts
var Role;
var init_environment2 = __esm(() => {
  Role = {
    OWNER: "OWNER",
    ADMIN: "ADMIN",
    MEMBER: "MEMBER",
    GUEST: "GUEST",
    NONE: "NONE"
  };
});
// src/types/events.ts
var EventType, PlatformPrefix;
var init_events = __esm(() => {
  ((EventType2) => {
    EventType2["WORLD_JOINED"] = "WORLD_JOINED";
    EventType2["WORLD_CONNECTED"] = "WORLD_CONNECTED";
    EventType2["WORLD_LEFT"] = "WORLD_LEFT";
    EventType2["ENTITY_JOINED"] = "ENTITY_JOINED";
    EventType2["ENTITY_LEFT"] = "ENTITY_LEFT";
    EventType2["ENTITY_UPDATED"] = "ENTITY_UPDATED";
    EventType2["ROOM_JOINED"] = "ROOM_JOINED";
    EventType2["ROOM_LEFT"] = "ROOM_LEFT";
    EventType2["MESSAGE_RECEIVED"] = "MESSAGE_RECEIVED";
    EventType2["MESSAGE_SENT"] = "MESSAGE_SENT";
    EventType2["MESSAGE_DELETED"] = "MESSAGE_DELETED";
    EventType2["CHANNEL_CLEARED"] = "CHANNEL_CLEARED";
    EventType2["VOICE_MESSAGE_RECEIVED"] = "VOICE_MESSAGE_RECEIVED";
    EventType2["VOICE_MESSAGE_SENT"] = "VOICE_MESSAGE_SENT";
    EventType2["VOICE_TURN_OBSERVED"] = "VOICE_TURN_OBSERVED";
    EventType2["VOICE_ENTITY_BOUND"] = "VOICE_ENTITY_BOUND";
    EventType2["REACTION_RECEIVED"] = "REACTION_RECEIVED";
    EventType2["POST_GENERATED"] = "POST_GENERATED";
    EventType2["INTERACTION_RECEIVED"] = "INTERACTION_RECEIVED";
    EventType2["RUN_STARTED"] = "RUN_STARTED";
    EventType2["RUN_ENDED"] = "RUN_ENDED";
    EventType2["RUN_TIMEOUT"] = "RUN_TIMEOUT";
    EventType2["ACTION_STARTED"] = "ACTION_STARTED";
    EventType2["ACTION_COMPLETED"] = "ACTION_COMPLETED";
    EventType2["EVALUATOR_STARTED"] = "EVALUATOR_STARTED";
    EventType2["EVALUATOR_COMPLETED"] = "EVALUATOR_COMPLETED";
    EventType2["MODEL_USED"] = "MODEL_USED";
    EventType2["MODEL_REGISTERED"] = "MODEL_REGISTERED";
    EventType2["EMBEDDING_GENERATION_REQUESTED"] = "EMBEDDING_GENERATION_REQUESTED";
    EventType2["EMBEDDING_GENERATION_COMPLETED"] = "EMBEDDING_GENERATION_COMPLETED";
    EventType2["EMBEDDING_GENERATION_FAILED"] = "EMBEDDING_GENERATION_FAILED";
    EventType2["PII_SCRUB_REQUESTED"] = "PII_SCRUB_REQUESTED";
    EventType2["PII_SCRUB_COMPLETED"] = "PII_SCRUB_COMPLETED";
    EventType2["PII_SCRUB_FAILED"] = "PII_SCRUB_FAILED";
    EventType2["ERROR_REPORTED"] = "ERROR_REPORTED";
    EventType2["CONTROL_MESSAGE"] = "CONTROL_MESSAGE";
    EventType2["FORM_FIELD_CONFIRMED"] = "FORM_FIELD_CONFIRMED";
    EventType2["FORM_FIELD_CANCELLED"] = "FORM_FIELD_CANCELLED";
    EventType2["VIEW_SWITCHED"] = "VIEW_SWITCHED";
    EventType2["SLASH_COMMAND_INVOKED"] = "SLASH_COMMAND_INVOKED";
    EventType2["SHORTCUT_FIRED"] = "SHORTCUT_FIRED";
    EventType2["USER_TYPING_STARTED"] = "USER_TYPING_STARTED";
    EventType2["USER_TYPING_PAUSED"] = "USER_TYPING_PAUSED";
    EventType2["USER_DRAFT_ABANDONED"] = "USER_DRAFT_ABANDONED";
    EventType2["HOOK_COMMAND_NEW"] = "HOOK_COMMAND_NEW";
    EventType2["HOOK_COMMAND_RESET"] = "HOOK_COMMAND_RESET";
    EventType2["HOOK_COMMAND_STOP"] = "HOOK_COMMAND_STOP";
    EventType2["HOOK_SESSION_START"] = "HOOK_SESSION_START";
    EventType2["HOOK_SESSION_END"] = "HOOK_SESSION_END";
    EventType2["HOOK_AGENT_BASIC_CAPABILITIES"] = "HOOK_AGENT_BASIC_CAPABILITIES";
    EventType2["HOOK_AGENT_START"] = "HOOK_AGENT_START";
    EventType2["HOOK_AGENT_END"] = "HOOK_AGENT_END";
    EventType2["HOOK_GATEWAY_START"] = "HOOK_GATEWAY_START";
    EventType2["HOOK_GATEWAY_STOP"] = "HOOK_GATEWAY_STOP";
    EventType2["HOOK_COMPACTION_BEFORE"] = "HOOK_COMPACTION_BEFORE";
    EventType2["HOOK_COMPACTION_AFTER"] = "HOOK_COMPACTION_AFTER";
    EventType2["HOOK_TOOL_BEFORE"] = "HOOK_TOOL_BEFORE";
    EventType2["HOOK_TOOL_AFTER"] = "HOOK_TOOL_AFTER";
    EventType2["HOOK_TOOL_PERSIST"] = "HOOK_TOOL_PERSIST";
    EventType2["HOOK_MESSAGE_SENDING"] = "HOOK_MESSAGE_SENDING";
    EventType2["PIPELINE_HOOK_METRIC"] = "PIPELINE_HOOK_METRIC";
  })(EventType ||= {});
  ((PlatformPrefix2) => {
    PlatformPrefix2["DISCORD"] = "DISCORD";
    PlatformPrefix2["TELEGRAM"] = "TELEGRAM";
    PlatformPrefix2["X"] = "X";
  })(PlatformPrefix ||= {});
});

// src/types/hook.ts
var DEFAULT_HOOK_PRIORITY = 0;
// src/types/memory.ts
var MemoryType;
var init_memory = __esm(() => {
  MemoryType = {
    DOCUMENT: "document",
    FRAGMENT: "fragment",
    MESSAGE: "message",
    DESCRIPTION: "description",
    CUSTOM: "custom"
  };
});
// src/types/message-source.ts
var MESSAGE_SOURCE_CLIENT_CHAT = "client_chat", MESSAGE_SOURCE_SUB_AGENT = "sub_agent", MESSAGE_SOURCE_CODING_AGENT = "coding-agent", MESSAGE_SOURCE_AGENT_GREETING = "agent_greeting", MESSAGE_SOURCES;
var init_message_source = __esm(() => {
  MESSAGE_SOURCES = {
    CLIENT_CHAT: MESSAGE_SOURCE_CLIENT_CHAT,
    SUB_AGENT: MESSAGE_SOURCE_SUB_AGENT,
    CODING_AGENT: MESSAGE_SOURCE_CODING_AGENT,
    AGENT_GREETING: MESSAGE_SOURCE_AGENT_GREETING
  };
});

// src/types/messaging.ts
var SOCKET_MESSAGE_TYPE, MESSAGE_STREAM_EVENT;
var init_messaging = __esm(() => {
  ((SOCKET_MESSAGE_TYPE2) => {
    SOCKET_MESSAGE_TYPE2[SOCKET_MESSAGE_TYPE2["ROOM_JOINING"] = 1] = "ROOM_JOINING";
    SOCKET_MESSAGE_TYPE2[SOCKET_MESSAGE_TYPE2["MESSAGE_SEND"] = 2] = "MESSAGE_SEND";
    SOCKET_MESSAGE_TYPE2[SOCKET_MESSAGE_TYPE2["MESSAGE"] = 3] = "MESSAGE";
    SOCKET_MESSAGE_TYPE2[SOCKET_MESSAGE_TYPE2["ACK"] = 4] = "ACK";
    SOCKET_MESSAGE_TYPE2[SOCKET_MESSAGE_TYPE2["THINKING"] = 5] = "THINKING";
    SOCKET_MESSAGE_TYPE2[SOCKET_MESSAGE_TYPE2["CONTROL"] = 6] = "CONTROL";
  })(SOCKET_MESSAGE_TYPE ||= {});
  MESSAGE_STREAM_EVENT = {
    messageStreamChunk: "messageStreamChunk",
    messageStreamError: "messageStreamError",
    messageBroadcast: "messageBroadcast"
  };
});

// src/types/notification.ts
function tierForPriority(priority) {
  switch (priority) {
    case "urgent":
    case "high":
      return "interrupt";
    case "normal":
      return "digest";
    case "low":
      return "silent";
  }
}
function defaultPriorityForCategory(category) {
  switch (category) {
    case "approval":
      return "high";
    case "task":
    case "workflow":
      return "normal";
    case "system":
      return "low";
    default:
      return DEFAULT_NOTIFICATION_PRIORITY;
  }
}
var DEFAULT_NOTIFICATION_CATEGORY = "general", DEFAULT_NOTIFICATION_PRIORITY = "normal", DEFAULT_NOTIFICATION_SOURCE = "agent", NOTIFICATION_STREAM = "notification", NOTIFICATION_COUNT_KEY = "count", SILENT_TIER_DEFAULT_EXPIRY_MS;
var init_notification = __esm(() => {
  SILENT_TIER_DEFAULT_EXPIRY_MS = 24 * 60 * 60 * 1000;
});

// src/types/pairing.ts
function getPairingIdLabel(channel) {
  return PAIRING_ID_LABELS[channel] ?? "userId";
}
var DEFAULT_PAIRING_CONFIG, PAIRING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", PAIRING_ID_LABELS;
var init_pairing = __esm(() => {
  DEFAULT_PAIRING_CONFIG = {
    maxPendingRequests: 3,
    requestTtlMs: 60 * 60 * 1000,
    codeLength: 8
  };
  PAIRING_ID_LABELS = {
    telegram: "userId",
    whatsapp: "phoneNumber",
    signal: "phoneNumber",
    discord: "userId",
    slack: "userId",
    imessage: "phoneOrEmail",
    googlechat: "email",
    msteams: "userId"
  };
});
// src/types/pending-user-action.ts
var PENDING_USER_ACTION_WEIGHT;
var init_pending_user_action = __esm(() => {
  PENDING_USER_ACTION_WEIGHT = {
    approval: 9,
    task_approval: 9,
    choice: 9,
    credential: 8,
    credential_request: 8,
    clarifying_question: 7,
    blocked_task: 10,
    prompt: 6,
    pending_prompt: 6
  };
});

// src/types/pipeline-hooks.ts
function withPipelinePhase(phase, fields) {
  return { phase, ...fields };
}
function defaultPipelineHookSchedule(phase) {
  return PIPELINE_PHASE_CONCURRENT_DEFAULT.has(phase) ? "concurrent" : "serial";
}
function defaultPipelineHookMutatesPrimary(phase) {
  return PIPELINE_PHASE_MUTATES_PRIMARY_DEFAULT.has(phase);
}
function pipelineHookMetricRoomId(ctx) {
  switch (ctx.phase) {
    case "incoming_before_compose":
    case "pre_should_respond":
    case "parallel_with_should_respond":
    case "outgoing_before_deliver":
      return ctx.roomId;
    case "compose_state_providers":
      return ctx.message.roomId;
    case "pre_model":
    case "post_model":
      return ctx.roomId ?? DEFAULT_UUID;
    case "after_memory_persisted":
      return ctx.memory.roomId;
    case "model_stream_chunk":
    case "model_stream_end":
      return ctx.roomId;
    default: {
      const _exhaustive = ctx;
      return DEFAULT_UUID;
    }
  }
}
function sortPipelineHooksByPosition(hooks) {
  return [...hooks].sort((a, b) => (a.position || 0) - (b.position || 0) || a.id.localeCompare(b.id));
}
function resolvePipelineHookSpec(spec) {
  const phase = spec.phase;
  return {
    id: spec.id,
    phase,
    position: spec.position ?? 0,
    schedule: spec.schedule ?? defaultPipelineHookSchedule(phase),
    mutatesPrimary: spec.mutatesPrimary ?? defaultPipelineHookMutatesPrimary(phase),
    handler: spec.handler
  };
}
function incomingPipelineHookContext(message, correlation) {
  return withPipelinePhase("incoming_before_compose", {
    message,
    ...correlation
  });
}
function composeStateProvidersPipelineHookContext(fields) {
  return withPipelinePhase("compose_state_providers", fields);
}
function preShouldRespondPipelineHookContext(message, fields) {
  return withPipelinePhase("pre_should_respond", {
    message,
    ...fields
  });
}
function parallelWithShouldRespondPipelineHookContext(fields) {
  return withPipelinePhase("parallel_with_should_respond", fields);
}
function outgoingPipelineHookContext(content, ctx) {
  return withPipelinePhase("outgoing_before_deliver", {
    content,
    source: ctx.source,
    roomId: ctx.roomId,
    message: ctx.message,
    actionName: ctx.actionName,
    responseId: ctx.responseId,
    streaming: ctx.streaming
  });
}
function preModelPipelineHookContext(fields) {
  return withPipelinePhase("pre_model", fields);
}
function postModelPipelineHookContext(fields) {
  return withPipelinePhase("post_model", fields);
}
function afterMemoryPersistedPipelineHookContext(memory, tableName, memoryId) {
  return withPipelinePhase("after_memory_persisted", {
    memory: { ...memory, id: memoryId },
    tableName,
    memoryId
  });
}
function modelStreamChunkPipelineHookContext(fields) {
  return withPipelinePhase("model_stream_chunk", fields);
}
function modelStreamEndPipelineHookContext(fields) {
  return withPipelinePhase("model_stream_end", fields);
}
var PIPELINE_HOOK_DEBUG_LOG_MS = 100, PIPELINE_HOOK_WARN_MS = 250, PIPELINE_HOOK_ERROR_LOG_MS = 2000, PIPELINE_PHASE_CONCURRENT_DEFAULT, PIPELINE_PHASE_MUTATES_PRIMARY_DEFAULT;
var init_pipeline_hooks = __esm(() => {
  init_primitives();
  PIPELINE_PHASE_CONCURRENT_DEFAULT = new Set([
    "parallel_with_should_respond",
    "model_stream_chunk"
  ]);
  PIPELINE_PHASE_MUTATES_PRIMARY_DEFAULT = new Set([
    "incoming_before_compose",
    "compose_state_providers",
    "outgoing_before_deliver",
    "pre_model",
    "post_model"
  ]);
});

// src/types/plugin.ts
function assertPublicRouteIntent(route, source = "plugin") {
  if (route.public !== true)
    return;
  const reason = route.publicReason;
  if (typeof reason !== "string" || reason.trim().length === 0) {
    throw new Error(`[RouteAuth] Public route ${source}:${route.type} ${route.path} must declare publicReason`);
  }
  if (PUBLIC_WRITE_METHODS.has(route.type)) {
    const publicWrite = route.publicWrite;
    if (typeof publicWrite !== "string" || publicWrite.trim().length === 0) {
      throw new Error(`[RouteAuth] Public ${route.type} route ${source}:${route.path} is unauthenticated by the central gate; a write-method public route must declare publicWrite naming its out-of-band auth (signature, capability token, …). Make it GET, gate it, or declare publicWrite.`);
    }
  }
}
function dedupeModalities(mods) {
  const seen = new Set(mods);
  return MODALITY_ORDER.filter((m) => seen.has(m));
}
function getViewModalities(view) {
  if (view.modalities && view.modalities.length > 0) {
    return dedupeModalities(view.modalities);
  }
  return [view.viewType ?? "gui"];
}
function collapseViewDeclarations(views) {
  const order = [];
  const byId = new Map;
  for (const view of views) {
    const mods = getViewModalities(view);
    const existing = byId.get(view.id);
    if (!existing) {
      order.push(view.id);
      byId.set(view.id, { ...view, modalities: mods });
      continue;
    }
    const merged = dedupeModalities([...existing.modalities, ...mods]);
    const isGui = (view.viewType ?? "gui") === "gui";
    const baseWasGui = (existing.viewType ?? "gui") === "gui";
    const base = isGui && !baseWasGui ? view : existing;
    byId.set(view.id, { ...base, modalities: merged });
  }
  return order.map((id) => byId.get(id));
}
var PUBLIC_WRITE_METHODS, PLUGIN_WIDGET_SLOTS, MODALITY_ORDER, PermissionNarrowedRejection;
var init_plugin = __esm(() => {
  PUBLIC_WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
  PLUGIN_WIDGET_SLOTS = [
    "chat-sidebar",
    "character",
    "nav-page",
    "home"
  ];
  MODALITY_ORDER = ["gui", "xr", "tui"];
  PermissionNarrowedRejection = class PermissionNarrowedRejection extends Error {
    capability;
    requested;
    granted;
    constructor(message, capability, requested, granted) {
      super(message);
      this.capability = capability;
      this.requested = requested;
      this.granted = granted;
      this.name = "PermissionNarrowedRejection";
    }
  };
});
// src/types/prompt-batcher.ts
var BatcherDisposedError;
var init_prompt_batcher = __esm(() => {
  BatcherDisposedError = class BatcherDisposedError extends Error {
    constructor() {
      super("PromptBatcher has been disposed");
      this.name = "BatcherDisposedError";
    }
  };
});
// src/types/prompt-optimization-trace.ts
var DEFAULT_SIGNAL_WEIGHTS;
var init_prompt_optimization_trace = __esm(() => {
  DEFAULT_SIGNAL_WEIGHTS = {
    "dpe:parseSuccess": 3,
    "dpe:schemaValid": 2,
    "dpe:requiredFieldsPresent": 2,
    "dpe:validationCodesMatched": 1,
    "dpe:retriesUsed": 1,
    "dpe:tokenEfficiency": 0.5,
    "evaluator:*": 1.5,
    "action:actionSuccess": 2,
    "action:actionFailure": 2,
    "neuro:reaction_positive": 1,
    "neuro:reaction_negative": 1.5,
    "neuro:reaction_neutral": 0.3,
    "neuro:user_correction": 2,
    "neuro:conversation_continued": 0.5,
    "neuro:response_latency": 0.3,
    "neuro:length_appropriateness": 0.3,
    "neuro:evaluator_agreement": 1
  };
});

// src/types/prompt-optimization-score-card.ts
class ScoreCard {
  _signals = [];
  _weightOverrides;
  constructor(weightOverrides) {
    this._weightOverrides = weightOverrides;
  }
  add(signal) {
    if (signal && typeof signal.value === "number") {
      this._signals.push(signal);
    }
  }
  addAll(signals) {
    if (!Array.isArray(signals))
      return;
    for (const s of signals)
      this.add(s);
  }
  get signals() {
    return this._signals;
  }
  bySource(source) {
    return this._signals.filter((s) => s.source === source);
  }
  byKind(kind) {
    return this._signals.filter((s) => s.kind === kind);
  }
  composite(weightOverrides) {
    if (this._signals.length === 0)
      return 0;
    const overrides = this._weightOverrides || weightOverrides ? { ...this._weightOverrides, ...weightOverrides } : undefined;
    let weightedSum = 0;
    let totalWeight = 0;
    for (const signal of this._signals) {
      const val = signal.value;
      if (typeof val !== "number" || Number.isNaN(val))
        continue;
      const key = `${signal.source}:${signal.kind}`;
      const wildcardKey = `${signal.source}:*`;
      const weight = signal.weight ?? overrides?.[key] ?? DEFAULT_SIGNAL_WEIGHTS[key] ?? DEFAULT_SIGNAL_WEIGHTS[wildcardKey] ?? 1;
      weightedSum += val * weight;
      totalWeight += weight;
    }
    return totalWeight === 0 ? 0 : weightedSum / totalWeight;
  }
  toJSON() {
    return {
      signals: [...this._signals],
      compositeScore: this.composite()
    };
  }
  static fromJSON(data2, weightOverrides) {
    const card = new ScoreCard(weightOverrides);
    if (data2 && Array.isArray(data2.signals)) {
      card.addAll(data2.signals);
    }
    return card;
  }
}
var init_prompt_optimization_score_card = __esm(() => {
  init_prompt_optimization_trace();
});
// src/types/search.ts
var SearchCategoryRegistryError;
var init_search = __esm(() => {
  SearchCategoryRegistryError = class SearchCategoryRegistryError extends Error {
    code;
    category;
    constructor(code, category, message) {
      super(message);
      this.name = "SearchCategoryRegistryError";
      this.code = code;
      this.category = category;
    }
  };
});

// src/types/runtime.ts
var CANONICAL_MESSAGE_TARGET_KINDS, ConnectorAccountPurpose, ConnectorAccountRole, ConnectorAuthMethod, ConnectorAccountHealth;
var init_runtime = __esm(() => {
  init_search();
  CANONICAL_MESSAGE_TARGET_KINDS = [
    "room",
    "channel",
    "thread",
    "user",
    "contact",
    "group",
    "server",
    "email",
    "phone"
  ];
  ConnectorAccountPurpose = {
    MESSAGING: "messaging",
    POSTING: "posting",
    READING: "reading",
    ADMIN: "admin",
    AUTOMATION: "automation"
  };
  ConnectorAccountRole = {
    OWNER: "OWNER",
    AGENT: "AGENT",
    TEAM: "TEAM"
  };
  ConnectorAuthMethod = {
    OAUTH: "OAUTH",
    API_KEY: "API_KEY",
    BOT_TOKEN: "BOT_TOKEN",
    WEBHOOK: "WEBHOOK",
    SESSION: "SESSION",
    NONE: "NONE"
  };
  ConnectorAccountHealth = {
    UNKNOWN: "UNKNOWN",
    HEALTHY: "HEALTHY",
    DEGRADED: "DEGRADED",
    REAUTH_REQUIRED: "REAUTH_REQUIRED",
    DISABLED: "DISABLED",
    ERROR: "ERROR"
  };
});
// src/types/schema-builder.ts
function snakeToCamel(s) {
  return s.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// src/types/service-interfaces.ts
var IControlTransportService, ITokenDataService, IWalletService, ILpService, ITranscriptionService, IVideoService, IMediaGenerationService, IScreenCaptureService, IBrowserService, IPdfService, IFileStorageService, IWebSearchService, IEmailService, IMessagingService, IPostService;
var init_service_interfaces = __esm(() => {
  init_service();
  IControlTransportService = class IControlTransportService extends Service {
    static serviceType = ServiceType.CONTROL_TRANSPORT;
    capabilityDescription = "Dispatches backend control messages to interactive clients.";
  };
  ITokenDataService = class ITokenDataService extends Service {
    static serviceType = ServiceType.TOKEN_DATA;
    static allowsMultiple = true;
    capabilityDescription = "Provides standardized access to token market data.";
  };
  IWalletService = class IWalletService extends Service {
    static serviceType = ServiceType.WALLET;
    static allowsMultiple = true;
    capabilityDescription = "Provides standardized access to wallet balances and portfolios.";
  };
  ILpService = class ILpService extends Service {
    static serviceType = "lp_pool";
    static allowsMultiple = true;
    capabilityDescription = "Provides standardized access to DEX liquidity pools.";
  };
  ITranscriptionService = class ITranscriptionService extends Service {
    static serviceType = ServiceType.TRANSCRIPTION;
    capabilityDescription = "Audio transcription and speech processing capabilities";
  };
  IVideoService = class IVideoService extends Service {
    static serviceType = ServiceType.VIDEO;
    capabilityDescription = "Video download, processing, and conversion capabilities";
  };
  IMediaGenerationService = class IMediaGenerationService extends Service {
    static serviceType = ServiceType.MEDIA_GENERATION;
    capabilityDescription = "Generates image, video, and audio media from prompts.";
    canGenerateMedia(_request) {
      return true;
    }
  };
  IScreenCaptureService = class IScreenCaptureService extends Service {
    static serviceType = ServiceType.SCREEN_CAPTURE;
    capabilityDescription = "Desktop screen/frame capture for live streaming";
  };
  IBrowserService = class IBrowserService extends Service {
    static serviceType = ServiceType.BROWSER;
    capabilityDescription = "Web browser automation and scraping capabilities";
  };
  IPdfService = class IPdfService extends Service {
    static serviceType = ServiceType.PDF;
    capabilityDescription = "PDF processing, extraction, and generation capabilities";
  };
  IFileStorageService = class IFileStorageService extends Service {
    static serviceType = ServiceType.REMOTE_FILES;
    capabilityDescription = "Content-addressed file storage: store, serve, list, and delete attachment bytes";
  };
  IWebSearchService = class IWebSearchService extends Service {
    static serviceType = ServiceType.WEB_SEARCH;
    capabilityDescription = "Web search and content discovery capabilities";
  };
  IEmailService = class IEmailService extends Service {
    static serviceType = ServiceType.EMAIL;
    capabilityDescription = "Email sending, receiving, and management capabilities";
  };
  IMessagingService = class IMessagingService extends Service {
    static serviceType = ServiceType.MESSAGE;
    capabilityDescription = "Platform messaging and channel management capabilities";
  };
  IPostService = class IPostService extends Service {
    static serviceType = ServiceType.POST;
    capabilityDescription = "Social media posting and content management capabilities";
  };
});
// src/types/setup.ts
function getStepIndex(step) {
  return SETUP_STEP_ORDER.indexOf(step);
}
function getNextStep(currentStep) {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex === -1 || currentIndex >= SETUP_STEP_ORDER.length - 1) {
    return null;
  }
  return SETUP_STEP_ORDER[currentIndex + 1];
}
function getPreviousStep(currentStep) {
  const currentIndex = getStepIndex(currentStep);
  if (currentIndex <= 0) {
    return null;
  }
  return SETUP_STEP_ORDER[currentIndex - 1];
}
function isStepCompleted(context, step) {
  return context.completedSteps.includes(step);
}
function calculateProgress(context) {
  const totalSteps = SETUP_STEP_ORDER.length - 1;
  const completedCount = context.completedSteps.filter((s) => s !== SetupStep.COMPLETE).length;
  return Math.round(completedCount / totalSteps * 100);
}
var SetupStep, SETUP_STEP_ORDER, SETUP_STEP_LABELS, SETUP_STEP_DESCRIPTIONS;
var init_setup = __esm(() => {
  SetupStep = {
    WELCOME: "WELCOME",
    RISK_ACK: "RISK_ACK",
    AUTH: "AUTH",
    CHANNELS: "CHANNELS",
    SKILLS: "SKILLS",
    COMPLETE: "COMPLETE"
  };
  SETUP_STEP_ORDER = [
    SetupStep.WELCOME,
    SetupStep.RISK_ACK,
    SetupStep.AUTH,
    SetupStep.CHANNELS,
    SetupStep.SKILLS,
    SetupStep.COMPLETE
  ];
  SETUP_STEP_LABELS = {
    [SetupStep.WELCOME]: "Welcome",
    [SetupStep.RISK_ACK]: "Risk Acknowledgement",
    [SetupStep.AUTH]: "Authentication",
    [SetupStep.CHANNELS]: "Channels",
    [SetupStep.SKILLS]: "Skills",
    [SetupStep.COMPLETE]: "Complete"
  };
  SETUP_STEP_DESCRIPTIONS = {
    [SetupStep.WELCOME]: "Introduction to the setup process",
    [SetupStep.RISK_ACK]: "Review and acknowledge security risks and responsibilities",
    [SetupStep.AUTH]: "Configure authentication with AI model providers",
    [SetupStep.CHANNELS]: "Set up messaging channels (Discord, Telegram, etc.)",
    [SetupStep.SKILLS]: "Configure agent skills and capabilities",
    [SetupStep.COMPLETE]: "Setup complete - agent is ready to use"
  };
});
// src/types/surface-manifest.ts
function dedupeCapabilities(caps) {
  return new Set(caps);
}
function resolveSurfaceManifest(decl) {
  const surface = decl?.surface;
  const capabilities = dedupeCapabilities(surface?.capabilities);
  const declaredBackground = surface?.background ?? decl?.backgroundPolicy ?? "opaque";
  const background = declaredBackground === "shared" && capabilities.has("wallpaper") ? "shared" : "opaque";
  return {
    background,
    header: surface?.header ?? decl?.headerPolicy ?? "normal",
    isolation: surface?.isolation ?? "in-process",
    lifecycle: surface?.lifecycle ?? "ephemeral",
    capabilities
  };
}
function resolveSurfaceBackgroundPolicy(decl) {
  return resolveSurfaceManifest(decl).background;
}
function surfaceGrants(manifest, capability) {
  return manifest.capabilities.has(capability);
}
var SURFACE_ISOLATION_LEVELS, SURFACE_CAPABILITIES, IMMERSIVE_WALLPAPER_SURFACE;
var init_surface_manifest = __esm(() => {
  SURFACE_ISOLATION_LEVELS = [
    "in-process",
    "sandboxed-iframe",
    "native-webview",
    "immersive"
  ];
  SURFACE_CAPABILITIES = [
    "wallpaper",
    "background:apply",
    "navigate",
    "storage",
    "agent-surface"
  ];
  IMMERSIVE_WALLPAPER_SURFACE = {
    background: "shared",
    header: "immersive",
    isolation: "immersive",
    capabilities: ["wallpaper", "background:apply"]
  };
});

// src/types/swarm-coordinator.ts
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readStr(record, key) {
  const value = record[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
function toSwarmActivity(event) {
  const data2 = isRecord(event.data) ? event.data : {};
  const base = {
    sessionId: event.sessionId,
    seq: event.seq ?? event.timestamp,
    timestamp: event.timestamp,
    ...event.taskId ? { taskId: event.taskId } : {},
    ...event.parentSessionId ? { parentSessionId: event.parentSessionId } : {}
  };
  switch (event.type) {
    case "message": {
      const text = readStr(data2, "text");
      return text ? { ...base, kind: "message", text } : null;
    }
    case "reasoning": {
      const text = readStr(data2, "text");
      return text ? { ...base, kind: "reasoning", text } : null;
    }
    case "plan": {
      const raw2 = data2.entries;
      if (!Array.isArray(raw2))
        return null;
      const entries = raw2.filter(isRecord).map((entry) => ({
        content: readStr(entry, "content") ?? "",
        status: readStr(entry, "status") ?? "pending",
        ...readStr(entry, "priority") ? { priority: readStr(entry, "priority") } : {}
      })).filter((entry) => entry.content.length > 0);
      return entries.length > 0 ? { ...base, kind: "plan", entries } : null;
    }
    case "tool_running": {
      const call = isRecord(data2.toolCall) ? data2.toolCall : data2;
      const rawStatus = readStr(call, "status") ?? "running";
      const tool = {
        status: TOOL_STATUS[rawStatus] ?? "running",
        ...readStr(call, "id") ? { id: readStr(call, "id") } : {},
        ...readStr(call, "title") ? { title: readStr(call, "title") } : {},
        ...readStr(call, "kind") ? { kind: readStr(call, "kind") } : {},
        ...readStr(call, "output") ? { output: readStr(call, "output") } : {},
        ...isRecord(call.rawInput) ? { rawInput: call.rawInput } : {},
        ...Array.isArray(call.locations) ? {
          locations: call.locations.filter(isRecord)
        } : {}
      };
      return { ...base, kind: "tool", tool };
    }
    default: {
      const status = LIFECYCLE_STATUS[event.type];
      if (!status)
        return null;
      return {
        ...base,
        kind: "lifecycle",
        event: event.type,
        status,
        ...readStr(data2, "label") ? { label: readStr(data2, "label") } : {},
        ...readStr(data2, "text") ?? readStr(data2, "message") ? { text: readStr(data2, "text") ?? readStr(data2, "message") } : {}
      };
    }
  }
}
function getSwarmCoordinatorService(runtime) {
  if (!runtime)
    return null;
  return runtime.getService(SWARM_COORDINATOR_SERVICE_TYPE) ?? null;
}
var SWARM_COORDINATOR_SERVICE_TYPE = "SWARM_COORDINATOR", LIFECYCLE_STATUS, TOOL_STATUS;
var init_swarm_coordinator = __esm(() => {
  LIFECYCLE_STATUS = {
    ready: "idle",
    task_registered: "running",
    reconnected: "running",
    task_complete: "success",
    stopped: "idle",
    error: "failure",
    blocked: "waiting",
    login_required: "waiting",
    escalation: "waiting"
  };
  TOOL_STATUS = {
    pending: "running",
    running: "running",
    in_progress: "running",
    completed: "success",
    failed: "failure",
    error: "failure",
    cancelled: "idle"
  };
});

// src/types/task.ts
var TaskStatus;
var init_task = __esm(() => {
  TaskStatus = {
    UNSPECIFIED: "UNSPECIFIED",
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    CANCELLED: "CANCELLED"
  };
});

// src/types/tee.ts
var TEEMode, TeeType;
var init_tee = __esm(() => {
  TEEMode = {
    UNSPECIFIED: "UNSPECIFIED",
    OFF: "OFF",
    LOCAL: "LOCAL",
    DOCKER: "DOCKER",
    PRODUCTION: "PRODUCTION"
  };
  TeeType = {
    UNSPECIFIED: "UNSPECIFIED",
    TDX_DSTACK: "TDX_DSTACK"
  };
});

// src/types/tools.ts
function getToolGroupDefinition(groupName) {
  return TOOL_GROUP_DEFINITIONS[normalizeToolName(groupName)];
}
function getToolGroupRiskTags(groupName) {
  return [...getToolGroupDefinition(groupName)?.riskTags ?? []];
}
function normalizeToolName(name) {
  return name.trim().toLowerCase();
}
function normalizeToolList(list) {
  if (!list) {
    return [];
  }
  return list.map(normalizeToolName).filter(Boolean);
}
function expandToolGroups(list) {
  const normalized = normalizeToolList(list);
  const expanded = [];
  for (const value of normalized) {
    const group = TOOL_GROUPS[value];
    if (group) {
      expanded.push(...group);
      continue;
    }
    expanded.push(value);
  }
  return Array.from(new Set(expanded));
}
function resolveToolProfilePolicy(profile) {
  if (!profile) {
    return;
  }
  const resolved = TOOL_PROFILES[profile];
  if (!resolved) {
    return;
  }
  if (!resolved.allow && !resolved.deny) {
    return;
  }
  return {
    allow: resolved.allow ? [...resolved.allow] : undefined,
    deny: resolved.deny ? [...resolved.deny] : undefined
  };
}
function collectExplicitAllowlist(policies) {
  const entries = [];
  for (const policy of policies) {
    if (!policy?.allow) {
      continue;
    }
    for (const value of policy.allow) {
      if (typeof value !== "string") {
        continue;
      }
      const trimmed = value.trim();
      if (trimmed) {
        entries.push(trimmed);
      }
    }
  }
  return entries;
}
function buildPluginToolGroups(params) {
  const all = [];
  const byPlugin = new Map;
  for (const tool of params.tools) {
    const meta = params.toolMeta(tool);
    if (!meta) {
      continue;
    }
    const name = normalizeToolName(tool.name);
    all.push(name);
    const pluginId = meta.pluginId.toLowerCase();
    const list = byPlugin.get(pluginId) ?? [];
    list.push(name);
    byPlugin.set(pluginId, list);
  }
  return { all, byPlugin };
}
function expandPluginGroups(list, groups) {
  if (!list || list.length === 0) {
    return list;
  }
  const expanded = [];
  for (const entry of list) {
    const normalized = normalizeToolName(entry);
    if (normalized === "group:plugins") {
      if (groups.all.length > 0) {
        expanded.push(...groups.all);
      } else {
        expanded.push(normalized);
      }
      continue;
    }
    const tools = groups.byPlugin.get(normalized);
    if (tools && tools.length > 0) {
      expanded.push(...tools);
      continue;
    }
    expanded.push(normalized);
  }
  return Array.from(new Set(expanded));
}
function expandPolicyWithPluginGroups(policy, groups) {
  if (!policy) {
    return;
  }
  return {
    allow: expandPluginGroups(policy.allow, groups),
    deny: expandPluginGroups(policy.deny, groups)
  };
}
function stripPluginOnlyAllowlist(policy, groups, coreTools) {
  if (!policy?.allow || policy.allow.length === 0) {
    return { policy, unknownAllowlist: [], strippedAllowlist: false };
  }
  const normalized = normalizeToolList(policy.allow);
  if (normalized.length === 0) {
    return { policy, unknownAllowlist: [], strippedAllowlist: false };
  }
  const pluginIds = new Set(groups.byPlugin.keys());
  const pluginTools = new Set(groups.all);
  const unknownAllowlist = [];
  let hasCoreEntry = false;
  for (const entry of normalized) {
    if (entry === "*") {
      hasCoreEntry = true;
      continue;
    }
    const isPluginEntry = entry === "group:plugins" || pluginIds.has(entry) || pluginTools.has(entry);
    const expanded = expandToolGroups([entry]);
    const isCoreEntry = expanded.some((tool) => coreTools.has(tool));
    if (isCoreEntry) {
      hasCoreEntry = true;
    }
    if (!isCoreEntry && !isPluginEntry) {
      unknownAllowlist.push(entry);
    }
  }
  const strippedAllowlist = !hasCoreEntry;
  return {
    policy: strippedAllowlist ? { ...policy, allow: undefined } : policy,
    unknownAllowlist: Array.from(new Set(unknownAllowlist)),
    strippedAllowlist
  };
}
function mergeToolPolicies(...policies) {
  const result = {};
  for (const policy of policies) {
    if (!policy)
      continue;
    if (policy.allow !== undefined) {
      result.allow = [...policy.allow || []];
    }
    if (policy.deny !== undefined) {
      result.deny = [...result.deny || [], ...policy.deny || []];
    }
  }
  if (result.allow) {
    result.allow = Array.from(new Set(result.allow));
  }
  if (result.deny) {
    result.deny = Array.from(new Set(result.deny));
  }
  return result;
}
function isToolAllowedByPolicy(toolName, policy) {
  const normalizedName = normalizeToolName(toolName);
  if (!policy) {
    return true;
  }
  if (policy.deny && policy.deny.length > 0) {
    const expandedDeny = expandToolGroups(policy.deny);
    if (expandedDeny.includes(normalizedName)) {
      return false;
    }
  }
  if (policy.allow && policy.allow.length > 0) {
    const expandedAllow = expandToolGroups(policy.allow);
    if (expandedAllow.includes("*")) {
      return true;
    }
    return expandedAllow.includes(normalizedName);
  }
  return true;
}
var TOOL_GROUP_DEFINITIONS, TOOL_GROUPS, TOOL_PROFILES;
var init_tools2 = __esm(() => {
  TOOL_GROUP_DEFINITIONS = {
    "group:memory": {
      tools: ["read_attachment"],
      riskTags: ["read_only", "memory_access"],
      description: "Read attachment and memory-adjacent context."
    },
    "group:web": {
      tools: ["web_search", "web_fetch"],
      riskTags: ["read_only", "network_access"],
      description: "Fetch or search external web content."
    },
    "group:fs": {
      tools: ["read", "read_file", "write", "edit", "apply_patch"],
      riskTags: ["read_only", "workspace_write"],
      description: "Read and mutate workspace files."
    },
    "group:runtime": {
      tools: ["exec", "process"],
      riskTags: ["host_execution", "external_side_effect"],
      description: "Run commands or inspect host runtime processes."
    },
    "group:sessions": {
      tools: [
        "sessions_list",
        "sessions_history",
        "sessions_send",
        "sessions_spawn",
        "session_status"
      ],
      riskTags: ["session_control", "external_side_effect"],
      description: "Inspect, spawn, or send input to interactive sessions."
    },
    "group:ui": {
      tools: ["browser", "canvas"],
      riskTags: ["ui_control", "external_side_effect"],
      description: "Control browser or canvas UI surfaces."
    },
    "group:automation": {
      tools: ["cron", "gateway"],
      riskTags: ["scheduled_execution", "external_side_effect"],
      description: "Create scheduled or gateway-triggered automation."
    },
    "group:messaging": {
      tools: ["message"],
      riskTags: ["messaging_side_effect", "external_side_effect"],
      description: "Send messages through connected messaging surfaces."
    },
    "group:nodes": {
      tools: ["nodes"],
      riskTags: ["device_control", "external_side_effect"],
      description: "Interact with node or device-level controls."
    },
    "group:all": {
      tools: [
        "browser",
        "canvas",
        "nodes",
        "cron",
        "message",
        "gateway",
        "agents_list",
        "sessions_list",
        "sessions_history",
        "sessions_send",
        "sessions_spawn",
        "session_status",
        "read_attachment",
        "read_file",
        "web_search",
        "web_fetch",
        "image",
        "read",
        "write",
        "edit",
        "apply_patch",
        "exec",
        "process"
      ],
      riskTags: [
        "aggregate",
        "read_only",
        "memory_access",
        "network_access",
        "workspace_write",
        "host_execution",
        "session_control",
        "ui_control",
        "scheduled_execution",
        "external_side_effect",
        "messaging_side_effect",
        "device_control"
      ],
      description: "All native core tools, excluding provider plugin tools."
    }
  };
  TOOL_GROUPS = Object.fromEntries(Object.entries(TOOL_GROUP_DEFINITIONS).map(([group, definition]) => [
    group,
    definition.tools
  ]));
  TOOL_PROFILES = {
    minimal: {
      allow: ["session_status"]
    },
    coding: {
      allow: [
        "group:fs",
        "group:runtime",
        "group:sessions",
        "group:memory",
        "image"
      ]
    },
    messaging: {
      allow: [
        "group:messaging",
        "sessions_list",
        "sessions_history",
        "sessions_send",
        "session_status"
      ]
    },
    full: {}
  };
});

// src/types/trigger.ts
var TRIGGER_SCHEMA_VERSION = 1;

// src/types/view-kind.ts
function resolveViewKind(decl) {
  if (decl?.viewKind)
    return decl.viewKind;
  if (decl?.developerOnly)
    return "developer";
  return "release";
}
function isViewKindEnabled(kind, enabled) {
  switch (kind) {
    case "system":
    case "release":
      return true;
    case "developer":
      return enabled.developer;
    case "preview":
      return enabled.preview;
    default:
      return false;
  }
}
function isViewVisible(decl, enabled) {
  return isViewKindEnabled(resolveViewKind(decl), enabled);
}
function isAlwaysOnViewKind(kind) {
  return kind === "system" || kind === "release";
}
var VIEW_KINDS, VIEW_KIND_META;
var init_view_kind = __esm(() => {
  VIEW_KINDS = [
    "system",
    "release",
    "developer",
    "preview"
  ];
  VIEW_KIND_META = {
    system: {
      label: "System",
      description: "Core views that are always available.",
      alwaysOn: true
    },
    release: {
      label: "Release",
      description: "Public, production-ready views for everyone.",
      alwaysOn: true
    },
    developer: {
      label: "Developer",
      description: "Developer tooling to verify the app is working — logs, database, trajectories.",
      alwaysOn: false
    },
    preview: {
      label: "Preview",
      description: "Unfinished, alpha, or experimental views still in progress.",
      alwaysOn: false
    }
  };
});

// src/types/index.ts
var init_types4 = __esm(() => {
  init_logger2();
  init_utils();
  init_pending_user_action();
  init_surface_manifest();
  init_view_kind();
  init_agent();
  init_commands();
  init_components();
  init_connector_setup();
  init_database();
  init_environment2();
  init_events();
  init_memory();
  init_message_source();
  init_messaging();
  init_model();
  init_notification();
  init_pairing();
  init_pipeline_hooks();
  init_plugin();
  init_primitives();
  init_prompt_batcher();
  init_prompt_optimization_score_card();
  init_prompt_optimization_trace();
  init_runtime();
  init_service();
  init_service_interfaces();
  init_setup();
  init_swarm_coordinator();
  init_task();
  init_tee();
  init_tools2();
});

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

// src/entities.ts
async function resolveTrustedComponentSourceIds(runtime2, world, components2) {
  const trusted = new Set;
  if (!world)
    return trusted;
  const sourceIds = new Set;
  for (const component of components2) {
    if (component.sourceEntityId) {
      sourceIds.add(component.sourceEntityId);
    }
  }
  if (sourceIds.size === 0)
    return trusted;
  const { resolveEntityRole, isAdminRank } = await Promise.resolve().then(() => (init_roles(), exports_roles));
  const metadata = world.metadata ?? {};
  await Promise.all([...sourceIds].map(async (sourceEntityId) => {
    const role = await resolveEntityRole(runtime2, world, metadata, sourceEntityId);
    if (isAdminRank(role)) {
      trusted.add(sourceEntityId);
    }
  }));
  return trusted;
}
function normalizeEntityMatch(value) {
  if (!isObjectRecord(value))
    return null;
  const name = typeof value.name === "string" ? value.name : undefined;
  const reason = typeof value.reason === "string" ? value.reason : undefined;
  if (!name)
    return null;
  return { name, reason };
}
function normalizeEntityMatches(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeEntityMatch(entry)).filter((entry) => entry !== null);
  }
  if (isObjectRecord(value) && "match" in value) {
    return normalizeEntityMatches(value.match);
  }
  const directMatch = normalizeEntityMatch(value);
  return directMatch ? [directMatch] : [];
}
function parseEntityResolutionResponse(response) {
  if (!response)
    return null;
  let parsedJson = response;
  if (typeof response === "string") {
    const trimmed = response.trim();
    if (!trimmed)
      return null;
    try {
      parsedJson = JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
  if (parsedJson && typeof parsedJson === "object") {
    const obj = parsedJson;
    const type = typeof obj.type === "string" ? obj.type : undefined;
    const entityId = typeof obj.entityId === "string" ? obj.entityId : typeof obj.resolvedId === "string" ? obj.resolvedId : undefined;
    const matches = normalizeEntityMatches(obj.matches);
    if (type || entityId || matches.length > 0) {
      return {
        type,
        entityId: entityId && entityId !== "null" ? entityId : undefined,
        matches: matches.length > 0 ? { match: matches } : undefined
      };
    }
  }
  return null;
}
async function getRecentInteractions(runtime2, sourceEntityId, candidateEntities, roomId, relationships) {
  const results = [];
  const recentMessages = await runtime2.getMemories({
    tableName: "messages",
    roomId,
    limit: 20
  });
  const messageEntityById = new Map;
  for (const recentMessage of recentMessages) {
    if (recentMessage.id && recentMessage.entityId) {
      messageEntityById.set(recentMessage.id, recentMessage.entityId);
    }
  }
  for (const entity of candidateEntities) {
    const interactions2 = [];
    let interactionScore = 0;
    const directReplies = recentMessages.filter((msg) => {
      if (!msg.entityId || !msg.content.inReplyTo) {
        return false;
      }
      const repliedToEntityId = messageEntityById.get(msg.content.inReplyTo);
      return msg.entityId === sourceEntityId && repliedToEntityId === entity.id || msg.entityId === entity.id && repliedToEntityId === sourceEntityId;
    });
    interactions2.push(...directReplies);
    const relationship = relationships.find((rel) => rel.sourceEntityId === sourceEntityId && rel.targetEntityId === entity.id || rel.targetEntityId === sourceEntityId && rel.sourceEntityId === entity.id);
    const relationshipMetadata = relationship?.metadata;
    if (relationshipMetadata?.interactions) {
      interactionScore = relationshipMetadata.interactions;
    }
    interactionScore += directReplies.length;
    const uniqueInteractions = [...new Set(interactions2)];
    results.push({
      entity,
      interactions: uniqueInteractions.slice(-5),
      count: Math.round(interactionScore)
    });
  }
  return results.sort((a, b) => b.count - a.count);
}
async function findEntityByName(runtime2, message, state2) {
  const room = state2.data.room ?? await runtime2.getRoom(message.roomId);
  if (!room) {
    logger.warn({ src: "core:entities", roomId: message.roomId }, "Room not found for entity search");
    return null;
  }
  const world = room.worldId ? await runtime2.getWorld(room.worldId) : null;
  const entitiesInRoom = await runtime2.getEntitiesForRoom(room.id, true);
  const filteredEntities = await Promise.all(entitiesInRoom.map(async (entity) => {
    if (!entity.components)
      return entity;
    const trustedSourceIds = await resolveTrustedComponentSourceIds(runtime2, world, entity.components);
    entity.components = entity.components.filter((component) => {
      if (component.sourceEntityId === message.entityId)
        return true;
      if (component.sourceEntityId && trustedSourceIds.has(component.sourceEntityId)) {
        return true;
      }
      if (component.sourceEntityId === runtime2.agentId)
        return true;
      return false;
    });
    return entity;
  }));
  const relationships = await runtime2.getRelationships({
    entityIds: [message.entityId]
  });
  const relationshipEntities = await Promise.all(relationships.map(async (rel) => {
    const entityId = rel.sourceEntityId === message.entityId ? rel.targetEntityId : rel.sourceEntityId;
    return runtime2.getEntityById(entityId);
  }));
  const allEntities = [
    ...filteredEntities,
    ...relationshipEntities.filter((e) => e !== null)
  ];
  const interactionData = await getRecentInteractions(runtime2, message.entityId, allEntities, room.id, relationships);
  const prompt = composePrompt({
    state: {
      roomName: room.name || room.id,
      worldName: world?.name || "Unknown",
      entitiesInRoom: JSON.stringify(filteredEntities, null, 2),
      entityId: message.entityId,
      senderId: message.entityId
    },
    template: entityResolutionTemplate
  });
  const result = await runtime2.useModel(ModelType.TEXT_SMALL, {
    prompt,
    responseSchema: ENTITY_RESOLUTION_SCHEMA,
    responseFormat: { type: "json_object" }
  });
  const resolution = parseEntityResolutionResponse(result);
  if (!resolution) {
    if (filteredEntities.length === 1) {
      return filteredEntities[0] ?? null;
    }
    logger.warn({ src: "core:entities" }, "Failed to parse entity resolution result");
    return null;
  }
  if (resolution.type === "EXACT_MATCH" && resolution.entityId) {
    const entity = await runtime2.getEntityById(resolution.entityId);
    if (entity) {
      if (entity.components) {
        const trustedSourceIds = await resolveTrustedComponentSourceIds(runtime2, world, entity.components);
        entity.components = entity.components.filter((component) => {
          if (component.sourceEntityId === message.entityId)
            return true;
          if (component.sourceEntityId && trustedSourceIds.has(component.sourceEntityId)) {
            return true;
          }
          if (component.sourceEntityId === runtime2.agentId)
            return true;
          return false;
        });
      }
      return entity;
    }
  }
  let matchesArray = [];
  const parsedResolution = resolution;
  const parsedResolutionMatches = parsedResolution.matches;
  if (parsedResolutionMatches?.match) {
    const matchValue = parsedResolutionMatches.match;
    matchesArray = Array.isArray(matchValue) ? matchValue : [matchValue];
  }
  const normalize = (s) => s.trim().toLowerCase();
  const stripAt = (s) => normalize(s).replace(/^@+/, "");
  const indexedEntities = allEntities.map((entity) => {
    const normalizedNames = new Set;
    const strippedNames = new Set;
    for (const name of entity.names) {
      normalizedNames.add(normalize(name));
      strippedNames.add(stripAt(name));
    }
    const normalizedUsernames = new Set;
    const strippedUsernames = new Set;
    const normalizedHandles = new Set;
    const strippedHandles = new Set;
    const fallbackTokens = [];
    for (const component of entity.components ?? []) {
      const username = typeof component.data?.username === "string" ? component.data.username : undefined;
      if (username) {
        normalizedUsernames.add(normalize(username));
        strippedUsernames.add(stripAt(username));
        fallbackTokens.push(normalize(username));
      }
      const handle = typeof component.data?.handle === "string" ? component.data.handle : undefined;
      if (handle) {
        const normalizedHandle = normalize(handle);
        normalizedHandles.add(normalizedHandle);
        strippedHandles.add(stripAt(handle));
        fallbackTokens.push(normalizedHandle);
        const handleNoAt = handle.replace(/^@+/, "");
        if (handleNoAt) {
          fallbackTokens.push(normalize(handleNoAt));
        }
      }
    }
    return {
      entity,
      normalizedNames,
      strippedNames,
      normalizedUsernames,
      strippedUsernames,
      normalizedHandles,
      strippedHandles,
      fallbackTokens
    };
  });
  const firstMatch = matchesArray[0];
  if (matchesArray.length > 0 && firstMatch && firstMatch.name) {
    const matchName = normalize(firstMatch.name);
    const matchKey = stripAt(firstMatch.name);
    const matchingEntity = indexedEntities.find((entry) => {
      if (entry.strippedNames.has(matchKey) || entry.normalizedNames.has(matchName) || entry.strippedUsernames.has(matchKey) || entry.normalizedUsernames.has(matchName) || entry.strippedHandles.has(matchKey) || entry.normalizedHandles.has(matchName)) {
        return true;
      }
      return false;
    })?.entity;
    if (matchingEntity) {
      if (resolution.type === "RELATIONSHIP_MATCH") {
        const interactionInfo = interactionData.find((d) => d.entity.id === matchingEntity.id);
        if (interactionInfo && interactionInfo.count > 0) {
          return matchingEntity;
        }
      } else {
        return matchingEntity;
      }
    }
  }
  const resultLower = JSON.stringify(result).toLowerCase();
  const fallbackEntity = indexedEntities.find((entry) => entry.fallbackTokens.some((token) => resultLower.includes(token)))?.entity;
  if (fallbackEntity) {
    return fallbackEntity;
  }
  if ((resolution.type === "USERNAME_MATCH" || resolution.type === "NAME_MATCH") && filteredEntities.length === 1) {
    return filteredEntities[0] ?? null;
  }
  if (allEntities.length === 1) {
    return allEntities[0] ?? null;
  }
  return null;
}
async function getEntityDetails({
  runtime: runtime2,
  roomId
}) {
  const runtimeCache = entityDetailsCache.get(runtime2) ?? new Map;
  entityDetailsCache.set(runtime2, runtimeCache);
  const cacheKey = String(roomId);
  const cachedEntry = runtimeCache.get(cacheKey);
  if (cachedEntry && cachedEntry.expiresAt > Date.now()) {
    return cachedEntry.promise;
  }
  const pendingPromise = (async () => {
    const [room, roomEntities] = await Promise.all([
      runtime2.getRoom(roomId),
      runtime2.getEntitiesForRoom(roomId, true)
    ]);
    const uniqueEntities = new Map;
    for (const entity of roomEntities) {
      const entityId = entity.id;
      if (!entityId || uniqueEntities.has(entityId))
        continue;
      const allData = {};
      for (const component of entity.components || []) {
        Object.assign(allData, component.data);
      }
      const mergedData = {};
      for (const [key, value] of Object.entries(allData)) {
        if (!mergedData[key]) {
          mergedData[key] = value;
          continue;
        }
        if (Array.isArray(mergedData[key]) && Array.isArray(value)) {
          mergedData[key] = [...new Set([...mergedData[key], ...value])];
        } else if (typeof mergedData[key] === "object" && typeof value === "object") {
          mergedData[key] = { ...mergedData[key], ...value };
        }
      }
      const getEntityNameFromMetadata = (source) => {
        const sourceMetadata = entity.metadata?.[source];
        if (sourceMetadata && typeof sourceMetadata === "object" && sourceMetadata !== null) {
          const metadataObj = sourceMetadata;
          if ("name" in metadataObj && typeof metadataObj.name === "string") {
            return metadataObj.name;
          }
        }
        return;
      };
      uniqueEntities.set(entityId, {
        id: entityId,
        name: room?.source ? getEntityNameFromMetadata(String(room.source)) || entity.names[0] : entity.names[0],
        names: entity.names,
        data: stableStringify({ ...mergedData, ...entity.metadata })
      });
    }
    return Array.from(uniqueEntities.values()).sort((left, right) => {
      const leftName = left.name ?? left.names[0] ?? "";
      const rightName = right.name ?? right.names[0] ?? "";
      return leftName.localeCompare(rightName) || String(left.id ?? "").localeCompare(String(right.id ?? ""));
    });
  })();
  runtimeCache.set(cacheKey, {
    expiresAt: Date.now() + ENTITY_DETAILS_CACHE_TTL_MS,
    promise: pendingPromise
  });
  try {
    return await pendingPromise;
  } catch (error) {
    runtimeCache.delete(cacheKey);
    throw error;
  }
}
function formatEntityNames(names) {
  const uniqueNames = [...new Set(names.filter(Boolean))];
  const visibleNames = uniqueNames.slice(0, MAX_ENTITY_DISPLAY_NAMES);
  const omittedCount = uniqueNames.length - visibleNames.length;
  const renderedNames = visibleNames.length > 0 ? `"${visibleNames.join('" aka "')}"` : '"(unnamed)"';
  return omittedCount > 0 ? `${renderedNames} (+${omittedCount} aliases omitted)` : renderedNames;
}
function truncateEntityMetadata(metadata) {
  const rendered = stableStringify(metadata);
  if (rendered.length <= MAX_ENTITY_METADATA_CHARS) {
    return rendered;
  }
  return `${rendered.slice(0, MAX_ENTITY_METADATA_CHARS)}... (truncated)`;
}
function formatEntities({ entities }) {
  const sortedEntities = [...entities].sort((left, right) => {
    const leftName = left.names[0] ?? "";
    const rightName = right.names[0] ?? "";
    return leftName.localeCompare(rightName) || String(left.id ?? "").localeCompare(String(right.id ?? ""));
  });
  const visibleEntities = sortedEntities.slice(0, MAX_ENTITY_DISPLAY_COUNT);
  const omittedEntityCount = sortedEntities.length - visibleEntities.length;
  const entityStrings = visibleEntities.map((entity) => {
    const header = `${formatEntityNames(entity.names)}
ID: ${entity.id}${entity.metadata && Object.keys(entity.metadata).length > 0 ? `
Data: ${truncateEntityMetadata(entity.metadata)}
` : `
`}`;
    return header;
  });
  if (omittedEntityCount > 0) {
    entityStrings.push(`... (+${omittedEntityCount} entities omitted)`);
  }
  return entityStrings.join(`
`);
}
var MAX_ENTITY_DISPLAY_NAMES = 8, MAX_ENTITY_DISPLAY_COUNT = 10, MAX_ENTITY_METADATA_CHARS = 2000, ENTITY_DETAILS_CACHE_TTL_MS = 1000, entityDetailsCache, ENTITY_RESOLUTION_SCHEMA, entityResolutionTemplate = `# Task: Resolve Entity Name
Message Sender: {{senderName}} (ID: {{senderId}})
Agent: {{agentName}} (ID: {{agentId}})

# Entities in Room:
{{#if entitiesInRoom}}
{{entitiesInRoom}}
{{/if}}

{{recentMessages}}

# Instructions:
1. Analyze the context to identify which entity is being referenced
2. Consider special references like "me" (the message sender) or "you" (agent the message is directed to)
3. Look for usernames/handles in standard formats (e.g. @username, user#1234)
4. Consider context from recent messages for pronouns and references
5. If multiple matches exist, use context to disambiguate
6. Consider recent interactions and relationship strength when resolving ambiguity

Return a JSON object with:
- entityId: exact ID if known, otherwise null
- type: EXACT_MATCH | USERNAME_MATCH | NAME_MATCH | RELATIONSHIP_MATCH | AMBIGUOUS | UNKNOWN
- matches: array of { "name": "matched-name", "reason": "why this entity matches" }

IMPORTANT: Your response must ONLY contain the JSON object above. Do not include any text, thinking, or reasoning before or after it.`, createUniqueUuid = (runtime2, baseUserId) => {
  if (baseUserId === runtime2.agentId) {
    return runtime2.agentId;
  }
  const combinedString = `${baseUserId}:${runtime2.agentId}`;
  return stringToUuid(combinedString);
};
var init_entities = __esm(() => {
  init_logger2();
  init_types4();
  init_utils();
  init_deterministic();
  entityDetailsCache = new WeakMap;
  ENTITY_RESOLUTION_SCHEMA = {
    type: "object",
    properties: {
      entityId: { type: "string" },
      type: {
        type: "string",
        enum: [
          "EXACT_MATCH",
          "USERNAME_MATCH",
          "NAME_MATCH",
          "RELATIONSHIP_MATCH",
          "AMBIGUOUS",
          "UNKNOWN"
        ]
      },
      matches: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            reason: { type: "string" }
          }
        }
      }
    }
  };
});

// src/utils/format-error.ts
function formatError(error) {
  try {
    return error instanceof Error ? error.message : String(error);
  } catch {
    try {
      return Object.prototype.toString.call(error);
    } catch {
      return "[unstringifiable error]";
    }
  }
}

// src/roles.ts
var exports_roles = {};
__export(exports_roles, {
  setEntityRole: () => setEntityRole,
  setConnectorAdminWhitelist: () => setConnectorAdminWhitelist,
  resolveWorldForMessage: () => resolveWorldForMessage,
  resolveEntityRole: () => resolveEntityRole,
  resolveCanonicalOwnerIdForMessage: () => resolveCanonicalOwnerIdForMessage,
  resolveCanonicalOwnerId: () => resolveCanonicalOwnerId,
  recordRoleGrant: () => recordRoleGrant,
  recordOwnerGrant: () => recordOwnerGrant,
  normalizeRole: () => normalizeRole,
  matchEntityToConnectorAdminWhitelist: () => matchEntityToConnectorAdminWhitelist,
  isAgentSelf: () => isAgentSelf,
  isAdminRank: () => isAdminRank,
  hasRoleAccess: () => hasRoleAccess,
  hasConfiguredCanonicalOwner: () => hasConfiguredCanonicalOwner,
  hasAtLeastRole: () => hasAtLeastRole,
  getUnresolvedSenderRoleFloor: () => getUnresolvedSenderRoleFloor,
  getLiveEntityMetadataFromMessage: () => getLiveEntityMetadataFromMessage,
  getEntityRole: () => getEntityRole,
  getConnectorAdminWhitelist: () => getConnectorAdminWhitelist,
  getConfiguredOwnerEntityIds: () => getConfiguredOwnerEntityIds,
  findWorldsForOwner: () => findWorldsForOwner,
  checkSenderRole: () => checkSenderRole,
  checkSenderPrivateAccess: () => checkSenderPrivateAccess,
  canModifyRole: () => canModifyRole,
  ROLE_RANK: () => ROLE_RANK,
  CANONICAL_ROLE_RANK: () => CANONICAL_ROLE_RANK
});
function hasAtLeastRole(role, minRole) {
  const rank = CANONICAL_ROLE_RANK[(role ?? "").toUpperCase()] ?? 0;
  return rank >= CANONICAL_ROLE_RANK[minRole];
}
function isAdminRank(role) {
  return hasAtLeastRole(role, "ADMIN");
}
function asStringArray(value) {
  if (!Array.isArray(value))
    return [];
  return value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()).filter(Boolean);
}
function normalizeConnectorAdminWhitelist(whitelist) {
  if (!whitelist || typeof whitelist !== "object")
    return {};
  return Object.fromEntries(Object.entries(whitelist).map(([connector, values]) => [connector, asStringArray(values)]).filter(([, values]) => values.length > 0));
}
function normalizeRoleGrantSource(raw2) {
  if (raw2 === "owner" || raw2 === "manual" || raw2 === "connector_admin") {
    return raw2;
  }
  return null;
}
function getRuntimeSettingString(runtime2, key) {
  if (typeof runtime2.getSetting !== "function") {
    return;
  }
  const value = runtime2.getSetting(key);
  if (typeof value !== "string") {
    return;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
function parseOwnerContactEntityIds(raw2) {
  if (!raw2) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw2);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return [];
    }
    return Object.values(parsed).map((entry) => entry && typeof entry.entityId === "string" ? entry.entityId.trim() : "").filter((entityId) => entityId.length > 0);
  } catch (error) {
    logger.warn(`[roles] Failed to parse owner contacts from runtime settings: ${formatError(error)}`);
    return [];
  }
}
function getMemoryMetadata(message) {
  return asRecordOrUndefined(message.metadata);
}
function getMessageSource(message) {
  return typeof message.content.source === "string" ? message.content.source : undefined;
}
function getUnresolvedSenderRoleFloor(message) {
  const source = getMessageSource(message)?.trim().toLowerCase();
  if (!source || LOCAL_UNRESOLVED_ROLE_SOURCES.has(source)) {
    return "USER";
  }
  return "GUEST";
}
function hasConnectorStableIdentity(metadata) {
  if (!metadata) {
    return false;
  }
  for (const rawConnector of Object.values(metadata)) {
    const connector = asRecordOrUndefined(rawConnector);
    if (!connector) {
      continue;
    }
    for (const field of CONNECTOR_STABLE_ID_FIELDS) {
      const value = connector[field];
      if (typeof value === "string" && value.trim().length > 0) {
        return true;
      }
    }
  }
  return false;
}
function getConnectorMetadataFromMemory(message) {
  const memoryMetadata = getMemoryMetadata(message);
  const source = getMessageSource(message);
  if (!source) {
    return;
  }
  const sourceMetadata = asRecordOrUndefined(memoryMetadata?.[source]);
  if (sourceMetadata) {
    const nestedMetadata = { [source]: sourceMetadata };
    if (hasConnectorStableIdentity(nestedMetadata)) {
      return nestedMetadata;
    }
  }
  const mapping = getConnectorIdentityMetadataMapping(source);
  if (!mapping) {
    return;
  }
  const userId = memoryMetadata?.[mapping.userIdField];
  if (typeof userId !== "string" || userId.trim().length === 0) {
    return;
  }
  const canonicalSource = normalizeConnectorSource(source) || source;
  const displayName = mapping.nameField && typeof memoryMetadata?.[mapping.nameField] === "string" ? memoryMetadata[mapping.nameField] : undefined;
  return {
    [canonicalSource]: {
      userId,
      id: userId,
      ...displayName ? { name: displayName, username: displayName } : {}
    }
  };
}
async function getEntityMetadata(runtime2, entityId) {
  if (typeof runtime2.getEntityById !== "function") {
    return;
  }
  try {
    const entity = await runtime2.getEntityById(entityId);
    return asRecordOrUndefined(entity?.metadata);
  } catch (error) {
    logger.warn(`[roles] Failed to look up entity ${entityId}: ${formatError(error)}`);
    return;
  }
}
async function findWorldsForOwner(runtime2, entityId) {
  if (!entityId) {
    logger.error({ src: "core:roles", agentId: runtime2.agentId }, "User ID is required to find server");
    return null;
  }
  const worlds = await runtime2.getAllWorlds();
  if (!worlds || worlds.length === 0) {
    logger.debug({ src: "core:roles", agentId: runtime2.agentId }, "No worlds found for agent");
    return null;
  }
  const ownerWorlds = [];
  for (const world of worlds) {
    const worldMetadata = world.metadata;
    const worldMetadataOwnership = worldMetadata?.ownership;
    if (worldMetadataOwnership && worldMetadataOwnership.ownerId === entityId) {
      ownerWorlds.push(world);
    }
  }
  return ownerWorlds.length ? ownerWorlds : null;
}
function getConfiguredOwnerEntityIds(runtime2) {
  const configuredAdminEntityId = getRuntimeSettingString(runtime2, CANONICAL_OWNER_SETTING_KEY);
  const ownerContactsRaw = getRuntimeSettingString(runtime2, OWNER_CONTACTS_SETTING_KEY);
  const ownerContactEntityIds = parseOwnerContactEntityIds(ownerContactsRaw);
  const deduped = new Set;
  if (configuredAdminEntityId) {
    deduped.add(configuredAdminEntityId);
  }
  for (const entityId of ownerContactEntityIds) {
    deduped.add(entityId);
  }
  return [...deduped];
}
function hasConfiguredCanonicalOwner(runtime2) {
  return getConfiguredOwnerEntityIds(runtime2).length > 0;
}
function resolveCanonicalOwnerId(runtime2, metadata) {
  const configuredOwnerIds = getConfiguredOwnerEntityIds(runtime2);
  if (configuredOwnerIds.length > 0) {
    return configuredOwnerIds[0] ?? null;
  }
  const worldOwnerId = metadata?.ownership?.ownerId;
  return typeof worldOwnerId === "string" && worldOwnerId.length > 0 ? worldOwnerId : null;
}
function resolveOwnershipCandidateIds(runtime2, metadata) {
  const configuredOwnerIds = getConfiguredOwnerEntityIds(runtime2);
  if (configuredOwnerIds.length > 0) {
    return configuredOwnerIds;
  }
  const ownerId = resolveCanonicalOwnerId(runtime2, metadata);
  return ownerId ? [ownerId] : [];
}
function connectorIdentityMatches(left, right) {
  if (!left || !right)
    return false;
  for (const [connector, leftRaw] of Object.entries(left)) {
    const leftConnector = asRecordOrUndefined(leftRaw);
    const rightConnector = asRecordOrUndefined(right[connector]);
    if (!leftConnector || !rightConnector) {
      continue;
    }
    for (const field of CONNECTOR_STABLE_ID_FIELDS) {
      const leftValue = leftConnector[field];
      const rightValue = rightConnector[field];
      if (typeof leftValue === "string" && leftValue.length > 0 && leftValue === rightValue) {
        return true;
      }
    }
  }
  return false;
}
async function hasConfirmedIdentityLink(runtime2, entityId, ownerId) {
  const linkedIds = await getConfirmedLinkedEntityIds(runtime2, entityId);
  return linkedIds.includes(ownerId);
}
async function getConfirmedLinkedEntityIds(runtime2, entityId) {
  if (typeof runtime2.getRelationships !== "function") {
    return [];
  }
  try {
    const relationships = await runtime2.getRelationships({
      entityIds: [entityId],
      tags: ["identity_link"]
    });
    const linkedIds = new Set;
    for (const relationship of relationships) {
      const metadata = asRecordOrUndefined(relationship.metadata);
      if (metadata?.status !== "confirmed") {
        continue;
      }
      if (relationship.sourceEntityId === entityId && typeof relationship.targetEntityId === "string") {
        linkedIds.add(relationship.targetEntityId);
      }
      if (relationship.targetEntityId === entityId && typeof relationship.sourceEntityId === "string") {
        linkedIds.add(relationship.sourceEntityId);
      }
    }
    return [...linkedIds];
  } catch (error) {
    logger.warn(`[roles] Failed to load identity links for ${entityId}: ${formatError(error)}`);
    return [];
  }
}
async function resolveOwnershipRole(runtime2, metadata, entityId, options) {
  const ownerIds = resolveOwnershipCandidateIds(runtime2, metadata);
  if (ownerIds.length === 0) {
    return null;
  }
  const liveEntityMetadata = options?.liveEntityMetadata;
  const senderMetadata = hasConnectorStableIdentity(liveEntityMetadata) ? liveEntityMetadata : await getEntityMetadata(runtime2, entityId);
  for (const ownerId of ownerIds) {
    if (ownerId === entityId) {
      return "OWNER";
    }
    if (await hasConfirmedIdentityLink(runtime2, entityId, ownerId)) {
      return "OWNER";
    }
    const ownerMetadata = await getEntityMetadata(runtime2, ownerId);
    if (!ownerMetadata) {
      continue;
    }
    if (connectorIdentityMatches(senderMetadata, ownerMetadata)) {
      return "OWNER";
    }
  }
  return null;
}
function resolveWorldIdFromMessageMetadata(runtime2, message) {
  const source = getMessageSource(message);
  if (!source) {
    return null;
  }
  const metadata = getMemoryMetadata(message);
  const worldIdKeys = getConnectorWorldIdMetadataKeys(source);
  for (const key of worldIdKeys) {
    const value = metadata?.[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return createUniqueUuid(runtime2, value);
    }
  }
  return null;
}
function setConnectorAdminWhitelist(runtime2, whitelist) {
  if (typeof runtime2.setSetting !== "function") {
    return;
  }
  const normalized = normalizeConnectorAdminWhitelist(whitelist);
  if (Object.keys(normalized).length === 0) {
    runtime2.setSetting(CONNECTOR_ADMINS_SETTING_KEY, null);
    return;
  }
  runtime2.setSetting(CONNECTOR_ADMINS_SETTING_KEY, JSON.stringify(normalized));
}
function getConnectorAdminWhitelist(runtime2) {
  const raw2 = getRuntimeSettingString(runtime2, CONNECTOR_ADMINS_SETTING_KEY);
  if (!raw2) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw2);
    return normalizeConnectorAdminWhitelist(parsed);
  } catch (error) {
    logger.warn(`[roles] Failed to parse ${CONNECTOR_ADMINS_SETTING_KEY}: ${formatError(error)}`);
    return {};
  }
}
function matchEntityToConnectorAdminWhitelist(entityMetadata, whitelist) {
  if (!entityMetadata || typeof entityMetadata !== "object")
    return null;
  const normalizedWhitelist = normalizeConnectorAdminWhitelist(whitelist);
  for (const [connector, platformIds] of Object.entries(normalizedWhitelist)) {
    const connectorMeta = asRecordOrUndefined(entityMetadata[connector]);
    if (!connectorMeta) {
      continue;
    }
    for (const field of CONNECTOR_STABLE_ID_FIELDS) {
      const value = connectorMeta[field];
      if (typeof value === "string" && platformIds.includes(value)) {
        return { connector, matchedValue: value, matchedField: field };
      }
    }
  }
  return null;
}
function normalizeRole(raw2) {
  const upper = (raw2 ?? "").toUpperCase();
  if (upper === "OWNER" || upper === "ADMIN" || upper === "USER")
    return upper;
  if (upper === "MEMBER")
    return "USER";
  return "GUEST";
}
function getEntityRole(metadata, entityId) {
  if (!metadata?.roles)
    return "GUEST";
  return normalizeRole(metadata.roles[entityId]);
}
function getStoredRoleSource(metadata, entityId) {
  return normalizeRoleGrantSource(metadata?.roleSources?.[entityId]);
}
async function resolveStoredRoleSource(runtime2, metadata, entityId, options) {
  const storedSource = getStoredRoleSource(metadata, entityId);
  if (storedSource) {
    return storedSource;
  }
  const storedRole = getEntityRole(metadata, entityId);
  if (storedRole === "GUEST") {
    return null;
  }
  if (storedRole === "OWNER") {
    return "owner";
  }
  const entityMetadata = options?.liveEntityId === entityId ? options.liveEntityMetadata ?? undefined : undefined;
  const matchedWhitelist = matchEntityToConnectorAdminWhitelist(entityMetadata ?? await getEntityMetadata(runtime2, entityId), getConnectorAdminWhitelist(runtime2));
  if (storedRole === "ADMIN" && matchedWhitelist) {
    return "connector_admin";
  }
  return "manual";
}
async function resolveExplicitGrantedRole(runtime2, metadata, entityId, options) {
  const directRole = getEntityRole(metadata, entityId);
  const directSource = await resolveStoredRoleSource(runtime2, metadata, entityId, options);
  if (directRole !== "GUEST" && directSource === "manual") {
    return { role: directRole, source: "manual" };
  }
  const linkedIds = await getConfirmedLinkedEntityIds(runtime2, entityId);
  let bestRole = null;
  for (const linkedEntityId of linkedIds) {
    const linkedRole = getEntityRole(metadata, linkedEntityId);
    if (linkedRole === "GUEST") {
      continue;
    }
    const linkedSource = await resolveStoredRoleSource(runtime2, metadata, linkedEntityId);
    if (linkedSource !== "manual") {
      continue;
    }
    if (!bestRole || ROLE_RANK[linkedRole] > ROLE_RANK[bestRole]) {
      bestRole = linkedRole;
    }
  }
  return bestRole ? { role: bestRole, source: "linked_manual" } : null;
}
function getLiveEntityMetadataFromMessage(message) {
  return getConnectorMetadataFromMemory(message);
}
async function resolveEntityRole(runtime2, _world, metadata, entityId, options) {
  const explicitRole = getEntityRole(metadata, entityId);
  const explicitSource = await resolveStoredRoleSource(runtime2, metadata, entityId, options);
  const ownershipRole = await resolveOwnershipRole(runtime2, metadata, entityId, options);
  if (ownershipRole === "OWNER") {
    return "OWNER";
  }
  const whitelist = getConnectorAdminWhitelist(runtime2);
  const liveMatched = matchEntityToConnectorAdminWhitelist(options?.liveEntityMetadata ?? undefined, whitelist);
  if (explicitRole !== "GUEST") {
    if (explicitRole === "OWNER") {
      return explicitSource === "manual" ? "OWNER" : "GUEST";
    }
    if (explicitSource === "connector_admin") {
      if (Object.keys(whitelist).length === 0) {
        return "GUEST";
      }
      if (liveMatched) {
        return "ADMIN";
      }
      const entityMetadata2 = await getEntityMetadata(runtime2, entityId);
      const matched2 = matchEntityToConnectorAdminWhitelist(entityMetadata2, whitelist);
      if (matched2) {
        return "ADMIN";
      }
      return "GUEST";
    }
    return explicitRole;
  }
  if (Object.keys(whitelist).length === 0) {
    return explicitRole;
  }
  if (liveMatched) {
    return "ADMIN";
  }
  const entityMetadata = await getEntityMetadata(runtime2, entityId);
  const matched = matchEntityToConnectorAdminWhitelist(entityMetadata, whitelist);
  if (!matched) {
    return explicitRole;
  }
  return "ADMIN";
}
async function checkSenderPrivateAccess(runtime2, message) {
  const resolved = await resolveWorldForMessage(runtime2, message);
  if (!resolved)
    return null;
  const { world, metadata } = resolved;
  const entityId = message.entityId;
  const options = {
    liveEntityMetadata: getLiveEntityMetadataFromMessage(message),
    liveEntityId: entityId
  };
  const role = await resolveEntityRole(runtime2, world, metadata, entityId, options);
  const ownershipRole = await resolveOwnershipRole(runtime2, metadata, entityId, options);
  if (ownershipRole === "OWNER") {
    return {
      entityId,
      role,
      isOwner: true,
      isAdmin: true,
      canManageRoles: true,
      hasPrivateAccess: true,
      accessRole: "OWNER",
      accessSource: "owner"
    };
  }
  const explicitAccess = await resolveExplicitGrantedRole(runtime2, metadata, entityId, options);
  return {
    entityId,
    role,
    isOwner: false,
    isAdmin: isAdminRank(role),
    canManageRoles: isAdminRank(role),
    hasPrivateAccess: explicitAccess !== null,
    accessRole: explicitAccess?.role ?? null,
    accessSource: explicitAccess?.source ?? null
  };
}
function canModifyRole(actorRole, targetCurrentRole, newRole) {
  if (targetCurrentRole === newRole)
    return false;
  const actorRank = ROLE_RANK[actorRole];
  const targetRank = ROLE_RANK[targetCurrentRole];
  if (actorRole === "OWNER")
    return true;
  if (actorRole === "ADMIN") {
    if (targetRank >= actorRank)
      return false;
    if (newRole === "OWNER")
      return false;
    return true;
  }
  return false;
}
async function resolveWorldForMessage(runtime2, message) {
  const room = await runtime2.getRoom(message.roomId);
  const worldId = room?.worldId ?? resolveWorldIdFromMessageMetadata(runtime2, message);
  if (!worldId)
    return null;
  const world = await runtime2.getWorld(worldId);
  if (!world)
    return null;
  const metadata = world.metadata ?? {};
  return { world, metadata };
}
async function resolveCanonicalOwnerIdForMessage(runtime2, message) {
  const configuredOwnerId = resolveCanonicalOwnerId(runtime2);
  if (configuredOwnerId) {
    return configuredOwnerId;
  }
  const resolved = await resolveWorldForMessage(runtime2, message);
  return resolveCanonicalOwnerId(runtime2, resolved?.metadata);
}
async function checkSenderRole(runtime2, message) {
  const resolved = await resolveWorldForMessage(runtime2, message);
  if (!resolved)
    return null;
  const { world, metadata } = resolved;
  const entityId = message.entityId;
  const role = await resolveEntityRole(runtime2, world, metadata, entityId, {
    liveEntityMetadata: getLiveEntityMetadataFromMessage(message),
    liveEntityId: entityId
  });
  return {
    entityId,
    role,
    isOwner: role === "OWNER",
    isAdmin: isAdminRank(role),
    canManageRoles: isAdminRank(role)
  };
}
function getAccessContext(runtime2, message) {
  if (!runtime2 || typeof runtime2.agentId !== "string" || !message || typeof message.entityId !== "string" || message.entityId.length === 0) {
    return null;
  }
  return { runtime: runtime2, message };
}
function isAgentSelf(runtime2, message) {
  const context = getAccessContext(runtime2, message);
  if (!context) {
    return false;
  }
  return context.message.entityId === context.runtime.agentId;
}
async function isCanonicalOwner(runtime2, message, resolveFn = resolveCanonicalOwnerIdForMessage) {
  try {
    const ownerId = await resolveFn(runtime2, message);
    return typeof ownerId === "string" && ownerId === message.entityId;
  } catch {
    return false;
  }
}
async function hasRoleAccess(runtime2, message, requiredRole, deps = {}) {
  if (requiredRole === "GUEST") {
    return true;
  }
  const context = getAccessContext(runtime2, message);
  if (!context) {
    return true;
  }
  if (isAgentSelf(context.runtime, context.message)) {
    return true;
  }
  if (await isCanonicalOwner(context.runtime, context.message, deps.resolveCanonicalOwnerIdForMessage)) {
    return true;
  }
  const checkRoleFn = deps.checkSenderRole ?? checkSenderRole;
  try {
    const result = await checkRoleFn(context.runtime, context.message);
    if (!result) {
      const senderRank2 = ROLE_RANK[getUnresolvedSenderRoleFloor(context.message)];
      const requiredRank2 = ROLE_RANK[requiredRole] ?? 0;
      return senderRank2 >= requiredRank2;
    }
    const senderRank = ROLE_RANK[result.role] ?? 0;
    const requiredRank = ROLE_RANK[requiredRole] ?? 0;
    return senderRank >= requiredRank;
  } catch {
    return false;
  }
}
function recordOwnerGrant(metadata, ownerId) {
  metadata.roles ??= {};
  metadata.roleSources ??= {};
  let changed = false;
  if (metadata.roles[ownerId] !== "OWNER") {
    metadata.roles[ownerId] = "OWNER";
    changed = true;
  }
  if (metadata.roleSources[ownerId] !== "owner") {
    metadata.roleSources[ownerId] = "owner";
    changed = true;
  }
  return changed;
}
function recordRoleGrant(metadata, entityId, role, source = "manual") {
  metadata.roles ??= {};
  metadata.roleSources ??= {};
  let changed = false;
  if (metadata.roles[entityId] !== role) {
    metadata.roles[entityId] = role;
    changed = true;
  }
  if (role === "GUEST") {
    if (metadata.roleSources[entityId] !== undefined) {
      delete metadata.roleSources[entityId];
      changed = true;
    }
  } else if (metadata.roleSources[entityId] !== source) {
    metadata.roleSources[entityId] = source;
    changed = true;
  }
  return changed;
}
async function setEntityRole(runtime2, message, targetEntityId, newRole, source = "manual") {
  const resolved = await resolveWorldForMessage(runtime2, message);
  if (!resolved)
    throw new Error("Cannot resolve world for role assignment");
  const { world, metadata } = resolved;
  if (!metadata.roles)
    metadata.roles = {};
  metadata.roleSources ??= {};
  metadata.roles[targetEntityId] = newRole;
  if (newRole === "GUEST") {
    delete metadata.roleSources[targetEntityId];
  } else {
    metadata.roleSources[targetEntityId] = source;
  }
  world.metadata = metadata;
  await runtime2.updateWorld(world);
  return { ...metadata.roles };
}
var CANONICAL_ROLE_RANK, ROLE_RANK, CONNECTOR_ADMINS_SETTING_KEY = "ELIZA_ROLES_CONNECTOR_ADMINS_JSON", CANONICAL_OWNER_SETTING_KEY = "ELIZA_ADMIN_ENTITY_ID", OWNER_CONTACTS_SETTING_KEY = "ELIZA_OWNER_CONTACTS_JSON", CONNECTOR_STABLE_ID_FIELDS, LOCAL_UNRESOLVED_ROLE_SOURCES;
var init_roles = __esm(() => {
  init_connectors();
  init_entities();
  init_logger2();
  init_message_source();
  CANONICAL_ROLE_RANK = {
    NONE: 0,
    GUEST: 1,
    USER: 2,
    MEMBER: 2,
    ADMIN: 3,
    OWNER: 4
  };
  ROLE_RANK = {
    GUEST: CANONICAL_ROLE_RANK.GUEST,
    USER: CANONICAL_ROLE_RANK.USER,
    ADMIN: CANONICAL_ROLE_RANK.ADMIN,
    OWNER: CANONICAL_ROLE_RANK.OWNER
  };
  CONNECTOR_STABLE_ID_FIELDS = ["userId", "id"];
  LOCAL_UNRESOLVED_ROLE_SOURCES = new Set([
    MESSAGE_SOURCE_CLIENT_CHAT,
    MESSAGE_SOURCE_SUB_AGENT,
    MESSAGE_SOURCE_CODING_AGENT,
    MESSAGE_SOURCE_AGENT_GREETING,
    "api",
    "benchmark",
    "dashboard",
    "deep-link",
    "event",
    "ios-local",
    "local-voice",
    "owner_app",
    "test"
  ]);
});
init_roles();

export {
  setEntityRole,
  setConnectorAdminWhitelist,
  resolveWorldForMessage,
  resolveEntityRole,
  resolveCanonicalOwnerIdForMessage,
  resolveCanonicalOwnerId,
  recordRoleGrant,
  recordOwnerGrant,
  normalizeRole,
  matchEntityToConnectorAdminWhitelist,
  isAgentSelf,
  isAdminRank,
  hasRoleAccess,
  hasConfiguredCanonicalOwner,
  hasAtLeastRole,
  getUnresolvedSenderRoleFloor,
  getLiveEntityMetadataFromMessage,
  getEntityRole,
  getConnectorAdminWhitelist,
  getConfiguredOwnerEntityIds,
  findWorldsForOwner,
  checkSenderRole,
  checkSenderPrivateAccess,
  canModifyRole,
  ROLE_RANK,
  CANONICAL_ROLE_RANK
};

//# debugId=C2E0F64FC870DCC464756E2164756E21
//# sourceMappingURL=roles.js.map
