import { CustomRepository } from '@shares/decorators'
import { Permission } from '@entities/permission.entity'
import { Repository } from 'typeorm'
import { GetAllPermissionDto } from '@dtos/permission.dto'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'

@CustomRepository(Permission)
export class PermissionRepository extends Repository<Permission> {
    async getAllPermissions(
        options: GetAllPermissionDto,
    ): Promise<Pagination<Permission>> {
        const { page, limit, searchQuery } = options
        const queryBuilder = this.createQueryBuilder('permissions').select([
            'permissions.id',
            'permissions.key',
            'permissions.description',
        ])
        if (searchQuery) {
            queryBuilder.andWhere('permissions.key like : searchQuery', {
                searchQuery: `${searchQuery}`,
            })
        }
        return paginate(queryBuilder, { page, limit })
    }
}
