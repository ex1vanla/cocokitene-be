import {
    Controller,
    Post,
    UseGuards,
    HttpCode,
    HttpStatus,
    Body,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { BoardMeetingService } from './board-meeting.service'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { PermissionEnum } from '@shares/constants/permission.const'
import { Permission } from '@shares/decorators/permission.decorator'
import { CreateBoardMeetingDto } from '@dtos/board-meeting.dto'
import { UserScope } from '@shares/decorators/user.decorator'
import { User } from '@entities/user.entity'

@Controller('board-meetings')
@ApiTags('board-meetings')
export class BoardMeetingController {
    constructor(private readonly boardMeetingService: BoardMeetingService) {}

    @Post('')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @Permission(PermissionEnum.BOARD_MEETING)
    async createBoardMeeting(
        @Body() createBoardMeetingDto: CreateBoardMeetingDto,
        @UserScope() user: User,
    ) {
        const userId = +user?.id
        const companyId = user?.companyId
        console.log('createCandidateDto :', createBoardMeetingDto)

        const boardMeeting = await this.boardMeetingService.createBoardMeeting(
            createBoardMeetingDto,
            userId,
            companyId,
        )
        return boardMeeting
    }
}
