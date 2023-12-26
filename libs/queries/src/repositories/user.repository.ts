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
import { Pagination, paginate } from 'nestjs-typeorm-paginate'
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

    async getUserByWalletAddress(
        walletAddress: string,
        status?: UserStatusEnum,
        // isNormalRole?: boolean,
    ): Promise<User> {
        const queryBuilder = this.createQueryBuilder('users')
        if (status) {
            queryBuilder
                .leftJoinAndSelect('users.userStatus', 'userStatus')
                .where('userStatus.status= :status', {
                    status,
                })
        }
        queryBuilder.andWhere('users.walletAddress= :walletAddress', {
            walletAddress,
        })
        const user = await queryBuilder.getOne()
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
            ])
            .leftJoinAndSelect('users.userStatus', 'userStatus')
            .leftJoinAndSelect('users.userRole', 'userRole')
            .leftJoinAndSelect('userRole.role', 'role')
            .where('users.companyId = :companyId', {
                companyId,
            })
            .andWhere('role.companyId = :companyId', {
                companyId,
            })

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
        queryBuilder.addOrderBy('role.roleName', 'ASC')
        return paginate(queryBuilder, { page, limit })
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
            .leftJoin('user_roles', 'userRole', 'users.id = userRole.userId')
            .leftJoin('roles', 'role', 'userRole.roleId = role.id')

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
                    walletAddress: newSuperAdminDto.walletAddress,
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
            throw error
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
    ): Promise<User> {
        await this.createQueryBuilder('users')
            .update(User)
            .set({
                username: updateUserDto.username,
                walletAddress: updateUserDto.walletAddress,
                email: updateUserDto.email,
                statusId: updateUserDto.statusId,
                phone: updateUserDto.phone,
                avatar: updateUserDto.avatar,
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
                'users.walletAddress',
                'users.defaultAvatarHashColor',
                'users.avatar',
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
    ): Promise<User> {
        const user = await this.create({
            ...createUserDto,
            companyId,
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
}
