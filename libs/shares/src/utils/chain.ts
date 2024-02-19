import { SupportedChainId } from '@shares/constants'

export const getChainId = (): SupportedChainId => {
    return configuration().common.networkEnv === ChainType.MAINNET
        ? SupportedChainId.MAINNET
        : SupportedChainId.SEPOLIA
}
