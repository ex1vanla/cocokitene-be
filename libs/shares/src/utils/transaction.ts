import { RPC_URLS, SupportedChainId } from '@shares/constants'
import configuration from '@shares/config/configuration'
import { Meeting } from '@shares/abis/types'
import { getContract, getWeb3Instance } from '@shares/utils/web3'
import { MEETING_ABI } from '@shares/abis'

export const sendCreateMeetingTransaction = async ({
    meetingId,
    titleMeeting,
    startTimeMeeting,
    endTimeMeeting,
    meetingLink,
    companyId,
    chainId,
    contractAddress,
    shareholdersTotal,
    shareholdersJoined,
    joinedMeetingShares,
    totalMeetingShares,
}: {
    meetingId: number
    titleMeeting: string
    startTimeMeeting: number
    endTimeMeeting: number
    meetingLink: string
    companyId: number
    chainId: SupportedChainId
    contractAddress: string
    shareholdersTotal: number
    shareholdersJoined: number
    joinedMeetingShares: number
    totalMeetingShares: number
}) => {
    try {
        const provider = RPC_URLS[chainId]
        const adminAddress = configuration().crawler.adminAddress
        const adminPrivateKey = configuration().crawler.adminPrivateKey
        const meetingContractInstance: Meeting = getContract(
            MEETING_ABI,
            contractAddress,
            provider,
        )
        const estimateGas = await meetingContractInstance.methods
            .createNoSign(
                meetingId,
                titleMeeting,
                startTimeMeeting,
                endTimeMeeting,
                meetingLink,
                companyId,
                shareholdersTotal,
                shareholdersJoined,
                joinedMeetingShares,
                totalMeetingShares,
            )
            .estimateGas({
                from: adminAddress,
            })
        // add private key
        const web3Instance = getWeb3Instance(provider)
        await web3Instance.eth.accounts.wallet.add(adminPrivateKey)
        const txResult = await meetingContractInstance.methods
            .createNoSign(
                meetingId,
                titleMeeting,
                startTimeMeeting,
                endTimeMeeting,
                meetingLink,
                companyId,
                shareholdersTotal,
                shareholdersJoined,
                joinedMeetingShares,
                totalMeetingShares,
            )
            .send({ from: adminAddress, gas: estimateGas })

        return txResult
    } catch (error) {
        // throw new Error(error);
        console.log('error-----', error)
        return
    }
}
