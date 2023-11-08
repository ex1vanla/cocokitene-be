import { Repository } from 'typeorm'
import { Proposal } from '@entities/proposal.entity'
import { CustomRepository } from '@shares/decorators'
import {
    CreateProposalDto,
    GetAllProposalDto,
    ProposalDtoUpdate,
} from '@dtos/proposal.dto'
import {
    IPaginationOptions,
    paginateRaw,
    Pagination,
} from 'nestjs-typeorm-paginate'
import { ProposalType } from '@shares/constants/proposal.const'

@CustomRepository(Proposal)
export class ProposalRepository extends Repository<Proposal> {
    async createProposal(
        createProposalDto: CreateProposalDto,
    ): Promise<Proposal> {
        const {
            title,
            description,
            oldDescription,
            type,
            meetingId,
            creatorId,
            notVoteYetQuantity,
        } = createProposalDto
        const createdProposal = await this.create({
            title,
            description,
            oldDescription,
            type,
            meetingId,
            creatorId,
            notVoteYetQuantity,
        })
        return await createdProposal.save()
    }

    async getProposalByProposalIdAndType(
        proposalId: number,
        type: ProposalType,
    ) {
        const proposal = await this.findOne({
            where: {
                id: proposalId,
                type: type,
            },
        })
        return proposal
    }
    async updateProposal(
        // userId: number,
        proposalId: number,
        proposalDtoUpdate: ProposalDtoUpdate,
    ): Promise<Proposal> {
        const { title, description, oldDescription, type } = proposalDtoUpdate
        await this.createQueryBuilder('proposals')
            .update(Proposal)
            .set({
                title: title,
                description: description,
                oldDescription: oldDescription,
                // creatorId: userId,
            })
            .where('proposals.id = :proposalId', { proposalId })
            .andWhere('proposals.type = :type', { type })
            .execute()
        const proposal = await this.getProposalByProposalIdAndType(
            proposalId,
            type,
        )
        return proposal
    }

    async getProposalById(proposalId: number): Promise<Proposal> {
        const proposal = await this.findOne({
            where: {
                id: proposalId,
            },
            relations: ['meeting'],
        })
        return proposal
    }

    async getAllProposals(
        meetingId: number,
        userId: number,
        options: IPaginationOptions & GetAllProposalDto,
    ): Promise<Pagination<Proposal>> {
        const typeQuery = options.type
        const queryBuilder = this.createQueryBuilder('proposals')
            .select([
                'proposals.id',
                'proposals.title',
                'proposals.description',
                'proposals.type',
                'proposals.votedQuantity',
                'proposals.unVotedQuantity',
                'proposals.notVoteYetQuantity',
            ])
            .leftJoin(
                'votings',
                'voting',
                'proposals.id = voting.proposalId AND voting.userId = :userId',
                { userId },
            )
            .addSelect(
                `(
            CASE
                WHEN voting.result = 'vote' THEN 1
                WHEN voting.result = 'un_vote' THEN 2
                WHEN voting.result = 'no_idea' THEN 3
                ELSE 4
        
          END)`,
                'resultActionVote',
            )

            .where('proposals.type = :type', {
                type: typeQuery,
            })
            .andWhere('proposals.meetingId = :meetingId', {
                meetingId: meetingId,
            })
        return paginateRaw(queryBuilder, options)
    }

    async updateNotVoteYetQuantityProposal(
        proposalId: number,
        typeProposal: ProposalType,
        totalShares: number,
    ): Promise<Proposal> {
        await this.createQueryBuilder('proposals')
            .update(Proposal)
            .set({
                notVoteYetQuantity: totalShares,
            })
            .where('proposals.id = :proposalId', { proposalId })
            .andWhere('proposals.type = :typeProposal', { typeProposal })
            .execute()
        const proposal = await this.getProposalByProposalIdAndType(
            proposalId,
            typeProposal,
        )
        return proposal
    }
}
