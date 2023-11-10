import { CompanyModule } from '@api/modules/companys/company.module'
import { EmailModule } from '@api/modules/emails/email.module'
import { MeetingFileModule } from '@api/modules/meeting-files/meeting-file.module'
import { MeetingController } from '@api/modules/meetings/meeting.controller'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { ProposalModule } from '@api/modules/proposals/proposal.module'
import { UserMeetingModule } from '@api/modules/user-meetings/user-meeting.module'
import { UserModule } from '@api/modules/users/user.module'
import { VotingModule } from '@api/modules/votings/voting.module'
import { Module, forwardRef } from '@nestjs/common'

@Module({
    imports: [
        CompanyModule,
        EmailModule,
        forwardRef(() => MeetingFileModule),
        ProposalModule,
        UserMeetingModule,
        UserModule,
        forwardRef(() => VotingModule),
    ],
    controllers: [MeetingController],
    providers: [MeetingService],
    exports: [MeetingService],
})
export class MeetingModule {}
