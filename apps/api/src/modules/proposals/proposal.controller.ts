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
import { GetAllProposalDto, ProposalDtoUpdate } from '@dtos/proposal.dto'
import { ProposalService } from '@api/modules/proposals/proposal.service'
import { UserScope } from '@shares/decorators/user.decorator'
import { User } from '@entities/user.entity'
import { VotingService } from '@api/modules/votings/voting.service'
import { VoteProposalDto } from '@dtos/voting.dto'

@Controller('proposals')
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
        @Param('proposalId') proposalId: number,
        @Body() proposalDtoUpdate: ProposalDtoUpdate,
        @UserScope() user: User,
    ) {
        const companyId = user?.companyId

        const updatedProposal = await this.proposalService.updateProposal(
            companyId,
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
        @Param('proposalId') proposalId: number,
        @Query() voteProposalDto: VoteProposalDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const companyId = user?.companyId
        const proposal = await this.votingService.voteProposal(
            companyId,
            userId,
            proposalId,
            voteProposalDto,
        )
        return proposal
    }

    @Delete(':proposalId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Permission(PermissionEnum.DELETE_PROPOSAL)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async deleteProposal(
        @Param('proposalId') proposalId: number,
        @UserScope() user: User,
    ) {
        const companyId = user?.companyId
        const result = await this.proposalService.deleteProposal(
            companyId,
            proposalId,
        )
        return result
    }

    @Get(':meetingId')
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
