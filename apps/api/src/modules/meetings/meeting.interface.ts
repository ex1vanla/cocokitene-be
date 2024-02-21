import { Meeting } from '@entities/meeting.entity'
import { Proposal } from '@entities/proposal.entity'
import { UserMeeting } from '@entities/user-meeting.entity'
import { VoteProposalResult } from '@shares/constants/proposal.const'

export interface ProposalItemDetailMeeting extends Proposal {
    voteResult: VoteProposalResult
}

export interface DetailMeetingResponse extends Partial<Meeting> {
    shareholdersTotal: number
    shareholdersJoined: number
    joinedMeetingShares: number
    totalMeetingShares: number
    proposals: ProposalItemDetailMeeting[]
    participants: { [key: string]: Partial<UserMeeting>[] }
}
