import { GetAllUsersDto, SuperAdminDto, UpdateUserDto } from '@dtos/user.dto'
import { User } from '@entities/user.entity'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserRepository } from '@repositories/user.repository'
import { httpErrors } from '@shares/exception-filter'
import { WalletAddressDto } from 'libs/queries/src/dtos/base.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { DetailUserReponse } from '@api/modules/users/user.interface'
import { CompanyService } from '@api/modules/companys/company.service'
import { UserRoleService } from '@api/modules/user-roles/user-role.service'

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
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

        const { roleIds, userAvatar } = updateUserDto

        await Promise.all([
            await this.userRoleService.updateUserRole(userId, roleIds),
            (existedUser = await this.userRepository.updateUserAvatar(
                existedUser.id,
                userAvatar,
            )),
        ])
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
        const roleNameByUserId = await this.userRoleService.getRoleNameByUserId(
            userId,
        )
        return {
            ...existedUser,
            roleName: roleNameByUserId,
        }
    }
}
