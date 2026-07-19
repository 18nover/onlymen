/**
 * Shared system permission contracts.
 *
 * `PermissionId` is the canonical union covering OS integrations across
 * macOS / win32 / linux / iOS / Android / web.
 */
export const PERMISSION_IDS = [
    "screen-recording",
    "accessibility",
    "reminders",
    "calendar",
    "health",
    "screentime",
    "contacts",
    "notes",
    "microphone",
    "camera",
    "location",
    "shell",
    "website-blocking",
    "notifications",
    "full-disk",
    "automation",
    "speech-recognition",
    "photos",
    "phone",
    "messages",
    "wifi",
    "bluetooth",
    "app-blocking",
    "usage-access",
    "overlay",
    "write-settings",
    "local-network",
    "battery-optimization",
];
export function isPermissionId(value) {
    return (typeof value === "string" &&
        PERMISSION_IDS.includes(value));
}
//# sourceMappingURL=permissions.js.map