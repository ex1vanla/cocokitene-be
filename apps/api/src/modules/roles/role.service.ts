import { Role } from '@entities/role.entity'
import { RoleRepository } from '@repositories/role.repository'
import { GetAllNormalRolesDto } from '@dtos/role.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { RoleEnum } from '@shares/constants'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RoleService {
    constructor(private readonly roleRepository: RoleRepository) {}
    async getPermissionsByRoleId(roleIds: number[]): Promise<string[]> {
        const permissionKeys = await this.roleRepository.getPermissionsByRoleId(
            roleIds,
        )
        return permissionKeys
    }

    async getRoleByRoleNameAndIdCompany(
        roleName: RoleEnum,
        companyId: number,
    ): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: {
                roleName: roleName,
                companyId: companyId,
            },
        })
        return role
    }

    async getAllNormalRoles(
        getAllNormalRolesDto: GetAllNormalRolesDto,
    ): Promise<Pagination<Role>> {
        const roles = await this.roleRepository.getAllNormalRoles(
            getAllNormalRolesDto,
        )
        return roles
    }

    async createCompanyRole(role: RoleEnum, companyId: number): Promise<Role> {
        const createdCompanyRole = await this.roleRepository.createCompanyRole(
            role,
            companyId,
        )
        return createdCompanyRole
    }
}
