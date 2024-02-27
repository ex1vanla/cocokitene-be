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
            address: '0x5840311fC53630515f9617412bda2f6DC47746DE',
            startBlock: 5370000,
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
