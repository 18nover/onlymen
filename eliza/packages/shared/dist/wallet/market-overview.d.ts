/**
 * Wallet market-overview domain logic.
 *
 * Pure, platform-free helpers shared by the Eliza Cloud market-preview service
 * (`@elizaos/cloud-shared` `market-preview.ts`) and the local-mode iOS agent
 * kernel fallback (`@elizaos/ui` `ios-local-agent-kernel.ts`). Both consume
 * the same CoinGecko provider metadata, stablecoin filters, market mapping, and
 * mover-ranking rules from here so the two copies cannot drift.
 *
 * No node/browser/cloud-only dependencies: raw data in, typed domain objects
 * out. Fetching, caching, and response wrapping stay at each call site.
 */
import type { WalletMarketMover, WalletMarketPriceSnapshot } from "@elizaos/contracts";
/** Number of top-market-cap rows requested from CoinGecko. */
export declare const COINGECKO_MARKET_LIMIT = 80;
/** Coins surfaced as fixed price snapshots (never as movers). */
export declare const MARKET_PRICE_IDS: readonly ["bitcoin", "ethereum", "solana"];
export declare const MARKET_PRICE_ID_SET: ReadonlySet<string>;
/** CoinGecko ids of assets excluded from mover ranking (stablecoins). */
export declare const STABLE_ASSET_IDS: ReadonlySet<string>;
/** Ticker symbols of assets excluded from mover ranking (stablecoins). */
export declare const STABLE_ASSET_SYMBOLS: ReadonlySet<string>;
/** CoinGecko provider identity for price + mover sources. */
export declare const COINGECKO_MARKET_PROVIDER: {
    readonly providerId: "coingecko";
    readonly providerName: "CoinGecko";
    readonly providerUrl: "https://www.coingecko.com/";
};
/** Polymarket provider identity for the predictions source. */
export declare const POLYMARKET_MARKET_PROVIDER: {
    readonly providerId: "polymarket";
    readonly providerName: "Polymarket";
    readonly providerUrl: "https://polymarket.com/";
};
/** Normalized CoinGecko `/coins/markets` row used to build the overview. */
export interface CoinGeckoMarketRecord {
    id: string;
    symbol: string;
    name: string;
    currentPriceUsd: number;
    change24hPct: number;
    marketCapRank: number | null;
    imageUrl: string | null;
}
/** Build the CoinGecko `/coins/markets` request URL (USD, 24h change). */
export declare function buildCoinGeckoMarketsUrl(): URL;
/** Map one raw CoinGecko row to a normalized record, or null if incomplete. */
export declare function mapCoinGeckoMarket(input: unknown): CoinGeckoMarketRecord | null;
/** Parse a raw CoinGecko `/coins/markets` payload into normalized records. */
export declare function parseCoinGeckoMarkets(payload: unknown): CoinGeckoMarketRecord[];
/** Whether a market is a stablecoin (excluded from mover ranking). */
export declare function isStableAsset(market: CoinGeckoMarketRecord): boolean;
/** Fixed price snapshots for the tracked `MARKET_PRICE_IDS`, in order. */
export declare function buildMarketPriceSnapshots(markets: CoinGeckoMarketRecord[]): WalletMarketPriceSnapshot[];
/**
 * Top movers by absolute 24h change: exclude tracked price coins and
 * stablecoins, cap at market-cap rank 200, take the six largest movers.
 */
export declare function buildMarketMovers(markets: CoinGeckoMarketRecord[]): WalletMarketMover[];
//# sourceMappingURL=market-overview.d.ts.map