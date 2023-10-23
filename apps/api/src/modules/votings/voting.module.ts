import { Module } from '@nestjs/common'
import { VotingService } from '@api/modules/votings/voting.service'
import { UserModule } from '@api/modules/users/user.module'

@Module({
    providers: [VotingService],
    exports: [VotingService],
    imports: [UserModule],
})
export class VotingModule {}
