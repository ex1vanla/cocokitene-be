import {
    forwardRef,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
} from '@nestjs/common'
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
import { StatePermisisionForRolesEnum } from '@shares/constants'

@Injectable()
export class RolePermissionService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        @Inject(forwardRef(() => RoleService))
        private readonly roleService: RoleService,
        @Inject(forwardRef(() => CompanyService))
        private readonly companyService: CompanyService,
        private readonly permissionService: PermissionService,
    ) {}

    async updateRoleForPermission(
        roleForPermissionDto: RoleForPermissionDto,
        companyId: number,
    ): Promise<string> {
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        const { assignmentRoleOfPermission } = roleForPermissionDto
        await Promise.all([
            ...assignmentRoleOfPermission.map(
                async (stateRolePermissionDto) => {
                    const { permissionId, changeStatePermissionForRole } =
                        stateRolePermissionDto
                    const removePermissionRoles: number[] = []
                    const updatePermissionRoles: number[] = []
                    console.log(
                        'removePermissionRoles--',
                        removePermissionRoles,
                    )
                    console.log(
                        'updatePermissionRoles--',
                        updatePermissionRoles,
                    )
                    await Promise.all([
                        ...changeStatePermissionForRole.map(async (item) => {
                            if (
                                item.state ==
                                StatePermisisionForRolesEnum.ENABLED
                            ) {
                                updatePermissionRoles.push(item.roleId)
                            } else {
                                removePermissionRoles.push(item.roleId)
                            }
                        }),
                    ])
                    console.log(
                        'removePermissionRoles--',
                        removePermissionRoles,
                    )
                    console.log(
                        'updatePermissionRoles--',
                        updatePermissionRoles,
                    )
                    console.log('------------')

                    await this.updateRolePermission(
                        permissionId,
                        removePermissionRoles,
                        [],
                    ),
                        await this.updateRolePermission(
                            permissionId,
                            [],
                            updatePermissionRoles,
                        )
                },
            ),
        ])
        return 'updated role permisison successfully!!!'
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

    async getListRoleIdByPermissionIdAndCompanyId(
        permissionId: number,
    ): Promise<number[]> {
        return await this.rolePermissionRepository.getListRoleIdByPermissionIdAndCompanyId(
            permissionId,
        )
    }
    async updateRolePermission(
        permissionId: number,
        removeRoleIds?: number[],
        newRoleIds?: number[],
    ): Promise<void> {
        if (removeRoleIds && removeRoleIds.length > 0) {
            await Promise.all([
                ...removeRoleIds.map((roleIdToRemove) =>
                    this.rolePermissionRepository.removeRolePermission(
                        roleIdToRemove,
                        permissionId,
                    ),
                ),
            ])
        }
        if (newRoleIds && newRoleIds.length > 0) {
            await Promise.all([
                ...newRoleIds.map((newRoleId) =>
                    this.rolePermissionRepository.createRolePermission({
                        roleId: newRoleId,
                        permissionId: permissionId,
                    }),
                ),
            ])
        }
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

    async getAllRoleWithPermissions(companyId: number): Promise<any> {
        const existedCompany = await this.companyService.getCompanyById(
            companyId,
        )
        if (!existedCompany) {
            throw new HttpException(
                httpErrors.COMPANY_NOT_FOUND,
                HttpStatus.NOT_FOUND,
            )
        }

        // list permission
        const listPermissions = await this.permissionService.getAllPermissions()

        // list role
        const listRoles = await this.roleService.getAllInternalRoleInCompany(
            companyId,
        )
        const rolePermissions = {}

        await Promise.all([
            ...listPermissions.map(async (permission) => {
                const permissionId = permission.id,
                    permissionName = permission.key
                rolePermissions[permissionName] = {}
                await Promise.all([
                    ...listRoles.map(async (role) => {
                        rolePermissions[permissionName][role.roleName] =
                            await this.getRolePermisionByPermissionIdAndRoleId(
                                permissionId,
                                role.id,
                            )
                    }),
                ])
            }),
        ])
        Object.keys(rolePermissions).forEach((permissionName) => {
            listRoles.forEach(() => {
                rolePermissions[permissionName] = Object.fromEntries(
                    Object.entries(rolePermissions[permissionName]).sort(
                        ([a], [b]) => a.localeCompare(b),
                    ),
                )
            })
        })
        return rolePermissions
    }
}
