import { Meeting } from '@entities/meeting.entity'
import { Proposal } from '@entities/proposal.entity'
import { UserMeeting } from '@entities/user-meeting.entity'
import { VoteProposalResult } from '@shares/constants/proposal.const'

export interface ProposalItemDetailMeeting extends Proposal {
    voteResult: VoteProposalResult
}

export interface ParticipantDetailMeeting {
    id: number
    roleMtg: Partial<UserMeeting>[]
}

export interface DetailMeetingResponse extends Partial<Meeting> {
    participants: ParticipantDetailMeeting[]
    shareholdersTotal: number
    shareholdersJoined: number
    joinedMeetingShares: number
    totalMeetingShares: number
    proposals: ProposalItemDetailMeeting[]
}
