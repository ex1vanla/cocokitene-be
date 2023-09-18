import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { UserService } from '@api/modules/users/user.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from 'libs/queries/src/dtos/user.dto'

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
}
