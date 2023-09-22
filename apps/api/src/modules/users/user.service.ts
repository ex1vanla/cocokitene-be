import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '@repositories/user.repository'
import { User } from '@entities/user.entity'
import { isValidSignature } from '@shares/utils'
import { httpErrors } from '@shares/exception-filter'
import { UserStatusRepository } from '@repositories/user-status.repository'
import { RoleRepository } from '@repositories/role.repository'
import { CreateUserDto } from 'libs/queries/src/dtos/user.dto'
import { REGISTER_ACCOUNT_MESSAGE, UserStatusEnum } from '@shares/constants'
import { IdDto } from 'libs/queries/src/dtos/base.dto'

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly userStatusRepository: UserStatusRepository,
        private readonly roleRepository: RoleRepository,
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { email, username, walletAddress, signature, roleId } =
            createUserDto

        // verify signature
        if (
            isValidSignature(walletAddress, signature, REGISTER_ACCOUNT_MESSAGE)
        ) {
            throw new HttpException(
                httpErrors.INVALID_SIGNATURE,
                HttpStatus.BAD_REQUEST,
            )
        }

        // check email existed
        const existedUserEmail = await this.userRepository.getActiveUserByEmail(
            createUserDto.email,
        )
        if (existedUserEmail) {
            throw new HttpException(
                httpErrors.USER_EXISTED,
                HttpStatus.BAD_REQUEST,
            )
        }

        // check wallet address existed
        const existedUserWalletAddress =
            await this.userRepository.getUserByWalletAddress(
                walletAddress,
                UserStatusEnum.ACTIVE,
            )
        if (existedUserWalletAddress) {
            throw new HttpException(
                httpErrors.USER_EXISTED,
                HttpStatus.BAD_REQUEST,
            )
        }

        //get unverified status and role user
        const [userStatus, role] = await Promise.all([
            this.userStatusRepository.getUserStatusByStatusType(
                UserStatusEnum.INACTIVE,
            ),
            this.roleRepository.getRoleById(roleId),
        ])
        if (!userStatus) {
            throw new HttpException(
                httpErrors.USER_STATUS_NOT_EXISTED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        if (!role) {
            throw new HttpException(
                httpErrors.ROLE_NOT_EXISTED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        //create user
        let createdUser: User
        try {
            createdUser = await this.userRepository.create({
                email,
                username,
                walletAddress,
                activeTime: new Date(Date.now()),
                statusId: userStatus.id,
                roleId: role.id,
            })
            await createdUser.save()
        } catch (error) {
            throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        return createdUser
    }
    async getUserNonceByUserId(idDto: IdDto): Promise<string> {
        const { id } = idDto
        const user = await this.userRepository.findOne({
            where: {
                id: id,
            },
        })
        return user.nonce
    }
}
