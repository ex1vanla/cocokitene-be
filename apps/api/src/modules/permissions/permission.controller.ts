import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { PermissionEnum } from '@shares/constants'
import { PermissionService } from '@api/modules/permissions/permission.service'
import { Permission } from '@shares/decorators/permission.decorator'

@Controller('permissions')
@ApiTags('permissions')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @Permission(PermissionEnum.LIST_PERMISSIONS)
    async getAllPermissions() {
        const permissions = await this.permissionService.getAllPermissions()
        return permissions
    }
}
