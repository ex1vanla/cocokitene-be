import {
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CandidateService } from './candidate.service'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants'
import { VoteCandidateDto } from '@dtos/voting-candidate.dto'
import { UserScope } from '@shares/decorators/user.decorator'
import { User } from '@entities/user.entity'
import { VotingCandidateService } from '../voting-candidate/voting-candidate.service'

@Controller('candidates')
@ApiTags('candidates')
export class CandidateController {
    constructor(
        private readonly candidateService: CandidateService,
        private readonly votingCandidateService: VotingCandidateService,
    ) {}

    @Post('/vote-board/:candidateId')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.DETAIL_BOARD_MEETING)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async voteBoardCandidate(
        @Param('candidateId') candidateId: number,
        @Query() voteCandidateDto: VoteCandidateDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const companyId = user?.companyId
        const candidate = await this.votingCandidateService.voteCandidate(
            companyId,
            userId,
            candidateId,
            voteCandidateDto,
        )

        return candidate
    }

    @Post('/vote-shareholder/:candidateId')
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.DETAIL_MEETING)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    async voteCandidateShareholderMtg(
        @Param('candidateId') candidateId: number,
        @Query() voteCandidateDto: VoteCandidateDto,
        @UserScope() user: User,
    ) {
        const userId = user?.id
        const companyId = user?.companyId
        const candidate =
            await this.votingCandidateService.voteCandidateInShareholderMtg(
                companyId,
                userId,
                candidateId,
                voteCandidateDto,
            )
        return candidate
    }
}
