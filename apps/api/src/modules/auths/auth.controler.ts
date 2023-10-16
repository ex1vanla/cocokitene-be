import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '@api/modules/auths/auth.service'
import {
    LoginByPassword,
    LoginDto,
    RefreshTokenDto,
} from 'libs/queries/src/dtos/auth.dto'

@Controller('auths')
@ApiTags('auths')
export class AuthControler {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const loginData = await this.authService.login(loginDto)
        return loginData
    }

    //start system admin
    @Post('/system-admin/login-by-password')
    @HttpCode(HttpStatus.OK)
    async loginByPassword(@Body() loginByPassword: LoginByPassword) {
        const loginByPasswordData = await this.authService.loginByPassword(
            loginByPassword,
        )
        return loginByPasswordData
    }
    @Post('refresh-token')
    @HttpCode(HttpStatus.CREATED)
    async generateNewAccessJWT(@Query() refreshTokenDto: RefreshTokenDto) {
        const newAccessToken = await this.authService.generateNewAccessJWT(
            refreshTokenDto,
        )
        return newAccessToken
    }
}
