import { Module } from '@nestjs/common'
import { MeetingController } from '@api/modules/meetings/meeting.controller'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { CompanyModule } from '@api/modules/companys/company.module'
import { EmailModule } from '@api/modules/emails/email.module'
import { MeetingFileModule } from '@api/modules/meeting-files/meeting-file.module'
import { ProposalModule } from '@api/modules/proposals/proposal.module'
import { UserMeetingModule } from '@api/modules/user-meetings/user-meeting.module'

@Module({
    imports: [
        CompanyModule,
        EmailModule,
        MeetingFileModule,
        ProposalModule,
        UserMeetingModule,
    ],
    controllers: [MeetingController],
    providers: [MeetingService],
})
export class MeetingModule {}
