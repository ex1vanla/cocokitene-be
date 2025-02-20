import {
    CreateSuperAdminCompanyDto,
    CreateUserDto,
    GetAllUsersDto,
    SuperAdminDto,
    UpdateOwnProfileDto,
    UpdateUserDto,
} from '@dtos/user.dto'
import { User } from '@entities/user.entity'
import { UserStatusEnum } from '@shares/constants/user.const'
import { CustomRepository } from '@shares/decorators'
import { Pagination, paginateRaw } from 'nestjs-typeorm-paginate'
import { Repository } from 'typeorm'
import { HttpException, HttpStatus } from '@nestjs/common'

@CustomRepository(User)
export class UserRepository extends Repository<User> {
    async getActiveUserByEmail(email: string): Promise<User> {
        const user = await this.createQueryBuilder('users')
            .leftJoinAndSelect('users.userStatus', 'userStatus')
            .where('userStatus.status= :status', {
                status: UserStatusEnum.ACTIVE,
            })
            .andWhere('users.email = :email', {
                email,
            })
            .getOne()
        return user
    }

    async getActiveUserById(id: number): Promise<User> {
        const user = await this.createQueryBuilder('users')
            .leftJoinAndSelect('users.userStatus', 'userStatus')
            .where('userStatus.status= :status', {
                status: UserStatusEnum.ACTIVE,
            })
            .andWhere('users.id = :id', {
                id,
            })
            .getOne()
        return user
    }

    async getInternalUserById(id: number): Promise<User> {
        const user = await this.createQueryBuilder('users')
            .where('users.id = :id', {
                id,
            })
            .getOne()
        return user
    }

    async getUserByWalletAddress(walletAddress: string): Promise<User> {
        const user = await this.createQueryBuilder('users')
            .leftJoin('users.userStatus', 'userStatus')
            .addSelect(['userStatus.id', 'userStatus.status'])
            .leftJoinAndSelect('users.company', 'companyUser')
            .leftJoin('companyUser.companyStatus', 'companyStatus')
            .addSelect(['companyStatus.id', 'companyStatus.status'])
            .where('users.walletAddress= :walletAddress', {
                walletAddress,
            })
            .getOne()
        return user
    }

    async getAllUsersCompany(
        options: GetAllUsersDto,
        companyId: number,
    ): Promise<Pagination<User>> {
        const { page, limit, searchQuery, sortOrder } = options

        const queryBuilder = this.createQueryBuilder('users')
            .select([
                'users.id',
                'users.username',
                'users.email',
                'users.walletAddress',
                'users.avatar',
                'users.companyId',
                'users.defaultAvatarHashColor',
                'users.createdAt',
                'users.updatedAt',
                'GROUP_CONCAT(role.role ORDER BY role.role ASC ) as listRoleResponse',
            ])
            .leftJoinAndSelect('users.userStatus', 'userStatus')
            .leftJoin('users.userRole', 'userRole')
            .leftJoin('userRole.role', 'role')
            .where('users.companyId = :companyId', { companyId })
            .andWhere('role.companyId = :companyId', { companyId })
            .groupBy('users.id')

        if (searchQuery) {
            queryBuilder
                .andWhere('(users.username like :username', {
                    username: `%${searchQuery}%`,
                })
                .orWhere('users.email like :email)', {
                    email: `%${searchQuery}%`,
                })
        }

        if (sortOrder) {
            queryBuilder.addOrderBy('users.updatedAt', sortOrder)
        }

        return paginateRaw(queryBuilder, { page, limit })
    }

    async getAllUserInCompanyByRoleName(
        options: GetAllUsersDto,
        companyId: number,
        roleId: number,
    ): Promise<Pagination<User>> {
        const { page, limit, searchQuery, sortOrder } = options

        const queryBuilder = this.createQueryBuilder('users')
            .select([
                'users.id',
                'users.username',
                'users.email',
                'users.walletAddress',
                'users.avatar',
                'users.companyId',
                'users.defaultAvatarHashColor',
                'users.createdAt',
                'users.updatedAt',
                'GROUP_CONCAT(role.id ORDER BY role.role ASC) as listRole',
            ])
            .leftJoinAndSelect('users.userStatus', 'userStatus')
            .leftJoin('users.userRole', 'userRole')
            .leftJoin('userRole.role', 'role')
            .andWhere('users.companyId = :companyId', { companyId })
            .having('listRole LIKE :roleContaining', {
                roleContaining: `%${roleId}%`,
            })
            .groupBy('users.id')

        if (searchQuery) {
            queryBuilder
                .andWhere('(users.userName like :userName', {
                    userName: `%${searchQuery}%`,
                })
                .orWhere('users.email like :email)', {
                    email: `%${searchQuery}%`,
                })
        }
        if (sortOrder) {
            queryBuilder.orderBy('users.updatedAt', sortOrder)
        }

        return paginateRaw(queryBuilder, { page, limit })
    }

    // async getUserByMeetingIdAndRole(
    //     meetingId: number,
    //     role: MeetingRole,
    // ): Promise<User[]> {
    //     const users = await this.createQueryBuilder('users')
    //         .select([
    //             'users.id',
    //             'users.username',
    //             'users.email',
    //             'users.avatar',
    //             'users.defaultAvatarHashColor',
    //         ])
    //         .leftJoinAndSelect('users.userMeeting', 'userMeeting')
    //         .where(
    //             'userMeeting.meetingId = :meetingId AND userMeeting.role  = :role',
    //             {
    //                 meetingId,
    //                 role,
    //             },
    //         )
    //         .getMany()

    //     return users
    // }

    async getSuperAdminCompany(companyId: number): Promise<User> {
        const superAdmin = await this.createQueryBuilder('users')
            .leftJoin('user_role', 'userRole', 'users.id = userRole.userId')
            .leftJoin('role', 'role', 'userRole.roleId = role.id')

            .leftJoinAndSelect('users.userStatus', 'userStatus')
            .where('role.roleName = :roleName', { roleName: 'SUPER_ADMIN' })
            .andWhere('users.companyId = :companyId', { companyId: companyId })
            .getOne()

        return superAdmin
    }

    async updateSuperAdminCompany(
        companyId: number,
        superAdminCompanyId: number,
        newSuperAdminDto: SuperAdminDto,
    ): Promise<User> {
        try {
            await this.createQueryBuilder('users')
                .update(User)
                .set({
                    username: newSuperAdminDto.username,
                    walletAddress: newSuperAdminDto.walletAddress || null,
                    email: newSuperAdminDto.email,
                    statusId: newSuperAdminDto.statusId,
                })
                .where('users.id = :superAdminCompanyId', {
                    superAdminCompanyId,
                })
                .andWhere('users.company_id = :companyId', {
                    companyId,
                })
                .execute()
            const updatedSuperAdminCompany = await this.findOne({
                where: {
                    id: superAdminCompanyId,
                },
            })
            return updatedSuperAdminCompany
        } catch (error) {
            // throw error
            throw new HttpException(
                { message: error.message },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }

    async updateUser(
        userId: number,
        companyId: number,
        updateUserDto: UpdateUserDto,
        updaterId: number,
    ): Promise<User> {
        await this.createQueryBuilder('users')
            .update(User)
            .set({
                username: updateUserDto.username,
                walletAddress: updateUserDto.walletAddress || null,
                shareQuantity: updateUserDto.shareQuantity || null,
                email: updateUserDto.email,
                statusId: updateUserDto.statusId,
                phone: updateUserDto.phone,
                avatar: updateUserDto.avatar,
                updaterId: updaterId,
            })
            .where('users.id = :userId', {
                userId: userId,
            })
            .andWhere('users.company_id = :companyId', {
                companyId: companyId,
            })
            .execute()
        const user = await this.findOne({
            where: {
                id: userId,
            },
        })
        return user
    }

    async getUserById(companyId: number, userId: number): Promise<User> {
        const user = await this.createQueryBuilder('users')
            .select([
                'users.username',
                'users.email',
                'users.phone',
                'users.walletAddress',
                'users.defaultAvatarHashColor',
                'users.avatar',
                'users.shareQuantity',
            ])
            .leftJoin('users.company', 'company')
            .addSelect(['company.id', 'company.companyName'])
            .leftJoin('users.userStatus', 'userStatus')
            .addSelect(['userStatus.id', 'userStatus.status'])
            .where('users.companyId = :companyId', {
                companyId,
            })
            .andWhere('users.id = :userId', { userId: userId })
            .getOne()
        return user
    }
    async createUser(
        companyId: number,
        createUserDto: CreateUserDto,
        creatorId: number,
    ): Promise<User> {
        const user = await this.create({
            ...createUserDto,
            walletAddress: createUserDto.walletAddress || null,
            shareQuantity: createUserDto.shareQuantity || null,
            companyId,
            creatorId: creatorId,
        })
        await user.save()
        return user
    }

    async createSuperAdminCompany(
        createSuperAdminCompanyDto: CreateSuperAdminCompanyDto,
    ): Promise<User> {
        const { username, companyId, walletAddress, email, statusId } =
            createSuperAdminCompanyDto
        const createdSuperAdmin = await this.create({
            username,
            companyId,
            walletAddress,
            email,
            statusId,
        })
        await createdSuperAdmin.save()
        return createdSuperAdmin
    }
    // update profile
    async updateOwnProfile(
        userId: number,
        companyId: number,
        updateOwnProfileDto: UpdateOwnProfileDto,
    ): Promise<User> {
        await this.createQueryBuilder('users')
            .update(User)
            .set({
                username: updateOwnProfileDto.username,
                walletAddress: updateOwnProfileDto.walletAddress,
                email: updateOwnProfileDto.email,
                phone: updateOwnProfileDto.phone,
                avatar: updateOwnProfileDto.avatar,
                updaterId: userId,
            })
            .where('users.id = :userId', {
                userId: userId,
            })
            .andWhere('users.company_id = :companyId', {
                companyId: companyId,
            })
            .execute()
        const user = await this.findOne({
            where: {
                id: userId,
            },
        })
        return user
    }

    async findUserByEmailInCompany({
        email,
        companyId,
    }: {
        email: string
        companyId: number
    }): Promise<User> {
        const user = await this.createQueryBuilder('users')
            .leftJoin('users.userStatus', 'userStatus')
            .addSelect(['userStatus.id', 'userStatus.status'])
            .leftJoinAndSelect('users.company', 'companyUser')
            .leftJoin('companyUser.companyStatus', 'companyStatus')
            .addSelect(['companyStatus.id', 'companyStatus.status'])
            .where('users.companyId = :companyId', {
                companyId,
            })
            .andWhere('users.email= :email', {
                email,
            })
            .getOne()
        return user
    }

    async getUserByResetPasswordTokenUser(token: string): Promise<User> {
        const user = await this.findOne({
            where: {
                resetPasswordToken: token,
            },
        })
        return user
    }
}
