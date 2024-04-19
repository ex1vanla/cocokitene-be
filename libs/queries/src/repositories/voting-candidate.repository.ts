import { Repository } from 'typeorm'
import { VotingCandidate } from '@entities/voting-candidate.entity'
import { CustomRepository } from '@shares/decorators'

@CustomRepository(VotingCandidate)
export class VotingCandidateRepository extends Repository<VotingCandidate> {}
