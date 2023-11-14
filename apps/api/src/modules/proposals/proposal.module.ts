import { ProposalService } from '@api/modules/proposals/proposal.service'
import { Module, forwardRef } from '@nestjs/common'
import { ProposalController } from '@api/modules/proposals/proposal.controller'
import { VotingModule } from '@api/modules/votings/voting.module'
import { MeetingModule } from '@api/modules/meetings/meeting.module'
import { ProposalFileModule } from '@api/modules/proposal-files/proposal-file.module'

@Module({
    controllers: [ProposalController],
    providers: [ProposalService],
    exports: [ProposalService],
    imports: [
        VotingModule,
        forwardRef(() => MeetingModule),
        forwardRef(() => ProposalFileModule),
    ],
})
export class ProposalModule {}
