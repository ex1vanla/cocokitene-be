import { Role } from '@entities/role.entity'
import { PermissionEnum } from '@shares/constants/permission.const'
import { CustomRepository } from '@shares/decorators'
import { Repository } from 'typeorm'

@CustomRepository(Role)
export class RoleRepository extends Repository<Role> {
    async getRoleByName(roleName: string): Promise<Role> {
        const role = await this.findOne({
            where: {
                roleName,
            },
        })
        return role
    }

    async getRoleById(roleId: number): Promise<Role> {
        const role = await this.findOne({
            where: {
                id: roleId,
            },
        })
        return role
    }

    async getPermissionsByRoleId(ids: number[]): Promise<string[]> {
        const permissionKeys: string[] = []
        for (const id of ids) {
            const role = await this.findOne({
                where: {
                    id: id,
                },
                relations: ['rolePermissions'],
            })
            if (role) {
                const permissionKeysAsString =
                    role?.rolePermissions?.map(
                        (rolePermission) =>
                            rolePermission?.permission?.key as PermissionEnum,
                    ) || []
                const permission_keys = permissionKeysAsString.map((key) =>
                    key.toString(),
                )
                permissionKeys.push(...permission_keys)
            }
        }
        return permissionKeys
    }
}
