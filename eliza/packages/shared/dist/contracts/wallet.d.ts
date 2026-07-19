/**
 * Shared wallet API contracts.
 *
 * Pure type definitions are re-exported from @elizaos/contracts.
 * Runtime helpers (RPC catalog, normalizers, builders) live here.
 */
import type { WalletConfigStatus, WalletConfigUpdateRequest, WalletRpcChain, WalletRpcCredentialKey, WalletRpcSelections } from "@elizaos/contracts";
export type { BscTradeExecuteRequest, BscTradeExecuteResponse, BscTradeExecutionResult, BscTradePreflightRequest, BscTradePreflightResponse, BscTradeQuoteLeg, BscTradeQuoteRequest, BscTradeQuoteResponse, BscTradeReadinessChecks, BscTradeRoutePreference, BscTradeRouteProvider, BscTradeSide, BscTradeTxStatus, BscTradeTxStatusResponse, BscTransferExecuteRequest, BscTransferExecuteResponse, BscTransferExecutionResult, BscUnsignedApprovalTx, BscUnsignedTradeTx, BscUnsignedTransferTx, BscWalletRpcProvider, EvmChainBalance, EvmNft, EvmSigningCapabilityKind, EvmTokenBalance, EvmWalletRpcProvider, KeyValidationResult, SolanaNft, SolanaTokenBalance, SolanaWalletRpcProvider, StewardApprovalInfo, StewardBalanceResponse, StewardPolicyResult, StewardTokenBalance, StewardTokenBalancesResponse, StewardWalletAddressesResponse, StewardWebhookEvent, StewardWebhookEventsResponse, StewardWebhookEventType, TradePermissionMode, WalletAddresses, WalletAddressPair, WalletBalancesResponse, WalletChain, WalletChainKind, WalletConfigStatus, WalletConfigUpdateRequest, WalletEntry, WalletEvmBalances, WalletEvmNftCollection, WalletExportRejection, WalletExportRequestBody, WalletGenerateResult, WalletImportResult, WalletKeys, WalletMarketMover, WalletMarketOverviewProviderId, WalletMarketOverviewResponse, WalletMarketOverviewSource, WalletMarketPrediction, WalletMarketPriceSnapshot, WalletNetworkMode, WalletNftMetadataBase, WalletNftsResponse, WalletPrimaryMap, WalletPrimaryUpdateRequest, WalletPrimaryUpdateResponse, WalletProviderKind, WalletRpcChain, WalletRpcCredentialKey, WalletRpcSelections, WalletSolanaBalances, WalletSolanaNftCollection, WalletSource, WalletTokenBalanceBase, WalletTradeLedgerEntry, WalletTradeLedgerQuoteLeg, WalletTradeLedgerRecordInput, WalletTradeSource, WalletTradingProfileRecentSwap, WalletTradingProfileResponse, WalletTradingProfileSeriesPoint, WalletTradingProfileSourceFilter, WalletTradingProfileSummary, WalletTradingProfileTokenBreakdown, WalletTradingProfileWindow, } from "@elizaos/contracts";
export declare const WALLET_RPC_PROVIDER_OPTIONS: {
    readonly evm: readonly [{
        readonly id: "eliza-cloud";
        readonly label: "Eliza Cloud";
    }, {
        readonly id: "alchemy";
        readonly label: "Alchemy";
    }, {
        readonly id: "infura";
        readonly label: "Infura";
    }, {
        readonly id: "ankr";
        readonly label: "Ankr";
    }];
    readonly bsc: readonly [{
        readonly id: "eliza-cloud";
        readonly label: "Eliza Cloud";
    }, {
        readonly id: "alchemy";
        readonly label: "Alchemy";
    }, {
        readonly id: "ankr";
        readonly label: "Ankr";
    }, {
        readonly id: "nodereal";
        readonly label: "NodeReal";
    }, {
        readonly id: "quicknode";
        readonly label: "QuickNode";
    }];
    readonly solana: readonly [{
        readonly id: "eliza-cloud";
        readonly label: "Eliza Cloud";
    }, {
        readonly id: "helius-birdeye";
        readonly label: "Helius + Birdeye";
    }];
};
export declare const DEFAULT_WALLET_RPC_SELECTIONS: WalletRpcSelections;
export declare function normalizeWalletRpcProviderId<TChain extends WalletRpcChain>(chain: TChain, value: string | null | undefined): WalletRpcSelections[TChain] | null;
export declare function normalizeWalletRpcSelections(input: Partial<Record<WalletRpcChain, string | null | undefined>> | WalletRpcSelections | null | undefined): WalletRpcSelections;
export declare function resolveInitialWalletRpcSelections(walletConfig: WalletConfigStatus | null | undefined): WalletRpcSelections;
export declare function buildWalletRpcUpdateRequest(args: {
    walletConfig?: WalletConfigStatus | null;
    rpcFieldValues: Partial<Record<WalletRpcCredentialKey, string>>;
    selectedProviders: WalletRpcSelections | Partial<Record<WalletRpcChain, string | null | undefined>>;
    selectedNetwork?: "mainnet" | "testnet";
}): WalletConfigUpdateRequest;
//# sourceMappingURL=wallet.d.ts.map