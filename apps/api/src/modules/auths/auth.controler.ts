import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from '@api/modules/auths/auth.service'
import { LoginDto, RefreshTokenDto } from 'libs/queries/src/dtos/auth.dto'

@Controller('auths')
@ApiTags('auths')
export class AuthControler {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const loginData = await this.authService.login(loginDto)
        return {
            loginData,
        }
    }

    @Get('refresh-token')
    @HttpCode(HttpStatus.OK)
    async generateNewAccessJWT(@Query() refreshTokenDto: RefreshTokenDto) {
        const newAccessToken = await this.authService.generateNewAccessJWT(
            refreshTokenDto,
        )
        return {
            newAccessToken,
        }
    }
}
