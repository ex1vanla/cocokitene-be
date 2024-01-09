import { GetAllUsersDto } from '@dtos/user.dto'
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UserScope } from '@shares/decorators/user.decorator'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { User } from '@entities/user.entity'
import { PermissionEnum } from '@shares/constants'
import { Permission } from '@shares/decorators/permission.decorator'
import { ShareholderService } from './shareholder.service'

@Controller('shareholder')
@ApiTags('shareholder')
export class ShareholderController {
    constructor(private readonly shareholderService: ShareholderService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.LIST_SHAREHOLDERS)
    async getAllSharehoderByCompany(
        @Query() getAllShareholderDto: GetAllUsersDto,
        @UserScope() user: User,
    ) {
        const companyId = user?.companyId
        const shareholders =
            await this.shareholderService.getAllShareholderCompany(
                getAllShareholderDto,
                companyId,
            )
        return shareholders
    }
}
