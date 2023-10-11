import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { VotingRepository } from '@repositories/voting.repository'
import { ProposalRepository } from '@repositories/proposal.repository'
import { MeetingRepository } from '@repositories/meeting.repository'
import { Voting } from '@entities/voting.entity'
import { VoteProposalDto } from '@dtos/voting.dto'
import { httpErrors } from '@shares/exception-filter'
import { VoteProposalResult } from '@shares/constants/proposal.const'

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

    async userVotingProposal(
        meetingId: number,
        companyId: number,
        userId: number,
        proposalId: number,
        voteProposalDto: VoteProposalDto,
    ): Promise<Voting> {
        const { result } = voteProposalDto
        const existedProposal =
            await this.proposalRepository.getProposalByIdAndMeetingId(
                proposalId,
                meetingId,
            )
        if (!existedProposal) {
            throw new HttpException(
                httpErrors.PROPOSAL_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        try {
            const checkExistedVoting =
                await this.findVotingByUserIdAndProposalId(userId, proposalId)

            if (checkExistedVoting) {
                const resultOld = checkExistedVoting.result
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
                    checkExistedVoting.result = result
                    await checkExistedVoting.save()
                    await existedProposal.save()
                    return checkExistedVoting
                } else {
                    throw new HttpException(
                        httpErrors.VOTING_FAILED,
                        HttpStatus.BAD_REQUEST,
                    )
                }
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
                    return createdVoting
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
}
