export enum SupportedChainId {
    MAINNET = 1,
    GOERLI = 5,
    SEPOLIA = 11155111,
}

export enum ChainType {
    TESTNET = 'TESTNET',
    MAINNET = 'MAINNET',
}

type RpcUrlsType = {
    [key in SupportedChainId]: string
}

export const RPC_URLS: RpcUrlsType = {
    [SupportedChainId.MAINNET]: ``,
    [SupportedChainId.GOERLI]: ``,
    [SupportedChainId.SEPOLIA]: ``,
}
