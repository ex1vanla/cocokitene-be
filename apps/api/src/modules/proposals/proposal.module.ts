import { ProposalService } from '@api/modules/proposals/proposal.service'
import { Module } from '@nestjs/common'
import { ProposalController } from '@api/modules/proposals/proposal.controller'
import { VotingModule } from '@api/modules/votings/voting.module'

@Module({
    controllers: [ProposalController],
    providers: [ProposalService],
    exports: [ProposalService],
    imports: [VotingModule],
})
export class ProposalModule {}
