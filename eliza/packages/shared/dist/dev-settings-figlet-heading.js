/**
 * Large ASCII headings for dev startup banners.
 *
 * Why banners: quick visual separation when four processes print similar tables
 * in sequence — humans/agents spot which child is speaking without reading prefixes.
 * This isomorphic copy always renders the plain boxed marker; the Node-only
 * app-core copy loads figlet for the fancier block.
 */
function renderFallbackHeading(text) {
    const rule = "_".repeat(text.length + 2);
    return [` ${rule} `, `| ${text} |`, `|${rule}|`].join("\n");
}
const SUBSYSTEM_FIGLET_TEXT = {
    orchestrator: "ORCHESTRATOR",
    vite: "VITE",
    api: "API",
    electrobun: "ELECTROBUN",
};
/** Renders a plain boxed heading (short marker) for the given subsystem. */
export function renderDevSubsystemFigletHeading(kind) {
    return renderFallbackHeading(SUBSYSTEM_FIGLET_TEXT[kind]);
}
/** Heading block, blank line, then the settings table (and any trailing footer). */
export function prependDevSubsystemFigletHeading(kind, tableAndFooter) {
    const head = renderDevSubsystemFigletHeading(kind);
    return `${head}\n\n${tableAndFooter}`;
}
//# sourceMappingURL=dev-settings-figlet-heading.js.map