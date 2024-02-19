import { Meeting } from '@entities/meeting.entity'
import {
    MeetingRole,
    UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'
import { SupportedChainId } from '@shares/constants'

export interface participant {
    meetingId: number
    userId: number
    username: string
    role: MeetingRole
    status: UserMeetingStatusEnum
}
export interface ResultVoteProposal {
    meetingId: number
    proposalId: number
    votedQuantity: number
    unVotedQuantity: number
    notVoteYetQuantity: number
}

export interface ListFileOfProposal {
    meetingId: number
    proposalFileId: number
    proposalId: number
    url: string
}

export interface MeetingEnded extends Partial<Meeting> {
    id: number
    companyId: number
    titleMeeting: string
    startTimeMeeting: number
    endTimeMeeting: number
    meetingLink: string
    participants: participant[]
    listResultProposals: ResultVoteProposal[]
    listResultProposalFiles: ListFileOfProposal[]
    shareholdersTotal: number
    shareholdersJoined: number
    joinedMeetingShares: number
    totalMeetingShares: number
}

export interface ConfigCrawler {
    contract: string
    provider: string
    chainId: SupportedChainId
    abi: any
    startBlock: number
    name: string
}
