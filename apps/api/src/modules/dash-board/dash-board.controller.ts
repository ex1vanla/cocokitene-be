import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PermissionEnum } from '@shares/constants'
import { GetAllMeetingInDayDto } from '@dtos/meeting.dto'
import { UserScope } from '@shares/decorators/user.decorator'
import { User } from '@entities/user.entity'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { Permission } from '@shares/decorators/permission.decorator'
import { DashBoardService } from './dash-board.service'

@Controller('dash-board')
@ApiTags('dash-board')
export class DashBoardController {
    constructor(private readonly dashBoardService: DashBoardService) {}
    @Get('/meeting-in-day')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.BASIC_PERMISSION)
    async getAllMeetingsByDate(
        @Query() getAllMeetingInDayDto: GetAllMeetingInDayDto,
        @UserScope() user: User,
    ) {
        const companyId = user.companyId
        const meetings = await this.dashBoardService.getAllMeetingInDay(
            getAllMeetingInDayDto,
            user,
            companyId,
        )
        return meetings
    }
}
