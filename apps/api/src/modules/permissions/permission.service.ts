import { Injectable } from '@nestjs/common'
import { GetAllPermissionDto } from '@dtos/permission.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { Permission } from '@entities/permission.entity'
import { PermissionRepository } from '@repositories/permission.repository'

@Injectable()
export class PermissionService {
    constructor(private readonly permissionRepository: PermissionRepository) {}

    async getAllPermissions(
        getAllPermissionDto: GetAllPermissionDto,
    ): Promise<Pagination<Permission>> {
        const permissions = await this.permissionRepository.getAllPermissions(
            getAllPermissionDto,
        )
        return permissions
    }
}
