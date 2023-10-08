import { CustomRepository } from '@shares/decorators'
import { User } from '@entities/user.entity'
import { Repository } from 'typeorm'
import { UserStatusEnum } from '@shares/constants/user.const'
import { GetAllUsersDto } from '@dtos/user.dto'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'

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

    async getUserByWalletAddress(
        walletAddress: string,
        status?: UserStatusEnum,
        isNormalRole?: boolean,
    ): Promise<User> {
        const queryBuilder = this.createQueryBuilder('users').leftJoinAndSelect(
            'users.role',
            'role',
        )
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
        if (isNormalRole) {
            queryBuilder.andWhere('role.roleName != :roleName', {
                roleName: 'USER_SYSTEM_ADMIN',
            })
        }
        const user = await queryBuilder.getOne()
        return user
    }

    async getAllUsersCompany(
        options: GetAllUsersDto,
        companyId: number,
    ): Promise<Pagination<User>> {
        console.log('companyId', companyId)
        const { page, limit } = options

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
        return paginate(queryBuilder, { page, limit })
    }
}
