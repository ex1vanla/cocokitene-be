import { Role } from '@entities/role.entity'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
    async getRoleByName(roleName: string): Promise<Role> {
        const role = await this.findOne({
            where: {
                roleName: roleName,
            },
        })
        return role
    }
}
