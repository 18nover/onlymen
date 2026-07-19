/**
 * Worker-side dispatcher for inbound `worker-rpc` messages.
 *
 * The host invokes a registered surface (action, provider, etc.) by
 * sending a `worker-rpc` envelope carrying the rpc-id and JSON args. The
 * dispatcher resolves the id to the live handler via the
 * {@link HandlerRegistry}, marshals JSON args back into handler-shaped
 * arguments (synthesising a {@link RuntimeProxy} and surface-specific
 * helpers like the {@link CallbackProxy}), invokes, and posts the
 * result as a `worker-rpc-result`.
 */
import { canonicalRpcBytes, hexDecode } from "../rpc-mac.js";
import { toWireError } from "./error.js";
/**
 * Build the dispatcher's `onMessage` callback. The bootstrap wires this
 * to the worker channel.
 */
export function createWorkerRpcDispatcher(registry, context) {
    return async (message) => {
        const reply = (result) => {
            context.channel.send(result);
        };
        // SOC2 A-4: HMAC verification.
        if (context.rpcAuth) {
            const macOk = await verifyMac(message, context.rpcAuth);
            if (!macOk) {
                reply({
                    type: "worker-rpc-result",
                    requestId: message.requestId,
                    ok: false,
                    error: {
                        name: "RpcAuthError",
                        message: "Worker RPC message MAC missing or invalid",
                        code: "RPC_AUTH_FAILED",
                    },
                });
                return;
            }
        }
        const entry = registry.get(message.target);
        if (!entry) {
            reply({
                type: "worker-rpc-result",
                requestId: message.requestId,
                ok: false,
                error: {
                    name: "UnknownTargetError",
                    message: `No handler registered for ${message.surface}:${message.target}`,
                    code: "UNKNOWN_TARGET",
                },
            });
            return;
        }
        if (entry.surface !== message.surface) {
            reply({
                type: "worker-rpc-result",
                requestId: message.requestId,
                ok: false,
                error: {
                    name: "SurfaceMismatchError",
                    message: `RPC surface ${message.surface} does not match registered handler surface ${entry.surface} for target ${message.target}`,
                    code: "SURFACE_MISMATCH",
                },
            });
            return;
        }
        // SOC2 A-5: permission enforcement.
        if (context.permissions) {
            const denial = checkPermission(entry.surface, context.permissions.granted);
            if (denial) {
                if (context.permissions.auditDispatcher) {
                    try {
                        await context.permissions.auditDispatcher.emit({
                            actor: { type: "system", id: "agent" },
                            action: "plugin.denied",
                            result: "denied",
                            resource: {
                                type: "plugin",
                                id: context.permissions.pluginId,
                            },
                            metadata: {
                                plugin_id: context.permissions.pluginId,
                                surface: message.surface,
                                target: message.target,
                                permission: denial,
                                reason: "permission_not_granted",
                            },
                        });
                    }
                    catch (auditError) {
                        // error-policy:J7 diagnostics-must-not-kill-the-loop — a failed
                        // permission-denial audit emit must not stop us from sending the
                        // deny reply, but the dropped audit event is surfaced rather than
                        // swallowed so a broken audit sink is visible.
                        const cause = auditError instanceof Error
                            ? auditError
                            : new Error(String(auditError));
                        process.stderr.write(`[remote-plugin] WARN: permission-denial audit emit failed for plugin ${context.permissions.pluginId}: ${cause.message}\n`);
                    }
                }
                reply({
                    type: "worker-rpc-result",
                    requestId: message.requestId,
                    ok: false,
                    error: {
                        name: "PermissionDeniedError",
                        message: `Plugin ${context.permissions.pluginId} not granted permission for surface ${message.surface}`,
                        code: "PERMISSION_DENIED",
                    },
                });
                return;
            }
        }
        try {
            const payload = await invokeBySurface(entry, message, context);
            reply({
                type: "worker-rpc-result",
                requestId: message.requestId,
                ok: true,
                payload,
            });
        }
        catch (error) {
            reply({
                type: "worker-rpc-result",
                requestId: message.requestId,
                ok: false,
                error: toWireError(error),
            });
        }
    };
}
/**
 * Surface-specific handler shapes the dispatcher routes JSON args into.
 * Adding a new surface is a new case here; everything else stays the
 * same.
 */
async function invokeBySurface(entry, message, context) {
    const args = (message.args ?? null);
    switch (entry.surface) {
        case "provider": {
            // Provider.get(runtime, message, state)
            const params = args;
            const result = await entry.handler(context.runtime, params.message, params.state);
            return (result ?? null);
        }
        case "event": {
            // Event handler takes a single payload arg; no return.
            await entry.handler(args);
            return null;
        }
        case "model": {
            // Model handler(runtime, params) → result
            const params = args;
            const result = await entry.handler(context.runtime, params.params);
            return (result ?? null);
        }
        case "action": {
            // Action handler(runtime, message, state, options, callback, responses)
            // `callback` round-trips back to the host when callbackId is provided.
            const params = args;
            const callback = makeActionCallback(context.channel, params.callbackId);
            const result = await entry.handler(context.runtime, params.message, params.state, params.options, callback, params.responses);
            return (result ?? null);
        }
        case "evaluator": {
            const params = args;
            const result = await entry.handler(context.runtime, params.message, params.state);
            return (result ?? null);
        }
        case "route": {
            const params = args;
            const result = await entry.handler(params.ctx);
            return (result ?? null);
        }
        case "service": {
            // Trampoline expects (runtime, ...methodArgs). The host sends
            // `{ args: unknown[] }`; pass through.
            const params = args;
            const result = await entry.handler(context.runtime, ...(params.args ?? []));
            return (result ?? null);
        }
        case "tests":
            throw new Error(`Surface "tests" is not host-RPC reachable; run via the worker's existing test runner.`);
        default: {
            const _exhaustive = entry.surface;
            throw new Error(`Unknown surface: ${String(_exhaustive)}`);
        }
    }
}
async function verifyMac(message, auth) {
    if (!message.mac)
        return false;
    let tag;
    try {
        tag = hexDecode(message.mac);
    }
    catch {
        return false;
    }
    const data = canonicalRpcBytes(message);
    try {
        return await auth.kms.hmacVerify(auth.keyId, data, tag);
    }
    catch {
        return false;
    }
}
/**
 * Map a surface kind to the host-permission gate that must be granted.
 * Returns the missing permission label when denied, or null when allowed.
 *
 * This is intentionally coarse — finer per-action permission gates can
 * layer on top once the action surface contract is stable.
 */
function checkPermission(surface, granted) {
    // `tests` is never host-RPC reachable; the surface switch will reject.
    if (surface === "tests")
        return null;
    // Treat any surface as allowed when the grant is empty/absent. The
    // tighter mapping below applies once any grants are set.
    if (!granted ||
        (Object.keys(granted.bun ?? {}).length === 0 &&
            Object.keys(granted.host ?? {}).length === 0)) {
        return null;
    }
    // Surfaces that touch host services need bun:run OR a host:* grant.
    const bun = granted.bun ?? {};
    const host = granted.host ?? {};
    const hasAnyHost = Object.values(host).some(Boolean);
    switch (surface) {
        case "action":
        case "service":
        case "route":
            // Mutating surfaces require some host or run permission.
            if (bun.run || hasAnyHost)
                return null;
            return "bun:run | host:*";
        case "provider":
        case "evaluator":
        case "model":
        case "event":
            // Read-only-ish surfaces: allow when any permission is granted.
            if (bun.read || bun.run || hasAnyHost)
                return null;
            return "bun:read | host:*";
        default:
            return null;
    }
}
function makeActionCallback(channel, callbackId) {
    return async (data) => {
        if (!callbackId)
            return;
        const message = {
            type: "worker-action-callback",
            callbackId,
            payload: (data ?? null),
        };
        channel.send(message);
    };
}
//# sourceMappingURL=dispatch.js.map