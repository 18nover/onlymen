/**
 * Real connector helpers for integration tests.
 *
 * These helpers create real Discord/Telegram bot connections for testing
 * connector functionality against your own accounts.
 *
 * Usage:
 *   import { createDiscordTestClient, sendDiscordDM } from "../../test/helpers/real-connector.js";
 *
 *   const discord = await createDiscordTestClient();
 *   await sendDiscordDM(discord.client, discord.userId, "test message");
 *   const reply = await waitForDiscordMessage(discord.client, channelId, 30_000);
 */
export interface DiscordTestClient {
    client: unknown;
    userId: string;
    destroy: () => Promise<void>;
}
/**
 * Create a real Discord bot client for testing.
 * Requires DISCORD_BOT_TOKEN in env.
 * Returns null if token is not available.
 */
export declare function createDiscordTestClient(): Promise<DiscordTestClient | null>;
/**
 * Send a DM to a Discord user via the bot.
 */
export declare function sendDiscordDM(client: unknown, userId: string, content: string): Promise<void>;
/**
 * Send a message to a Discord channel.
 */
export declare function sendDiscordChannelMessage(client: unknown, channelId: string, content: string): Promise<void>;
/**
 * Wait for a new message in a Discord channel within the given timeout.
 * Returns the message content or null if timeout.
 */
export declare function waitForDiscordMessage(client: unknown, channelId: string, timeoutMs?: number, fromBotOnly?: boolean): Promise<string | null>;
export interface TelegramTestBot {
    token: string;
    botInfo: {
        id: number;
        username: string;
    };
    sendMessage: (chatId: string | number, text: string) => Promise<void>;
    destroy: () => void;
}
/**
 * Create a real Telegram bot for testing.
 * Requires TELEGRAM_BOT_TOKEN in env.
 * Returns null if token is not available.
 */
export declare function createTelegramTestBot(): Promise<TelegramTestBot | null>;
//# sourceMappingURL=real-connector.d.ts.map