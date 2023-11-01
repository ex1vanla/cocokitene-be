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
import { WalletAddressDto } from 'libs/queries/src/dtos/base.dto'
import { UserService } from './user.service'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { User } from '@entities/user.entity'
import { PermissionEnum } from '@shares/constants'
import { Permission } from '@shares/decorators/permission.decorator'

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('get-nonce')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getNonceByUserWalletAddress(
        @Query() walletAddressDto: WalletAddressDto,
    ) {
        const nonceValue =
            await this.userService.getUserNonceByUserWalletAddress(
                walletAddressDto,
            )
        return nonceValue
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission(PermissionEnum.LIST_ACCOUNT)
    async getAllUserByCompany(
        @Query() getAllUsersDto: GetAllUsersDto,
        @UserScope() user: User,
    ) {
        const companyId = user?.companyId
        const users = await this.userService.getAllUsersCompany(
            getAllUsersDto,
            companyId,
        )
        return users
    }
}
