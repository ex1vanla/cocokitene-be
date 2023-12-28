import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthService } from '@api/modules/auths/auth.service'
import {
    ForgotPasswordDto,
    LoginByPassword,
    LoginDto,
    RefreshTokenDto,
    SystemAdminRefreshTokenDto,
} from 'libs/queries/src/dtos/auth.dto'
import { ResetPasswordDto } from '@dtos/password.dto'
import { ChangePasswordDto } from '@dtos/system-admin.dto'

@Controller('auths')
@ApiTags('auths')
export class AuthController {
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

    @Post('/system-admin/forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async sendEmailForgotPassword(
        @Body() forgotPasswordDto: ForgotPasswordDto,
    ) {
        await this.authService.sendEmailForgotPassword(forgotPasswordDto)
        return 'Send reset password token to your email successfully!!!'
    }

    @Post('/system-admin/email/verify/:token')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    async verifyEmailAndResetPassword(
        @Param('token') linkToken: string,
        @Body() resetPasswordDto: ResetPasswordDto,
    ) {
        const isEmailVerify =
            await this.authService.verifyEmailAndResetPassword(
                linkToken,
                resetPasswordDto,
            )
        return isEmailVerify
    }
    
    @Post('system-admin/:id/reset-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(
        @Param('id') systemAdminId: number,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        const changePassword = await this.authService.changePassword(
            systemAdminId,
            changePasswordDto,
        )
        return changePassword
    }
}
