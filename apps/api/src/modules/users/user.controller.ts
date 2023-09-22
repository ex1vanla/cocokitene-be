import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common'
import { UserService } from '@api/modules/users/user.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'libs/queries/src/dtos/user.dto'
import { JwtAuthGuard } from '@shares/guards/jwt-auth.guard'
import { Permission } from '@shares/decorators/permission.decorator'
import { IdDto } from 'libs/queries/src/dtos/base.dto'

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

    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Permission('detail_account')
    async getNonceByUserId(@Param() userId: IdDto) {
        const nonceValue = await this.userService.getUserNonceByUserId(userId)
        return {
            success: true,
            content: nonceValue,
        }
    }
}
