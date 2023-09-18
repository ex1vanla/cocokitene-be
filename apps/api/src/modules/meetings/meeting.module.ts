import { Module } from '@nestjs/common'
import { MeetingController } from '@api/modules/meetings/meeting.controller'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { CompanyModule } from '@api/modules/companys/company.module'
import { EmailModule } from '@api/modules/emails/email.module'

@Module({
    imports: [CompanyModule, EmailModule],
    controllers: [MeetingController],
    providers: [MeetingService],
})
export class MeetingModule {}
