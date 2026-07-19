/**
 * Build the {@link WorkerAnnouncePluginMessage.descriptor} payload from
 * the author's Plugin object.
 *
 * The descriptor is a JSON-safe copy of the Plugin where every function
 * value is replaced by a `{ rpc: true, id: <stable-id> }` tag. The host
 * uses the tags as the `target` in subsequent `worker-rpc` invocations.
 *
 * The mapping of `id → handler` is kept in a per-worker
 * {@link HandlerRegistry} so the dispatcher can resolve incoming
 * worker-rpc calls back to the live function.
 */
export function createHandlerRegistry() {
    const inner = new Map();
    return {
        get: (id) => inner.get(id),
        set: (id, entry) => {
            inner.set(id, entry);
        },
        clear: () => inner.clear(),
        get size() {
            return inner.size;
        },
    };
}
/**
 * Walk `plugin`, allocate a stable id for each function, register the
 * handler, and return a JSON descriptor with `{ rpc: true, id }` in
 * lieu of each function.
 */
/**
 * Lazy service-instance cache keyed by serviceType. The first method
 * invocation on a service triggers `service.start(runtime)`; subsequent
 * calls reuse the cached instance until the worker shuts down or the
 * service's stop() is called externally.
 */
const serviceInstances = new WeakMap();
async function serviceMethodTrampoline(service, method, args) {
    let instancePromise = serviceInstances.get(service);
    if (!instancePromise) {
        // First call: bootstrap the service. The runtime arg is the
        // RuntimeProxyApi the dispatcher injects (see dispatch.ts).
        const [runtime] = args;
        instancePromise = service.start(runtime);
        serviceInstances.set(service, instancePromise);
    }
    const instance = await instancePromise;
    const fn = instance[method];
    if (typeof fn !== "function") {
        throw new Error(`Service ${service.serviceType} has no rpcMethod "${method}".`);
    }
    // args[0] is runtime; args[1..] are the actual method args.
    return fn.apply(instance, args.slice(1));
}
export function buildAnnounceDescriptor(plugin, registry) {
    let counter = 0;
    const allocId = (kind, target) => {
        counter += 1;
        return `${kind}:${target}:${counter}`;
    };
    const refOf = (fn, surface, target) => {
        const id = allocId(surface, target);
        registry.set(id, { id, surface, target, handler: fn });
        return { rpc: true, id };
    };
    const descriptor = {
        name: plugin.name,
        mode: "remote",
    };
    if (plugin.description)
        descriptor.description = plugin.description;
    if (plugin.priority !== undefined)
        descriptor.priority = plugin.priority;
    if (plugin.dependencies)
        descriptor.dependencies = plugin.dependencies;
    if (plugin.config)
        descriptor.config = plugin.config;
    if (plugin.schema)
        descriptor.schema = plugin.schema;
    if (plugin.actions?.length) {
        descriptor.actions = plugin.actions.map((action) => {
            const entry = {
                name: action.name,
                handler: refOf(action.handler, "action", action.name),
            };
            if (action.similes)
                entry.similes = action.similes;
            if (action.description)
                entry.description = action.description;
            if (action.examples !== undefined)
                entry.examples = action.examples;
            if (action.validate) {
                entry.validate = refOf(action.validate, "action", `${action.name}.validate`);
            }
            return entry;
        });
    }
    if (plugin.providers?.length) {
        descriptor.providers = plugin.providers.map((provider) => {
            const entry = {
                name: provider.name,
                get: refOf(provider.get, "provider", provider.name),
            };
            if (provider.description)
                entry.description = provider.description;
            if (provider.dynamic !== undefined)
                entry.dynamic = provider.dynamic;
            if (provider.position !== undefined)
                entry.position = provider.position;
            if (provider.private !== undefined)
                entry.private = provider.private;
            return entry;
        });
    }
    if (plugin.models) {
        const modelDescriptor = {};
        for (const [modelType, fn] of Object.entries(plugin.models)) {
            modelDescriptor[modelType] = refOf(fn, "model", modelType);
        }
        descriptor.models = modelDescriptor;
    }
    if (plugin.events) {
        const eventDescriptor = {};
        for (const [eventName, handlers] of Object.entries(plugin.events)) {
            eventDescriptor[eventName] = handlers.map((handler, index) => refOf(handler, "event", `${eventName}#${index}`));
        }
        descriptor.events = eventDescriptor;
    }
    if (plugin.services?.length) {
        descriptor.services = plugin.services.map((service) => {
            const entry = {
                serviceType: service.serviceType,
                rpcMethods: service.rpcMethods,
            };
            if (service.capabilityDescription) {
                entry.capabilityDescription = service.capabilityDescription;
            }
            // Each rpcMethod becomes a registered handler keyed by the
            // service.method combo. The actual instance is started lazily
            // when the host first invokes a method (see dispatch.ts).
            for (const method of service.rpcMethods) {
                const target = `${service.serviceType}.${method}`;
                // Register a closure that defers to the service instance
                // resolved by dispatch.ts when this id is invoked. The handler
                // receives the runtime + method args.
                const handler = async (...args) => serviceMethodTrampoline(service, method, args);
                const id = allocId("service", target);
                registry.set(id, { id, surface: "service", target, handler });
                entry[`rpc:${method}`] = { rpc: true, id };
            }
            return entry;
        });
    }
    if (plugin.evaluators?.length) {
        descriptor.evaluators = plugin.evaluators.map((evaluator) => {
            const entry = {
                name: evaluator.name,
                handler: refOf(evaluator.handler, "evaluator", evaluator.name),
            };
            if (evaluator.description)
                entry.description = evaluator.description;
            if (evaluator.validate) {
                entry.validate = refOf(evaluator.validate, "evaluator", `${evaluator.name}.validate`);
            }
            return entry;
        });
    }
    if (plugin.routes?.length) {
        descriptor.routes = plugin.routes.map((route) => {
            const entry = {
                path: route.path,
            };
            if (route.type)
                entry.type = route.type;
            if (route.name)
                entry.name = route.name;
            if (route.public !== undefined)
                entry.public = route.public;
            if (route.publicReason)
                entry.publicReason = route.publicReason;
            if (route.publicWrite)
                entry.publicWrite = route.publicWrite;
            if (route.isMultipart !== undefined)
                entry.isMultipart = route.isMultipart;
            if (route.routeHandler) {
                entry.routeHandler = refOf(route.routeHandler, "route", `${route.type ?? "GET"} ${route.path}`);
            }
            return entry;
        });
    }
    // JSON-only metadata fields: copy through unchanged.
    if (plugin.views)
        descriptor.views = plugin.views;
    if (plugin.widgets)
        descriptor.widgets = plugin.widgets;
    if (plugin.componentTypes) {
        descriptor.componentTypes = plugin.componentTypes;
    }
    return descriptor;
}
//# sourceMappingURL=descriptor.js.map