import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common'
import { UserService } from '@api/modules/users/user.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'libs/queries/src/dtos/user.dto'
import { WalletAddressDto } from 'libs/queries/src/dtos/base.dto'

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDto: CreateUserDto) {
        const createdUser = await this.userService.createUser(createUserDto)
        return {
            success: true,
            content: createdUser,
        }
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async getNonceByUserWalletAddress(
        @Query() walletAddressDto: WalletAddressDto,
    ) {
        const nonceValue =
            await this.userService.getUserNonceByUserWalletAddress(
                walletAddressDto,
            )
        return {
            success: true,
            content: nonceValue,
        }
    }
}
