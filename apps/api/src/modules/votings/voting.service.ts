import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { VotingRepository } from '@repositories/voting.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
import { Voting } from '@entities/voting.entity'
import { VoteProposalDto } from '@dtos/voting.dto'
import { httpErrors } from '@shares/exception-filter'
import { VoteProposalResult } from '@shares/constants/proposal.const'
import { Proposal } from '@entities/proposal.entity'
import { UserService } from '@api/modules/users/user.service'

@Injectable()
export class VotingService {
    constructor(
        private readonly votingRepository: VotingRepository,
        private readonly proposalRepository: ProposalRepository,
        private readonly userService: UserService,
    ) {}

    async findVotingByUserIdAndProposalId(
        userId: number,
        proposalId: number,
    ): Promise<Voting> {
        const existedVoting = await this.votingRepository.findOne({
            where: {
                userId: userId,
                proposalId: proposalId,
            },
        })
        return existedVoting
    }

    async voteProposal(
        companyId: number,
        userId: number,
        proposalId: number,
        voteProposalDto: VoteProposalDto,
    ): Promise<Proposal> {
        const { result } = voteProposalDto

        const proposal = await this.proposalRepository.getProposalById(
            proposalId,
        )
        if (!proposal) {
            throw new HttpException(
                httpErrors.PROPOSAL_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        if (proposal.meeting.companyId !== companyId) {
            throw new HttpException(
                httpErrors.MEETING_NOT_IN_THIS_COMPANY,
                HttpStatus.BAD_REQUEST,
            )
        }

        const existedUser = await this.userService.getActiveUserById(userId)

        if (!existedUser) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.BAD_REQUEST,
            )
        }

        const shareOfUser = existedUser.shareQuantity

        const existedProposal = await this.proposalRepository.getProposalById(
            proposalId,
        )

        try {
            const checkExistedVoting =
                await this.findVotingByUserIdAndProposalId(userId, proposalId)

            if (checkExistedVoting) {
                const updateCountVoteExistedProposal =
                    await this.updateVoteCount(
                        existedProposal,
                        checkExistedVoting,
                        voteProposalDto,
                        shareOfUser,
                    )
                return updateCountVoteExistedProposal
            } else {
                let createdVoting: Voting
                try {
                    createdVoting = await this.votingRepository.createVoting({
                        userId: userId,
                        proposalId: proposalId,
                        result: result,
                    })
                    switch (result) {
                        case VoteProposalResult.VOTE:
                            existedProposal.votedQuantity += shareOfUser
                            existedProposal.notVoteYetQuantity -= shareOfUser
                            break
                        case VoteProposalResult.UNVOTE:
                            existedProposal.unVotedQuantity += shareOfUser
                            existedProposal.notVoteYetQuantity -= shareOfUser
                            break
                    }
                    await createdVoting.save()
                    await existedProposal.save()
                    return existedProposal
                } catch (error) {
                    throw new HttpException(
                        httpErrors.VOTING_CREATED_FAILED,
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    )
                }
            }
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async deleteVoting(proposalId: number) {
        await this.votingRepository.softDelete({ proposalId })
    }

    async updateVoteCount(
        existedProposal: Proposal,
        existedVoting: Voting,
        voteProposalDto: VoteProposalDto,
        shareOfUser: number,
    ): Promise<Proposal> {
        const { result } = voteProposalDto
        const resultOld = existedVoting.result
        if (result !== resultOld) {
            switch (resultOld) {
                case VoteProposalResult.VOTE:
                    existedProposal.votedQuantity -= shareOfUser
                    break
                case VoteProposalResult.UNVOTE:
                    existedProposal.unVotedQuantity -= shareOfUser
                    break
            }
            switch (result) {
                case VoteProposalResult.VOTE:
                    existedProposal.votedQuantity += shareOfUser
                    break
                case VoteProposalResult.UNVOTE:
                    existedProposal.unVotedQuantity += shareOfUser
                    break
            }
            if (result === VoteProposalResult.NO_IDEA) {
                existedProposal.notVoteYetQuantity += shareOfUser
                await this.votingRepository.delete(existedVoting.id)
                // await existedProposal.save()
            } else {
                existedVoting.result = result
                await existedVoting.save()
            }
            await existedProposal.save()
            return existedProposal
        } else {
            throw new HttpException(
                httpErrors.VOTING_FAILED,
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}
