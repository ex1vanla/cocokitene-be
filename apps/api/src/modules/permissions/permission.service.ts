import { Injectable } from '@nestjs/common'
import { Permission } from '@entities/permission.entity'
import { PermissionRepository } from '@repositories/permission.repository'
import { GetAllPermissionDto } from '@dtos/permissions.dto'

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepository: PermissionRepository) {}

    async getAllPermissions(
        getAllPermissionDto: GetAllPermissionDto,
    ): Promise<Permission[]> {
        const permissions = await this.permissionRepository.getAllPermissions(
            getAllPermissionDto,
        )
        return permissions
    }
}
