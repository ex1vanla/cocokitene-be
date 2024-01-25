import { Meeting } from '@entities/meeting.entity'
import { UserMeeting } from '@entities/user-meeting.entity'
import { Proposal } from '@entities/proposal.entity'
import { Voting } from '@entities/voting.entity'
import { ProposalFile } from '@entities/proposal-file'

export interface MeetingEnded extends Partial<Meeting> {
    hosts: Partial<UserMeeting>[]
    controlBoards: Partial<UserMeeting>[]
    directors: Partial<UserMeeting>[]
    administrativeCouncils: Partial<UserMeeting>[]
    shareholders: Partial<UserMeeting>[]
    listProposals: Partial<Proposal>[]
    listProposalFiles: Partial<ProposalFile>[]
    listVotings: Partial<Voting>[]
}

export interface ListMeetingEnded {
    listMeetingEnded: MeetingEnded[]
}
