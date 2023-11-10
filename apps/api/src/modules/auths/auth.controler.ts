import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '@api/modules/auths/auth.service'
import {
    LoginByPassword,
    LoginDto,
    RefreshTokenDto,
    SystemAdminRefreshTokenDto,
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
    //refresh token user
    @Post('/user/refresh-token')
    @HttpCode(HttpStatus.CREATED)
    async generateNewAccessJWT(@Body() refreshTokenDto: RefreshTokenDto) {
        const newAccessToken = await this.authService.generateNewAccessJWT(
            refreshTokenDto,
        )
        return newAccessToken
    }

    @Post('/system-admin/refresh-token')
    @HttpCode(HttpStatus.CREATED)
    async generateNewAccessJWTSystemAdmin(
        @Body() systemAdminRefreshTokenDto: SystemAdminRefreshTokenDto,
    ) {
        const newAccessTokenSystemAdmin =
            await this.authService.generateNewAccessJWTSystemAdmin(
                systemAdminRefreshTokenDto,
            )
        return newAccessTokenSystemAdmin
    }
}
