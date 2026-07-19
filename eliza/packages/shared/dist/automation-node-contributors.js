function normalizeCapabilityName(value) {
    return value.trim().toLowerCase();
}
function getRuntimeActionCapabilityNames(runtime) {
    const names = new Set();
    for (const action of runtime.actions ?? []) {
        names.add(normalizeCapabilityName(action.name));
        for (const simile of action.similes ?? []) {
            names.add(normalizeCapabilityName(simile));
        }
    }
    return names;
}
function getRuntimePluginNames(runtime) {
    return new Set((runtime.plugins ?? [])
        .map((plugin) => normalizeCapabilityName(plugin.name))
        .filter((name) => name.length > 0));
}
function hasMatchingRuntimeCapability(spec, actionNames, pluginNames) {
    if (spec.enabledWithoutRuntimeCapability) {
        return true;
    }
    return (spec.actionNames.some((name) => actionNames.has(normalizeCapabilityName(name))) ||
        spec.pluginNames.some((name) => pluginNames.has(normalizeCapabilityName(name))));
}
/**
 * Build catalog descriptors for a set of runtime-capability specs, gating each
 * node's availability on the runtime's loaded actions/plugins.
 */
export function buildRuntimeCapabilityNodes(specs, runtime) {
    const actionNames = getRuntimeActionCapabilityNames(runtime);
    const pluginNames = getRuntimePluginNames(runtime);
    return specs.map((spec) => {
        const enabled = hasMatchingRuntimeCapability(spec, actionNames, pluginNames);
        return {
            id: spec.id,
            label: spec.label,
            description: spec.description,
            class: spec.class,
            source: "static_catalog",
            backingCapability: spec.backingCapability,
            ownerScoped: spec.ownerScoped,
            requiresSetup: !enabled,
            availability: enabled ? "enabled" : "disabled",
            ...(enabled ? {} : { disabledReason: spec.disabledReason }),
        };
    });
}
const contributors = new Map();
export function registerAutomationNodeContributor(id, contributor) {
    const normalizedId = id.trim();
    if (!normalizedId) {
        throw new Error("Automation node contributor id is required");
    }
    contributors.set(normalizedId, contributor);
}
export function listAutomationNodeContributors() {
    return [...contributors.values()];
}
export function clearAutomationNodeContributorsForTests() {
    contributors.clear();
}
//# sourceMappingURL=automation-node-contributors.js.map