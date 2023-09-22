import { Repository } from 'typeorm'
import { Proposal } from '@entities/proposal.entity'
import { CustomRepository } from '@shares/decorators'

@CustomRepository(Proposal)
export class ProposalRepository extends Repository<Proposal> {}
