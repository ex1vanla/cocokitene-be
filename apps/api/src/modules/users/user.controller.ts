import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { WalletAddressDto } from 'libs/queries/src/dtos/base.dto'
import { UserService } from './user.service'

@Controller('users')
@ApiTags('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // @Post()
    // @HttpCode(HttpStatus.CREATED)
    // @UseGuards(JwtAuthGuard)
    // @Permission('create_account')
    // async createUser(@Body() createUserDto: CreateUserDto) {
    //     const createdUser = await this.userService.createUser(createUserDto)
    //     return {
    //         success: true,
    //         content: createdUser,
    //     }
    // }

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
