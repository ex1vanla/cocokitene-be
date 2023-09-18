import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '@repositories/user.repository'
import { ConfigService } from '@nestjs/config'

import {
    GenerateAccessJWTData,
    LoginResponseData,
} from '@api/modules/auths/auth.interface'
import { UserStatusEnum } from '@shares/constants'
import { httpErrors } from '@shares/exception-filter'
import { getSignedMessage, isValidSignature } from '@shares/utils'
import { uuid } from '@shares/utils/uuid'
import { User } from '@entities/user.entity'
import {
    generateAccessJWT,
    generateRefreshTokenJWT,
    verifyAccessTokenJWT,
} from '@shares/utils/jwt'
import { LoginDto, RefreshTokenDto } from 'libs/queries/src/dtos/auth.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
    ) {}

    async login(loginDto: LoginDto): Promise<LoginResponseData> {
        const { walletAddress, signature } = loginDto
        // check user exists
        const user = await this.userRepository.getUserByWalletAddress(
            walletAddress,
            UserStatusEnum.ACTIVE,
        )
        if (!user) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        // get message have to sign
        const signedMessage = getSignedMessage(user.nonce)
        // verify signature
        if (!isValidSignature(walletAddress, signature, signedMessage)) {
            throw new HttpException(
                httpErrors.INVALID_SIGNATURE,
                HttpStatus.BAD_REQUEST,
            )
        }
        //update nonce();
        user.nonce = uuid()
        await user.save()

        const { userData, accessToken, refreshToken } =
            await this.generateResponseLoginData(user)
        return {
            userData,
            accessToken,
            refreshToken,
        }
    }

    async generateResponseLoginData(user: User): Promise<LoginResponseData> {
        let accessToken
        let refreshToken
        let userData
        try {
            userData = {
                id: user.id,
                walletAddress: user.walletAddress,
                username: user.username,
                email: user.email,
                role: user.role.roleName,
            }
            accessToken = generateAccessJWT(userData, {
                expiresIn: Number(
                    this.configService.get('api.accessTokenExpireInSec'),
                ),
            })
            refreshToken = generateRefreshTokenJWT(userData, {
                expiresIn: Number(
                    this.configService.get('api.refreshTokenExpireInSec'),
                ),
            })
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        return {
            userData,
            accessToken,
            refreshToken,
        }
    }

    async generateNewAccessJWT(
        refreshTokenDto: RefreshTokenDto,
    ): Promise<GenerateAccessJWTData> {
        const refreshToken = refreshTokenDto.refreshToken
        let payload
        try {
            payload = await verifyAccessTokenJWT(refreshToken)
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
        }
        const accessToken = generateAccessJWT(payload)
        return { accessToken }
    }
}
