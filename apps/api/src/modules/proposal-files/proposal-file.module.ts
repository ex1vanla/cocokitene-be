import { ProposalFileService } from '@api/modules/proposal-files/proposal-file.service'
import { Module } from '@nestjs/common'

@Module({
    providers: [ProposalFileService],
    exports: [ProposalFileService],
})
export class ProposalFileModule {}
