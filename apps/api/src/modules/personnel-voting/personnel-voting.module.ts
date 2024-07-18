import { forwardRef, Module } from '@nestjs/common'
import { PersonnelVotingService } from './personnel-voting.service'
import { CandidateModule } from '../candidate/candidate.module'
import { MeetingModule } from '../meetings/meeting.module'

@Module({
    imports: [CandidateModule, forwardRef(() => MeetingModule)],
    providers: [PersonnelVotingService],
    exports: [PersonnelVotingService],
})
export class PersonnelVotingModule {}
