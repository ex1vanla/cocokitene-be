import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { PermissionEnum } from '@shares/constants'
import { Permission } from '@shares/decorators/permission.decorator'
import {
    GetAllProposalDto,
    ProposalDtoUpdate,
    TypeProposalDto,
} from '@dtos/proposal.dto'
import { ProposalService } from '@api/modules/proposals/proposal.service'
import { UserScope } from '@shares/decorators/user.decorator'
import { User } from '@entities/user.entity'
import { VotingService } from '@api/modules/votings/voting.service'
import { VoteProposalDto } from '@dtos/voting.dto'

@Controller('meetings/:meetingId/proposals')
@ApiTags('proposals')
export class ProposalController {
    constructor(
        private readonly proposalService: ProposalService,
        private readonly votingService: VotingService,
    ) {}
    @Patch('/edit-proposal/:proposalId')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.EDIT_PROPOSAL)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async updateProposal(
        @Param('meetingId') meetingId: number,
        @Param('proposalId') proposalId: number,
        @Body() proposalDtoUpdate: ProposalDtoUpdate,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const updatedProposal = await this.proposalService.updateProposal(
            userId,
            meetingId,
            proposalId,
            proposalDtoUpdate,
        )
        return updatedProposal
    }

    @Post('/vote/:proposalId')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.VOTING_PROPOSAL)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async voteProposal(
        @Param('meetingId') meetingId: number,
        @Param('proposalId') proposalId: number,
        @Query() voteProposalDto: VoteProposalDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const companyId = user?.companyId
        const proposal = await this.votingService.userVotingProposal(
            meetingId,
            companyId,
            userId,
            proposalId,
            voteProposalDto,
        )
        return proposal
    }

    @Delete('/delete/:proposalId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Permission(PermissionEnum.DELETE_PROPOSAL)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async deleteProposal(
        @Param('meetingId') meetingId: number,
        @Param('proposalId') proposalId: number,
        @Query() typeProposalDto: TypeProposalDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const result = await this.proposalService.deleteProposal(
            userId,
            meetingId,
            proposalId,
            typeProposalDto,
        )
        return result
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.LIST_PROPOSAL)
    async getAllProposals(
        @Param('meetingId') meetingId: number,
        @Query() getAllProposalDto: GetAllProposalDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const proposals = await this.proposalService.getAllProposal(
            meetingId,
            userId,
            getAllProposalDto,
        )
        return proposals
    }
}
