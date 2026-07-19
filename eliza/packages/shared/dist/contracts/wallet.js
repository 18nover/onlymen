/**
 * Shared wallet API contracts.
 *
 * Pure type definitions are re-exported from @elizaos/contracts.
 * Runtime helpers (RPC catalog, normalizers, builders) live here.
 */
// ── Runtime helpers ──────────────────────────────────────────────────────────
// RPC provider catalog, normalizers, and request builders.
// These have runtime values and cannot live in the pure-types contracts package.
export const WALLET_RPC_PROVIDER_OPTIONS = {
    evm: [
        { id: "eliza-cloud", label: "Eliza Cloud" },
        { id: "alchemy", label: "Alchemy" },
        { id: "infura", label: "Infura" },
        { id: "ankr", label: "Ankr" },
    ],
    bsc: [
        { id: "eliza-cloud", label: "Eliza Cloud" },
        { id: "alchemy", label: "Alchemy" },
        { id: "ankr", label: "Ankr" },
        { id: "nodereal", label: "NodeReal" },
        { id: "quicknode", label: "QuickNode" },
    ],
    solana: [
        { id: "eliza-cloud", label: "Eliza Cloud" },
        { id: "helius-birdeye", label: "Helius + Birdeye" },
    ],
};
export const DEFAULT_WALLET_RPC_SELECTIONS = {
    evm: "eliza-cloud",
    bsc: "eliza-cloud",
    solana: "eliza-cloud",
};
const WALLET_RPC_PROVIDER_ALIASES = {
    elizacloud: "eliza-cloud",
    helius: "helius-birdeye",
};
const WALLET_RPC_PROVIDER_IDS = {
    evm: new Set(WALLET_RPC_PROVIDER_OPTIONS.evm.map((option) => option.id)),
    bsc: new Set(WALLET_RPC_PROVIDER_OPTIONS.bsc.map((option) => option.id)),
    solana: new Set(WALLET_RPC_PROVIDER_OPTIONS.solana.map((option) => option.id)),
};
export function normalizeWalletRpcProviderId(chain, value) {
    if (typeof value !== "string")
        return null;
    const trimmed = value.trim().toLowerCase();
    if (!trimmed)
        return null;
    const normalized = WALLET_RPC_PROVIDER_ALIASES[trimmed]
        ? WALLET_RPC_PROVIDER_ALIASES[trimmed]
        : trimmed;
    if (WALLET_RPC_PROVIDER_IDS[chain].has(normalized)) {
        return normalized;
    }
    return null;
}
export function normalizeWalletRpcSelections(input) {
    return {
        evm: normalizeWalletRpcProviderId("evm", input?.evm) ??
            DEFAULT_WALLET_RPC_SELECTIONS.evm,
        bsc: normalizeWalletRpcProviderId("bsc", input?.bsc) ??
            DEFAULT_WALLET_RPC_SELECTIONS.bsc,
        solana: normalizeWalletRpcProviderId("solana", input?.solana) ??
            DEFAULT_WALLET_RPC_SELECTIONS.solana,
    };
}
const WALLET_RPC_PROVIDER_CREDENTIAL_KEYS = {
    evm: {
        "eliza-cloud": [],
        alchemy: ["ALCHEMY_API_KEY"],
        infura: ["INFURA_API_KEY"],
        ankr: ["ANKR_API_KEY"],
    },
    bsc: {
        "eliza-cloud": [],
        alchemy: ["ALCHEMY_API_KEY"],
        ankr: ["ANKR_API_KEY"],
        nodereal: ["NODEREAL_BSC_RPC_URL"],
        quicknode: ["QUICKNODE_BSC_RPC_URL"],
    },
    solana: {
        "eliza-cloud": [],
        "helius-birdeye": ["HELIUS_API_KEY", "BIRDEYE_API_KEY"],
    },
};
const LEGACY_CUSTOM_WALLET_RPC_CHAIN_KEYS = {
    evm: ["ETHEREUM_RPC_URL", "BASE_RPC_URL", "AVALANCHE_RPC_URL"],
    bsc: ["BSC_RPC_URL"],
    solana: ["SOLANA_RPC_URL"],
};
function isWalletConfigCredentialSet(walletConfig, configKey) {
    switch (configKey) {
        case "ALCHEMY_API_KEY":
            return Boolean(walletConfig?.alchemyKeySet);
        case "INFURA_API_KEY":
            return Boolean(walletConfig?.infuraKeySet);
        case "ANKR_API_KEY":
            return Boolean(walletConfig?.ankrKeySet);
        case "NODEREAL_BSC_RPC_URL":
            return Boolean(walletConfig?.nodeRealBscRpcSet);
        case "QUICKNODE_BSC_RPC_URL":
            return Boolean(walletConfig?.quickNodeBscRpcSet);
        case "HELIUS_API_KEY":
            return Boolean(walletConfig?.heliusKeySet);
        case "BIRDEYE_API_KEY":
            return Boolean(walletConfig?.birdeyeKeySet);
        case "SOLANA_RPC_URL":
            return Boolean(walletConfig?.legacyCustomChains?.includes("solana"));
        case "BSC_RPC_URL":
            return Boolean(walletConfig?.legacyCustomChains?.includes("bsc"));
        case "ETHEREUM_RPC_URL":
        case "BASE_RPC_URL":
        case "AVALANCHE_RPC_URL":
            return Boolean(walletConfig?.legacyCustomChains?.includes("evm"));
        default:
            return false;
    }
}
export function resolveInitialWalletRpcSelections(walletConfig) {
    if (walletConfig?.selectedRpcProviders) {
        return normalizeWalletRpcSelections(walletConfig.selectedRpcProviders);
    }
    return {
        evm: walletConfig?.alchemyKeySet
            ? "alchemy"
            : walletConfig?.infuraKeySet
                ? "infura"
                : walletConfig?.ankrKeySet
                    ? "ankr"
                    : DEFAULT_WALLET_RPC_SELECTIONS.evm,
        bsc: walletConfig?.nodeRealBscRpcSet
            ? "nodereal"
            : walletConfig?.quickNodeBscRpcSet
                ? "quicknode"
                : walletConfig?.alchemyKeySet
                    ? "alchemy"
                    : walletConfig?.ankrKeySet
                        ? "ankr"
                        : DEFAULT_WALLET_RPC_SELECTIONS.bsc,
        solana: walletConfig?.heliusKeySet || walletConfig?.birdeyeKeySet
            ? "helius-birdeye"
            : DEFAULT_WALLET_RPC_SELECTIONS.solana,
    };
}
function collectSelectedWalletRpcCredentialKeys(selectedProviders) {
    const selectedKeys = new Set();
    for (const chain of Object.keys(selectedProviders)) {
        const provider = selectedProviders[chain];
        for (const key of WALLET_RPC_PROVIDER_CREDENTIAL_KEYS[chain][provider] ??
            []) {
            selectedKeys.add(key);
        }
    }
    return selectedKeys;
}
export function buildWalletRpcUpdateRequest(args) {
    const { walletConfig, rpcFieldValues, selectedProviders, selectedNetwork } = args;
    const credentials = {};
    const normalizedSelections = normalizeWalletRpcSelections(selectedProviders);
    const selectedKeys = collectSelectedWalletRpcCredentialKeys(normalizedSelections);
    for (const key of selectedKeys) {
        const value = rpcFieldValues[key]?.trim();
        if (value) {
            credentials[key] = value;
        }
    }
    const allKnownKeys = new Set([
        "ALCHEMY_API_KEY",
        "INFURA_API_KEY",
        "ANKR_API_KEY",
        "NODEREAL_BSC_RPC_URL",
        "QUICKNODE_BSC_RPC_URL",
        "HELIUS_API_KEY",
        "BIRDEYE_API_KEY",
    ]);
    for (const chain of Object.keys(LEGACY_CUSTOM_WALLET_RPC_CHAIN_KEYS)) {
        if (walletConfig?.legacyCustomChains?.includes(chain)) {
            for (const key of LEGACY_CUSTOM_WALLET_RPC_CHAIN_KEYS[chain]) {
                credentials[key] = "";
                allKnownKeys.add(key);
            }
        }
    }
    for (const key of allKnownKeys) {
        if (selectedKeys.has(key)) {
            continue;
        }
        if (isWalletConfigCredentialSet(walletConfig, key) ||
            rpcFieldValues[key] !== undefined) {
            credentials[key] = "";
        }
    }
    return {
        selections: normalizedSelections,
        walletNetwork: selectedNetwork ??
            (walletConfig?.walletNetwork === "testnet" ? "testnet" : "mainnet"),
        credentials,
    };
}
//# sourceMappingURL=wallet.js.map