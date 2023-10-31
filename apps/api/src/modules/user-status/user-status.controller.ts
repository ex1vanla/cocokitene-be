import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserStatusService } from '@api/modules/user-status/user-status.service'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { Permission } from '@shares/decorators/permission.decorator'
import { PermissionEnum } from '@shares/constants'
import { GetAllUserStatusDto } from '@dtos/user-status.dto'

@Controller('user-status')
@ApiTags('user-status')
export class UserStatusController {
    constructor(private readonly userStatusService: UserStatusService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.LIST_USER_STATUS)
    async getAllUserStatus(
        @Query() getAllUserStatusDto: GetAllUserStatusDto,
        // @UserScope() user: User,
    ) {
        const userStatus = await this.userStatusService.getAllUserStatus(
            getAllUserStatusDto,
        )
        return userStatus
    }
}
