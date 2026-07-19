/**
 * Canonical wire contract for the universal slash-command catalog served by
 * `GET /api/commands`. This is the single declaration of the command transport
 * shape — the projection `serializeCommand` produces, the TUI autocomplete
 * consumes, the web composer renders, and the connector bridges forward.
 *
 * The domain vocabulary (`CommandScope`, `CommandCategory`, `CommandSurface`,
 * `CommandArgSource`, `ClientCommandAction`, `CommandTarget`) lives in
 * `@elizaos/core` alongside `CommandDefinition`; those types are re-exported
 * here so every wire consumer references one enum/union and cannot drift (the
 * TUI previously carried a hand-synced copy that lost `toggle-transcription`,
 * the `source` field, `views`, and the strong `category` union — #12411).
 *
 * Kept in the shared api layer next to `agent-api-types` so agent, UI, TUI, and
 * `@elizaos/plugin-commands` import one contract without a runtime dependency
 * on the plugin.
 */
export {};
//# sourceMappingURL=command-transport-types.js.map