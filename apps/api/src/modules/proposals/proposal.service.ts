import {
    CreateProposalDto,
    GetAllProposalDto,
    ProposalDtoUpdate,
    TypeProposalDto,
} from '@dtos/proposal.dto'
import { Proposal } from '@entities/proposal.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ProposalRepository } from '@repositories/proposal.repository'
import { httpErrors } from '@shares/exception-filter'
import { MeetingRepository } from '@repositories/meeting.repository'
import { VotingService } from '@api/modules/votings/voting.service'

@Injectable()
export class ProposalService {
    constructor(
        private readonly proposalRepository: ProposalRepository,
        private readonly meetingRepository: MeetingRepository,
        private readonly votingService: VotingService,
    ) {}

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

    async updateProposal(
        userId: number,
        companyId: number,
        proposalId: number,
        proposalDtoUpdate: ProposalDtoUpdate,
    ): Promise<Proposal> {
        try {
            // check existed of meeting and proposal
            const meetingId =
                await this.proposalRepository.getIdMeetingByProposalId(
                    proposalId,
                )
            const meeting = await this.meetingRepository.findOne({
                where: {
                    id: meetingId,
                },
            })
            if (!meeting) {
                throw new HttpException(
                    httpErrors.MEETING_NOT_EXISTED,
                    HttpStatus.BAD_REQUEST,
                )
            }
            if (meeting.companyId !== companyId) {
                throw new HttpException(
                    httpErrors.MEETING_NOT_IN_THIS_COMPANY,
                    HttpStatus.BAD_REQUEST,
                )
            }

            const updateProposal = await this.proposalRepository.updateProposal(
                userId,
                proposalId,
                proposalDtoUpdate,
            )
            return updateProposal
        } catch (error) {
            throw new HttpException(
                httpErrors.MEETING_UPDATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async deleteProposal(
        userId: number,
        companyId: number,
        proposalId: number,
        typeProposalDto: TypeProposalDto,
    ) {
        const { type } = typeProposalDto
        // check existed of meeting and proposal
        const meetingId =
            await this.proposalRepository.getIdMeetingByProposalId(proposalId)
        const meeting = await this.meetingRepository.findOne({
            where: {
                id: meetingId,
            },
        })
        if (!meeting) {
            throw new HttpException(
                httpErrors.MEETING_NOT_EXISTED,
                HttpStatus.BAD_REQUEST,
            )
        }
        if (meeting.companyId !== companyId) {
            throw new HttpException(
                httpErrors.MEETING_NOT_IN_THIS_COMPANY,
                HttpStatus.BAD_REQUEST,
            )
        }

        try {
            //delete proposal
            await this.proposalRepository.softDelete({
                meetingId,
                id: proposalId,
                type: type,
            })
            //join voting and delete relate idProposal
            await this.votingService.deleteVoting(proposalId)

            return `proposal with Id ${proposalId} deleted successfully`
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.BAD_REQUEST,
            )
        }
    }

    async getAllProposal(
        meetingId: number,
        userId: number,
        getAllProposalDto: GetAllProposalDto,
    ) {
        const proposals = await this.proposalRepository.getAllProposals(
            meetingId,
            userId,
            getAllProposalDto,
        )

        return proposals
    }
}
