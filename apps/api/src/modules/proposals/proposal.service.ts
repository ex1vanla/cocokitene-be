import {
    CreateProposalDto,
    GetAllProposalDto,
    ProposalDto,
    ProposalDtoUpdate,
} from '@dtos/proposal.dto'
import { Proposal } from '@entities/proposal.entity'
import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common'
import { ProposalRepository } from '@repositories/proposal.repository'
import { httpErrors } from '@shares/exception-filter'
import { VotingService } from '@api/modules/votings/voting.service'
import { MeetingService } from '@api/modules/meetings/meeting.service'
import { ProposalFileService } from '@api/modules/proposal-files/proposal-file.service'

@Injectable()
export class ProposalService {
    constructor(
        private readonly proposalRepository: ProposalRepository,
        private readonly votingService: VotingService,
        @Inject(forwardRef(() => MeetingService))
        private readonly meetingService: MeetingService,
        private readonly proposalFileService: ProposalFileService,
    ) {}

    async createProposal(
        createProposalDto: CreateProposalDto,
    ): Promise<Proposal> {
        const {
            title,
            description,
            oldDescription,
            type,
            creatorId,
            meetingId,
            notVoteYetQuantity,
            files,
        } = createProposalDto
        try {
            const createdProposal =
                await this.proposalRepository.createProposal({
                    title,
                    description,
                    oldDescription,
                    type,
                    creatorId,
                    meetingId,
                    notVoteYetQuantity,
                })

            if (files && files.length > 0) {
                console.log(files)

                await Promise.all([
                    ...files.map((file) =>
                        this.proposalFileService.createProposalFile({
                            url: file.url,
                            proposalId: createdProposal.id,
                        }),
                    ),
                ])
            }

            return createdProposal
        } catch (error) {
            throw new HttpException(
                httpErrors.PROPOSAL_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async updateProposal(
        companyId: number,
        proposalId: number,
        proposalDtoUpdate: ProposalDtoUpdate,
    ): Promise<Proposal> {
        try {
            // check existed of meeting and proposal
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

            const updateProposal = await this.proposalRepository.updateProposal(
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

    async deleteProposal(companyId: number, proposalId: number) {
        // check existed of meeting and proposal
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

        try {
            //delete proposal
            const meetingId = proposal.meeting.id
            await this.proposalRepository.softDelete({
                meetingId,
                id: proposalId,
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

    async updateListProposals(
        meetingId: number,
        userId: number,
        proposals: ProposalDto[],
        totalShares: number,
    ): Promise<void> {
        const meeting = await this.meetingService.getInternalMeetingById(
            meetingId,
        )
        const listCurrentProposals = meeting.proposals
        // list edited
        const listEdited = proposals.filter((proposal) => !!proposal.id)
        const listEditedIds = listEdited.map((proposal) => proposal.id)
        // list deleted
        const listDeleted = listCurrentProposals.filter(
            (proposal) => !listEditedIds.includes(proposal.id),
        )
        // list added
        const listAdded = proposals.filter((proposal) => !proposal.id)

        try {
            await Promise.all([
                ...listEdited.map((proposal) =>
                    this.proposalRepository.updateProposal(
                        proposal.id,
                        proposal,
                    ),
                ),
                ...listDeleted.map((proposal) =>
                    this.deleteProposal(meeting.companyId, proposal.id),
                ),
                ...listAdded.map((proposal) =>
                    this.createProposal({
                        title: proposal.title,
                        description: proposal.description,
                        oldDescription: proposal.oldDescription,
                        type: proposal.type,
                        creatorId: userId,
                        meetingId,
                        notVoteYetQuantity: totalShares,
                    }),
                ),
            ])
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.BAD_REQUEST,
            )
        }
    }
}
