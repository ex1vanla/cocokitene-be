import { GetAllUsersDto } from '@dtos/user.dto'
import { User } from '@entities/user.entity'
import { UserStatusEnum } from '@shares/constants/user.const'
import { CustomRepository } from '@shares/decorators'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'
import { Repository } from 'typeorm'

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
        // console.log('companyId', companyId)
        const { page, limit, searchQuery } = options

        const queryBuilder = this.createQueryBuilder('users')
            .select([
                'users.id',
                'users.username',
                'users.email',
                'users.avatar',
                'users.companyId',
                'users.defaultAvatarHashColor',
                'users.createdAt',
                'users.updatedAt',
            ])
            .where('users.companyId = :companyId', {
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
            .where('role.roleName = :roleName', { roleName: 'SUPER_ADMIN' })
            .andWhere('users.companyId = :companyId', { companyId: companyId })
            .getOne()

        return superAdmin
    }
}
