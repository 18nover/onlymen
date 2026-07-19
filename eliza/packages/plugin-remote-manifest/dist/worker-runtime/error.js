/**
 * Error serialization across the worker boundary.
 *
 * The wire envelope carries a `{ name, message, stack?, cause?, code? }`
 * payload. The receiving side re-throws an `Error` whose `stack`
 * preserves the remote frames and is prefixed with a clearly-marked
 * boundary frame so debuggers can tell where the boundary was crossed.
 */
/** Convert an unknown thrown value into a wire-safe descriptor. */
export function toWireError(value) {
    if (value instanceof Error) {
        const cause = serializeCause(value.cause);
        const code = value.code !== undefined
            ? String(value.code)
            : undefined;
        const out = {
            name: value.name,
            message: value.message,
        };
        if (value.stack)
            out.stack = value.stack;
        if (cause !== undefined)
            out.cause = cause;
        if (code !== undefined)
            out.code = code;
        return out;
    }
    return { name: "Error", message: String(value) };
}
/** Rehydrate a wire descriptor into a thrown-able Error. */
export function fromWireError(wire, boundary) {
    const err = new Error(wire.message);
    err.name = wire.name;
    if (wire.code !== undefined)
        err.code = wire.code;
    if (wire.cause !== undefined) {
        err.cause = wire.cause;
    }
    const remoteStack = wire.stack ?? `${wire.name}: ${wire.message}`;
    const boundaryFrame = `    at [${boundary} boundary]`;
    const localStack = err.stack ?? "";
    err.stack = `${remoteStack}\n${boundaryFrame}\n${localStack
        .split("\n")
        .slice(1)
        .join("\n")}`;
    return err;
}
function serializeCause(cause) {
    if (cause === undefined)
        return undefined;
    if (cause === null)
        return null;
    if (typeof cause === "string" ||
        typeof cause === "number" ||
        typeof cause === "boolean") {
        return cause;
    }
    if (cause instanceof Error) {
        return {
            name: cause.name,
            message: cause.message,
            ...(cause.stack ? { stack: cause.stack } : {}),
        };
    }
    try {
        return JSON.parse(JSON.stringify(cause));
    }
    catch {
        return String(cause);
    }
}
//# sourceMappingURL=error.js.map