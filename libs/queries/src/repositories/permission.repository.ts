import { CustomRepository } from '@shares/decorators'
import { Permission } from '@entities/permission.entity'
import { Repository } from 'typeorm'

@CustomRepository(Permission)
export class PermissionRepository extends Repository<Permission> {
    async getAllPermissions(): Promise<Permission[]> {
        const queryBuilder = this.createQueryBuilder('permissions').select([
            'permissions.id',
            'permissions.key',
            'permissions.description',
        ])
        const permissions = await queryBuilder.getMany()
        return permissions
    }
}
