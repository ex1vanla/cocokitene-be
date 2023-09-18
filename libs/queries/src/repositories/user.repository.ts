import { CustomRepository } from '@shares/decorators'
import { User } from '@entities/user.entity'
import { Repository } from 'typeorm'
import { UserStatusEnum } from '@shares/constants/user.const'

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
}
