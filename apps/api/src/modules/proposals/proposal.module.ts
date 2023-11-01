import { ProposalService } from '@api/modules/proposals/proposal.service'
import { Module, forwardRef } from '@nestjs/common'
import { ProposalController } from '@api/modules/proposals/proposal.controller'
import { VotingModule } from '@api/modules/votings/voting.module'
import { MeetingModule } from '@api/modules/meetings/meeting.module'

@Module({
    controllers: [ProposalController],
    providers: [ProposalService],
    exports: [ProposalService],
    imports: [VotingModule, forwardRef(() => MeetingModule)],
})
export class ProposalModule {}
