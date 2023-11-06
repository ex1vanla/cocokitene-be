import { Role } from '@entities/role.entity'
import { Injectable } from '@nestjs/common'
import { RoleRepository } from '@repositories/role.repository'

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) {}
    async getPermissionsByRoleId(roleIds: number[]): Promise<string[]> {
        const permissionKeys = await this.roleRepository.getPermissionsByRoleId(
            roleIds,
        )
        return permissionKeys
    }

    async getRoleByRoleName(roleName: string): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: {
                roleName: roleName,
            },
        })
        return role
    }
}
