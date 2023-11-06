import { CustomRepository } from '@shares/decorators'
import { UserRole } from '@entities/user-role.entity'
import { Repository } from 'typeorm'
@CustomRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {
    async getRoleIdsByUserId(userId: number): Promise<number[]> {
        const userRoles = await this.createQueryBuilder('user_roles')
            .select(['user_roles.roleId'])
            .where('user_roles.userId = :userId', { userId })
            .getMany()
        const roleIds: number[] = userRoles.map((userRole) => userRole.roleId)
        return roleIds
    }

    async getRoleNameByUserId(userId: number): Promise<string[]> {
        const userRoles = await this.createQueryBuilder('user_roles')
            .leftJoinAndSelect('user_roles.role', 'role')
            .where('user_roles.userId = :userId', { userId })
            .getMany()
        const roleNames: string[] = userRoles.map(
            (userRole) => userRole.role.roleName,
        )
        return roleNames
    }
}
