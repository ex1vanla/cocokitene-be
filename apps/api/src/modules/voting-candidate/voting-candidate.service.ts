import { VotingCandidate } from '@entities/voting-candidate.entity'
import { Injectable } from '@nestjs/common'
import { VotingCandidateRepository } from '@repositories/voting-candidate.repository'

@Injectable()
export class VotingCandidateService {
    constructor(
        private readonly votingCandidateRepository: VotingCandidateRepository,
    ) {}

    async findVotingByUserIdAndCandidateId(
        userId: number,
        candideId: number,
    ): Promise<VotingCandidate> {
        const existedVotingCandidate =
            await this.votingCandidateRepository.findOne({
                where: {
                    userId: userId,
                    votedForCandidateId: candideId,
                },
            })
        return existedVotingCandidate
    }
}
