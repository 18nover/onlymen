/**
 * Runtime-agnostic type contracts shared across the bridge, dashboard, and
 * host surfaces — a type-only module (no runtime values). Collects: Electrobun
 * RPC install-detection types, per-connector status snapshots (WhatsApp,
 * Telegram, Discord, Slack, Google Chat, Signal, iMessage, Nostr, MS Teams)
 * and the generic channel snapshot shape, the plugin config-UI hint schema
 * (`ConfigUiHint` with dynamic-value / visibility / validation / action-binding
 * expressions and `PluginUiTheme` tokens), config snapshots, presence entries,
 * gateway agent/session/file rows, cron job definitions, and skill status
 * reports. Consumed by both Node and browser code, so it must stay import-free.
 */
export {};
//# sourceMappingURL=index.js.map