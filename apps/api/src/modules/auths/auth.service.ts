/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '@repositories/user.repository'
import { ConfigService } from '@nestjs/config'

import {
    GenerateAccessJWTData,
    GenerateAccessJWTSystemAdminData,
    LoginResponseData,
    SystemAdminLoginResponseData,
} from '@api/modules/auths/auth.interface'
import { UserStatusEnum } from '@shares/constants'
import { httpErrors } from '@shares/exception-filter'
import {
    comparePassword,
    getSignedMessage,
    isValidSignature,
} from '@shares/utils'
import { uuid } from '@shares/utils/uuid'
import { User } from '@entities/user.entity'
import {
    generateAccessJWT,
    generateRefreshTokenJWT,
    generateSystemAdminAccessJWT,
    generateSystemAdminRefreshJWT,
    verifyAccessTokenJWT,
    verifyRefreshJWT,
    verifySystemAdminRefreshTokenJWT,
} from '@shares/utils/jwt'
import {
    LoginByPassword,
    LoginDto,
    RefreshTokenDto,
    SystemAdminRefreshTokenDto,
} from 'libs/queries/src/dtos/auth.dto'
import { UserRole } from '@entities/user-role.entity'
import { RolePermission } from '@entities/role-permission.entity'
import { Permission } from '@entities/permission.entity'
import { Role } from '@entities/role.entity'
import { RoleRepository } from '@repositories/role.repository'
import { UserRoleRepository } from '@repositories/user-role.repository'
import { RoleService } from '@api/modules/roles/role.service'
import { UserRoleService } from '@api/modules/user-roles/user-role.service'
import { SystemAdminRepository } from '@repositories/system-admin.repository'
import { SystemAdmin } from '@entities/system-admin.entity'

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly configService: ConfigService,
        private readonly roleService: RoleService,
        private readonly userRoleService: UserRoleService,
        private readonly systemAdminRepository: SystemAdminRepository,
    ) {}

    async login(loginDto: LoginDto): Promise<LoginResponseData> {
        const {
            walletAddress,
            // , signature
        } = loginDto
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
        // const signedMessage = getSignedMessage(user.nonce)
        // // verify signature
        // if (!isValidSignature(walletAddress, signature, signedMessage)) {
        //     throw new HttpException(
        //         httpErrors.INVALID_SIGNATURE,
        //         HttpStatus.BAD_REQUEST,
        //     )
        // }
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
            const roleIds = await this.userRoleService.getRoleIdsByUserId(
                user.id,
            )
            const permissionKeys =
                await this.roleService.getPermissionsByRoleId(roleIds)

            userData = {
                id: user.id,
                walletAddress: user.walletAddress,
                username: user.username,
                email: user.email,
                companyId: user.companyId,
                permissionKeys,
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
                {
                    message: error.message,
                },
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
            payload = await verifyRefreshJWT(refreshToken)
        } catch (error) {
            throw new HttpException(
                {
                    message: error.message,
                },
                HttpStatus.UNAUTHORIZED,
            )
        }
        const accessToken = generateAccessJWT(payload)
        return accessToken
    }

    async loginByPassword(
        loginByPassword: LoginByPassword,
    ): Promise<SystemAdminLoginResponseData> {
        const { email } = loginByPassword
        const systemAdmin =
            await this.systemAdminRepository.findSystemAdminByEmail(email)
        if (!systemAdmin) {
            throw new HttpException(
                httpErrors.SYSTEM_ADMIN_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        const checkPassword = await comparePassword(
            loginByPassword.password,
            systemAdmin.password,
        )
        if (!checkPassword) {
            throw new HttpException(
                httpErrors.SYSTEM_ADMIN_INVALID_PASSWORD,
                HttpStatus.FORBIDDEN,
            )
        }
        const { systemAdminData, accessToken, refreshToken } =
            await this.generateResponseSystemAdminLoginData(systemAdmin)
        return {
            systemAdminData,
            accessToken,
            refreshToken,
        }
    }

    async generateResponseSystemAdminLoginData(
        systemAdmin: SystemAdmin,
    ): Promise<SystemAdminLoginResponseData> {
        let accessToken
        let refreshToken
        let systemAdminData

        try {
            systemAdminData = { ...systemAdmin }
            delete systemAdminData.password
            accessToken = generateSystemAdminAccessJWT(systemAdminData, {
                expiresIn: Number(
                    this.configService.get(
                        'api.systemAdminAccessTokenExpireInSec',
                    ),
                ),
            })

            refreshToken = generateSystemAdminRefreshJWT(systemAdminData, {
                expiresIn: Number(
                    this.configService.get(
                        'api.systemAdminRefreshTokenExpireInSec',
                    ),
                ),
            })
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        return {
            systemAdminData,
            accessToken,
            refreshToken,
        }
    }

    async generateNewAccessJWTSystemAdmin(
        systemAdminRefreshTokenDto: SystemAdminRefreshTokenDto,
    ): Promise<GenerateAccessJWTSystemAdminData> {
        const systemAdminRefreshToken =
            systemAdminRefreshTokenDto.systemAdminRefreshToken
        let payload
        try {
            payload = await verifySystemAdminRefreshTokenJWT(
                systemAdminRefreshToken,
            )
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.UNAUTHORIZED,
            )
        }
        const systemAdminAccessToken = generateSystemAdminAccessJWT(payload)
        return systemAdminAccessToken
    }
}
