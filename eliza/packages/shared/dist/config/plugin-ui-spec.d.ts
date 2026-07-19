/**
 * Generates UiSpec JSON for plugin/connector configuration forms.
 *
 * When the agent wants to help a user configure a plugin, it generates
 * a UiSpec that renders as an interactive form in chat. The form fields
 * are derived from the plugin's parameter definitions.
 *
 * Actions:
 *   - "plugin:save" → saves config via PUT /api/plugins/:id
 *   - "plugin:enable" → enables the plugin
 *   - "plugin:test" → tests connectivity
 */
export interface PluginParam {
    key: string;
    required?: boolean;
    isSet?: boolean;
    type?: string;
    description?: string;
    label?: string;
}
export interface PluginForUiSpec {
    id: string;
    name: string;
    description?: string;
    enabled?: boolean;
    category?: string;
    parameters: PluginParam[];
}
/** Declarative UI specification for rendering plugin forms in chat. */
export interface PluginUiSpec {
    version: number;
    root: string;
    elements: Record<string, Record<string, unknown>>;
    state: Record<string, unknown>;
}
export declare function buildPluginConfigUiSpec(plugin: PluginForUiSpec): PluginUiSpec;
/**
 * Generate a compact plugin list UiSpec for the agent to show available
 * plugins matching a query.
 */
export declare function buildPluginListUiSpec(plugins: PluginForUiSpec[], title: string): PluginUiSpec;
//# sourceMappingURL=plugin-ui-spec.d.ts.map