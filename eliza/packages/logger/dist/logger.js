/**
 * elizaOS's standard structured logger, built on Adze. Exposes the `Logger`
 * interface and the `createLogger` factory (plus the default `logger` /
 * `elizaLogger` singletons) as a Pino-shaped API extended with custom
 * `success`/`progress` levels. Redacts sensitive fields via fast-redact, keeps
 * an in-memory ring buffer with real-time listeners for WebSocket streaming,
 * and lazily opens optional file sinks (`output.log`, `prompts.log`,
 * `chat.log`) with prompt/response/chat instrumentation helpers. Adapts between
 * node and a console-based browser path.
 */
// Test hook to clear env cache in logger tests (kept internal)
export const __loggerTestHooks = {
    clearEnvCacheForTests: () => { },
    stripAnsi: (str) => stripAnsi(str),
};
import adze, { setup, } from "adze";
import { getEnv as getEnvironmentVar } from "./env.js";
import fastRedact from "fast-redact";
// Global log listeners for streaming
const logListeners = new Set();
/**
 * Add a listener for real-time log entries (used for WebSocket streaming)
 * @param listener - Callback function to receive log entries
 * @returns Function to remove the listener
 */
export function addLogListener(listener) {
    logListeners.add(listener);
    return () => logListeners.delete(listener);
}
/**
 * Remove a log listener
 * @param listener - The listener to remove
 */
export function removeLogListener(listener) {
    logListeners.delete(listener);
}
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Log level priorities for filtering
 */
const LOG_LEVEL_PRIORITY = {
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
    alert: 60,
};
/**
 * Reverse mapping from numeric level to preferred level name
 * When multiple level names have the same numeric value, we prioritize the most semantic one
 */
const LEVEL_TO_NAME = {
    10: "trace", // prefer 'trace' over 'verbose'
    20: "debug",
    27: "success",
    28: "progress",
    29: "log",
    30: "info",
    40: "warn",
    50: "error",
    60: "fatal", // prefer 'fatal' over 'alert'
};
/**
 * Check if a message should be logged based on current level
 */
function shouldLog(messageLevel, currentLevel) {
    const messagePriority = LOG_LEVEL_PRIORITY[messageLevel.toLowerCase()] || 30;
    const currentPriority = LOG_LEVEL_PRIORITY[currentLevel.toLowerCase()] || 30;
    return messagePriority >= currentPriority;
}
/**
 * Safe JSON stringify that handles circular references
 */
function safeStringify(obj) {
    try {
        const seen = new WeakSet();
        return JSON.stringify(obj, (_, value) => {
            if (typeof value === "object" && value !== null) {
                if (seen.has(value))
                    return "[Circular]";
                seen.add(value);
            }
            return value;
        });
    }
    catch {
        return String(obj);
    }
}
/**
 * Parse boolean from text string
 */
function parseBooleanFromText(value) {
    if (!value)
        return false;
    const normalized = value.toLowerCase().trim();
    return (normalized === "true" ||
        normalized === "1" ||
        normalized === "yes" ||
        normalized === "on");
}
/**
 * Format a value for display in pretty log extras
 */
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
/**
 * Format a log entry in compact pretty format
 * Format: [src] message (key=val, key=val)
 *
 * agentId/agentName are NOT displayed in pretty mode because:
 * - Loggers with namespace already show an agent-prefixed tag (via Adze)
 * - These fields ARE still included in JSON mode for filtering/monitoring
 */
function formatPrettyLog(context, message, isJsonMode) {
    // In JSON mode, don't format - return message as-is
    if (isJsonMode) {
        return message;
    }
    const src = context.src;
    // Build prefix: [SRC] in uppercase
    const srcPart = src ? `[${src.toUpperCase()}] ` : "";
    // Build extras: (key=val, key=val)
    // Exclude: src (already in prefix), agentId/agentName (shown via Adze namespace tag)
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
// ============================================================================
// Configuration
// ============================================================================
// Log level configuration
const DEFAULT_LOG_LEVEL = "info";
const effectiveLogLevel = getEnvironmentVar("LOG_LEVEL") || DEFAULT_LOG_LEVEL;
// Custom log levels mapping (elizaOS to Adze)
// These are for our internal shouldLog function, not Adze's levels
export const customLevels = {
    fatal: 60,
    error: 50,
    warn: 40,
    info: 30,
    log: 29,
    progress: 28,
    success: 27,
    debug: 20,
    trace: 10,
};
// Configuration flags
const raw = parseBooleanFromText(getEnvironmentVar("LOG_JSON_FORMAT"));
const showTimestamps = parseBooleanFromText(getEnvironmentVar("LOG_TIMESTAMPS") ?? "true");
// Generate a unique server ID for this process instance
const serverId = getEnvironmentVar("SERVER_ID") ||
    (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID().slice(0, 8)
        : Math.random().toString(36).slice(2, 10));
// Configure sensitive data redaction
// fast-redact requires bracket notation for top-level keys or wildcard paths for nested
// Using wildcard paths that match both top-level and nested objects
let redact;
try {
    redact = fastRedact({
        paths: [
            // Wildcard paths for nested objects (also catches some top-level in object context)
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
            "*.bearer",
        ],
        serialize: false, // Don't stringify, just redact in place
        censor: "[REDACTED]",
    });
}
catch {
    // Fallback for environments where fast-redact fails (e.g., browser extensions)
    redact = ((obj) => obj);
    redact.restore = (obj) => obj;
}
// ============================================================================
// File Log Output
// ============================================================================
/**
 * File logging - lazy-initialized on first write to avoid module-init timing issues.
 * Enable with LOG_FILE=true/1 (writes output.log, prompts.log, and chat.log in
 * cwd) or LOG_FILE=/path/to/file.log.
 * Disabled by default.
 */
let _fileLogState = "pending";
let _fileLogFd = null;
// One-shot guard so a persistent file-write failure surfaces exactly once on
// stderr instead of being swallowed forever by the catch in writeLogEntryToFile
// (#16356: an invalid stripAnsi regex threw on every write and output.log
// silently stayed empty for the sink's whole lifetime).
let _fileLogWriteErrorWarned = false;
let _promptLogFd = null;
let _chatLogFd = null;
let _promptLogCounter = 0;
let _fs = null;
function getFs() {
    if (_fs)
        return _fs;
    try {
        _fs = require("node:fs");
        return _fs;
    }
    catch {
        // error-policy:J7 logger is a leaf and cannot report through itself; no
        // node:fs (browser build) legitimately means "no file sink", not a failure.
        return null;
    }
}
/**
 * Strip ANSI escape codes from a string for plain-text logging.
 * Uses RegExp constructor to avoid control-character-in-regex lint.
 */
function stripAnsi(str) {
    const ESC = "\x1b";
    const BEL = "\x07";
    const re = new RegExp(`${ESC}(?:\\[[\\x20-\\x3F]*[\\x40-\\x7E]|\\].*?(?:${BEL}|${ESC}\\\\|\\(B))`, "g");
    return str.replace(re, "");
}
/**
 * Lazily open the log files on the first write.
 * Returns true if the files are ready for writing.
 */
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
        if (!logFileEnv ||
            logFileEnv.trim() === "" ||
            logFileEnv.trim() === "0" ||
            logFileEnv.trim().toLowerCase() === "false") {
            return false;
        }
        const fs = getFs();
        if (!fs)
            return false;
        const pathMod = require("node:path");
        const isBooleanFlag = ["true", "1", "yes", "on"].includes(logFileEnv.trim().toLowerCase());
        const logFilePath = isBooleanFlag
            ? pathMod.join(process.cwd(), "output.log")
            : logFileEnv.trim();
        const logDir = pathMod.dirname(isBooleanFlag ? pathMod.join(process.cwd(), "output.log") : logFilePath);
        // Ensure log directory exists
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
                }
                catch {
                    // error-policy:J6 best-effort fd close on process exit.
                }
                _fileLogFd = null;
            }
            if (fs2 && _promptLogFd !== null) {
                try {
                    fs2.closeSync(_promptLogFd);
                }
                catch {
                    // error-policy:J6 best-effort fd close on process exit.
                }
                _promptLogFd = null;
            }
            if (fs2 && _chatLogFd !== null) {
                try {
                    fs2.closeSync(_chatLogFd);
                }
                catch {
                    // error-policy:J6 best-effort fd close on process exit.
                }
                _chatLogFd = null;
            }
        });
        return true;
    }
    catch {
        // error-policy:J7 ensureFileLog sets up the logger's own optional file
        // sink; the logger cannot report a failure to initialize itself through
        // itself, so a failed setup degrades to no file logging (returns false).
        return false;
    }
}
/**
 * Write a formatted log entry to the output file.
 * Skips browser environments, unset LOG_FILE, or a failed file open.
 */
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
        const line = `${timestamp} [${levelStr.toUpperCase().padEnd(8)}] ${stripAnsi(entry.msg)}\n`;
        fs.writeSync(fd, line);
    }
    catch (error) {
        // A persistent write failure (e.g. #16356's invalid regex, which threw on
        // every call) must not stay invisible for the sink's whole lifetime — go
        // straight to stderr once, bypassing the logger that is itself failing.
        if (!_fileLogWriteErrorWarned) {
            _fileLogWriteErrorWarned = true;
            console.error(`[logger] failed to write to the log file; further errors are suppressed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
function promptSlug(counter, agentName, modelType) {
    return `#${String(counter).padStart(4, "0")}/${agentName}/${modelType}`;
}
const MAX_PROMPT_LOG_CHARS = 100_000;
function writeToPromptLog(slug, kind, modelType, body, metadata) {
    if (!ensureFileLog() || _promptLogFd === null)
        return;
    try {
        const fs = getFs();
        if (!fs)
            return;
        const sep = "=".repeat(80);
        let header = `${sep}\n ${slug}  ${kind}: ${modelType} (${body.length} chars)\n`;
        header += ` ${new Date().toISOString()}\n`;
        if (metadata) {
            header += ` ${JSON.stringify(metadata, null, 2)}\n`;
        }
        header += `${sep}\n`;
        fs.writeSync(_promptLogFd, header);
        if (body.length > MAX_PROMPT_LOG_CHARS) {
            fs.writeSync(_promptLogFd, body.substring(0, MAX_PROMPT_LOG_CHARS));
            fs.writeSync(_promptLogFd, `\n... [TRUNCATED - ${body.length - MAX_PROMPT_LOG_CHARS} more chars]\n`);
        }
        else {
            fs.writeSync(_promptLogFd, body);
        }
        fs.writeSync(_promptLogFd, `\n${sep}\n\n`);
    }
    catch {
        // Silent fail
    }
}
/**
 * Log a prompt to prompts.log. Returns the slug callers can pass as
 * `metadata.promptSlug` when logging the matching response.
 */
export function logPrompt(modelType, prompt, metadata) {
    if (!ensureFileLog())
        return "";
    const counter = ++_promptLogCounter;
    const agentName = metadata?.agentName ?? "unknown";
    const slug = promptSlug(counter, agentName, modelType);
    writeToPromptLog(slug, "PROMPT", modelType, prompt, {
        ...metadata,
        promptSlug: slug,
    });
    return slug;
}
/**
 * Log a response to prompts.log. Returns the correlated prompt slug, or an
 * empty string when no prompt slug is available.
 */
export function logResponse(modelType, response, metadata) {
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
const CHAT_PREVIEW_IN_MAX = 200;
const CHAT_PREVIEW_OUT_MAX = 120;
function escapeChatPreview(text) {
    const safe = text.length > 10_000 ? text.slice(0, 10_000) : text;
    const oneLine = safe.replace(/\s+/g, " ").trim();
    return oneLine.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function writeChatLine(line) {
    if (!ensureFileLog() || _chatLogFd === null)
        return;
    try {
        const fs = getFs();
        if (!fs)
            return;
        const timestamp = new Date().toISOString();
        fs.writeSync(_chatLogFd, `${timestamp} ${line}\n`);
    }
    catch {
        // Silent fail
    }
}
/** Log an incoming message to chat.log. */
export function logChatIn(params) {
    const preview = escapeChatPreview(params.text.length > CHAT_PREVIEW_IN_MAX
        ? `${params.text.slice(0, CHAT_PREVIEW_IN_MAX)}...`
        : params.text);
    const roomShort = params.roomId.slice(0, 8);
    const msgShort = params.messageId.slice(0, 8);
    const source = params.source ?? "unknown";
    const line = `[CHAT:IN]  #agent:${params.agentName} room=${roomShort} msg=${msgShort} source=${source} "${preview}"`;
    writeChatLine(line);
    return line;
}
/** Log an outgoing response to chat.log. */
export function logChatOut(params) {
    const roomShort = params.roomId.slice(0, 8);
    let part = `[CHAT:OUT] #agent:${params.agentName} room=${roomShort} action=${params.action}`;
    if (params.actions && params.actions.length > 0) {
        part += ` actions=${params.actions.join(",")}`;
    }
    if (params.emoji) {
        part += ` emoji=${params.emoji}`;
    }
    if (params.text !== undefined && params.text !== "") {
        const preview = escapeChatPreview(params.text.length > CHAT_PREVIEW_OUT_MAX
            ? `${params.text.slice(0, CHAT_PREVIEW_OUT_MAX)}...`
            : params.text);
        part += ` len=${params.text.length} "${preview}"`;
    }
    else if (params.emoji) {
        part += " len=0";
    }
    if (params.providers && params.providers.length > 0) {
        part += ` providers=${params.providers.join(",")}`;
    }
    if (params.reasoning !== undefined && params.reasoning !== "") {
        const safe = escapeChatPreview(params.reasoning.length > 80
            ? `${params.reasoning.slice(0, 80)}...`
            : params.reasoning);
        part += ` reasoning="${safe}"`;
    }
    writeChatLine(part);
    return part;
}
// ============================================================================
// In-Memory Log Storage
// ============================================================================
/**
 * Creates an in-memory destination for storing recent logs
 */
function createInMemoryDestination(maxLogs = 100) {
    const logs = [];
    return {
        write(entry) {
            logs.push(entry);
            if (logs.length > maxLogs) {
                logs.shift();
            }
            // Notify all listeners for real-time streaming
            for (const listener of logListeners) {
                listener(entry);
            }
        },
        clear() {
            logs.length = 0;
        },
        recentLogs() {
            return logs
                .map((entry) => {
                const timestamp = showTimestamps
                    ? new Date(entry.time).toISOString()
                    : "";
                // Convert numeric level back to string using the reverse mapping
                const levelStr = LEVEL_TO_NAME[entry.level ?? 30] || "info";
                return `${timestamp} ${levelStr} ${entry.msg}`.trim();
            })
                .join("\n");
        },
    };
}
// Global in-memory destination
const globalInMemoryDestination = createInMemoryDestination();
// ============================================================================
// Adze Configuration
// ============================================================================
// Configure Adze globally
// Map elizaOS log levels to Adze log levels
const getAdzeActiveLevel = () => {
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
    return "info"; // Default to info
};
const adzeActiveLevel = getAdzeActiveLevel();
// Reusable custom level configuration using Adze's types
const customLevelConfig = {
    alert: {
        levelName: "alert",
        level: 0,
        style: "font-size: 12px; color: #ff0000;",
        terminalStyle: ["bgRed", "white", "bold"],
        method: "error",
        emoji: "",
    },
    error: {
        levelName: "error",
        level: 1,
        style: "font-size: 12px; color: #ff0000;",
        terminalStyle: ["bgRed", "whiteBright", "bold"],
        method: "error",
        emoji: "",
    },
    warn: {
        levelName: "warn",
        level: 2,
        style: "font-size: 12px; color: #ffaa00;",
        terminalStyle: ["bgYellow", "black", "bold"],
        method: "warn",
        emoji: "",
    },
    info: {
        levelName: "info",
        level: 3,
        style: "font-size: 12px; color: #0099ff;",
        terminalStyle: ["cyan"],
        method: "info",
        emoji: "",
    },
    fail: {
        levelName: "fail",
        level: 4,
        style: "font-size: 12px; color: #ff6600;",
        terminalStyle: ["red", "underline"],
        method: "error",
        emoji: "",
    },
    success: {
        levelName: "success",
        level: 5,
        style: "font-size: 12px; color: #00cc00;",
        terminalStyle: ["green"],
        method: "log",
        emoji: "",
    },
    log: {
        levelName: "log",
        level: 6,
        style: "font-size: 12px; color: #888888;",
        terminalStyle: ["white"],
        method: "log",
        emoji: "",
    },
    debug: {
        levelName: "debug",
        level: 7,
        style: "font-size: 12px; color: #9b59b6;",
        terminalStyle: ["gray", "dim"],
        method: "debug",
        emoji: "",
    },
    verbose: {
        levelName: "verbose",
        level: 8,
        style: "font-size: 12px; color: #666666;",
        terminalStyle: ["gray", "dim", "italic"],
        method: "debug",
        emoji: "",
    },
};
const adzeStore = setup({
    activeLevel: adzeActiveLevel,
    format: raw ? "json" : "pretty",
    timestampFormatter: showTimestamps ? undefined : () => "",
    withEmoji: false,
    levels: customLevelConfig,
});
// Mirror Adze output to in-memory storage
adzeStore.addListener("*", (log) => {
    try {
        const d = log.data;
        const dMessage = d?.message;
        const msg = Array.isArray(dMessage)
            ? dMessage
                .map((m) => (typeof m === "string" ? m : safeStringify(m)))
                .join(" ")
            : typeof dMessage === "string"
                ? dMessage
                : "";
        const entry = {
            time: Date.now(),
            level: d && typeof d.level === "number" ? d.level : undefined,
            msg,
        };
        globalInMemoryDestination.write(entry);
    }
    catch {
        // Silent fail - don't break logging
    }
});
// ============================================================================
// Logger Factory
// ============================================================================
/**
 * Creates a sealed Adze logger instance with namespaces and metadata
 */
function sealAdze(base) {
    let chain = adze;
    // Add namespaces if provided
    const namespaces = [];
    if (typeof base.namespace === "string")
        namespaces.push(base.namespace);
    if (Array.isArray(base.namespaces))
        namespaces.push(...base.namespaces);
    if (namespaces.length > 0) {
        chain = chain.ns(...namespaces);
    }
    // Add metadata (excluding namespace properties)
    const metaBase = { ...base };
    delete metaBase.namespace;
    delete metaBase.namespaces;
    // Add server context metadata (always, for observability)
    // Only add defaults if user hasn't provided them
    if (!metaBase.name) {
        metaBase.name = "elizaos";
    }
    // Add pid for process identification
    if (!metaBase.pid && typeof process !== "undefined" && process.pid) {
        metaBase.pid = process.pid;
    }
    // Add environment (production, development, test)
    if (!metaBase.environment && typeof process !== "undefined" && process.env) {
        metaBase.environment = process.env.NODE_ENV || "development";
    }
    // Add serverId for instance identification
    if (!metaBase.serverId) {
        metaBase.serverId = serverId;
    }
    // Add hostname (for JSON format or when explicitly needed)
    if (raw && !metaBase.hostname) {
        // Get hostname in a way that works in both Node and browser
        let hostname = "unknown";
        if (typeof process !== "undefined" && process.platform) {
            // Node.js environment
            const os = require("node:os");
            hostname = os.hostname();
        }
        else {
            // Browser environment
            const browserLocation = globalThis.location;
            if (browserLocation) {
                hostname = browserLocation.hostname || "browser";
            }
        }
        metaBase.hostname = hostname;
    }
    // This ensures the sealed logger inherits the correct log level and styling
    const globalConfig = {
        activeLevel: getAdzeActiveLevel(),
        format: raw ? "json" : "pretty",
        timestampFormatter: showTimestamps ? undefined : () => "",
        withEmoji: false,
        levels: customLevelConfig,
    };
    return chain.meta(metaBase).seal(globalConfig);
}
/**
 * Extract configuration from bindings
 */
function extractBindingsConfig(bindings) {
    let level = effectiveLogLevel;
    let base = {};
    let maxMemoryLogs;
    if (typeof bindings === "object" && bindings !== null) {
        if ("level" in bindings) {
            level = bindings.level;
        }
        if ("maxMemoryLogs" in bindings &&
            typeof bindings.maxMemoryLogs === "number") {
            maxMemoryLogs = bindings.maxMemoryLogs;
        }
        // Extract base bindings (excluding special properties)
        const { level: _, maxMemoryLogs: __, ...rest } = bindings;
        base = rest;
    }
    return { level, base, maxMemoryLogs };
}
/**
 * Creates a logger instance using Adze
 * @param bindings - Logger configuration or boolean flag
 * @returns Logger instance with elizaOS API
 */
function createLogger(bindings = false) {
    const { level, base, maxMemoryLogs } = extractBindingsConfig(bindings);
    // Reset memory buffer if custom limit requested
    if (typeof maxMemoryLogs === "number" && maxMemoryLogs > 0) {
        globalInMemoryDestination.clear();
    }
    // Check if we should force browser behavior (for testing)
    const forceBrowser = typeof bindings === "object" &&
        bindings &&
        "__forceType" in bindings &&
        bindings.__forceType === "browser";
    // If forcing browser mode, create a simple console-based logger
    if (forceBrowser) {
        const levelStr = typeof level === "number" ? "info" : level || effectiveLogLevel;
        const currentLevel = levelStr.toLowerCase();
        const formatArgs = (...args) => {
            return args
                .map((arg) => {
                if (typeof arg === "string")
                    return arg;
                if (arg instanceof Error)
                    return arg.message;
                return safeStringify(arg);
            })
                .join(" ");
        };
        const logToConsole = (method, ...args) => {
            if (!shouldLog(method, currentLevel)) {
                return;
            }
            const message = formatArgs(...args);
            const consoleMethod = method === "fatal"
                ? "error"
                : method === "trace" || method === "verbose"
                    ? "debug"
                    : method === "success" || method === "progress"
                        ? "info"
                        : method === "log"
                            ? "log"
                            : method in console &&
                                typeof console[method] === "function"
                                ? method
                                : "log";
            const consoleFn = console[consoleMethod];
            if (consoleFn && typeof consoleFn === "function") {
                // TypeScript doesn't know that consoleMethod excludes non-function properties
                // but we've already checked typeof consoleFn === 'function', so it's safe
                consoleFn(message);
            }
        };
        /**
         * Safely redact sensitive data from an object (browser version)
         */
        const safeRedact = (obj) => {
            try {
                const copy = { ...obj };
                redact(copy);
                return copy;
            }
            catch {
                return obj;
            }
        };
        const adaptArgs = (obj, msg, ...args) => {
            if (typeof obj === "string") {
                return msg !== undefined ? [obj, msg, ...args] : [obj, ...args];
            }
            if (obj instanceof Error) {
                return msg !== undefined
                    ? [obj.message, msg, ...args]
                    : [obj.message, ...args];
            }
            // Redact sensitive data from objects
            const redactedObj = safeRedact(obj);
            if (msg !== undefined) {
                // Browser is always pretty mode - format as compact single line
                const formatted = formatPrettyLog(redactedObj, msg, false);
                return [formatted, ...args];
            }
            // No message - format context only
            const formatted = formatPrettyLog(redactedObj, "", false);
            return formatted ? [formatted, ...args] : [...args];
        };
        return {
            level: currentLevel,
            trace: (obj, msg, ...args) => logToConsole("trace", ...adaptArgs(obj, msg, ...args)),
            debug: (obj, msg, ...args) => logToConsole("debug", ...adaptArgs(obj, msg, ...args)),
            info: (obj, msg, ...args) => logToConsole("info", ...adaptArgs(obj, msg, ...args)),
            warn: (obj, msg, ...args) => logToConsole("warn", ...adaptArgs(obj, msg, ...args)),
            error: (obj, msg, ...args) => logToConsole("error", ...adaptArgs(obj, msg, ...args)),
            fatal: (obj, msg, ...args) => logToConsole("fatal", ...adaptArgs(obj, msg, ...args)),
            success: (obj, msg, ...args) => logToConsole("success", ...adaptArgs(obj, msg, ...args)),
            progress: (obj, msg, ...args) => logToConsole("progress", ...adaptArgs(obj, msg, ...args)),
            log: (obj, msg, ...args) => logToConsole("log", ...adaptArgs(obj, msg, ...args)),
            clear: () => {
                if (typeof console.clear === "function")
                    console.clear();
            },
            child: (childBindings) => createLogger({
                level: currentLevel,
                ...base,
                ...childBindings,
                __forceType: "browser",
            }),
        };
    }
    // Create sealed Adze instance with configuration
    const sealed = sealAdze(base);
    const levelStr = typeof level === "number" ? "info" : level || effectiveLogLevel;
    const currentLevel = levelStr.toLowerCase();
    /**
     * Invoke Adze method with error capture
     */
    const invoke = (method, ...args) => {
        // Check if this log level should be output
        if (!shouldLog(method, currentLevel)) {
            return;
        }
        // Capture to in-memory destination for API access (even for namespaced loggers)
        let msg = "";
        if (args.length > 0) {
            msg = args
                .map((arg) => {
                if (typeof arg === "string")
                    return arg;
                if (arg instanceof Error)
                    return arg.message;
                return safeStringify(arg);
            })
                .join(" ");
        }
        // Include namespace in the message if present
        if (base.namespace) {
            msg = `#${base.namespace}  ${msg}`;
        }
        const entry = {
            time: Date.now(),
            level: LOG_LEVEL_PRIORITY[method.toLowerCase()] || LOG_LEVEL_PRIORITY.info,
            msg,
        };
        globalInMemoryDestination.write(entry);
        writeLogEntryToFile(entry);
        // Map Eliza methods to correct Adze invocations
        let adzeMethod = method;
        let adzeArgs = args;
        // Normalize special cases - map our custom levels to Adze levels
        if (method === "fatal") {
            // Adze uses 'alert' for fatal-level logging
            adzeMethod = "alert";
        }
        else if (method === "progress") {
            // Map progress to info level with a prefix
            adzeMethod = "info";
            adzeArgs = ["[PROGRESS]", ...args];
        }
        else if (method === "success") {
            // Map success to info level with a prefix
            adzeMethod = "info";
            adzeArgs = ["[SUCCESS]", ...args];
        }
        else if (method === "trace") {
            // Map trace to verbose
            adzeMethod = "verbose";
        }
        // Invoke the sealed logger method
        try {
            // The sealed logger implements AdzeLogMethods
            const loggerWithMethods = sealed;
            const logMethod = loggerWithMethods[adzeMethod];
            if (typeof logMethod === "function") {
                logMethod.call(loggerWithMethods, ...adzeArgs);
            }
        }
        catch {
            // Adze internals failed — drop the log entry rather than breaking the runtime
        }
    };
    /**
     * Safely redact sensitive data from an object
     * Creates a shallow copy to avoid mutating the original
     */
    const safeRedact = (obj) => {
        try {
            // Create a shallow copy to avoid mutating original
            const copy = { ...obj };
            // fast-redact returns the redacted string when serialize:false
            // but mutates the object in place, so we use the copy
            redact(copy);
            return copy;
        }
        catch {
            // If redaction fails, return original (don't break logging)
            return obj;
        }
    };
    /**
     * Adapt elizaOS logger API arguments to Adze format
     * Also applies redaction to sensitive data in objects
     *
     * In pretty mode: formats as compact single line [src] agent — message (extras)
     * In JSON mode: keeps structured object for machine parsing
     */
    const adaptArgs = (obj, msg, ...args) => {
        // String first argument - no context object
        if (typeof obj === "string") {
            return msg !== undefined ? [obj, msg, ...args] : [obj, ...args];
        }
        // Error object
        if (obj instanceof Error) {
            return msg !== undefined
                ? [obj.message, { error: obj }, msg, ...args]
                : [obj.message, { error: obj }, ...args];
        }
        // Object (context) - redact sensitive data
        const redactedObj = safeRedact(obj);
        if (msg !== undefined) {
            // Pretty mode: format as compact single line
            if (!raw) {
                const formatted = formatPrettyLog(redactedObj, msg, raw);
                return [formatted, ...args];
            }
            // JSON mode: keep structured object for machine parsing
            return [msg, redactedObj, ...args];
        }
        // No message provided - just context object
        if (!raw) {
            // Pretty mode: format the object as a simple string
            const formatted = formatPrettyLog(redactedObj, "", raw);
            return formatted ? [formatted, ...args] : [...args];
        }
        return [redactedObj, ...args];
    };
    // Create log methods
    const trace = (obj, msg, ...args) => invoke("verbose", ...adaptArgs(obj, msg, ...args));
    const debug = (obj, msg, ...args) => invoke("debug", ...adaptArgs(obj, msg, ...args));
    const info = (obj, msg, ...args) => invoke("info", ...adaptArgs(obj, msg, ...args));
    const warn = (obj, msg, ...args) => invoke("warn", ...adaptArgs(obj, msg, ...args));
    const error = (obj, msg, ...args) => invoke("error", ...adaptArgs(obj, msg, ...args));
    const fatal = (obj, msg, ...args) => invoke("fatal", ...adaptArgs(obj, msg, ...args));
    const success = (obj, msg, ...args) => invoke("success", ...adaptArgs(obj, msg, ...args));
    const progress = (obj, msg, ...args) => invoke("progress", ...adaptArgs(obj, msg, ...args));
    const logFn = (obj, msg, ...args) => invoke("log", ...adaptArgs(obj, msg, ...args));
    /**
     * Clear console and memory buffer
     */
    const clear = () => {
        const consoleClear = console.clear;
        if (typeof consoleClear === "function") {
            consoleClear();
        }
        globalInMemoryDestination.clear();
    };
    /**
     * Create child logger with additional bindings
     */
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
        child,
    };
}
// ============================================================================
// Exports
// ============================================================================
// Create default logger instance
const logger = createLogger();
// Backward compatibility alias
export const elizaLogger = logger;
// Export recent logs function
export const recentLogs = () => globalInMemoryDestination.recentLogs();
// Export everything
export { createLogger, logger };
export default logger;
//# sourceMappingURL=logger.js.map