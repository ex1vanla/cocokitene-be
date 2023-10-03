import { Repository } from 'typeorm'
import { Proposal } from '@entities/proposal.entity'
import { CustomRepository } from '@shares/decorators'
import { CreateProposalDto } from '@dtos/proposal.dto'

@CustomRepository(Proposal)
export class ProposalRepository extends Repository<Proposal> {
    async createProposal(
        createProposalDto: CreateProposalDto,
    ): Promise<Proposal> {
        const { title, description, type, meetingId, creatorId } =
            createProposalDto
        const createdProposal = await this.create({
            title,
            description,
            type,
            meetingId,
            creatorId,
        })
        await createdProposal.save()
        return createdProposal
    }
}
