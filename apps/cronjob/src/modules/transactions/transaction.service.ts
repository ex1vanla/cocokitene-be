import { Injectable } from '@nestjs/common'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { ListMeetingEnded } from '../cronjob/cronjob.interface'
import { StatusMeeting } from '@shares/constants/meeting.const'
import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { ProposalFileService } from '@api/modules/proposal-files/proposal-file.service'

@Injectable()
export class TransactionService {
    constructor(
        private readonly meetingService: MeetingService,
        private readonly userMeetingService: UserMeetingService,
        private readonly proposalFileService: ProposalFileService,
    ) {}
    async handleAllEndedMeeting(): Promise<ListMeetingEnded[]> {
        const listMeetingEnd = await this.meetingService.findMeetingByStatus(
            StatusMeeting.HAPPENED,
        )
        const meetingEndedPromise: ListMeetingEnded[] = []
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

                // tien do here, include voting and user in meeting: host, controlBoards, directors, administrativeCouncils,shareholders

                // const meetingEnd: MeetingEnded = {
                //     listProposals: listProposal,
                //     listProposalFiles: listProposalFiles,
                //     // tien add field other in here to fulfull interface MeetingEnded
                // }
                // meetingEndedPromise.push(meetingEnd)
            }),
        ])
        return meetingEndedPromise
    }
}
