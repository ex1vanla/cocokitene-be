import { Injectable } from '@nestjs/common'
import { Permission } from '@entities/permission.entity'
import { PermissionRepository } from '@repositories/permission.repository'

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepository: PermissionRepository) {}

    async getAllPermissions(): Promise<Permission[]> {
        const permissions = await this.permissionRepository.getAllPermissions()
        return permissions
    }
}
