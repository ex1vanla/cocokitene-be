import { Meeting } from '@entities/meeting.entity'
import {
    MeetingRole,
    UserMeetingStatusEnum,
} from '@shares/constants/meeting.const'

export interface participant {
    userId: number
    username: string
    role: MeetingRole
    status: UserMeetingStatusEnum
}
export interface ResultVoteProposal {
    proposalId: number
    votedQuantity: number
    unVotedQuantity: number
    notVoteYetQuantity: number
}

export interface ListFileOfProposal {
    proposalFileId: number
    proposalId: number
    url: string
}

export interface MeetingEnded extends Partial<Meeting> {
    id: number
    companyId: number
    titleMeeting: string
    participants: participant[]
    listResultProposals: ResultVoteProposal[]
    listResultProposalFiles: ListFileOfProposal[]
    shareholdersTotal: number
    shareholdersJoined: number
    joinedMeetingShares: number
    totalMeetingShares: number
}
