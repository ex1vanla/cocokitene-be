import { ProposalService } from '@api/modules/proposals/proposal.service'
import { Module } from '@nestjs/common'

@Module({
    providers: [ProposalService],
    exports: [ProposalService],
})
export class ProposalModule {}
