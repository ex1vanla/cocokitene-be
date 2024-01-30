import { Injectable } from '@nestjs/common'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { ListMeetingEnded, MeetingEnded } from '../cronjob/cronjob.interface'
import { MeetingRole, StatusMeeting } from '@shares/constants/meeting.const'
import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { ProposalFileService } from '@api/modules/proposal-files/proposal-file.service'
import { enumToArray } from '@shares/utils/enum'
import { VotingService } from '@api/modules/votings/voting.service'

@Injectable()
export class TransactionService {
    constructor(
        private readonly meetingService: MeetingService,
        private readonly userMeetingService: UserMeetingService,
        private readonly proposalFileService: ProposalFileService,
        private readonly votingService: VotingService,
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

        // console.log('ListMeetingEnd :',listMeetingEnd)

        await Promise.all([
            ...listMeetingEnd.map(async (meeting) => {
                let listVotingOfProposal = []
                const listProposal = meeting.proposals
                const listProposalFiles = listProposal.flatMap(
                    (proposal) => proposal.proposalFiles,
                )

                console.log('listProposal----', listProposal)
                console.log('listProposal----', listProposalFiles)

                //Tien : get user-role of Meeting
                const [
                    hosts,
                    controlBoards,
                    directors,
                    administrativeCouncils,
                    shareholders,
                ] = await Promise.all(
                    enumToArray(MeetingRole).map((role) =>
                        this.userMeetingService.getUserMeetingByMeetingIdAndRole(
                            meeting.id,
                            role,
                        ),
                    ),
                )

                listProposal.forEach(async (item) => {
                    const listVote =
                        await this.votingService.getListVotedOfProposal(item.id)
                    listVotingOfProposal = [
                        ...listVotingOfProposal,
                        ...listVote,
                    ]
                })

                // tien do here, include voting and user in meeting: host, controlBoards, directors, administrativeCouncils,shareholders

                // const meetingEnd: MeetingEnded = {
                //     listProposals: listProposal,
                //     listProposalFiles: listProposalFiles,
                //     // tien add field other in here to fulfull interface MeetingEnded
                //     hosts: hosts,
                //     controlBoards: controlBoards,
                //     directors: directors,
                //     administrativeCouncils: administrativeCouncils,
                //     shareholders: shareholders,
                //     listVotings: listVotingOfProposal,
                // }
                // meetingEndedPromise.push(meetingEnd)
            }),
        ])
        return meetingEndedPromise
    }
}
