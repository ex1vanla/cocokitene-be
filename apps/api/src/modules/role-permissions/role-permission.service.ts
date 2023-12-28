import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { RolePermissionRepository } from '@repositories/role-permission.repository'
import {
    CreateRolePermissonDto,
    RoleForPermissionDto,
} from '@dtos/role-permission.dto'
import { RoleService } from '@api/modules/roles/role.service'
import { CompanyService } from '@api/modules/companys/company.service'
import { PermissionService } from '@api/modules/permissions/permission.service'
import { RolePermission } from '@entities/role-permission.entity'
import { httpErrors } from '@shares/exception-filter'

@Injectable()
export class RolePermissionService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly roleService: RoleService,
        private readonly companyService: CompanyService,
        private readonly permissionService: PermissionService,
    ) {}

    async updateRoleForPermission(
        roleForPermissionDto: RoleForPermissionDto,
        companyId: number,
    ): Promise<any> {
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        const updatedListRolePermissions = {}
        const listRoles = await this.roleService.getAllInternalRoleInCompany(
            companyId,
        )

        const listPermissions = await this.permissionService.getAllPermissions()

        await Promise.all([
            ...roleForPermissionDto.assignmentRoleOfPermission.map(
                (permissionRoleDto) =>
                    this.updateRolePermission(
                        permissionRoleDto.permissionId,
                        permissionRoleDto.roleIds,
                    ),
            ),
        ])

        await Promise.all([
            ...listPermissions.map(async (permission) => {
                const permissionId = permission.id,
                    permissionName = permission.key
                updatedListRolePermissions[permissionName] = {}
                await Promise.all([
                    ...listRoles.map(async (role) => {
                        updatedListRolePermissions[permissionName][
                            role.roleName
                        ] = await this.getRolePermisionByPermissionIdAndRoleId(
                            permissionId,
                            role.id,
                        )
                    }),
                ])
            }),
        ])
        return updatedListRolePermissions
    }

    async getRolePermisionByPermissionIdAndRoleId(
        permissionId: number,
        roleId: number,
    ): Promise<number> {
        const existedRolePermission =
            await this.rolePermissionRepository.findOne({
                where: {
                    roleId: roleId,
                    permissionId: permissionId,
                },
            })
        return existedRolePermission ? 1 : 0
    }

    async updateRolePermission(
        permissionId: number,
        newRoleIds: number[],
    ): Promise<void> {
        const listRoleIds = await this.getListRoleIdByPermissionIdAndCompanyId(
            permissionId,
        )
        // list roleId need  add
        const roleIdToAdds = newRoleIds.filter(
            (roleId) => !listRoleIds.includes(roleId),
        )
        // list roleId need remove
        const roleIdToRemoves = listRoleIds.filter(
            (roleId) => !newRoleIds.includes(roleId),
        )
        await Promise.all([
            ...roleIdToRemoves.map((roleIdToRemove) =>
                this.rolePermissionRepository.removeRolePermission(
                    roleIdToRemove,
                    permissionId,
                ),
            ),
            ...roleIdToAdds.map((roleIdToAdd) =>
                this.createRolePermission({
                    roleId: roleIdToAdd,
                    permissionId: permissionId,
                }),
            ),
        ])
    }

    async getListRoleIdByPermissionIdAndCompanyId(
        permissionId: number,
    ): Promise<number[]> {
        return await this.rolePermissionRepository.getListRoleIdByPermissionIdAndCompanyId(
            permissionId,
        )
    }


    async createRolePermission(
        createRolePermissonDto: CreateRolePermissonDto,
    ): Promise<RolePermission> {
        const { roleId, permissionId } = createRolePermissonDto
        try {
            const createdRolePermission =
                await this.rolePermissionRepository.createRolePermission({
                    roleId,
                    permissionId,
                })

            return createdRolePermission
        } catch (error) {
            throw new HttpException(
                {
                    code: httpErrors.ROLE_PERMISSION_CREATE_FAILED.code,
                    message: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            )
        }
    }
}
