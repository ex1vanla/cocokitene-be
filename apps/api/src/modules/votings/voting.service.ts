import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { VotingRepository } from '@repositories/voting.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
import { MeetingRepository } from '@repositories/meeting.repository'
import { Voting } from '@entities/voting.entity'
import { VoteProposalDto } from '@dtos/voting.dto'
import { httpErrors } from '@shares/exception-filter'
import { VoteProposalResult } from '@shares/constants/proposal.const'
import { Proposal } from '@entities/proposal.entity'

@Injectable()
export class VotingService {
    constructor(
        private readonly votingRepository: VotingRepository,
        private readonly proposalRepository: ProposalRepository,
        private readonly meetingRepository: MeetingRepository,
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

        const existedProposal = await this.proposalRepository.getProposalById(
            proposalId,
        )

        try {
            const checkExistedVoting =
                await this.findVotingByUserIdAndProposalId(userId, proposalId)

            if (checkExistedVoting) {
                const updatedProposal = await this.updateVoteCount(
                    existedProposal,
                    checkExistedVoting,
                    voteProposalDto,
                )

                return updatedProposal
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
                            existedProposal.votedQuantity++
                            break
                        case VoteProposalResult.UNVOTE:
                            existedProposal.unVotedQuantity++
                            break
                        case VoteProposalResult.NO_IDEA:
                            existedProposal.notVoteYetQuantity++
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
                error.message,
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
    ): Promise<Proposal> {
        const { result } = voteProposalDto
        const resultOld = existedVoting.result
        if (result !== resultOld) {
            switch (resultOld) {
                case VoteProposalResult.VOTE:
                    existedProposal.votedQuantity--
                    break
                case VoteProposalResult.UNVOTE:
                    existedProposal.unVotedQuantity--
                    break
                case VoteProposalResult.NO_IDEA:
                    existedProposal.notVoteYetQuantity--
                    break
            }
            switch (result) {
                case VoteProposalResult.VOTE:
                    existedProposal.votedQuantity++
                    break
                case VoteProposalResult.UNVOTE:
                    existedProposal.unVotedQuantity++
                    break
                case VoteProposalResult.NO_IDEA:
                    existedProposal.notVoteYetQuantity++
                    break
            }
            existedVoting.result = result
            await this.votingRepository.save(existedVoting)
            await this.proposalRepository.save(existedProposal)
            return existedProposal
        } else {
            throw new HttpException(
                httpErrors.VOTING_FAILED,
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}
