import { UserMeetingService } from '@api/modules/user-meetings/user-meeting.service'
import { Module } from '@nestjs/common'

@Module({
    providers: [UserMeetingService],
    exports: [UserMeetingService],
})
export class UserMeetingModule {}
