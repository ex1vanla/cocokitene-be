import {
    CreateSuperAdminCompanyDto,
    CreateUserDto,
    GetAllUsersDto,
    SuperAdminDto,
    UpdateOwnProfileDto,
    UpdateUserDto,
} from '@dtos/user.dto'
import { User } from '@entities/user.entity'
import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
import { UserRepository } from '@repositories/user.repository'
import { httpErrors } from '@shares/exception-filter'
import { WalletAddressDto } from 'libs/queries/src/dtos/base.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { DetailUserReponse } from '@api/modules/users/user.interface'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserRoleService } from '@api/modules/user-roles/user-role.service'
import { uuid } from '@shares/utils/uuid'
import { RoleEnum } from '@shares/constants'
import { generateRandomHexColor } from '@shares/utils'
import { Like } from 'typeorm'

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        @Inject(forwardRef(() => CompanyService))
        private readonly companyService: CompanyService,
        private readonly userRoleService: UserRoleService,
    ) {}

    async getUserNonceByUserWalletAddress(
        walletAddressDto: WalletAddressDto,
    ): Promise<string> {
        const { walletAddress } = walletAddressDto
        const user = await this.userRepository.findOne({
            where: {
                walletAddress: walletAddress,
            },
        })
        if (!user) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.BAD_REQUEST,
            )
        }
        return user.nonce
    }

    async getAllUsersCompany(
        getAllUsersDto: GetAllUsersDto,
        companyId: number,
    ): Promise<Pagination<User>> {
        const users = await this.userRepository.getAllUsersCompany(
            getAllUsersDto,
            companyId,
        )

        return users
    }

    async getTotalSharesHolderByShareholderIds(
        shareholderIds: number[],
    ): Promise<number> {
        const users = await Promise.all([
            ...shareholderIds.map((shareholderId) =>
                this.userRepository.getActiveUserById(shareholderId),
            ),
        ])

        const totalShares = users.reduce((accumulator, currentValue) => {
            accumulator = accumulator + Number(currentValue.shareQuantity)
            return accumulator
        }, 0)

        return totalShares
    }

    async getActiveUserById(userId: number): Promise<User> {
        const user = await this.userRepository.getActiveUserById(userId)

        return user
    }

    async getInternalUserById(userId: number): Promise<User> {
        const user = await this.userRepository.getInternalUserById(userId)
        return user
    }

    // async getUserByMeetingIdAndRole(
    //     meetingId: number,
    //     role: MeetingRole,
    // ): Promise<User[]> {
    //     const users = this.userRepository.getUserByMeetingIdAndRole(
    //         meetingId,
    //         role,
    //     )

    //     return users
    // }

    async getSuperAdminCompany(companyId: number): Promise<User> {
        const superAdmin = await this.userRepository.getSuperAdminCompany(
            companyId,
        )
        return superAdmin
    }
    async updateSuperAdminCompany(
        companyId: number,
        superAdminCompanyId: number,
        newSuperAdminDto: SuperAdminDto,
    ): Promise<User> {
        const updatedSuperAdminCompany =
            await this.userRepository.updateSuperAdminCompany(
                companyId,
                superAdminCompanyId,
                newSuperAdminDto,
            )
        return updatedSuperAdminCompany
    }
    async updateUser(
        companyId: number,
        userId: number,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        let existedUser = await this.userRepository.findOne({
            where: {
                id: userId,
                companyId: companyId,
            },
        })
        if (!existedUser) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        //update user
        try {
            existedUser = await this.userRepository.updateUser(
                userId,
                companyId,
                updateUserDto,
            )
        } catch (error) {
            throw new HttpException(
                httpErrors.USER_UPDATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        const { roleIds } = updateUserDto
        const roleIdsOfUserId = await this.userRoleService.updateUserRole(
            userId,
            roleIds,
        )
        const roleShareHolder =
            await this.userRoleService.getRoleByRoleNameAndIdCompany(
                RoleEnum.SHAREHOLDER,
                companyId,
            )
        if (roleIdsOfUserId.includes(roleShareHolder.id)) {
            existedUser.shareQuantity = updateUserDto.shareQuantity
            await existedUser.save()
        }
        return existedUser
    }

    async getUserById(
        companyId: number,
        userId: number,
    ): Promise<DetailUserReponse> {
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        const existedUser = await this.userRepository.getUserById(
            companyId,
            userId,
        )
        if (!existedUser) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        const rolesByUserId = await this.userRoleService.getRolesByUserId(
            userId,
        )

        return {
            ...existedUser,
            roles: rolesByUserId,
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const existedUser = await this.userRepository.findOne({
            where: {
                email: Like(`%${email}%`),
            },
        })
        return existedUser
    }

    async getUserByWalletAddress(walletAddress: string): Promise<User> {
        const existedUser = await this.userRepository.findOne({
            where: {
                walletAddress: Like(`%${walletAddress}%`),
            },
        })
        return existedUser
    }

    async createUser(companyId: number, createUserDto: CreateUserDto) {
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        //createUser
        let createdUser: User

        try {
            createdUser = await this.userRepository.createUser(
                companyId,
                createUserDto,
            )

            createdUser.nonce = uuid()
            createdUser.defaultAvatarHashColor = generateRandomHexColor()
            await createdUser.save()
        } catch (error) {
            throw new HttpException(
                httpErrors.USER_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        const { roleIds } = createUserDto
        try {
            await Promise.all([
                ...roleIds.map((roleId) =>
                    this.userRoleService.createUserRole({
                        userId: createdUser.id,
                        roleId: roleId,
                    }),
                ),
            ])
        } catch (error) {
            throw new HttpException(
                { message: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
        return createdUser
    }

    async createSuperAdminCompany(
        createSuperAdminCompanyDto: CreateSuperAdminCompanyDto,
    ): Promise<User> {
        const { username, companyId, walletAddress, email, statusId } =
            createSuperAdminCompanyDto
        try {
            const createdSuperAdmin =
                await this.userRepository.createSuperAdminCompany({
                    username,
                    companyId,
                    walletAddress,
                    email,
                    statusId,
                })
            createdSuperAdmin.nonce = uuid()
            await createdSuperAdmin.save()
            return createdSuperAdmin
        } catch (error) {
            throw new HttpException(
                httpErrors.SUPER_ADMIN_CREATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    // update profile
    async updateOwnProfile(
        user: User,
        userId: number,
        updateOwnProfileDto: UpdateOwnProfileDto,
    ): Promise<User> {
        const companyId = user?.companyId,
        userRequestId = user?.id
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        const canUpdateOwnProfile = userId == userRequestId
        if (!canUpdateOwnProfile) {
            throw new HttpException(
                httpErrors.USER_NOT_OWNER_OF_PROFILE,
                HttpStatus.BAD_REQUEST,
            )
        }
        let existedUser = await this.userRepository.findOne({
            where: {
                id: userId,
                companyId: companyId,
            },
        })
        if (!existedUser) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }


        //update profle of user
        try {
            existedUser = await this.userRepository.updateOwnProfile(
                userId,
                companyId,
                updateOwnProfileDto,
            )
        } catch (error) {
            throw new HttpException(
                httpErrors.PROFILE_UPDATE_FAILED,
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }

        return existedUser

    }



    
    //profile
    async getProfileOwnById(
        userId: number,
        user: User,
    ): Promise<DetailUserReponse> {
        const companyId = user?.companyId,
            userRequestId = user?.id
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        const canSeeDetailOwnProfile = userId == userRequestId
        if (!canSeeDetailOwnProfile) {
            throw new HttpException(
                httpErrors.USER_NOT_OWNER_OF_PROFILE,
                HttpStatus.BAD_REQUEST,
            )
        }
        
        const existedUser = await this.userRepository.getUserById(
            companyId,
            userId,
        )

        if (!existedUser) {
            throw new HttpException(
                httpErrors.USER_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }
        const rolesByUserId = await this.userRoleService.getRolesByUserId(
            userId,
        )
        return {
            ...existedUser,
            roles: rolesByUserId,
        }
    }


        
}
