import { GetAllShareholderDto } from '@dtos/shareholder.dto'

import { User } from '@entities/user.entity'
import { CustomRepository } from '@shares/decorators'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'
import { Repository } from 'typeorm'

@CustomRepository(User)
export class ShareholderRepository extends Repository<User> {
    async getAllShareholderCompany(
        options: GetAllShareholderDto,
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
                'users.shareQuantity',
            ])
            .leftJoinAndSelect('users.userStatus', 'userStatus')

            .where('users.shareQuantity IS NOT NULL')
            .andWhere('users.companyId = :companyId', {
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
            queryBuilder.orderBy('users.updatedAt', sortOrder)
        }

        return paginate(queryBuilder, { page, limit })
    }

    async getShareholderById(
        companyId: number,
        shareholderId: number,
    ): Promise<User> {
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
            .andWhere('users.id = :shareholderId', {
                shareholderId,
            })
            .getOne()
        return user
    }
}
