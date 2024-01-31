import { Injectable } from '@nestjs/common'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { StatusMeeting } from '@shares/constants/meeting.const'
import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { VotingService } from '@api/modules/votings/voting.service'
import { MeetingEnded } from '../cronjob/cronjob.interface'

@Injectable()
export class TransactionService {
    constructor(
        private readonly meetingService: MeetingService,
        private readonly userMeetingService: UserMeetingService,
        private readonly votingService: VotingService,
    ) {}
    async handleAllEndedMeeting(): Promise<MeetingEnded[]> {
        const listMeetingEnd = await this.meetingService.findMeetingByStatus(
            StatusMeeting.HAPPENED,
        )
        const meetingEndedPromise: MeetingEnded[] = []
        if (!listMeetingEnd || listMeetingEnd.length == 0) {
            console.log('No meeting ends: ' + new Date())
            return
        }

        await Promise.all([
            ...listMeetingEnd.map(async (meeting) => {
                const listProposal = meeting.proposals
                const listProposalFiles = listProposal.flatMap(
                    (proposal) => proposal.proposalFiles,
                )

                console.log('listProposal----', listProposal)
                console.log('listProposal----', listProposalFiles)
            }),
        ])
        return meetingEndedPromise
    }
}
