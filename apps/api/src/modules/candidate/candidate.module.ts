import { Module } from '@nestjs/common'
import { CandidateController } from './candidate.controller'
import { CandidateService } from './candidate.service'
import { VotingCandidateModule } from '../voting-candidate/voting-candidate.module'

@Module({
    controllers: [CandidateController],
    providers: [CandidateService],
    exports: [CandidateService],
    imports: [VotingCandidateModule],
})
export class CandidateModule {}
