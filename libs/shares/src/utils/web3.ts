import { compareAddress } from '@shares/utils/address'
import { USER_LOGIN_BASE_MESSAGE } from '@shares/constants/auth.const'
/* eslint-disable @typescript-eslint/no-var-requires */
const Web3 = require('web3')

export const isValidSignature = (
    account: string,
    signature: string,
    message: string,
): boolean => {
    const web3 = new Web3()
    const accountRecover = web3.eth.accounts.recover(message, signature)
    if (!accountRecover || !compareAddress(account, accountRecover)) {
        return false
    }
    return true
}

export const getSignedMessage = (nonce): string => {
    return `${USER_LOGIN_BASE_MESSAGE} - nonce: ${nonce}`
}
