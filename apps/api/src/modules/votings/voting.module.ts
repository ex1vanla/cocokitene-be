import { Module } from '@nestjs/common'
import { VotingService } from '@api/modules/votings/voting.service'

@Module({
    providers: [VotingService],
    exports: [VotingService],
})
export class VotingModule {}
