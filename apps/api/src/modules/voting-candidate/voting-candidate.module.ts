import { Module, forwardRef } from '@nestjs/common'
import { UserModule } from '../users/user.module'
import { RoleMtgModule } from '../role-mtgs/role-mtg.module'
import { UserMeetingModule } from '../user-meetings/user-meeting.module'
import { MeetingModule } from '../meetings/meeting.module'
import { VotingCandidateService } from './voting-candidate.service'

@Module({
    imports: [
        forwardRef(() => UserModule),
        RoleMtgModule,
        UserMeetingModule,
        forwardRef(() => MeetingModule),
    ],
    providers: [VotingCandidateService],
    exports: [VotingCandidateService],
})
export class VotingCandidateModule {}
