import { Meeting } from '@entities/meeting.entity'
import {
    ParticipantDetailMeeting,
    ProposalItemDetailMeeting,
} from '../meetings/meeting.interface'
import { Candidate } from '@entities/candidate.entity'
import { VoteCandidateResult } from '@shares/constants/candidate.const'

export interface CandidateItemDetailMeeting extends Candidate {
    voteResult: VoteCandidateResult
}

export interface DetailBoardMeetingResponse extends Partial<Meeting> {
    boardsTotal: number
    boardsJoined: number
    participants: ParticipantDetailMeeting[]
    candidates: CandidateItemDetailMeeting[]
    proposals: ProposalItemDetailMeeting[]
}
