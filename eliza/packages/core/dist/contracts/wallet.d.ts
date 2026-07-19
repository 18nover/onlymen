/**
 * Wallet API contracts.
 *
 * Type contracts moved to @elizaos/contracts (Phase 5A). Re-export here
 * so existing consumers that import from this module keep compiling.
 * Runtime helpers (normalizers, constants) remain here.
 */
import type { BscTradeExecuteRequest, BscTradeExecuteResponse, BscTradeExecutionResult, BscTradePreflightRequest, BscTradePreflightResponse, BscTradeQuoteLeg, BscTradeQuoteRequest, BscTradeQuoteResponse, BscTradeReadinessChecks, BscTradeRoutePreference, BscTradeRouteProvider, BscTradeSide, BscTradeTxStatus, BscTradeTxStatusResponse, BscTransferExecuteRequest, BscTransferExecuteResponse, BscTransferExecutionResult, BscUnsignedApprovalTx, BscUnsignedTradeTx, BscUnsignedTransferTx, BscWalletRpcProvider, EvmChainBalance, EvmNft, EvmSigningCapabilityKind, EvmTokenBalance, EvmWalletRpcProvider, KeyValidationResult, SolanaNft, SolanaTokenBalance, SolanaWalletRpcProvider, StewardApprovalInfo, StewardBalanceResponse, StewardPolicyResult, StewardTokenBalance, StewardTokenBalancesResponse, StewardWalletAddressesResponse, StewardWebhookEvent, StewardWebhookEventsResponse, StewardWebhookEventType, TradePermissionMode, WalletAddresses, WalletAddressPair, WalletBalancesResponse, WalletChain, WalletChainKind, WalletConfigStatus, WalletConfigUpdateRequest, WalletEntry, WalletEvmBalances, WalletEvmNftCollection, WalletExportRejection, WalletExportRequestBody, WalletGenerateResult, WalletImportResult, WalletKeys, WalletMarketMover, WalletMarketOverviewProviderId, WalletMarketOverviewResponse, WalletMarketOverviewSource, WalletMarketPrediction, WalletMarketPriceSnapshot, WalletNetworkMode, WalletNftMetadataBase, WalletNftsResponse, WalletPrimaryMap, WalletPrimaryUpdateRequest, WalletPrimaryUpdateResponse, WalletProviderKind, WalletRpcChain, WalletRpcCredentialKey, WalletRpcSelections, WalletSolanaBalances, WalletSolanaNftCollection, WalletSource, WalletTokenBalanceBase, WalletTradeLedgerEntry, WalletTradeLedgerQuoteLeg, WalletTradeLedgerRecordInput, WalletTradeSource, WalletTradingProfileRecentSwap, WalletTradingProfileResponse, WalletTradingProfileSeriesPoint, WalletTradingProfileSourceFilter, WalletTradingProfileSummary, WalletTradingProfileTokenBreakdown, WalletTradingProfileWindow } from "@elizaos/contracts";
export type { BscTradeExecuteRequest, BscTradeExecuteResponse, BscTradeExecutionResult, BscTradePreflightRequest, BscTradePreflightResponse, BscTradeQuoteLeg, BscTradeQuoteRequest, BscTradeQuoteResponse, BscTradeReadinessChecks, BscTradeRoutePreference, BscTradeRouteProvider, BscTradeSide, BscTradeTxStatus, BscTradeTxStatusResponse, BscTransferExecuteRequest, BscTransferExecuteResponse, BscTransferExecutionResult, BscUnsignedApprovalTx, BscUnsignedTradeTx, BscUnsignedTransferTx, BscWalletRpcProvider, EvmChainBalance, EvmNft, EvmSigningCapabilityKind, EvmTokenBalance, EvmWalletRpcProvider, KeyValidationResult, SolanaNft, SolanaTokenBalance, SolanaWalletRpcProvider, StewardApprovalInfo, StewardBalanceResponse, StewardPolicyResult, StewardTokenBalance, StewardTokenBalancesResponse, StewardWalletAddressesResponse, StewardWebhookEvent, StewardWebhookEventsResponse, StewardWebhookEventType, TradePermissionMode, WalletAddresses, WalletAddressPair, WalletBalancesResponse, WalletChain, WalletChainKind, WalletConfigStatus, WalletConfigUpdateRequest, WalletEntry, WalletEvmBalances, WalletEvmNftCollection, WalletExportRejection, WalletExportRequestBody, WalletGenerateResult, WalletImportResult, WalletKeys, WalletMarketMover, WalletMarketOverviewProviderId, WalletMarketOverviewResponse, WalletMarketOverviewSource, WalletMarketPrediction, WalletMarketPriceSnapshot, WalletNetworkMode, WalletNftMetadataBase, WalletNftsResponse, WalletPrimaryMap, WalletPrimaryUpdateRequest, WalletPrimaryUpdateResponse, WalletProviderKind, WalletRpcChain, WalletRpcCredentialKey, WalletRpcSelections, WalletSolanaBalances, WalletSolanaNftCollection, WalletSource, WalletTokenBalanceBase, WalletTradeLedgerEntry, WalletTradeLedgerQuoteLeg, WalletTradeLedgerRecordInput, WalletTradeSource, WalletTradingProfileRecentSwap, WalletTradingProfileResponse, WalletTradingProfileSeriesPoint, WalletTradingProfileSourceFilter, WalletTradingProfileSummary, WalletTradingProfileTokenBreakdown, WalletTradingProfileWindow, };
export declare const WALLET_RPC_PROVIDER_OPTIONS: {
    readonly evm: readonly [{
        readonly id: EvmWalletRpcProvider;
        readonly label: "Eliza Cloud";
    }, {
        readonly id: EvmWalletRpcProvider;
        readonly label: "Alchemy";
    }, {
        readonly id: EvmWalletRpcProvider;
        readonly label: "Infura";
    }, {
        readonly id: EvmWalletRpcProvider;
        readonly label: "Ankr";
    }];
    readonly bsc: readonly [{
        readonly id: BscWalletRpcProvider;
        readonly label: "Eliza Cloud";
    }, {
        readonly id: BscWalletRpcProvider;
        readonly label: "Alchemy";
    }, {
        readonly id: BscWalletRpcProvider;
        readonly label: "Ankr";
    }, {
        readonly id: BscWalletRpcProvider;
        readonly label: "NodeReal";
    }, {
        readonly id: BscWalletRpcProvider;
        readonly label: "QuickNode";
    }];
    readonly solana: readonly [{
        readonly id: SolanaWalletRpcProvider;
        readonly label: "Eliza Cloud";
    }, {
        readonly id: SolanaWalletRpcProvider;
        readonly label: "Helius + Birdeye";
    }];
};
export declare const DEFAULT_WALLET_RPC_SELECTIONS: WalletRpcSelections;
export declare function normalizeWalletRpcProviderId<TChain extends WalletRpcChain>(chain: TChain, value: string | null | undefined): WalletRpcSelections[TChain] | null;
export declare function normalizeWalletRpcSelections(input: Partial<Record<WalletRpcChain, string | null | undefined>> | WalletRpcSelections | null | undefined): WalletRpcSelections;
//# sourceMappingURL=wallet.d.ts.map