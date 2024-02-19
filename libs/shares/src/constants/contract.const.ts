import { MEETING_ABI } from '@shares/abis'
import { SupportedChainId } from '@shares/constants/chain.const'

export enum CONTRACT_TYPE {
    MEETING = 'MEETING',
}

export const ABI_BY_TYPE = {
    [CONTRACT_TYPE.MEETING]: MEETING_ABI,
}
export interface ContractDetail {
    address: string
    startBlock: number
    description: string
    type: CONTRACT_TYPE
}

export type ContractByChain = {
    [key in SupportedChainId]: ContractDetail[]
}

export const CONTRACT_BY_CHAIN: ContractByChain = {
    [SupportedChainId.GOERLI]: [
        {
            address: '',
            startBlock: 0,
            description: 'Meeting contract testnet',
            type: CONTRACT_TYPE.MEETING,
        },
    ],
    [SupportedChainId.SEPOLIA]: [
        {
            address: '0x34Cb756f9FE0Db5Fc6A41ce623B1A8adEC9c44AF',
            startBlock: 0,
            description: 'Meeting contract testnet',
            type: CONTRACT_TYPE.MEETING,
        },
    ],
    [SupportedChainId.MAINNET]: [
        {
            address: '',
            startBlock: 0,
            description: 'Meeting contract mainnet',
            type: CONTRACT_TYPE.MEETING,
        },
    ],
}

export const ADDRESS_NULL = '0x0000000000000000000000000000000000000000'
