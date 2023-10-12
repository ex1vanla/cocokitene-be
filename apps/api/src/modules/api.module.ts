import { Module } from '@nestjs/common'
import { ApiController } from './api.controller'
import { ApiService } from './api.service'
import { ConfigModule } from '@nestjs/config'
import configuration from '@shares/config/configuration'
import { DatabaseModule } from '@database/database.module'
import { GlobalRepository } from '@api/modules/global-repositories/global-repository.module'
import { UserModule } from '@api/modules/users/user.module'
import { AuthModule } from '@api/modules/auths/auth.module'
import { MeetingModule } from '@api/modules/meetings/meeting.module'
import { EmailModule } from '@api/modules/emails/email.module'
import { S3Module } from '@api/modules/s3/s3.module'
import { ProposalModule } from '@api/modules/proposals/proposal.module'
import { VotingModule } from '@api/modules/votings/voting.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        DatabaseModule,
        GlobalRepository,
        UserModule,
        AuthModule,
        MeetingModule,
        EmailModule,
        S3Module,
        ProposalModule,
        VotingModule,
    ],
    controllers: [ApiController],
    providers: [ApiService],
})
export class ApiModule {}
