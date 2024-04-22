import { Module, forwardRef } from '@nestjs/common'
import { UserModule } from '../users/user.module'
import { UserMeetingModule } from '../user-meetings/user-meeting.module'
import { MeetingModule } from '../meetings/meeting.module'
import { VotingCandidateService } from './voting-candidate.service'
import { MeetingRoleMtgModule } from '../meeting-role-mtgs/meeting-role-mtg.module'

@Module({
    imports: [
        forwardRef(() => UserModule),
        UserMeetingModule,
        MeetingRoleMtgModule,
        forwardRef(() => MeetingModule),
    ],
    providers: [VotingCandidateService],
    exports: [VotingCandidateService],
})
export class VotingCandidateModule {}
