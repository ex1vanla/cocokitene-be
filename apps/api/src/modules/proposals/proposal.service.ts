import { CreateProposalDto } from '@dtos/proposal.dto'
import { Proposal } from '@entities/proposal.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ProposalRepository } from '@repositories/proposal.repository'
import { httpErrors } from '@shares/exception-filter'

@Injectable()
export class ProposalService {
    constructor(private readonly proposalRepository: ProposalRepository) {}

    async createProposal(
        createProposalDto: CreateProposalDto,
    ): Promise<Proposal> {
        const { title, description, type, creatorId, meetingId } =
            createProposalDto
        try {
            const createdProposal =
                await this.proposalRepository.createProposal({
                    title,
                    description,
                    type,
                    creatorId,
                    meetingId,
                })
            await createdProposal.save()
            return createdProposal
        } catch (error) {
            throw new HttpException(
                httpErrors.PROPOSAL_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
