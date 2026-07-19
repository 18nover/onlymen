/**
 * Calendar API contracts.
 *
 * Canonical home for the calendar event / feed / summary DTOs consumed by
 * `@elizaos/plugin-calendar` (service, action, routes, client, UI) and by
 * `@elizaos/plugin-personal-assistant` (briefs, reminders, travel) and the `@elizaos/ui`
 * client type augmentation. They live in `@elizaos/shared` because the
 * contract layer is the only package both `@elizaos/ui` and the plugins can
 * depend on without a cycle.
 *
 * The `LifeOps`-prefixed names are retained for source compatibility with the
 * many existing importers; the types are calendar-owned regardless of prefix.
 */
export const LIFEOPS_CALENDAR_WINDOW_PRESETS = [
    "tomorrow_morning",
    "tomorrow_afternoon",
    "tomorrow_evening",
];
//# sourceMappingURL=calendar.js.map