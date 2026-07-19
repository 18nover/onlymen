/**
 * Large ASCII headings for dev startup banners.
 *
 * Why banners: quick visual separation when four processes print similar tables
 * in sequence — humans/agents spot which child is speaking without reading prefixes.
 * This isomorphic copy always renders the plain boxed marker; the Node-only
 * app-core copy loads figlet for the fancier block.
 */
/** Subsystem printed as giant ASCII above each dev settings table. */
export type DevSubsystemBannerKind = "orchestrator" | "vite" | "api" | "electrobun";
/** Renders a plain boxed heading (short marker) for the given subsystem. */
export declare function renderDevSubsystemFigletHeading(kind: DevSubsystemBannerKind): string;
/** Heading block, blank line, then the settings table (and any trailing footer). */
export declare function prependDevSubsystemFigletHeading(kind: DevSubsystemBannerKind, tableAndFooter: string): string;
//# sourceMappingURL=dev-settings-figlet-heading.d.ts.map