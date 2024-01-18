import { Injectable } from '@nestjs/common'
import { Permission } from '@entities/permission.entity'
import { PermissionRepository } from '@repositories/permission.repository'
import { GetAllPermissionDto } from '@dtos/permissions.dto'
import { PermissionEnum } from '@shares/constants'

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepository: PermissionRepository) {}

    async getAllNormalPermissions(
        getAllPermissionDto: GetAllPermissionDto,
    ): Promise<Permission[]> {
        const normalPermissions =
            await this.permissionRepository.getAllPermissions(
                getAllPermissionDto,
            )
        const [permissionRoleInternal, permissionRoleNormal] =
            await Promise.all([
                this.permissionRepository.getPermissionByPermissionName(
                    PermissionEnum.LIST_ROLES_INTERNAL,
                ),
                this.permissionRepository.getPermissionByPermissionName(
                    PermissionEnum.LIST_ROLES_NORMAL,
                ),
            ])

        const filteredNormalPermissions = normalPermissions.filter(
            (permission) => {
                return (
                    permission.id !== permissionRoleInternal.id &&
                    permission.id !== permissionRoleNormal.id
                )
            },
        )

        return filteredNormalPermissions
    }
    async getAllInternalPermissions(
        getAllPermissionDto: GetAllPermissionDto,
    ): Promise<Permission[]> {
        const internalPermissions =
            await this.permissionRepository.getAllPermissions(
                getAllPermissionDto,
            )

        return internalPermissions
    }
}
